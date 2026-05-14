import React from 'react';
import { useSelector } from 'react-redux';
import { Search, MoreHorizontal, Phone, Video, Info, UserPlus } from 'lucide-react';
import Avatar from '@components/common/Avatar';

const Header = () => {
  const { activeChat } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  if (!activeChat) {
    return (
      <header className="h-20 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl px-8 flex items-center justify-between z-10">
        <div className="flex-1" />
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{user?.username}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Administrator</p>
          </div>
          <Avatar src={user?.avatar} alt={user?.username} size="md" status={user?.status} className="border-2 border-primary-100 dark:border-slate-800" />
        </div>
      </header>
    );
  }

  const isGroup = activeChat.type === 'group' || activeChat.type === 'channel';

  return (
    <header className="h-20 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl px-8 flex items-center justify-between z-10 sticky top-0">
      {/* Chat Info */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="relative group cursor-pointer">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
          <Avatar
            src={activeChat.avatar}
            alt={activeChat.name}
            size="lg"
            status={activeChat.status}
            className="border-2 border-white dark:border-slate-800 shadow-sm"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 truncate tracking-tight">
              {activeChat.name || activeChat.displayName}
            </h2>
            {isGroup && (
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest">
                {activeChat.type}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${activeChat.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
            <p className="text-xs text-slate-400 font-bold">
              {!isGroup ? (activeChat.status === 'online' ? 'Active now' : 'Away') : `${activeChat.memberCount || 0} members`}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-slate-50 dark:bg-slate-900 rounded-2xl p-1.5 mr-2">
          {!isGroup && (
            <>
              <button className="p-2.5 text-slate-500 hover:text-primary-500 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all group">
                <Phone className="h-5 w-5 group-hover:scale-110" />
              </button>
              <button className="p-2.5 text-slate-500 hover:text-primary-500 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all group">
                <Video className="h-5 w-5 group-hover:scale-110" />
              </button>
            </>
          )}
          <button className="p-2.5 text-slate-500 hover:text-primary-500 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all group border-l border-slate-200 dark:border-slate-700 ml-1.5 pl-4">
             <Search className="h-5 w-5 group-hover:scale-110" />
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <Info className="h-5 w-5" />
          </button>
          <button className="p-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
