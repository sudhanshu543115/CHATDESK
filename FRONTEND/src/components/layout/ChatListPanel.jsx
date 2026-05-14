import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Search, Plus, MessageSquare, Users, Hash, Filter, CheckCircle2 } from 'lucide-react';
import Input from '@components/common/Input';
import Avatar from '@components/common/Avatar';
import Button from '@components/common/Button';
import { setActiveChat } from '@store/slices/chatSlice';
import { MOCK_TASKS } from '@utils/mockData';

const ChatListPanel = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('chats');
  const { contacts } = useSelector((state) => state.user);
  const { groups, channels } = useSelector((state) => state.workspace);
  const { unreadCounts, activeChat } = useSelector((state) => state.chat);

  const tabs = [
    { id: 'chats', icon: MessageSquare, label: 'Chats' },
    { id: 'groups', icon: Users, label: 'Groups' },
    { id: 'channels', icon: Hash, label: 'Channels' },
    { id: 'tasks', icon: CheckCircle2, label: 'Tasks' },
  ];

  const getFilteredItems = () => {
    switch (activeTab) {
      case 'chats':
        return contacts.filter((contact) =>
          contact.displayName.toLowerCase().includes(searchQuery.toLowerCase())
        );
      case 'groups':
        return groups.filter((group) =>
          group.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      case 'channels':
        return channels.filter((channel) =>
          channel.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      case 'tasks':
        return MOCK_TASKS.filter((task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      default:
        return [];
    }
  };

  const filteredItems = getFilteredItems();

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'critical': return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      case 'high': return 'text-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'low': return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
      default: return 'text-slate-500 bg-slate-50 dark:bg-slate-900/20';
    }
  };

  return (
    <div className="w-80 h-screen border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col z-20">
      {/* Header Area */}
      <div className="p-6 pb-2">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Messages</h1>
          <button className="p-2 bg-slate-50 dark:bg-slate-900 rounded-full text-slate-500 hover:text-primary-500 transition-colors">
            <Filter className="h-4 w-4" />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative group">
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={Search}
            className="bg-slate-50 dark:bg-slate-900 border-none focus:ring-2 focus:ring-primary-500 transition-all rounded-xl pl-10"
          />
        </div>
      </div>

      {/* Tabs - Modern Minimal Style */}
      <div className="flex px-4 mt-4 space-x-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
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

      {/* List Area */}
      <div className="flex-1 overflow-y-auto mt-4 px-2 custom-scrollbar">
        {filteredItems.length === 0 ? (
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
                    className="w-full p-4 flex flex-col gap-2 rounded-2xl border border-transparent hover:border-slate-100 dark:hover:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate flex-1 mr-2">
                        {item.title}
                      </h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-black uppercase tracking-widest ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-[10px] font-bold text-primary-600">
                          {item.assignee[0]}
                        </div>
                        <span className="text-xs text-slate-400 font-medium">{item.assignee}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{item.status}</span>
                    </div>
                  </div>
                );
              }

              const isSelected = activeChat?.id === item.id;
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
                      src={item.avatar}
                      alt={item.name || item.displayName}
                      size="lg"
                      status={item.status}
                      className={`shadow-sm border-2 ${isSelected ? 'border-white/20' : 'border-transparent'}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className={`font-bold truncate tracking-tight ${isSelected ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>
                        {item.name || item.displayName}
                      </h3>
                      <span className={`text-[10px] font-medium ${isSelected ? 'text-white/70' : 'text-slate-400 dark:text-slate-500'}`}>
                        12:45 PM
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className={`text-xs truncate font-medium ${isSelected ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                        {item.lastMessage?.content || item.description || 'No messages yet'}
                      </p>
                      {unreadCounts[item.id] > 0 && (
                        <span className={`
                          flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-black
                          ${isSelected ? 'bg-white text-primary-600' : 'bg-primary-600 text-white'}
                        `}>
                          {unreadCounts[item.id]}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="p-4">
        <button className="w-full h-12 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:scale-95">
          <Plus className="h-5 w-5" />
          <span>New {activeTab === 'tasks' ? 'Task' : activeTab.slice(0, -1)}</span>
        </button>
      </div>
    </div>
  );
};

export default ChatListPanel;
