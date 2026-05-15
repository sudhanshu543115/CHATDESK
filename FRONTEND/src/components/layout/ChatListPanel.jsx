import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, MessageSquare, Users, Filter, CheckCircle2, Loader2, X, Check } from 'lucide-react';
import Input from '@components/common/Input';
import Avatar from '@components/common/Avatar';
import { setActiveChat } from '@store/slices/chatSlice';
import { 
  useGetUsersQuery, 
  useGetGroupsQuery, 
  useCreateGroupMutation,
  useGetTasksQuery
} from '@store/services/chatApi';

const ChatListPanel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('chats');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  
  const { user: currentUser } = useSelector((state) => state.auth);
  const { activeChat } = useSelector((state) => state.chat);

  const { data: usersData, isLoading: usersLoading } = useGetUsersQuery();
  const { data: groupsData, isLoading: groupsLoading } = useGetGroupsQuery(1); 
  const { data: tasksData, isLoading: tasksLoading } = useGetTasksQuery(1);
  const [createGroup, { isLoading: isCreating }] = useCreateGroupMutation();

  const tabs = [
    { id: 'chats', icon: MessageSquare, label: 'Chats', path: '/chat' },
    { id: 'groups', icon: Users, label: 'Groups', path: '/chat' },
    { id: 'tasks', icon: CheckCircle2, label: 'Tasks', path: '/tasks' },
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab.id);
    navigate(tab.path);
  };

  const toggleMember = (userId) => {
    if (selectedMembers.includes(userId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== userId));
    } else {
      setSelectedMembers([...selectedMembers, userId]);
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;
    try {
      const memberIds = [...selectedMembers];
      if (currentUser?.id && !memberIds.includes(parseInt(currentUser.id))) {
        memberIds.push(parseInt(currentUser.id));
      }

      await createGroup({ 
        name: newGroupName, 
        workspaceId: 1, 
        memberIds: memberIds.map(id => parseInt(id)) 
      }).unwrap();
      
      setNewGroupName('');
      setSelectedMembers([]);
      setShowCreateModal(false);
    } catch (err) {
      console.error('Failed to create group:', err);
    }
  };

  const getFilteredItems = () => {
    let items = [];
    switch (activeTab) {
      case 'chats':
        items = usersData?.users || usersData?.data?.users || [];
        items = items.filter(u => String(u.id) !== String(currentUser?.id));
        return items.filter((user) =>
          user.username.toLowerCase().includes(searchQuery.toLowerCase())
        );
      case 'groups':
        items = groupsData?.groups || groupsData?.data?.groups || [];
        return items.filter((group) =>
          group.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      case 'tasks':
        items = tasksData?.tasks || tasksData?.data?.tasks || [];
        return items.filter((task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      default:
        return [];
    }
  };

  const filteredItems = getFilteredItems();
  const isLoading = usersLoading || groupsLoading || tasksLoading;

  const getPriorityColor = (priority) => {
    if (!priority) return 'text-slate-500 bg-slate-50 dark:bg-slate-900/20';
    switch (priority.toLowerCase()) {
      case 'critical': return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      case 'high': return 'text-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'low': return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
      default: return 'text-slate-500 bg-slate-50 dark:bg-slate-900/20';
    }
  };

  return (
    <div className="w-80 h-screen border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col z-20">
      <div className="p-6 pb-2">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Messages</h1>
          <button className="p-2 bg-slate-50 dark:bg-slate-900 rounded-full text-slate-500 hover:text-primary-500 transition-colors">
            <Filter className="h-4 w-4" />
          </button>
        </div>
        <div className="relative group">
          <Input
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={Search}
            className="bg-slate-50 dark:bg-slate-900 border-none focus:ring-2 focus:ring-primary-500 transition-all rounded-xl pl-10"
          />
        </div>
      </div>

      <div className="flex px-4 mt-4 space-x-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab)}
            className={`
              flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
              text-[10px] font-bold transition-all duration-300
              ${activeTab === tab.id
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 shadow-sm'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }
            `}
          >
            <tab.icon className={`h-3.5 w-3.5 ${activeTab === tab.id ? 'scale-110' : ''} transition-transform`} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto mt-4 px-2 custom-scrollbar">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <Loader2 className="h-8 w-8 text-primary-500 animate-spin mb-4" />
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Fetching Data...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-8 text-center animate-fade-in">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center">
               <Search className="h-8 w-8 text-slate-300" />
            </div>
            <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">
              No {activeTab} found
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredItems.map((item) => {
              if (activeTab === 'tasks') {
                return (
                  <div
                    key={item.id}
                    onClick={() => navigate('/tasks')}
                    className="w-full p-4 flex flex-col gap-2 rounded-2xl border border-transparent hover:border-slate-100 dark:hover:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate flex-1 mr-2">
                        {item.title}
                      </h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-black uppercase tracking-widest ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                    </div>
                  </div>
                );
              }

              const isSelected = activeChat?.id === item.id;
              const displayName = item.username || item.name || 'Unknown';
              
              return (
                <button
                  key={item.id}
                  onClick={() => dispatch(setActiveChat(item))}
                  className={`
                    w-full p-4 flex items-center gap-4 rounded-2xl transition-all duration-300 group
                    ${isSelected 
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20 active-scale-95' 
                      : 'hover:bg-slate-50 dark:hover:bg-slate-900'
                    }
                  `}
                >
                  <div className="relative">
                    <Avatar
                      src={item.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`}
                      alt={displayName}
                      size="lg"
                      status={item.status || 'offline'}
                      className={`shadow-sm border-2 ${isSelected ? 'border-white/20' : 'border-transparent'}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className={`font-bold truncate tracking-tight ${isSelected ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>
                        {displayName}
                      </h3>
                      <span className={`text-[10px] font-medium ${isSelected ? 'text-white/70' : 'text-slate-400 dark:text-slate-500'}`}>
                        12:45 PM
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className={`text-xs truncate font-medium ${isSelected ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                        {item.lastMessage?.content || item.description || 'No messages yet'}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="p-4">
        <button 
          onClick={() => {
            if (activeTab === 'tasks') navigate('/tasks');
            else if (activeTab === 'groups') setShowCreateModal(true);
          }}
          className="w-full h-12 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:scale-95"
        >
          <Plus className="h-5 w-5" />
          <span>New {activeTab === 'tasks' ? 'Task' : activeTab.slice(0, -1)}</span>
        </button>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-scale-up flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Create New Group</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Selected: {selectedMembers.length} Members
                </p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto space-y-6 custom-scrollbar">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Group Name</label>
                <Input
                  placeholder="e.g. Design Team, Project Alpha"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  autoFocus
                  className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Choose Members</label>
                <div className="space-y-1.5">
                  {(usersData?.users || usersData?.data?.users || [])
                    .filter(u => String(u.id) !== String(currentUser?.id))
                    .map((user) => {
                      const isSelected = selectedMembers.includes(user.id);
                      return (
                        <button
                          key={user.id}
                          onClick={() => toggleMember(user.id)}
                          className={`
                            w-full p-3 rounded-2xl flex items-center gap-3 transition-all border
                            ${isSelected 
                              ? 'bg-primary-50 dark:bg-primary-900/10 border-primary-500/30' 
                              : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'
                            }
                          `}
                        >
                          <div className={`
                            w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all
                            ${isSelected ? 'bg-primary-600 border-primary-600' : 'border-slate-200 dark:border-slate-700'}
                          `}>
                            {isSelected && <Check className="h-3 w-3 text-white stroke-[4]" />}
                          </div>
                          <Avatar
                            src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                            alt={user.username}
                            size="sm"
                          />
                          <span className={`text-sm font-bold ${isSelected ? 'text-primary-600 dark:text-primary-400' : 'text-slate-600 dark:text-slate-300'}`}>
                            {user.username}
                          </span>
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50/50 dark:bg-slate-950/50 flex gap-3">
              <button 
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-3 text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateGroup}
                disabled={!newGroupName.trim() || isCreating}
                className="flex-[2] py-3 bg-primary-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-primary-500/20 hover:bg-primary-500 disabled:opacity-30 transition-all flex items-center justify-center gap-2"
              >
                {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Create Group ({selectedMembers.length + 1})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatListPanel;
