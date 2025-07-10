import { Chat, MessageStore, Promotion } from "@/types/message";
import { create } from "zustand";

// Mock data for testing
const mockChats: Chat[] = [
  {
    id: '1',
    driverId: '1',
    driverName: 'John Smith',
    driverPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    lastMessage: 'I\'m 2 minutes away from your pickup location',
    lastMessageTime: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    unreadCount: 2,
    isActive: true,
    tripId: 'trip-123',
    messages: [
      {
        id: 'msg-1',
        content: 'Hi! I\'m your driver for today',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        senderId: '1',
        senderType: 'driver',
        isRead: true,
        messageType: 'text'
      },
      {
        id: 'msg-2',
        content: 'I\'m 2 minutes away from your pickup location',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        senderId: '1',
        senderType: 'driver',
        isRead: false,
        messageType: 'text'
      }
    ]
  },
  {
    id: '2',
    driverId: '2',
    driverName: 'Sarah Johnson',
    driverPhoto: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    lastMessage: 'Your ride has been completed. How was your experience?',
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    unreadCount: 0,
    isActive: false,
    tripId: 'trip-456',
    messages: [
      {
        id: 'msg-3',
        content: 'Your ride has been completed. How was your experience?',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        senderId: '2',
        senderType: 'driver',
        isRead: true,
        messageType: 'text'
      }
    ]
  },
  {
    id: '3',
    driverId: '3',
    driverName: 'Mike Davis',
    driverPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    lastMessage: 'I\'ll be there in 3 minutes',
    lastMessageTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    unreadCount: 1,
    isActive: true,
    tripId: 'trip-789',
    messages: [
      {
        id: 'msg-4',
        content: 'I\'ll be there in 3 minutes',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        senderId: '3',
        senderType: 'driver',
        isRead: false,
        messageType: 'text'
      }
    ]
  }
];

const mockPromotions: Promotion[] = [
  {
    id: 'promo-1',
    title: 'Weekend Special',
    description: 'Get 20% off on all rides this weekend',
    discountPercentage: 20,
    validUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=150&fit=crop',
    code: 'WEEKEND20',
    terms: 'Valid on weekends only. Cannot be combined with other offers.'
  },
  {
    id: 'promo-2',
    title: 'First Ride Free',
    description: 'New users get their first ride completely free',
    discountPercentage: 100,
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=150&fit=crop',
    code: 'FIRSTRIDE',
    terms: 'Valid for new users only. Maximum value $25.'
  }
];

export const useMessageStore = create<MessageStore>((set, get) => ({
  // Initial state
  chats: mockChats,
  activeChat: null,
  promotions: mockPromotions,
  isLoading: false,
  error: null,

  // Actions
  setChats: (chats) => set({ chats }),
  
  addChat: (chat) => set((state) => ({ 
    chats: [...state.chats, chat] 
  })),
  
  updateChat: (chatId, updates) => set((state) => ({
    chats: state.chats.map(chat => 
      chat.id === chatId ? { ...chat, ...updates } : chat
    ),
    activeChat: state.activeChat?.id === chatId 
      ? { ...state.activeChat, ...updates } 
      : state.activeChat
  })),
  
  removeChat: (chatId) => set((state) => ({
    chats: state.chats.filter(chat => chat.id !== chatId),
    activeChat: state.activeChat?.id === chatId ? null : state.activeChat
  })),
  
  setActiveChat: (chat) => set({ activeChat: chat }),
  
  addMessage: (chatId, message) => set((state) => {
    const updatedChats = state.chats.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          messages: [...chat.messages, message],
          lastMessage: message.content,
          lastMessageTime: message.timestamp,
          unreadCount: message.senderType === 'driver' && !message.isRead 
            ? chat.unreadCount + 1 
            : chat.unreadCount
        };
      }
      return chat;
    });

    return {
      chats: updatedChats,
      activeChat: state.activeChat?.id === chatId 
        ? updatedChats.find(chat => chat.id === chatId) || null
        : state.activeChat
    };
  }),
  
  markChatAsRead: (chatId) => set((state) => ({
    chats: state.chats.map(chat => 
      chat.id === chatId 
        ? { ...chat, unreadCount: 0, messages: chat.messages.map(msg => ({ ...msg, isRead: true })) }
        : chat
    ),
    activeChat: state.activeChat?.id === chatId 
      ? { ...state.activeChat, unreadCount: 0, messages: state.activeChat.messages.map(msg => ({ ...msg, isRead: true })) }
      : state.activeChat
  })),
  
  setPromotions: (promotions) => set({ promotions }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error })
})); 