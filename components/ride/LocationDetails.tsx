import { IconSymbol } from '@/components/ui/IconSymbol';
import React from 'react';
import { Text, View } from 'react-native';

interface LocationDetailsProps {
  userAddress: string | null;
  destinationAddress: string | null;
}

export const LocationDetails: React.FC<LocationDetailsProps> = ({ 
  userAddress, 
  destinationAddress 
}) => {
  return (
    <View className="flex-col gap-4 mb-8">
      <View className="flex-row items-start gap-3">
        <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mt-1">
          <IconSymbol name="location.fill" color="#22c55e" size={16} />
        </View>
        <View className="flex-1">
          <Text className="text-sm text-gray-500 mb-1">Pick-up</Text>
          <Text className="text-gray-800 font-medium text-base">
            {userAddress ?? 'Current location'}
          </Text>
        </View>
      </View>
      
      <View className="flex-row items-start gap-3">
        <View className="w-8 h-8 bg-red-100 rounded-full items-center justify-center mt-1">
          <IconSymbol name="location.fill" color="#ef4444" size={16} />
        </View>
        <View className="flex-1">
          <Text className="text-sm text-gray-500 mb-1">Destination</Text>
          <Text className="text-gray-800 font-medium text-base">
            {destinationAddress ?? 'Select destination'}
          </Text>
        </View>
      </View>
    </View>
  );
}; 