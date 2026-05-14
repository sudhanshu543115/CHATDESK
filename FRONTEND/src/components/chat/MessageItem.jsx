import React, { useState } from 'react';
import { format } from 'date-fns';
import Avatar from '@components/common/Avatar';
import { MoreVertical, Reply, Edit2, Trash2, Smile } from 'lucide-react';

const MessageItem = ({ message, isOwn }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      className={`
        flex gap-3 animate-fade-in
        ${isOwn ? 'flex-row-reverse' : ''}
      `}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      <Avatar
        src={message.sender.avatar}
        alt={message.sender.username}
        size="sm"
      />

      {/* Message Content */}
      <div className={`flex-1 max-w-[70%] ${isOwn ? 'flex flex-col items-end' : ''}`}>
        {/* Sender Name & Time */}
        {!isOwn && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-light-text dark:text-dark-text">
              {message.sender.username}
            </span>
            <span className="text-xs text-light-muted dark:text-dark-muted">
              {format(new Date(message.timestamp), 'HH:mm')}
            </span>
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={`
            message p-3 rounded-lg
            ${isOwn
              ? 'bg-primary-600 text-white message-sent'
              : 'bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border message-received'
            }
          `}
        >
          {/* Reply To */}
          {message.replyTo && (
            <div className="mb-2 pb-2 border-b border-light-border/20 dark:border-dark-border/20 text-sm opacity-75">
              <div className="font-medium">{message.replyTo.sender.username}</div>
              <div className="truncate">{message.replyTo.content}</div>
            </div>
          )}

          {/* Content */}
          <p className="break-words">{message.content}</p>

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {message.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center gap-2 p-2 bg-light-bg/10 dark:bg-dark-bg/10 rounded"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{attachment.name}</p>
                    <p className="text-xs opacity-75">
                      {(attachment.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {message.reactions.map((reaction, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-light-bg/20 dark:bg-dark-bg/20 rounded-full text-sm"
                >
                  {reaction.emoji}
                  <span className="text-xs">{reaction.users.length}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Time for own messages */}
        {isOwn && (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-light-muted dark:text-dark-muted">
              {format(new Date(message.timestamp), 'HH:mm')}
            </span>
            {message.isEdited && (
              <span className="text-xs text-light-muted dark:text-dark-muted">(edited)</span>
            )}
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div
            className={`
              flex items-center gap-1 mt-1
              ${isOwn ? 'flex-row-reverse' : ''}
            `}
          >
            <button className="p-1 hover:bg-light-surface dark:hover:bg-dark-surface rounded transition-colors">
              <Reply className="h-4 w-4 text-light-muted dark:text-dark-muted" />
            </button>
            {isOwn && (
              <>
                <button className="p-1 hover:bg-light-surface dark:hover:bg-dark-surface rounded transition-colors">
                  <Edit2 className="h-4 w-4 text-light-muted dark:text-dark-muted" />
                </button>
                <button className="p-1 hover:bg-light-surface dark:hover:bg-dark-surface rounded transition-colors">
                  <Trash2 className="h-4 w-4 text-light-muted dark:text-dark-muted" />
                </button>
              </>
            )}
            <button className="p-1 hover:bg-light-surface dark:hover:bg-dark-surface rounded transition-colors">
              <Smile className="h-4 w-4 text-light-muted dark:text-dark-muted" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
