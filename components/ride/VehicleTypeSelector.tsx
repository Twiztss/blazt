import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type VehicleType = 'Economy' | 'Electric' | 'Premium';

interface VehicleTypeSelectorProps {
  selectedVehicleType: VehicleType;
  onVehicleTypeSelect: (type: VehicleType) => void;
}

export const VehicleTypeSelector: React.FC<VehicleTypeSelectorProps> = ({
  selectedVehicleType,
  onVehicleTypeSelect
}) => {
  const vehicleTypes: VehicleType[] = ['Economy', 'Electric', 'Premium'];

  return (
    <View className="mb-8">
      <Text className="text-lg font-semibold text-gray-800 mb-4">Vehicle Type</Text>
      <View className="flex-row gap-3">
        {vehicleTypes.map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => onVehicleTypeSelect(type)}
            className={`flex-1 p-4 rounded-lg border-2 ${
              selectedVehicleType === type 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 bg-white'
            }`}
          >
            <Text className={`text-center font-medium text-base ${
              selectedVehicleType === type ? 'text-blue-600' : 'text-gray-600'
            }`}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}; 