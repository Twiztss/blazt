import React from 'react';
import { View } from 'react-native';
import { ActionButton } from '../ActionButton';
import { LocationDetails } from '../LocationDetails';
import { TripDetails } from '../TripDetails';
import { VehicleTypeSelector } from '../VehicleTypeSelector';

type VehicleType = 'Economy' | 'Electric' | 'Premium';

interface ConfirmationStepProps {
  userAddress: string | null;
  destinationAddress: string | null;
  selectedVehicleType: VehicleType;
  estimatedTime: number;
  estimatedDistance: number;
  onVehicleTypeSelect: (type: VehicleType) => void;
  onConfirm: () => void;
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  userAddress,
  destinationAddress,
  selectedVehicleType,
  estimatedTime,
  estimatedDistance,
  onVehicleTypeSelect,
  onConfirm
}) => {
  return (
    <View className="flex-1">
      <LocationDetails 
        userAddress={userAddress}
        destinationAddress={destinationAddress}
      />
      
      <VehicleTypeSelector
        selectedVehicleType={selectedVehicleType}
        onVehicleTypeSelect={onVehicleTypeSelect}
      />
      
      <TripDetails
        estimatedTime={estimatedTime}
        estimatedDistance={estimatedDistance}
        basePriceRange="$20-35"
      />
      
      <ActionButton
        title="Confirm Ride"
        onPress={onConfirm}
        disabled={!destinationAddress}
      />
    </View>
  );
}; 