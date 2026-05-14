import React from 'react';
import { Smile } from 'lucide-react';

const MessageReactions = ({ reactions, onReact }) => {
  if (!reactions || reactions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {reactions.map((reaction) => (
        <button
          key={reaction.emoji}
          onClick={() => onReact(reaction.emoji)}
          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border hover:border-primary transition-colors text-xs"
          title={reaction.users.map(u => u.username).join(', ')}
        >
          <span>{reaction.emoji}</span>
          <span className="text-light-muted dark:text-dark-muted font-medium">
            {reaction.count}
          </span>
        </button>
      ))}
      <button
        onClick={() => {/* Open emoji picker */}}
        className="inline-flex items-center p-1 rounded-full text-light-muted dark:text-dark-muted hover:text-primary transition-colors"
      >
        <Smile className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

export default MessageReactions;
