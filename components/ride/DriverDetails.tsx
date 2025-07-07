import { IconSymbol } from '@/components/ui/IconSymbol';
import React from 'react';
import { Image, Text, View } from 'react-native';
import { Driver } from './DriverCard';

interface DriverDetailsProps {
  driver: Driver;
}

export const DriverDetails: React.FC<DriverDetailsProps> = ({ driver }) => {
  return (
    <View className="bg-blue-50 rounded-lg p-6 mb-8">
      <Text className="text-lg font-semibold text-gray-800 mb-4">Your Driver</Text>
      
      <View className="flex-row items-center justify-between gap-3">
        <Image
          source={{ uri: driver.photo }}
          className="w-16 aspect-square rounded-full"
        />
        <View className="flex-1 justify-center gap-1">
          <Text className="text-lg font-semibold text-gray-800">{driver.name}</Text>
          <Text className="text-gray-600 text-base">
            {driver.carModel} • {driver.plateNumber}
          </Text>
          <View className="flex-row items-center">
            <IconSymbol name="star.fill" color="#fbbf24" size={12} />
            <Text className="text-sm text-gray-600">
              {driver.rating} • {driver.vehicleType}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}; 