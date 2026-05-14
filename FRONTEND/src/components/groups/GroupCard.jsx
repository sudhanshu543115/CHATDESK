import React from 'react';
import Avatar from '@components/common/Avatar';

const GroupCard = ({ group, onClick, active }) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200
        ${active 
          ? 'bg-primary/10 border-primary shadow-sm' 
          : 'hover:bg-light-surface dark:hover:bg-dark-surface border-transparent'
        }
        border
      `}
    >
      <Avatar
        src={group.avatar}
        alt={group.name}
        size="md"
        className="rounded-lg"
      />
      <div className="flex-1 text-left min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-light-text dark:text-dark-text truncate">
            {group.name}
          </h4>
        </div>
        <p className="text-xs text-light-muted dark:text-dark-muted truncate">
          {group.memberCount} members • {group.description || 'No description'}
        </p>
      </div>
    </button>
  );
};

export default GroupCard;
