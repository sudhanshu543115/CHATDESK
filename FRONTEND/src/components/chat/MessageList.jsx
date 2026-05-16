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

        // Safety check for message.sender to avoid crashes if backend returns null
        const senderId = message.sender?.id || message.senderId;
        const isOwn = String(senderId) === String(currentUserId);

        return (
          <div key={message.id}>
            {showDateDivider && (
              <div className="flex items-center justify-center my-6">
                <div className="bg-slate-900 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 border border-slate-800">
                  {format(new Date(message.timestamp), 'MMMM d, yyyy')}
                </div>
              </div>
            )}
            <MessageItem
              message={message}
              isOwn={isOwn}
              isSending={message.isSending}
            />

          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
