import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Bell, CheckCheck, X } from 'lucide-react';
import { markAllAsRead, clearNotifications } from '@store/slices/notificationSlice';
import NotificationItem from './NotificationItem';

const NotificationPanel = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { notifications, unreadCount } = useSelector((state) => state.notification);

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-12 w-80 max-h-[500px] bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl shadow-2xl z-50 flex flex-col">
      <div className="p-4 border-b border-light-border dark:border-dark-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-light-text dark:text-dark-text">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => dispatch(markAllAsRead())}
            className="p-1.5 rounded-lg text-light-muted dark:text-dark-muted hover:text-primary transition-colors"
            title="Mark all as read"
          >
            <CheckCheck className="h-4 w-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-light-muted dark:text-dark-muted hover:text-red-500 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <NotificationItem key={notif.id} notification={notif} />
          ))
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm text-light-muted dark:text-dark-muted">No notifications yet</p>
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="p-3 border-t border-light-border dark:border-dark-border">
          <button
            onClick={() => dispatch(clearNotifications())}
            className="w-full py-2 text-xs text-light-muted dark:text-dark-muted hover:text-red-500 transition-colors"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
