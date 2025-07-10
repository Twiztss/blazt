import { IconSymbol } from '@/components/ui/IconSymbol';
import { Chat } from '@/types/message';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface ChatCardProps {
  chat: Chat;
  onPress: (chat: Chat) => void;
}

export const ChatCard: React.FC<ChatCardProps> = ({ chat, onPress }) => {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return diffInMinutes === 0 ? 'now' : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(chat)}
      className="bg-white border-b border-gray-100 p-4"
    >
      <View className="flex-row items-center gap-3 ml-2">
        <View className="relative">
          <Image
            source={{ uri: chat.driverPhoto }}
            className="w-14 h-14 rounded-full border-gray-200 border"
          />
          {chat.isActive && (
            <View className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
          )}
        </View>
        
        <View className="flex-1 justify-center ml-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-gray-800">
              {chat.driverName}
            </Text>
            <Text className="text-sm text-gray-500">
              {formatTime(chat.lastMessageTime)}
            </Text>
          </View>
          
          <View className="flex-row items-center justify-between mt-1">
            <Text 
              className="text-gray-600 text-base flex-1 mr-2"
              numberOfLines={1}
            >
              {chat.lastMessage}
            </Text>
            
            {chat.unreadCount > 0 && (
              <View className="bg-orange-500 rounded-full min-w-[20px] h-5 items-center justify-center px-1">
                <Text className="text-white text-xs font-semibold">
                  {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                </Text>
              </View>
            )}
          </View>
          
          {chat.tripId && (
            <View className="flex-row items-center mt-1">
              <IconSymbol name="car.fill" color="#6b7280" size={12} />
              <Text className="text-xs text-gray-500 ml-1">
                Trip #{chat.tripId.split('-')[1]}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}; 