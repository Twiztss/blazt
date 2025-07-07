import React from 'react';
import { Text, View } from 'react-native';

interface TripDetailsProps {
  estimatedTime: number;
  estimatedDistance: number;
  basePriceRange: string;
}

export const TripDetails: React.FC<TripDetailsProps> = ({
  estimatedTime,
  estimatedDistance,
  basePriceRange
}) => {
  return (
    <View className="bg-gray-50 rounded-lg p-6 mb-8">
      <View className="flex-row justify-between items-center">
        <View className="flex-1 items-center">
          <Text className="text-sm text-gray-500 mb-2">Estimated Time</Text>
          <Text className="text-lg font-semibold text-gray-800">{estimatedTime} min</Text>
        </View>
        <View className="flex-1 items-center">
          <Text className="text-sm text-gray-500 mb-2">Distance</Text>
          <Text className="text-lg font-semibold text-gray-800">{estimatedDistance} km</Text>
        </View>
        <View className="flex-1 items-center">
          <Text className="text-sm text-gray-500 mb-2">Base Price</Text>
          <Text className="text-lg font-semibold text-gray-800">{basePriceRange}</Text>
        </View>
      </View>
    </View>
  );
}; 