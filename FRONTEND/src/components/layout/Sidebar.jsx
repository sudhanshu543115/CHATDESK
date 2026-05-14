import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar } from '@store/slices/uiSlice';
import {
  MessageSquare,
  Users,
  Hash,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  CheckCircle2
} from 'lucide-react';
import Avatar from '@components/common/Avatar';
import { logout } from '@store/slices/authSlice';

const Sidebar = ({ collapsed }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { currentWorkspace } = useSelector((state) => state.workspace);
  const { unreadCount } = useSelector((state) => state.notification);

  const menuItems = [
    { icon: MessageSquare, label: 'Chats', id: 'chats', active: true },
    { icon: Users, label: 'Groups', id: 'groups' },
    { icon: Hash, label: 'Channels', id: 'channels' },
    { icon: CheckCircle2, label: 'Tasks', id: 'tasks' },
  ];

  return (
    <div
      className={`
        relative h-screen
        bg-slate-50 dark:bg-slate-950
        border-r border-slate-200 dark:border-slate-800
        flex flex-col
        transition-all duration-500 ease-in-out
        shadow-xl z-30
        ${collapsed ? 'w-20' : 'w-72'}
      `}
    >
      {/* Workspace Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative">
              <Avatar
                src={currentWorkspace?.avatar}
                alt={currentWorkspace?.name || 'Workspace'}
                size={collapsed ? "md" : "lg"}
                className="rounded-xl shadow-lg border-2 border-white dark:border-slate-800"
              />
            </div>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0 animate-fade-in">
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 truncate leading-tight">
                {currentWorkspace?.name || 'Workspace'}
              </h3>
              <p className="text-xs text-primary-500 font-semibold uppercase tracking-wider">Pro Plan</p>
            </div>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 py-8 overflow-y-auto custom-scrollbar">
        {!collapsed && (
          <p className="px-6 mb-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
            Navigation
          </p>
        )}
        <nav className="space-y-2 px-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`
                w-full flex items-center gap-4 px-4 py-3 rounded-xl
                transition-all duration-300 group relative
                ${item.active 
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900 hover:shadow-md'
                }
                ${collapsed ? 'justify-center' : ''}
              `}
            >
              <item.icon className={`h-5 w-5 flex-shrink-0 ${item.active ? '' : 'group-hover:scale-110 transition-transform'}`} />
              {!collapsed && (
                <span className="font-semibold tracking-tight">{item.label}</span>
              )}
              {item.active && !collapsed && (
                <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* User Section - Premium Card Style */}
      <div className="p-4 mx-4 mb-6 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800">
        <div className={`flex items-center gap-3 ${collapsed ? 'flex-col' : ''}`}>
          <div className="relative">
            <Avatar
              src={user?.avatar}
              alt={user?.username || 'User'}
              size="md"
              status={user?.status}
              className="border-2 border-primary-100 dark:border-slate-700 shadow-sm"
            />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                {user?.username}
              </p>
              <p className="text-[10px] text-slate-400 font-medium uppercase truncate">Available</p>
            </div>
          )}
          {!collapsed && (
            <button className="p-1.5 text-slate-400 hover:text-primary-500 transition-colors">
              <Settings className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-4 py-6 border-t border-slate-200 dark:border-slate-800">
        <div className="space-y-2">
          <button
            className={`
              w-full flex items-center gap-4 px-4 py-2.5 rounded-xl
              text-slate-600 dark:text-slate-400 
              hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-500
              transition-all group
              ${collapsed ? 'justify-center' : ''}
            `}
            onClick={() => dispatch(logout())}
          >
            <LogOut className="h-5 w-5 flex-shrink-0 group-hover:-translate-x-1 transition-transform" />
            {!collapsed && <span className="font-semibold">Logout</span>}
          </button>
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => dispatch(toggleSidebar())}
        className="absolute -right-4 top-24 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:scale-110 hover:border-primary-500 transition-all group"
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-primary-500" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-slate-400 group-hover:text-primary-500" />
        )}
      </button>
    </div>
  );
};

export default Sidebar;
