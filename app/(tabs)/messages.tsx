import { ChatCard } from '@/components/messages/ChatCard';
import { ChatDetailScreen } from '@/components/messages/ChatDetailScreen';
import { PromotionCard } from '@/components/messages/PromotionCard';
import { PromotionDetailModal } from '@/components/messages/PromotionDetailModal';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useMessageStore } from '@/store/messageStore';
import { Chat, Message, Promotion } from '@/types/message';
import { useState } from 'react';
import {
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const Messages = () => {
  const { 
    chats, 
    promotions, 
    activeChat, 
    setActiveChat, 
    addMessage, 
    markChatAsRead,
    isLoading 
  } = useMessageStore();
  
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleChatPress = (chat: Chat) => {
    setActiveChat(chat);
    markChatAsRead(chat.id);
  };

  const handleBackToChats = () => {
    setActiveChat(null);
  };

  const handleSendMessage = (messageText: string) => {
    if (!activeChat) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content: messageText,
      timestamp: new Date(),
      senderId: 'user',
      senderType: 'user',
      isRead: false,
      messageType: 'text'
    };

    addMessage(activeChat.id, newMessage);
  };

  const handlePromotionPress = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setShowPromotionModal(true);
  };

  const handleApplyPromotion = (promotion: Promotion) => {
    Alert.alert(
      'Promotion Applied',
      `The promotion code "${promotion.code}" has been applied to your next ride!`,
      [{ text: 'OK', onPress: () => setShowPromotionModal(false) }]
    );
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // If a chat is active, show the chat detail screen
  if (activeChat) {
    return (
      <ChatDetailScreen
        chat={activeChat}
        onBack={handleBackToChats}
        onSendMessage={handleSendMessage}
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-white border-gray-200 px-4 py-3">
        <Text className="text-4xl font-bold text-gray-800">Messages</Text>
      </View>

      <ScrollView 
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#f97316']}
            tintColor="#f97316"
          />
        }
      >
        {/* Promotions Section */}
        {promotions.length > 0 && (
          <View className="bg-white border-gray-200">
            <View className="px-4 py-3 border-gray-100">
              <Text className="text-lg font-semibold text-gray-800">
                Special Offers
              </Text>
              <Text className="text-gray-600 text-sm">
                Don't miss out on these great deals
              </Text>
            </View>
            
            <View className="px-4 py-3">
              {promotions.map((promotion) => (
                <PromotionCard
                  key={promotion.id}
                  promotion={promotion}
                  onPress={handlePromotionPress}
                />
              ))}
            </View>
          </View>
        )}

        {/* Chats Section */}
        <View className="bg-white">
          <View className="px-4 py-3 border-b border-gray-100">
            <Text className="text-lg font-semibold text-gray-800">
              Recent Chats
            </Text>
            <Text className="text-gray-600 text-sm">
              {chats.length} conversation{chats.length !== 1 ? 's' : ''}
            </Text>
          </View>

          {chats.length === 0 ? (
            <View className="px-4 py-8 items-center">
              <IconSymbol name="message" color="#9ca3af" size={48} />
              <Text className="text-gray-500 text-lg font-medium mt-4">
                No messages yet
              </Text>
              <Text className="text-gray-400 text-center mt-2">
                Start a ride to chat with your driver
              </Text>
            </View>
          ) : (
            chats.map((chat) => (
              <ChatCard
                key={chat.id}
                chat={chat}
                onPress={handleChatPress}
              />
            ))
          )}
        </View>

        {/* Empty state for no chats */}
        {chats.length === 0 && promotions.length === 0 && (
          <View className="flex-1 items-center justify-center py-16">
            <IconSymbol name="message" color="#9ca3af" size={64} />
            <Text className="text-gray-500 text-xl font-medium mt-4">
              No messages or promotions
            </Text>
            <Text className="text-gray-400 text-center mt-2 px-8">
              Book a ride to start chatting with drivers and receive special offers
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Promotion Detail Modal */}
      <PromotionDetailModal
        promotion={selectedPromotion}
        visible={showPromotionModal}
        onClose={() => setShowPromotionModal(false)}
        onApply={handleApplyPromotion}
      />
    </SafeAreaView>
  );
};

export default Messages;

