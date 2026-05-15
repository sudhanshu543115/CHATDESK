import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  useGetMessagesQuery, 
  useGetGroupQuery, 
  useAddMemberToGroupMutation, 
  useRemoveMemberFromGroupMutation, 
  useDeleteGroupMutation,
  useGetUsersQuery
} from '@store/services/chatApi';
import { setUnreadCount, setActiveChat } from '@store/slices/chatSlice';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import Avatar from '@components/common/Avatar';
import Input from '@components/common/Input';
import { 
  Loader2, 
  MessageSquareDashed as MessageIcon, 
  Phone, 
  Video, 
  Search, 
  Info, 
  MoreHorizontal, 
  X, 
  UserPlus, 
  UserMinus, 
  LogOut, 
  Trash2,
  Check
} from 'lucide-react';

const ChatWindow = () => {
  const dispatch = useDispatch();
  const { activeChat } = useSelector((state) => state.chat);
  const { user: currentUser } = useSelector((state) => state.auth);
  const messagesEndRef = useRef(null);
  const [showSettings, setShowSettings] = useState(false);
  const [searchMemberQuery, setSearchMemberQuery] = useState('');

  const isGroup = activeChat?.memberCount !== undefined || activeChat?.workspaceId;

  // Real-time Group Data
  const { data: groupDetails, isLoading: groupLoading } = useGetGroupQuery(activeChat?.id, {
    skip: !activeChat || !isGroup
  });

  const { data: allUsersData } = useGetUsersQuery();
  const [addMember] = useAddMemberToGroupMutation();
  const [removeMember] = useRemoveMemberFromGroupMutation();
  const [deleteGroup] = useDeleteGroupMutation();

  // Clear unread count when chat is opened
  useEffect(() => {
    if (activeChat) {
      dispatch(setUnreadCount({ chatId: activeChat.id, count: 0 }));
    }
  }, [activeChat?.id, dispatch]);
  
  const queryParams = {
    channelId: null, // Channels removed as per request
    recipientId: activeChat?.username ? activeChat.id : null,
    groupId: isGroup ? activeChat.id : null,
  };

  const { data: messagesData, isLoading, isFetching } = useGetMessagesQuery(queryParams, {
    skip: !activeChat,
    pollingInterval: 2000, 
  });

  const messages = messagesData?.data?.messages || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages.length]);

  const handleAddMember = async (userId) => {
    try {
      await addMember({ groupId: activeChat.id, userId }).unwrap();
    } catch (err) {
      console.error('Failed to add member:', err);
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await removeMember({ groupId: activeChat.id, userId }).unwrap();
    } catch (err) {
      console.error('Failed to remove member:', err);
    }
  };

  const handleDeleteGroup = async () => {
    if (window.confirm('Are you sure you want to delete this group? This cannot be undone.')) {
      try {
        await deleteGroup(activeChat.id).unwrap();
        dispatch(setActiveChat(null));
        setShowSettings(false);
      } catch (err) {
        console.error('Failed to delete group:', err);
      }
    }
  };

  const handleExitGroup = async () => {
    if (window.confirm('Are you sure you want to exit this group?')) {
      try {
        await removeMember({ groupId: activeChat.id, userId: currentUser.id }).unwrap();
        dispatch(setActiveChat(null));
        setShowSettings(false);
      } catch (err) {
        console.error('Failed to exit group:', err);
      }
    }
  };

  if (!activeChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-xl">
        <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center mb-6 border border-slate-200 dark:border-slate-800 shadow-2xl animate-fade-in">
          <MessageIcon className="h-10 w-10 text-slate-400 dark:text-slate-700" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-300">Select a conversation</h2>
        <p className="text-slate-500 text-sm mt-2">Pick a person or group to start chatting</p>
      </div>
    );
  }

  const displayName = activeChat.username || activeChat.name || 'Conversation';

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-slate-950 relative overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-900 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-between z-10">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => isGroup && setShowSettings(true)}
        >
          <div className="w-10 h-10 rounded-xl bg-primary-600/10 flex items-center justify-center border border-primary-500/20 group-hover:bg-primary-600 group-hover:text-white transition-all">
            <span className="font-black">{displayName[0].toUpperCase()}</span>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              {displayName}
              {isGroup && <Info className="h-3 w-3 text-slate-400 group-hover:text-primary-500" />}
            </h3>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                {isGroup ? `${activeChat.memberCount || 0} Members` : 'Active Now'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {isFetching && !isLoading && <Loader2 className="h-4 w-4 text-primary-500 animate-spin mr-2" />}
          <button className="p-2 text-slate-400 hover:text-primary-500 hover:bg-primary-500/10 rounded-lg transition-all">
            <Phone className="h-4 w-4" />
          </button>
          <button className="p-2 text-slate-400 hover:text-primary-500 hover:bg-primary-500/10 rounded-lg transition-all">
            <Video className="h-4 w-4" />
          </button>
          <div className="w-px h-4 bg-slate-200 dark:bg-slate-800 mx-1"></div>
          <button className="p-2 text-slate-400 hover:text-primary-500 hover:bg-primary-500/10 rounded-lg transition-all">
            <Search className="h-4 w-4" />
          </button>
          <button 
            onClick={() => isGroup && setShowSettings(true)}
            className={`p-2 rounded-lg transition-all ${showSettings ? 'bg-primary-500 text-white' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className="h-8 w-8 text-primary-600 animate-spin mb-4" />
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest text-center">Syncing messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-40 animate-fade-in">
             <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-2xl mb-4">
                <MessageIcon className="h-8 w-8 text-slate-400" />
             </div>
             <p className="text-slate-400 font-medium tracking-tight">No messages yet</p>
          </div>
        ) : (
          <>
            <MessageList messages={messages} currentUserId={currentUser?.id} />
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <MessageInput activeChat={activeChat} currentUser={currentUser} />

      {/* Group Settings Modal */}
      {showSettings && isGroup && (
        <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-md z-[50] flex justify-end animate-fade-in">
          <div className="w-96 bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col animate-slide-left">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Group Settings</h2>
              <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {/* Group Info */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-primary-600 text-white flex items-center justify-center text-3xl font-black shadow-xl shadow-primary-500/20 mb-4">
                  {displayName[0].toUpperCase()}
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{displayName}</h3>
                <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-widest">{activeChat.memberCount} Members</p>
              </div>

              {/* Members List */}
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Group Members</h4>
                <div className="space-y-2">
                  {groupDetails?.data?.group?.members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group">
                      <div className="flex items-center gap-3">
                        <Avatar src={member.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.username}`} size="sm" />
                        <div>
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                            {member.username} {String(member.id) === String(currentUser.id) && <span className="text-[10px] text-primary-500">(You)</span>}
                          </p>
                        </div>
                      </div>
                      {String(member.id) !== String(currentUser.id) && (
                        <button 
                          onClick={() => handleRemoveMember(member.id)}
                          className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <UserMinus className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Members */}
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Invite People</h4>
                <div className="relative mb-3">
                   <Input 
                     placeholder="Search users..." 
                     value={searchMemberQuery}
                     onChange={(e) => setSearchMemberQuery(e.target.value)}
                     className="pl-9 bg-slate-50 dark:bg-slate-950 border-transparent text-sm"
                   />
                   <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1 custom-scrollbar">
                  {allUsersData?.data?.users
                    .filter(u => !groupDetails?.data?.group?.members.some(m => m.id === u.id))
                    .filter(u => u.username.toLowerCase().includes(searchMemberQuery.toLowerCase()))
                    .map((user) => (
                      <button 
                        key={user.id}
                        onClick={() => handleAddMember(user.id)}
                        className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/10 group transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} size="sm" />
                          <span className="text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:text-primary-600">{user.username}</span>
                        </div>
                        <UserPlus className="h-4 w-4 text-slate-300 group-hover:text-primary-500" />
                      </button>
                    ))}
                </div>
              </div>

              {/* Danger Zone */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <button 
                  onClick={handleExitGroup}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl text-orange-500 hover:bg-orange-500/10 font-bold text-sm transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  Exit Group
                </button>
                <button 
                  onClick={handleDeleteGroup}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl text-red-500 hover:bg-red-500/10 font-bold text-sm transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Group
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
