import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Search, MoreHorizontal, Phone, Video, Info, Sun, Moon } from 'lucide-react';
import Avatar from '@components/common/Avatar';
import { setTheme } from '@store/slices/uiSlice';

const Header = () => {
  const dispatch = useDispatch();
  const { activeChat } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.ui);

  const toggleTheme = () => {
    dispatch(setTheme(theme === 'dark' ? 'light' : 'dark'));
  };

  if (!activeChat) {
    return (
      <header className="h-20 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl px-8 flex items-center justify-between z-10">
        <div className="flex-1" />
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2.5 text-slate-500 dark:text-slate-400 hover:text-primary-500 transition-all"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{user?.username}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Online</p>
            </div>
            <Avatar 
              src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} 
              alt={user?.username} 
              size="md" 
              status="online" 
            />
          </div>
        </div>
      </header>
    );
  }

  const displayName = activeChat.username || activeChat.name || 'Unknown';
  const isGroup = activeChat.memberCount !== undefined || activeChat.workspaceId;

  return (
    <header className="h-20 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl px-8 flex items-center justify-between z-10 sticky top-0">
      <div className="flex items-center gap-4">
        <Avatar
          src={activeChat.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`}
          alt={displayName}
          size="lg"
          status={activeChat.status || 'online'}
        />
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 truncate tracking-tight">
            {displayName}
          </h2>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <p className="text-xs text-slate-400 font-bold">
              {!isGroup ? 'Active now' : `${activeChat.memberCount || 0} members`}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button 
          onClick={toggleTheme}
          className="p-2.5 text-slate-500 dark:text-slate-400 hover:text-primary-500 transition-all"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {!isGroup && (
          <>
            <button className="p-2.5 text-slate-500 dark:text-slate-400 hover:text-primary-500 transition-all">
              <Phone className="h-5 w-5" />
            </button>
            <button className="p-2.5 text-slate-500 dark:text-slate-400 hover:text-primary-500 transition-all">
              <Video className="h-5 w-5" />
            </button>
          </>
        )}
        
        <button className="p-2.5 text-slate-500 dark:text-slate-400 hover:text-primary-500 transition-all">
           <Search className="h-5 w-5" />
        </button>
        <button className="p-2.5 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
          <Info className="h-5 w-5" />
        </button>
        <button className="p-2.5 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;
