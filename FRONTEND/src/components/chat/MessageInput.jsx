import React, { useState, useRef, useEffect } from 'react';
import { useSendMessageMutation } from '@store/services/chatApi';
import { Send, Paperclip, Smile, X, Loader2 } from 'lucide-react';

const MessageInput = ({ activeChat, currentUser }) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [sendMessage] = useSendMessageMutation();
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [activeChat?.id]);

  const handleSend = async () => {
    if (!message.trim() && attachments.length === 0) return;

    const content = message;
    const currentAttachments = attachments;

    setMessage('');
    setAttachments([]);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();

    try {
      const messageData = {
        content: content,
        senderId: parseInt(currentUser?.id),
        channelId: activeChat?.workspaceId && !activeChat.username ? parseInt(activeChat.id) : null,
        recipientId: activeChat?.username ? parseInt(activeChat.id) : null,
        groupId: activeChat?.memberCount !== undefined ? parseInt(activeChat.id) : null,
      };

      await sendMessage(messageData).unwrap();
    } catch (err) {
      console.error('Failed to send message:', err);
      setMessage(content);
      setAttachments(currentAttachments);
      alert('Failed to send message. Please try again.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const emojis = ['😀', '😂', '😍', '🥳', '😎', '🤔', '👍', '👎', '❤️', '🔥', '✨', '🎉'];

  const placeholderName = activeChat?.username || activeChat?.name || '';

  return (
    <div className="p-4 border-t border-slate-200 dark:border-slate-900 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl transition-colors duration-300">
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {attachments.map((attachment, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl text-[10px] font-bold text-slate-500 dark:text-slate-400"
            >
              <span className="truncate max-w-[150px] uppercase">{attachment.name}</span>
              <button
                onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-3">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-3 text-slate-400 dark:text-slate-500 hover:text-primary-500 hover:bg-primary-500/10 rounded-xl transition-all"
        >
          <Paperclip className="h-5 w-5" />
        </button>
        <input ref={fileInputRef} type="file" multiple className="hidden" onChange={(e) => setAttachments([...attachments, ...Array.from(e.target.files)])} />

        <div className="flex-1 relative group">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Message ${placeholderName}...`}
            rows={1}
            className="w-full px-5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/40 transition-all resize-none custom-scrollbar shadow-inner"
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-3 text-slate-400 dark:text-slate-500 hover:text-amber-500 hover:bg-amber-500/10 rounded-xl transition-all"
          >
            <Smile className="h-5 w-5" />
          </button>
          {showEmojiPicker && (
            <div className="absolute bottom-full right-0 mb-4 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl grid grid-cols-4 gap-1 animate-slide-up z-50">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => { setMessage(message + emoji); setShowEmojiPicker(false); }}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xl transition-transform hover:scale-125"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleSend}
          disabled={!message.trim() && attachments.length === 0}
          className="p-3.5 bg-primary-600 text-white rounded-xl hover:bg-primary-500 shadow-lg shadow-primary-500/20 disabled:opacity-30 disabled:grayscale transition-all active:scale-95 flex-shrink-0"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
