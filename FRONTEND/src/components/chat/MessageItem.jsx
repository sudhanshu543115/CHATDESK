import React, { useState } from 'react';
import { format } from 'date-fns';
import Avatar from '@components/common/Avatar';
import { MoreVertical, Reply, Edit2, Trash2, Smile, Loader2, Copy, Check } from 'lucide-react';
import { useDeleteMessageMutation } from '@store/services/chatApi';

const MessageItem = ({ message, isOwn }) => {
  const [showActions, setShowActions] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deleteMessage, { isLoading: isDeleting }] = useDeleteMessageMutation();

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

  const displayName = message.sender?.username || 'Unknown';
  const avatarSeed = displayName;

  return (
    <div
      className={`
        flex gap-3 animate-fade-in group transition-all duration-300
        ${isOwn ? 'flex-row-reverse' : ''}
      `}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
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
        {/* Sender Name & Time */}
        {!isOwn && (
          <div className="flex items-center gap-2 mb-1 ml-1">
            <span className="text-xs font-black text-slate-700 dark:text-slate-300 tracking-tight">
              {displayName}
            </span>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">
              {format(new Date(message.timestamp), 'HH:mm')}
            </span>
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={`
            relative p-3.5 rounded-2xl transition-all duration-300
            ${isOwn
              ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20 rounded-tr-none'
              : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none shadow-sm'
            }
            ${isDeleting ? 'opacity-50 grayscale' : ''}
          `}
        >
          <p className="text-sm leading-relaxed break-words">{message.content}</p>

          {isDeleting && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 dark:bg-black/20 rounded-2xl">
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            </div>
          )}
        </div>

        {/* Time for own messages */}
        {isOwn && (
          <div className="flex items-center gap-2 mt-1 mr-1">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">
              {format(new Date(message.timestamp), 'HH:mm')}
            </span>
          </div>
        )}

        {/* Actions - Modern Floating Bar */}
        {showActions && !isDeleting && (
          <div
            className={`
              flex items-center gap-1.5 mt-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-1 rounded-xl shadow-xl animate-slide-up transition-colors
              ${isOwn ? 'flex-row-reverse' : ''}
            `}
          >
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
            <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-500 hover:text-amber-500 transition-all" title="React">
              <Smile className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
