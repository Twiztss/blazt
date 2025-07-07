import React from 'react';
import { View } from 'react-native';
import { ActionButton } from '../ActionButton';
import { Driver } from '../DriverCard';
import { DriverDetails } from '../DriverDetails';
import { PriceBreakdown } from '../PriceBreakdown';
import { StepHeader } from '../StepHeader';
import { TripSummary } from '../TripSummary';

interface FinalConfirmationStepProps {
  userAddress: string | null;
  destinationAddress: string | null;
  selectedDriver: Driver;
  onBack: () => void;
  onProceedToPayment: () => void;
}

export const FinalConfirmationStep: React.FC<FinalConfirmationStepProps> = ({
  userAddress,
  destinationAddress,
  selectedDriver,
  onBack,
  onProceedToPayment
}) => {
  return (
    <View className="flex-1">
      <StepHeader
        title="Confirm Booking"
        onBack={onBack}
        showBackButton={true}
      />

      <TripSummary
        userAddress={userAddress}
        destinationAddress={destinationAddress}
      />

      <DriverDetails driver={selectedDriver} />

      <PriceBreakdown
        baseFare={selectedDriver.price}
        serviceFee={2.50}
      />

      <ActionButton
        title="Proceed to Payment"
        onPress={onProceedToPayment}
      />
    </View>
  );
}; 