export const API_BASE_URL = 'http://localhost:8000';
export const WS_BASE_URL = 'http://localhost:8000';
export const GRAPHQL_ENDPOINT = `${API_BASE_URL}/graphql`;
export const WS_ENDPOINT = `${WS_BASE_URL}/ws`;

export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
};

export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
  FILE: 'file',
};

export const USER_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  AWAY: 'away',
  BUSY: 'busy',
};

export const CHAT_TYPES = {
  DIRECT: 'direct',
  GROUP: 'group',
  CHANNEL: 'channel',
};

export const NOTIFICATION_TYPES = {
  MESSAGE: 'message',
  MENTION: 'mention',
  REACTION: 'reaction',
  INVITE: 'invite',
  SYSTEM: 'system',
};

export const FILE_TYPES = {
  IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  VIDEO: ['video/mp4', 'video/webm', 'video/ogg'],
  AUDIO: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
  DOCUMENT: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
};

export const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
