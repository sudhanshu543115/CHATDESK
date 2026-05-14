import React from 'react';
import Avatar from '@components/common/Avatar';
import { formatDistanceToNow } from 'date-fns';

const NotificationItem = ({ notification, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        p-4 border-b border-light-border dark:border-dark-border cursor-pointer transition-colors
        ${notification.read ? 'opacity-60' : 'bg-primary/5 hover:bg-primary/10'}
        hover:bg-light-bg dark:hover:bg-dark-bg
      `}
    >
      <div className="flex gap-3">
        <Avatar src={notification.sender?.avatar} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-light-text dark:text-dark-text">
            <span className="font-semibold">{notification.sender?.username}</span>
            {' '}{notification.content}
          </p>
          <p className="text-xs text-light-muted dark:text-dark-muted mt-1">
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
