import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMessages } from '@store/slices/chatSlice';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';

const ChatWindow = () => {
  const dispatch = useDispatch();
  const { activeChat, messages, typingUsers, loading } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (activeChat?.id) {
      dispatch(fetchMessages(activeChat.id));
    }
  }, [activeChat?.id, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!activeChat) return null;

  const chatMessages = messages[activeChat.id] || [];
  const currentTypingUsers = typingUsers[activeChat.id] || [];

  return (
    <div className="flex-1 flex flex-col bg-light-bg dark:bg-dark-bg">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-light-muted dark:text-dark-muted">Loading messages...</div>
          </div>
        ) : chatMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-light-muted dark:text-dark-muted mb-2">
                No messages yet
              </p>
              <p className="text-sm text-light-muted dark:text-dark-muted">
                Start the conversation!
              </p>
            </div>
          </div>
        ) : (
          <>
            <MessageList messages={chatMessages} currentUserId={user?.id} />
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Typing Indicator */}
      {currentTypingUsers.length > 0 && (
        <TypingIndicator userIds={currentTypingUsers} />
      )}

      {/* Message Input */}
      <MessageInput chatId={activeChat.id} />
    </div>
  );
};

export default ChatWindow;
