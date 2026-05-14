export const MOCK_USER = {
  id: 'u1',
  username: 'johndoe',
  displayName: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  status: 'online',
};

export const MOCK_WORKSPACES = [
  {
    id: 'w1',
    name: 'ChatDesk Team',
    slug: 'chatdesk-team',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=ChatDesk',
    isOwner: true,
  },
  {
    id: 'w2',
    name: 'Marketing Project',
    slug: 'marketing',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Marketing',
    isOwner: false,
  },
];

export const MOCK_CHANNELS = [
  { id: 'c1', name: 'general', isPrivate: false, description: 'Company-wide announcements' },
  { id: 'c2', name: 'development', isPrivate: false, description: 'Tech talk and PR reviews' },
  { id: 'c3', name: 'design-feedback', isPrivate: true, description: 'Private design reviews' },
];

export const MOCK_GROUPS = [
  { id: 'g1', name: 'Lunch Group', memberCount: 12, avatar: null },
  { id: 'g2', name: 'Project X Core', memberCount: 5, avatar: null },
];

export const MOCK_CHATS = [
  {
    id: 'dm1',
    name: 'Jane Smith',
    type: 'direct',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    lastMessage: { content: 'Hey, did you see the latest designs?', timestamp: new Date().toISOString() },
    unreadCount: 2,
    status: 'online',
  },
  {
    id: 'dm2',
    name: 'Alex Wilson',
    type: 'direct',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    lastMessage: { content: 'The server is back up.', timestamp: new Date(Date.now() - 3600000).toISOString() },
    unreadCount: 0,
    status: 'offline',
  },
];

export const MOCK_MESSAGES = [
  {
    id: 'm1',
    content: 'Hello everyone! Welcome to the new workspace.',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    sender: { id: 'u2', username: 'jane_smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane' },
    reactions: [{ emoji: '👋', count: 3, users: [{ id: 'u1', username: 'johndoe' }] }],
  },
  {
    id: 'm2',
    content: 'Thanks Jane! Excited to be here.',
    timestamp: new Date(Date.now() - 86000000).toISOString(),
    sender: { id: 'u1', username: 'johndoe', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
  },
  {
    id: 'm3',
    content: 'I have uploaded the architecture diagram.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    sender: { id: 'u2', username: 'jane_smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane' },
    attachments: [{ id: 'a1', name: 'architecture.pdf', url: '#', type: 'application/pdf' }],
  },
];


export const MOCK_TASKS = [
  { id: 't1', title: 'Complete UI Redesign', status: 'In Progress', priority: 'High', assignee: 'Jane Smith' },
  { id: 't2', title: 'Fix Auth Bugs', status: 'Pending', priority: 'Critical', assignee: 'Alex Wilson' },
  { id: 't3', title: 'Write Documentation', status: 'Completed', priority: 'Low', assignee: 'John Doe' },
];
