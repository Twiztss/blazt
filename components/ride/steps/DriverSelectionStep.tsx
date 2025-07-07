import React from 'react';
import { ScrollView, View } from 'react-native';
import { Driver, DriverCard } from '../DriverCard';
import { StepHeader } from '../StepHeader';

interface DriverSelectionStepProps {
  drivers: Driver[];
  onDriverSelect: (driver: Driver) => void;
  onBack: () => void;
}

export const DriverSelectionStep: React.FC<DriverSelectionStepProps> = ({
  drivers,
  onDriverSelect,
  onBack
}) => {
  return (
    <View className="flex-1">
      <StepHeader
        title="Select Driver"
        onBack={onBack}
        showBackButton={true}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {drivers.map((driver) => (
          <DriverCard
            key={driver.id}
            driver={driver}
            onSelect={onDriverSelect}
          />
        ))}
      </ScrollView>
    </View>
  );
}; 