import { IconSymbol } from '@/components/ui/IconSymbol';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export interface Driver {
  id: string;
  name: string;
  photo: string;
  carModel: string;
  plateNumber: string;
  estimatedArrival: number;
  price: number;
  rating: number;
  vehicleType: 'Economy' | 'Electric' | 'Premium';
}

interface DriverCardProps {
  driver: Driver;
  onSelect: (driver: Driver) => void;
}

export const DriverCard: React.FC<DriverCardProps> = ({ driver, onSelect }) => {
  return (
    <TouchableOpacity
      onPress={() => onSelect(driver)}
      className="bg-white border border-gray-200 rounded-lg p-5 mb-4 shadow-sm"
    >
      <View className="flex-row items-center gap-3">
        <Image
          source={{ uri: driver.photo }}
          className="w-16 aspect-square rounded-full"
        />
        <View className="flex-1 justify-center">
          <View className="flex-row items-center gap-2">
            <Text className="text-lg font-semibold text-gray-800">{driver.name}</Text>
            <View className="flex-row items-center space-x-1">
              <IconSymbol name="star.fill" color="#fbbf24" size={12} />
              <Text className="text-sm text-gray-600">{driver.rating}</Text>
            </View>
          </View>
          <Text className="text-gray-600 text-base">
            {driver.carModel} • {driver.plateNumber}
          </Text>
          <Text className="text-sm text-gray-500">{driver.vehicleType}</Text>
        </View>
        <View className="items-end">
          <Text className="text-lg font-semibold text-gray-800 mb-1">${driver.price}</Text>
          <Text className="text-sm text-gray-500">{driver.estimatedArrival} mins</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}; 