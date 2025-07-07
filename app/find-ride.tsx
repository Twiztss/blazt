import { IconSymbol } from '@/components/ui/IconSymbol';
import { calculateDriveTime, calculateRegion } from '@/lib/map';
import { useLocationStore } from '@/store';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';

// Import modular components
import { Driver } from '@/components/ride/DriverCard';
import { StepIndicator } from '@/components/ride/StepIndicator';
import { ConfirmationStep } from '@/components/ride/steps/ConfirmationStep';
import { DriverSelectionStep } from '@/components/ride/steps/DriverSelectionStep';
import { FinalConfirmationStep } from '@/components/ride/steps/FinalConfirmationStep';

const { width, height } = Dimensions.get('window');

// Mock drivers data
const mockDrivers: Driver[] = [
  {
    id: '1',
    name: 'John Smith',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    carModel: 'Toyota Camry',
    plateNumber: 'ABC-123',
    estimatedArrival: 3,
    price: 25.50,
    rating: 4.8,
    vehicleType: 'Economy'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    carModel: 'Tesla Model 3',
    plateNumber: 'XYZ-789',
    estimatedArrival: 5,
    price: 32.00,
    rating: 4.9,
    vehicleType: 'Electric'
  },
  {
    id: '3',
    name: 'Mike Wilson',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    carModel: 'BMW 5 Series',
    plateNumber: 'DEF-456',
    estimatedArrival: 7,
    price: 45.75,
    rating: 4.7,
    vehicleType: 'Premium'
  }
];

type Step = 'confirmation' | 'driver-selection' | 'final-confirmation';

export default function FindRideScreen() {
  const [currentStep, setCurrentStep] = useState<Step>('confirmation');
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [selectedVehicleType, setSelectedVehicleType] = useState<'Economy' | 'Electric' | 'Premium'>('Economy');
  const [mapRegion, setMapRegion] = useState<any>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);
  const [estimatedTime, setEstimatedTime] = useState<number>(0);
  const [estimatedDistance, setEstimatedDistance] = useState<number>(0);
  
  const mapRef = useRef<MapView>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Bottom sheet snap points
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  const { 
    userAddress, 
    userLatitude, 
    userLongitude, 
    destinationAddress, 
    destinationLatitude, 
    destinationLongitude,
    setUserLocation,
    setDestinationLocation
  } = useLocationStore();

  // Calculate route and region when locations change
  useEffect(() => {
    if (userLatitude && userLongitude && destinationLatitude && destinationLongitude) {
      const region = calculateRegion(userLatitude, userLongitude, destinationLatitude, destinationLongitude);
      setMapRegion(region);
      
      // Mock route coordinates (in real app, use Google Directions API)
      const mockRoute = [
        { latitude: userLatitude, longitude: userLongitude },
        { latitude: (userLatitude + destinationLatitude) / 2, longitude: (userLongitude + destinationLongitude) / 2 },
        { latitude: destinationLatitude, longitude: destinationLongitude }
      ];
      setRouteCoordinates(mockRoute);
      
      // Calculate estimated time and distance
      const time = calculateDriveTime(userLatitude, userLongitude, destinationLatitude, destinationLongitude);
      setEstimatedTime(time);
      setEstimatedDistance(Math.round(time * 0.5 * 10) / 10); // Mock distance calculation
    }
  }, [userLatitude, userLongitude, destinationLatitude, destinationLongitude]);

  const handleConfirmRide = () => {
    if (!destinationAddress) {
      Alert.alert('Error', 'Please select a destination');
      return;
    }
    setCurrentStep('driver-selection');
    // Expand bottom sheet to show driver selection
    bottomSheetRef.current?.snapToIndex(1);
  };

  const handleDriverSelect = (driver: Driver) => {
    setSelectedDriver(driver);
    setCurrentStep('final-confirmation');
    // Expand bottom sheet to show final confirmation
    bottomSheetRef.current?.snapToIndex(2);
  };

  const handleProceedToPayment = () => {
    Alert.alert('Success', 'Redirecting to payment...');
    // Navigate to payment screen
  };

  const handleBack = () => {
    if (currentStep === 'driver-selection') {
      setCurrentStep('confirmation');
      bottomSheetRef.current?.snapToIndex(0);
    } else if (currentStep === 'final-confirmation') {
      setCurrentStep('driver-selection');
      bottomSheetRef.current?.snapToIndex(1);
    }
  };

  const handleTopBarBack = () => {
    if (currentStep === 'confirmation') {
      // Go back to homepage
      router.push('/');
    } else {
      // Go back to previous step
      handleBack();
    }
  };

  // Bottom sheet backdrop component
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={0}
        appearsOnIndex={1}
        opacity={0.5}
      />
    ),
    []
  );

  const renderBottomSheetContent = () => {
    switch (currentStep) {
      case 'confirmation':
        return (
          <ConfirmationStep
            userAddress={userAddress}
            destinationAddress={destinationAddress}
            selectedVehicleType={selectedVehicleType}
            estimatedTime={estimatedTime}
            estimatedDistance={estimatedDistance}
            onVehicleTypeSelect={setSelectedVehicleType}
            onConfirm={handleConfirmRide}
          />
        );
      case 'driver-selection':
        return (
          <DriverSelectionStep
            drivers={mockDrivers}
            onDriverSelect={handleDriverSelect}
            onBack={handleBack}
          />
        );
      case 'final-confirmation':
        return selectedDriver ? (
          <FinalConfirmationStep
            userAddress={userAddress}
            destinationAddress={destinationAddress}
            selectedDriver={selectedDriver}
            onBack={handleBack}
            onProceedToPayment={handleProceedToPayment}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Map View */}
      <View className="flex-1">
        {mapRegion && (
          <MapView
            ref={mapRef}
            provider={PROVIDER_DEFAULT}
            style={{ flex: 1 }}
            initialRegion={mapRegion}
            region={mapRegion}
            showsUserLocation
            showsMyLocationButton
          >
            {/* Pick-up Marker */}
            {userLatitude && userLongitude && (
              <Marker
                coordinate={{ latitude: userLatitude, longitude: userLongitude }}
                title="Pick-up Location"
                description={userAddress + ""}
                pinColor="green"
              />
            )}
            
            {/* Destination Marker */}
            {destinationLatitude && destinationLongitude && (
              <Marker
                coordinate={{ latitude: destinationLatitude, longitude: destinationLongitude }}
                title="Destination"
                description={destinationAddress + ""}
                pinColor="red"
              />
            )}
            
            {/* Route Polyline */}
            {routeCoordinates.length > 0 && (
              <Polyline
                coordinates={routeCoordinates}
                strokeColor="#3b82f6"
                strokeWidth={4}
                lineDashPattern={[1]}
              />
            )}
          </MapView>
        )}
      </View>

      {/* Top Bar with Back Button */}
      <View className="absolute top-20 left-4 flex flex-row items-center gap-4">
        <TouchableOpacity
          onPress={handleTopBarBack}
          className="bg-white rounded-full p-2 shadow-lg"
        >
          <IconSymbol 
            name="chevron.left" 
            color="#374151" 
            size={24} 
          />
        </TouchableOpacity>
        <Text className='text-2xl font-bold'>Go Back</Text>
      </View>

      {/* Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: 'white' }}
        handleIndicatorStyle={{ backgroundColor: '#d1d5db' }}
        enablePanDownToClose={false}
      >
        <BottomSheetScrollView 
          contentContainerStyle={{ flexGrow: 1, padding: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <StepIndicator currentStep={currentStep} />
          {renderBottomSheetContent()}
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
}
