import { format, formatDistanceToNow, isToday, isThisYear } from 'date-fns';

export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  
  if (isToday(date)) {
    return format(date, 'HH:mm');
  }
  
  if (isThisYear(date)) {
    return format(date, 'MMM d, HH:mm');
  }
  
  return format(date, 'MMM d, yyyy');
};

export const formatRelativeTime = (timestamp) => {
  const date = new Date(timestamp);
  return formatDistanceToNow(date, { addSuffix: true });
};

export const formatFullDate = (timestamp) => {
  const date = new Date(timestamp);
  return format(date, 'MMMM d, yyyy HH:mm');
};

export const formatChatDate = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  
  if (isToday(date)) {
    return 'Today';
  }
  
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  
  if (isThisYear(date)) {
    return format(date, 'MMMM d');
  }
  
  return format(date, 'MMMM d, yyyy');
};

export const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
