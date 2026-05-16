import React, { useState } from 'react';
import { format } from 'date-fns';
import Avatar from '@components/common/Avatar';
import { MoreVertical, Reply, Edit2, Trash2, Smile, Loader2, Copy, Check, Download, FileText, File } from 'lucide-react';
import { useDeleteMessageMutation, useToggleReactionMutation } from '@store/services/chatApi';
import { useSelector } from 'react-redux';

// ─── Constants ──────────────────────────────────────────────────────────────
const COMMON_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🔥', '🙌', '✨'];

// ─── Media Renderer ─────────────────────────────────────────────────────────────
const MediaRenderer = ({ mediaUrl, mediaType, fileName, isOwn, isSending }) => {
  if (!mediaUrl) return null;

  const getDetectedType = () => {
    if (mediaType && mediaType !== 'file') return mediaType;
    const ext = fileName?.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return 'image';
    if (['mp4', 'webm', 'ogg'].includes(ext)) return 'video';
    if (['mp3', 'wav', 'm4a'].includes(ext)) return 'audio';
    return 'file';
  };

  const detectedType = getDetectedType();
  const bubbleBg = isOwn
    ? 'bg-primary-700/50 border-primary-500/30'
    : 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700';

  if (detectedType === 'image') {
    return (
      <div className="mt-2 rounded-xl overflow-hidden max-w-xs border border-black/10 dark:border-white/10 shadow-md relative group">
        <a href={isSending ? '#' : mediaUrl} target="_blank" rel="noreferrer">
          <img
            src={mediaUrl}
            alt={fileName || 'Image'}
            className={`w-full object-cover max-h-64 hover:brightness-90 transition-all cursor-zoom-in ${isSending ? 'blur-sm grayscale' : ''}`}
          />
        </a>
        {isSending && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 backdrop-blur-[2px]">
            <Loader2 className="h-6 w-6 animate-spin text-white mb-2" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Uploading...</span>
          </div>
        )}
      </div>
    );
  }

  if (detectedType === 'video') {
    return (
      <div className="mt-2 rounded-xl overflow-hidden max-w-xs border border-black/10 dark:border-white/10 shadow-md relative">
        <video
          src={mediaUrl}
          controls={!isSending}
          className={`w-full max-h-64 rounded-xl ${isSending ? 'opacity-50' : ''}`}
          preload="metadata"
        >
          Your browser does not support video.
        </video>
        {isSending && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          </div>
        )}
      </div>
    );
  }

  if (detectedType === 'audio') {
    return (
      <div className={`mt-2 rounded-xl p-3 border ${bubbleBg} max-w-xs relative`}>
        <p className="text-[10px] font-bold uppercase tracking-wider mb-2 opacity-60">{fileName || 'Audio'}</p>
        <audio src={mediaUrl} controls={!isSending} className="w-full h-8" preload="metadata">
          Your browser does not support audio.
        </audio>
        {isSending && <div className="absolute inset-0 bg-white/10 dark:bg-black/10 flex items-center justify-center rounded-xl"><Loader2 className="h-4 w-4 animate-spin" /></div>}
      </div>
    );
  }

  return (
    <a
      href={isSending ? '#' : mediaUrl}
      download={fileName}
      target="_blank"
      rel="noreferrer"
      className={`mt-2 flex items-center gap-3 rounded-xl p-3 border ${bubbleBg} max-w-xs group transition-all ${isSending ? 'opacity-50 cursor-wait' : 'hover:opacity-80'}`}
    >
      <div className="p-2 bg-primary-500/20 rounded-lg">
        {isSending ? <Loader2 className="h-5 w-5 animate-spin text-primary-400" /> : <File className="h-5 w-5 text-primary-400" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold truncate">{fileName || 'Download File'}</p>
        <p className="text-[10px] opacity-50">{isSending ? 'Uploading...' : 'Click to download'}</p>
      </div>
      {!isSending && <Download className="h-4 w-4 opacity-50 group-hover:opacity-100 flex-shrink-0" />}
    </a>
  );
};


// ─── Main MessageItem ────────────────────────────────────────────────────────────
const MessageItem = ({ message, isOwn, isSending }) => {
  const [showActions, setShowActions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [copied, setCopied] = useState(false);
  const currentUser = useSelector((state) => state.auth.user);
  
  const [deleteMessage, { isLoading: isDeleting }] = useDeleteMessageMutation();
  const [toggleReaction] = useToggleReactionMutation();

  const handleDelete = async () => {
    if (window.confirm('Delete this message?')) {
      try {
        await deleteMessage(message.id).unwrap();
      } catch (err) {
        console.error('Failed to delete message:', err);
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleEmoji = async (emoji) => {
    if (isSending) return;
    try {
      await toggleReaction({
        messageId: message.id,
        userId: parseInt(currentUser.id),
        emoji
      }).unwrap();
      setShowEmojiPicker(false);
    } catch (err) {
      console.error('Failed to toggle reaction:', err);
    }
  };

  const displayName = message.sender?.username || 'Unknown';
  const avatarSeed = displayName;
  const hasMedia = !!message.mediaUrl;
  const isMediaOnly = hasMedia && !message.content;

  // Group reactions by emoji
  const groupedReactions = message.reactions?.reduce((acc, r) => {
    acc[r.emoji] = (acc[r.emoji] || []);
    acc[r.emoji].push(parseInt(r.userId));
    return acc;
  }, {}) || {};

  return (
    <div
      className={`flex gap-3 animate-fade-in group transition-all duration-300 ${isOwn ? 'flex-row-reverse' : ''} mb-4`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false);
        setShowEmojiPicker(false);
      }}
    >
      {/* Avatar */}
      <Avatar
        src={message.sender?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`}
        alt={displayName}
        size="sm"
        className="mt-1 shadow-md border border-white dark:border-slate-800"
      />

      {/* Message Content */}
      <div className={`flex-1 max-w-[70%] ${isOwn ? 'flex flex-col items-end' : ''}`}>
        {!isOwn && (
          <div className="flex items-center gap-2 mb-1 ml-1">
            <span className="text-xs font-black text-slate-700 dark:text-slate-300 tracking-tight">{displayName}</span>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">
              {format(new Date(message.timestamp), 'HH:mm')}
            </span>
          </div>
        )}

        {/* Bubble & Actions Wrapper */}
        <div className="relative group/actions">
          {/* Bubble */}
          <div
            className={`
              relative rounded-2xl transition-all duration-300
              ${isMediaOnly ? 'p-1' : 'p-3.5'}
              ${isOwn
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20 rounded-tr-none'
                : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none shadow-sm'
              }
              ${isDeleting ? 'opacity-50 grayscale' : ''}
            `}
          >
            {!isMediaOnly && message.content && (
              <p className="text-sm leading-relaxed break-words">{message.content}</p>
            )}

            <MediaRenderer
              mediaUrl={message.mediaUrl}
              mediaType={message.mediaType}
              fileName={message.fileName}
              isOwn={isOwn}
              isSending={isSending}
            />

            {isDeleting && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 dark:bg-black/20 rounded-2xl">
                <Loader2 className="h-4 w-4 animate-spin text-white" />
              </div>
            )}
          </div>

          {/* Reactions Display */}
          {Object.keys(groupedReactions).length > 0 && (
            <div className={`flex flex-wrap gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
              {Object.entries(groupedReactions).map(([emoji, userIds]) => {
                const hasReacted = userIds.includes(parseInt(currentUser.id));
                return (
                  <button
                    key={emoji}
                    onClick={() => handleToggleEmoji(emoji)}
                    className={`
                      flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold transition-all
                      ${hasReacted 
                        ? 'bg-primary-500/20 border-primary-500/40 text-primary-600 dark:text-primary-400' 
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'}
                      border
                    `}
                  >
                    <span>{emoji}</span>
                    <span>{userIds.length}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Floating Action Bar */}
          {showActions && !isDeleting && (
            <div className={`
              absolute top-1/2 -translate-y-1/2 
              ${isOwn ? 'right-full mr-3' : 'left-full ml-3'} 
              flex items-center gap-0.5 z-20 
              animate-fade-in
            `}>
              {/* Emoji Picker Popover */}
              {showEmojiPicker && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-2xl shadow-2xl flex gap-1 animate-slide-up">
                  {COMMON_EMOJIS.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => handleToggleEmoji(emoji)}
                      className="hover:bg-slate-100 dark:hover:bg-slate-800 p-1.5 rounded-xl transition-all text-lg hover:scale-125 active:scale-95"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}

              <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-all" title="Reply">
                <Reply className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={handleCopy}
                className={`p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all ${copied ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'}`}
                title="Copy"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
              {isOwn && (
                <>
                  <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-all" title="Edit">
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-1.5 hover:bg-red-500/10 dark:hover:bg-red-500/20 rounded-lg text-slate-400 dark:text-slate-500 hover:text-red-500 transition-all"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </>
              )}
              <button 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all ${showEmojiPicker ? 'text-amber-500' : 'text-slate-400 dark:text-slate-500 hover:text-amber-500'}`} 
                title="React"
              >
                <Smile className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Timestamp & Status for own messages */}
        {isOwn && (
          <div className="flex items-center gap-1.5 mt-1 mr-1">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">
              {format(new Date(message.timestamp), 'HH:mm')}
            </span>
            <div className="flex items-center">
              {isSending ? (
                <Loader2 className="h-2.5 w-2.5 animate-spin text-slate-400" />
              ) : (
                <Check className="h-3 w-3 text-emerald-500" />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
