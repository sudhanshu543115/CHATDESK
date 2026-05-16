import { store } from '../store';
import { chatApi } from '../store/services/chatApi';
import { setUnreadCount } from '../store/slices/chatSlice';

let socket = null;
let reconnectInterval = 5000; // Increased to 5s
let pingInterval = null;
let isConnecting = false;

export const initWebSocket = (userId) => {
  if (!userId || isConnecting) return;

  // Don't kill an already connecting or open socket
  if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
    return;
  }

  isConnecting = true;
  
  if (socket) {
    console.log('🔄 Cleaning up old connection...');
    socket.onclose = null;
    socket.onerror = null;
    socket.onmessage = null;
    socket.onopen = null;
    try {
      socket.close();
    } catch (e) {}
    socket = null;
  }

  // Auto-detect WebSocket URL based on environment
  let wsBaseUrl = import.meta.env.VITE_WS_BASE_URL || `ws://127.0.0.1:8001`;

  
  // If we're on production (Vercel) but the env is still pointing to localhost, auto-correct it
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    try {
      // Use the API URL as a base for the WebSocket URL
      const apiHost = new URL(import.meta.env.VITE_API_BASE_URL || window.location.origin).host;
      wsBaseUrl = `${protocol}//${apiHost}`;
    } catch (e) {
      wsBaseUrl = `${protocol}//${window.location.hostname}`;
    }
  }

  const wsUrl = `${wsBaseUrl}/ws/${userId}`;

  console.log(`📡 Connecting to real-time server...`);
  
  socket = new WebSocket(wsUrl);

  socket.onopen = () => {
    console.log('✅ Real-time connection established');
    isConnecting = false;
    
    if (pingInterval) clearInterval(pingInterval);
    pingInterval = setInterval(() => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send('ping');
      }
    }, 25000); 
  };

  socket.onmessage = (event) => {
    try {
      if (event.data === 'pong' || event.data === '{"type": "PING"}') return;

      const message = JSON.parse(event.data);
      
      if (message.type === 'NEW_MESSAGE') {
        const newMessage = message.data;
        const state = store.getState();
        const currentUserId = state.auth.user?.id;
        const activeChat = state.chat.activeChat;

        const arg = { 
          channelId: newMessage.channelId, 
          recipientId: newMessage.recipientId, 
          groupId: newMessage.groupId 
        };

        store.dispatch(
          chatApi.util.updateQueryData('getMessages', arg, (draft) => {
            if (!draft.data) draft.data = { messages: [] };
            const exists = draft.data.messages.some(m => m.id === newMessage.id);
            if (!exists) {
              draft.data.messages.push(newMessage);
            }
          })
        );

        const isFromMe = String(newMessage.senderId) === String(currentUserId);
        const isInActiveChat = activeChat && String(activeChat.id) === String(newMessage.senderId || newMessage.channelId || newMessage.groupId);

        console.log('🔊 Sound Check:', { isFromMe, isInActiveChat, senderId: newMessage.senderId, currentUserId });

        // FIX: Remove !isInActiveChat so sound plays even if the chat is open!
        if (!isFromMe) {
          console.log('🎵 Attempting to play notification sound...');
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3');
          audio.volume = 0.4;
          audio.play()
            .then(() => console.log('✅ Sound played successfully'))
            .catch((err) => {
              console.warn('❌ Sound failed (Autoplay policy?):', err.message);
            });

          // Only show visual notification if NOT in active chat
          if (!isInActiveChat && Notification.permission === 'granted') {
            new Notification(`New message from ${newMessage.sender.username}`, {
              body: newMessage.content,
              icon: '/logo.png'
            });
          }

          if (!isInActiveChat) {
            const chatId = newMessage.channelId || newMessage.groupId || newMessage.senderId;
            const currentCount = state.chat.unreadCounts[chatId] || 0;
            store.dispatch(setUnreadCount({ chatId, count: currentCount + 1 }));
          }
        } else {
          console.log('🔇 Sound suppressed (Message is from yourself)');
        }
      } else if (message.type === 'REACTION_UPDATE') {
        const { messageId, reactions } = message.data;
        const state = store.getState();
        const activeChat = state.chat.activeChat;

        if (activeChat) {
          const arg = { 
            channelId: activeChat.workspaceId && !activeChat.username ? parseInt(activeChat.id) : null,
            recipientId: activeChat.username ? parseInt(activeChat.id) : null,
            groupId: activeChat.memberCount !== undefined ? parseInt(activeChat.id) : null
          };

          store.dispatch(
            chatApi.util.updateQueryData('getMessages', arg, (draft) => {
              if (draft?.data?.messages) {
                const msg = draft.data.messages.find(m => m.id === messageId);
                if (msg) {
                  msg.reactions = reactions;
                }
              }
            })
          );
        }
      } else if (['TASK_CREATED', 'TASK_UPDATED', 'TASK_DELETED'].includes(message.type)) {

        console.log(`📋 Mission Update Received: ${message.type}`);
        // Invalidate the Task tag to trigger a re-fetch of the board
        store.dispatch(chatApi.util.invalidateTags(['Task']));
      }
    } catch (e) {}
  };

  socket.onerror = () => {
    isConnecting = false;
  };

  socket.onclose = () => {
    isConnecting = false;
    console.log('⚠️ Connection lost. Reconnecting in 5s...');
    if (pingInterval) clearInterval(pingInterval);
    
    // Add a small random jitter to prevent "thundering herd"
    const jitter = Math.random() * 1000;
    setTimeout(() => initWebSocket(userId), reconnectInterval + jitter);
  };
};

if (typeof window !== 'undefined' && 'Notification' in window) {
  if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
    document.addEventListener('click', () => {
      Notification.requestPermission();
    }, { once: true });
  }
}
