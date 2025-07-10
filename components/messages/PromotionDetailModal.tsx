import { IconSymbol } from '@/components/ui/IconSymbol';
import { Promotion } from '@/types/message';
import React from 'react';
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface PromotionDetailModalProps {
  promotion: Promotion | null;
  visible: boolean;
  onClose: () => void;
  onApply: (promotion: Promotion) => void;
}

export const PromotionDetailModal: React.FC<PromotionDetailModalProps> = ({ 
  promotion, 
  visible, 
  onClose, 
  onApply 
}) => {
  if (!promotion) return null;

  const formatValidUntil = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
          <Text className="text-lg font-semibold text-gray-800">
            Promotion Details
          </Text>
          <TouchableOpacity onPress={onClose}>
            <IconSymbol name="xmark" color="#374151" size={24} />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 p-4">
          {/* Promotion Image */}
          {promotion.imageUrl && (
            <Image
              source={{ uri: promotion.imageUrl }}
              className="w-full h-48 rounded-lg mb-4"
            />
          )}

          {/* Promotion Badge */}
          <View className="flex-row items-center mb-4">
            <View className="bg-orange-500 rounded-full px-4 py-2 mr-3">
              <Text className="text-white font-bold text-lg">
                {promotion.discountPercentage}% OFF
              </Text>
            </View>
            {promotion.code && (
              <View className="bg-gray-100 rounded-full px-4 py-2 border border-gray-300">
                <Text className="text-gray-800 font-semibold">
                  Code: {promotion.code}
                </Text>
              </View>
            )}
          </View>

          {/* Title and Description */}
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            {promotion.title}
          </Text>
          
          <Text className="text-gray-600 text-base mb-6 leading-6">
            {promotion.description}
          </Text>

          {/* Validity */}
          <View className="bg-gray-50 rounded-lg p-4 mb-6">
            <View className="flex-row items-center mb-2">
              <IconSymbol name="clock.fill" color="#6b7280" size={16} />
              <Text className="text-gray-700 font-semibold ml-2">
                Valid Until
              </Text>
            </View>
            <Text className="text-gray-600">
              {formatValidUntil(promotion.validUntil)}
            </Text>
          </View>

          {/* Terms and Conditions */}
          {promotion.terms && (
            <View className="mb-6">
              <Text className="text-gray-700 font-semibold mb-2">
                Terms & Conditions
              </Text>
              <Text className="text-gray-600 text-sm leading-5">
                {promotion.terms}
              </Text>
            </View>
          )}

          {/* How to Use */}
          <View className="bg-blue-50 rounded-lg p-4 mb-6">
            <Text className="text-blue-800 font-semibold mb-2">
              How to Use
            </Text>
            <View className="space-y-2">
              <View className="flex-row items-start">
                <View className="bg-blue-500 rounded-full w-6 h-6 items-center justify-center mr-3 mt-0.5">
                  <Text className="text-white text-xs font-bold">1</Text>
                </View>
                <Text className="text-blue-700 flex-1">
                  Copy the promotion code: <Text className="font-semibold">{promotion.code}</Text>
                </Text>
              </View>
              <View className="flex-row items-start">
                <View className="bg-blue-500 rounded-full w-6 h-6 items-center justify-center mr-3 mt-0.5">
                  <Text className="text-white text-xs font-bold">2</Text>
                </View>
                <Text className="text-blue-700 flex-1">
                  Book your ride and apply the code at checkout
                </Text>
              </View>
              <View className="flex-row items-start">
                <View className="bg-blue-500 rounded-full w-6 h-6 items-center justify-center mr-3 mt-0.5">
                  <Text className="text-white text-xs font-bold">3</Text>
                </View>
                <Text className="text-blue-700 flex-1">
                  Enjoy your discounted ride!
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View className="p-4 border-t border-gray-200">
          <TouchableOpacity
            onPress={() => onApply(promotion)}
            className="bg-orange-500 rounded-full py-4 mb-3"
          >
            <Text className="text-white text-center font-semibold text-lg">
              Apply Promotion
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={onClose}
            className="bg-gray-100 rounded-full py-4"
          >
            <Text className="text-gray-700 text-center font-semibold text-lg">
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}; 