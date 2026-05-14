import React from 'react';
import { Hash, Lock } from 'lucide-react';

const ChannelItem = ({ channel, onClick, active }) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all
        ${active 
          ? 'bg-primary/10 text-primary font-medium' 
          : 'text-light-muted dark:text-dark-muted hover:bg-light-surface dark:hover:bg-dark-surface hover:text-light-text dark:hover:text-dark-text'
        }
      `}
    >
      {channel.isPrivate ? (
        <Lock className="h-4 w-4" />
      ) : (
        <Hash className="h-4 w-4" />
      )}
      <span className="truncate text-sm">{channel.name}</span>
    </button>
  );
};

export default ChannelItem;
