import { fetchAPI } from '@/lib/fetch';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { ReactNativeModal } from 'react-native-modal';
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
  const [isModalVisible, setModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleProceed = async () => {
    setModalVisible(true)
    setLoading(true)
    setError(null)
    try {
      // TODO: Replace with actual ride data from props or context
      const ridePayload = {
        user_id: 1, // Replace with actual user id
        driver_id: selectedDriver.id,
        start_location: userAddress,
        start_latitude: 37.7749, // Replace with actual lat
        start_longitude: -122.4194, // Replace with actual lng
        destination_location: destinationAddress,
        destination_latitude: 37.7849, // Replace with actual lat
        destination_longitude: -122.4094, // Replace with actual lng
        status: 'confirmed',
        estimated_arrival_minutes: selectedDriver.estimatedArrival,
        price: selectedDriver.price // Use the price property from DriverCard type
      }
      await fetchAPI('/(api)/ride', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ridePayload)
      })
    } catch (err: any) {
      setError(err.message || 'Failed to confirm ride')
    } finally {
      setLoading(false)
    }
    onProceedToPayment()
  }

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
        onPress={handleProceed}
      />

      <ReactNativeModal isVisible={isModalVisible}>
        <View className="bg-white px-7 py-9 rounded-2xl min-h-[200px] items-center justify-center">
          {loading ? (
            <Text className="text-lg text-gray-500 mb-4">Confirming your ride...</Text>
          ) : error ? (
            <Text className="text-lg text-red-500 mb-4">{error}</Text>
          ) : (
            <>
              <Text className="text-2xl font-bold mb-4">Ride Confirmed!</Text>
              <Text className="text-base text-gray-500 mb-6">Your ride has been successfully booked.</Text>
              <ActionButton
                title="Close"
                onPress={() => {
                  setModalVisible(false)
                  // Redirect to payment page with amount (replace 25.50 with actual amount)
                  router.push({ pathname: '/payment', params: { amount: selectedDriver.price } })
                }}
              />
            </>
          )}
        </View>
      </ReactNativeModal>
    </View>
  );
}; 