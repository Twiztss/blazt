import { IconSymbol } from '@/components/ui/IconSymbol';
import { Promotion } from '@/types/message';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface PromotionCardProps {
  promotion: Promotion;
  onPress: (promotion: Promotion) => void;
}

export const PromotionCard: React.FC<PromotionCardProps> = ({ promotion, onPress }) => {
  const formatValidUntil = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays <= 0) {
      return 'Expired';
    } else if (diffInDays === 1) {
      return 'Expires today';
    } else {
      return `Expires in ${diffInDays} days`;
    }
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(promotion)}
      className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 mb-3 border border-orange-200"
    >
      <View className="flex-row items-center gap-3">
        {promotion.imageUrl && (
          <Image
            source={{ uri: promotion.imageUrl }}
            className="w-16 h-16 rounded-lg"
          />
        )}
        
        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-1">
            <View className="bg-orange-500 rounded-full px-2 py-1">
              <Text className="text-white text-xs font-bold">
                {promotion.discountPercentage}% OFF
              </Text>
            </View>
            {promotion.code && (
              <View className="bg-white rounded-full px-2 py-1 border border-orange-300">
                <Text className="text-orange-600 text-xs font-semibold">
                  {promotion.code}
                </Text>
              </View>
            )}
          </View>
          
          <Text className="text-lg font-semibold text-gray-800 mb-1">
            {promotion.title}
          </Text>
          
          <Text className="text-gray-600 text-sm mb-2" numberOfLines={2}>
            {promotion.description}
          </Text>
          
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <IconSymbol name="clock.fill" color="#6b7280" size={12} />
              <Text className="text-xs text-gray-500 ml-1">
                {formatValidUntil(promotion.validUntil)}
              </Text>
            </View>
            
            <View className="flex-row items-center">
              <IconSymbol name="arrow.right" color="#f97316" size={14} />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}; 