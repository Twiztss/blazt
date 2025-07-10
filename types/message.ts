export interface Message {
  id: string;
  content: string;
  timestamp: Date;
  senderId: string;
  senderType: 'user' | 'driver';
  isRead: boolean;
  messageType: 'text' | 'image' | 'location' | 'system';
}

export interface Chat {
  id: string;
  driverId: string;
  driverName: string;
  driverPhoto: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isActive: boolean;
  tripId?: string;
  messages: Message[];
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discountPercentage: number;
  validUntil: Date;
  isActive: boolean;
  imageUrl?: string;
  code?: string;
  terms?: string;
}

export interface MessageStore {
  chats: Chat[];
  activeChat: Chat | null;
  promotions: Promotion[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setChats: (chats: Chat[]) => void;
  addChat: (chat: Chat) => void;
  updateChat: (chatId: string, updates: Partial<Chat>) => void;
  removeChat: (chatId: string) => void;
  setActiveChat: (chat: Chat | null) => void;
  addMessage: (chatId: string, message: Message) => void;
  markChatAsRead: (chatId: string) => void;
  setPromotions: (promotions: Promotion[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
} 