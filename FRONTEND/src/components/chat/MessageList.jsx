import React from 'react';
import MessageItem from './MessageItem';
import { format } from 'date-fns';

const MessageList = ({ messages, currentUserId }) => {
  return (
    <div className="space-y-4">
      {messages.map((message, index) => {
        const showDateDivider =
          index === 0 ||
          new Date(messages[index - 1].timestamp).toDateString() !==
            new Date(message.timestamp).toDateString();

        return (
          <div key={message.id}>
            {showDateDivider && (
              <div className="flex items-center justify-center my-4">
                <div className="bg-light-surface dark:bg-dark-surface px-4 py-1 rounded-full text-xs text-light-muted dark:text-dark-muted">
                  {format(new Date(message.timestamp), 'MMMM d, yyyy')}
                </div>
              </div>
            )}
            <MessageItem
              message={message}
              isOwn={message.sender.id === currentUserId}
            />
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
