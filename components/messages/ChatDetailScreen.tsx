import { IconSymbol } from '@/components/ui/IconSymbol';
import { Chat, Message } from '@/types/message';
import React, { useEffect, useRef, useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface ChatDetailScreenProps {
  chat: Chat;
  onBack: () => void;
  onSendMessage: (message: string) => void;
}

export const ChatDetailScreen: React.FC<ChatDetailScreenProps> = ({ 
  chat, 
  onBack, 
  onSendMessage 
}) => {
  const [messageText, setMessageText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSend = () => {
    if (messageText.trim()) {
      onSendMessage(messageText.trim());
      setMessageText('');
    }
  };

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [chat.messages]);

  const renderMessage = (message: Message) => {
    const isUser = message.senderType === 'user';
    
    return (
      <View 
        key={message.id} 
        className={`flex-row ${isUser ? 'justify-end' : 'justify-start'} mb-3`}
      >
        <View className={`max-w-[75%] ${isUser ? 'order-2' : 'order-1'}`}>
          {!isUser && (
            <View className="flex-row items-center mb-1">
              <Image
                source={{ uri: chat.driverPhoto }}
                className="w-6 h-6 rounded-full mr-2 border border-gray-200"
              />
              <Text className="text-xs text-gray-500">{chat.driverName}</Text>
            </View>
          )}
          
          <View className={`rounded-2xl px-4 py-3 ${
            isUser 
              ? 'bg-orange-500 rounded-br-md' 
              : 'bg-gray-100 rounded-bl-md'
          }`}>
            <Text className={`text-base ${
              isUser ? 'text-white' : 'text-gray-800'
            }`}>
              {message.content}
            </Text>
          </View>
          
          <Text className={`text-xs text-gray-500 mt-1 ${
            isUser ? 'text-right' : 'text-left'
          }`}>
            {formatTime(message.timestamp)}
            {isUser && (
              <IconSymbol 
                name={message.isRead ? "checkmark.circle.fill" : "checkmark.circle"} 
                color={message.isRead ? "#10b981" : "#9ca3af"} 
                size={12} 
              />
            )}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className='flex-1 bg-white'>
    <KeyboardAvoidingView 
      className="flex-1 bg-white" 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-200 bg-white">
        <TouchableOpacity onPress={onBack} className="mr-3">
          <IconSymbol name="chevron.left" color="#374151" size={24} />
        </TouchableOpacity>
        
        <Image
          source={{ uri: chat.driverPhoto }}
          className="w-10 h-10 rounded-full mr-3"
        />
        
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-800">
            {chat.driverName}
          </Text>
          <View className="flex-row items-center">
            <View className={`w-2 h-2 rounded-full mr-2 ${
              chat.isActive ? 'bg-green-500' : 'bg-gray-400'
            }`} />
            <Text className="text-sm text-gray-500">
              {chat.isActive ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity className="ml-2">
          <IconSymbol name="phone.fill" color="#f97316" size={20} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView 
        ref={scrollViewRef}
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
      >
        {chat.messages.map(renderMessage)}
      </ScrollView>

      {/* Input */}
      <View className="flex-row items-center p-3 mb-14 border-t border-gray-200 bg-white">
        <TouchableOpacity className="mr-3">
          <IconSymbol name="plus.circle" color="#6b7280" size={24} />
        </TouchableOpacity>
        
        <TextInput
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type a message..."
          className="flex-1 bg-gray-100 rounded-full px-4 py-3 text-base"
          multiline
          maxLength={500}
        />
        
        <TouchableOpacity 
          onPress={handleSend}
          disabled={!messageText.trim()}
          className={`ml-3 p-3 rounded-full ${
            messageText.trim() ? 'bg-orange-500' : 'bg-gray-300'
          }`}
        >
          <IconSymbol 
            name="arrow.up" 
            color={messageText.trim() ? "#ffffff" : "#9ca3af"} 
            size={20} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}; 