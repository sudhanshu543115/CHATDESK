import React, { useState, useRef, useEffect } from 'react';
import { useSendMessageMutation } from '@store/services/chatApi';
import { Send, Paperclip, Smile, X, Loader2, Image, FileAudio, FileVideo, File } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8001';

const getFileIcon = (type) => {
  if (type === 'image') return <Image className="h-3.5 w-3.5 text-blue-400" />;
  if (type === 'video') return <FileVideo className="h-3.5 w-3.5 text-purple-400" />;
  if (type === 'audio') return <FileAudio className="h-3.5 w-3.5 text-green-400" />;
  return <File className="h-3.5 w-3.5 text-slate-400" />;
};

const MessageInput = ({ activeChat, currentUser, onPendingMessage, onMessageSent }) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]); // [{file, preview, mediaType}]
  const [uploading, setUploading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [sendMessage] = useSendMessageMutation();
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [activeChat?.id]);

  // Clean up preview URLs on unmount
  useEffect(() => {
    return () => attachments.forEach(a => { if (a.preview) URL.revokeObjectURL(a.preview); });
  }, [attachments]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      mediaType: file.type.startsWith('image/') ? 'image'
               : file.type.startsWith('video/') ? 'video'
               : file.type.startsWith('audio/') ? 'audio' : 'file',
      name: file.name,
    }));
    setAttachments(prev => [...prev, ...newAttachments]);
    e.target.value = '';
  };

  const removeAttachment = (index) => {
    setAttachments(prev => {
      if (prev[index]?.preview) URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const uploadFile = async (attachment) => {
    const formData = new FormData();
    formData.append('file', attachment.file);
    const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: formData });
    return res.json();
  };

  const handleSend = async () => {
    if (!message.trim() && attachments.length === 0) return;

    const content = message;
    const currentAttachments = [...attachments];
    setMessage('');
    setAttachments([]);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();

    try {
      const baseData = {
        senderId: parseInt(currentUser?.id),
        channelId: activeChat?.workspaceId && !activeChat.username ? parseInt(activeChat.id) : null,
        recipientId: activeChat?.username ? parseInt(activeChat.id) : null,
        groupId: activeChat?.memberCount !== undefined ? parseInt(activeChat.id) : null,
        sender: { id: currentUser.id, username: currentUser.username, avatar: currentUser.avatar }
      };

      if (currentAttachments.length > 0) {
        setUploading(true);
        
        // Process each attachment
        for (const attachment of currentAttachments) {
          const tempId = `temp-${Date.now()}-${Math.random()}`;
          
          // 1. Create Optimistic (Pending) Message
          if (onPendingMessage) {
            onPendingMessage({
              ...baseData,
              id: tempId,
              content: content || '',
              timestamp: new Date().toISOString(),
              timestampMs: Date.now(),
              mediaUrl: attachment.preview || '',
              mediaType: attachment.mediaType,
              fileName: attachment.name,
              isSending: true
            });
          }

          // 2. Actually Upload
          const uploadResult = await uploadFile(attachment);
          
          if (uploadResult.url) {
            // 3. Send Real Message
            await sendMessage({
              ...baseData,
              content: content || attachment.name,
              mediaUrl: uploadResult.url.startsWith('http') ? uploadResult.url : `${API_BASE}${uploadResult.url}`,
              mediaType: uploadResult.media_type,
              fileName: uploadResult.file_name,
            }).unwrap();
          }

          // 4. Remove Optimistic Message with delay
          setTimeout(() => {
            if (onMessageSent) onMessageSent(tempId);
          }, 500);
        }
        setUploading(false);
      } else {
        const tempId = `temp-${Date.now()}-${Math.random()}`;
        
        // 1. Optimistic Text Message
        if (onPendingMessage) {
          onPendingMessage({
            ...baseData,
            id: tempId,
            content: content,
            timestamp: new Date().toISOString(),
            timestampMs: Date.now(),
            isSending: true
          });
        }

        // 2. Send Real
        await sendMessage({ ...baseData, content }).unwrap();

        // 3. Cleanup
        setTimeout(() => {
          if (onMessageSent) onMessageSent(tempId);
        }, 500);
      }

    } catch (err) {
      console.error('Failed to send:', err);
      setUploading(false);
      setMessage(content);
      setAttachments(currentAttachments);
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
      {/* Attachment Previews */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          {attachments.map((attachment, index) => (
            <div key={index} className="relative group">
              {attachment.preview ? (
                <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                  <img src={attachment.preview} alt={attachment.name} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeAttachment(index)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl text-[10px] font-bold text-slate-500 dark:text-slate-400 max-w-[160px]">
                  {getFileIcon(attachment.mediaType)}
                  <span className="truncate">{attachment.name}</span>
                  <button onClick={() => removeAttachment(index)} className="text-slate-400 hover:text-red-500 transition-colors ml-1">
                    <X className="h-3 w-3 flex-shrink-0" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-3">
        {/* Attach Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="p-3 text-slate-400 dark:text-slate-500 hover:text-primary-500 hover:bg-primary-500/10 rounded-xl transition-all disabled:opacity-50"
          title="Attach image, video, audio or file"
        >
          {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Paperclip className="h-5 w-5" />}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
          className="hidden"
          onChange={handleFileSelect}
        />

        {/* Text Input */}
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

        {/* Emoji */}
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

        {/* Send */}
        <button
          onClick={handleSend}
          disabled={(!message.trim() && attachments.length === 0) || uploading}
          className="p-3.5 bg-primary-600 text-white rounded-xl hover:bg-primary-500 shadow-lg shadow-primary-500/20 disabled:opacity-30 disabled:grayscale transition-all active:scale-95 flex-shrink-0"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
