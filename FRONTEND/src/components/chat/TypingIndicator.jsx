import React from 'react';
import { useSelector } from 'react-redux';
import Avatar from '@components/common/Avatar';

const TypingIndicator = ({ userIds }) => {
  const { contacts } = useSelector((state) => state.user);

  const typingUsers = contacts.filter((contact) => userIds.includes(contact.id));

  if (typingUsers.length === 0) return null;

  const names = typingUsers.map((u) => u.username).join(', ');
  const text = typingUsers.length === 1 ? `${names} is typing...` : `${names} are typing...`;

  return (
    <div className="px-4 py-2 bg-light-surface dark:bg-dark-surface border-t border-light-border dark:border-dark-border">
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <span className="text-sm text-light-muted dark:text-dark-muted">{text}</span>
      </div>
    </div>
  );
};

export default TypingIndicator;
