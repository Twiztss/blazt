import React from 'react';
import { Text, View } from 'react-native';

interface PriceBreakdownProps {
  baseFare: number;
  serviceFee: number;
}

export const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
  baseFare,
  serviceFee
}) => {
  const total = baseFare + serviceFee;

  return (
    <View className="bg-gray-50 rounded-lg p-6 mb-8">
      <Text className="text-lg font-semibold text-gray-800 mb-4">Price Breakdown</Text>
      
      <View className="space-y-3">
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-600 text-base">Base Fare</Text>
          <Text className="text-gray-800 text-base font-medium">${baseFare.toFixed(2)}</Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-600 text-base">Service Fee</Text>
          <Text className="text-gray-800 text-base font-medium">${serviceFee.toFixed(2)}</Text>
        </View>
        <View className="border-t border-gray-200 pt-3 mt-3">
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-semibold text-gray-800">Total</Text>
            <Text className="text-lg font-semibold text-gray-800">
              ${total.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}; 