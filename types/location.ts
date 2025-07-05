export interface LocationStore {
  // User location properties
  userAddress: string | null;
  userLongitude: number | null;
  userLatitude: number | null;
  
  // Destination location properties
  destinationAddress: string | null;
  destinationLongitude: number | null;
  destinationLatitude: number | null;
  
  // Actions
  setUserLocation: ({ latitude, longitude, address }: { latitude: number; longitude: number; address: string }) => void;
  setDestinationLocation: ({ latitude, longitude, address }: { latitude: number; longitude: number; address: string }) => void;
}
