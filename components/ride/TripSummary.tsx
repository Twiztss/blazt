import { IconSymbol } from '@/components/ui/IconSymbol';
import React from 'react';
import { Text, View } from 'react-native';

interface TripSummaryProps {
  userAddress: string | null;
  destinationAddress: string | null;
}

export const TripSummary: React.FC<TripSummaryProps> = ({
  userAddress,
  destinationAddress
}) => {
  return (
    <View className="bg-gray-50 rounded-lg p-6 mb-8">
      <Text className="text-lg font-semibold text-gray-800 mb-4">Trip Summary</Text>
      
      <View className="flex-col gap-4">
        <View className="flex-row items-start gap-3">
          <View className="w-6 h-6 bg-green-100 rounded-full items-center justify-center mt-1">
            <IconSymbol name="location.fill" color="#22c55e" size={12} />
          </View>
          <View className="flex-1">
            <Text className="text-sm text-gray-500 mb-1">From</Text>
            <Text className="text-gray-800 font-medium text-base">
              {userAddress ?? 'Current location'}
            </Text>
          </View>
        </View>
        
        <View className="flex-row items-start gap-3">
          <View className="w-6 h-6 bg-red-100 rounded-full items-center justify-center mt-1">
            <IconSymbol name="location.fill" color="#ef4444" size={12} />
          </View>
          <View className="flex-1">
            <Text className="text-sm text-gray-500 mb-1">To</Text>
            <Text className="text-gray-800 font-medium text-base">
              {destinationAddress ?? 'Select destination'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}; 