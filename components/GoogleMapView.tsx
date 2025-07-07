import {
  calculateDriveTime,
  calculateRegion,
  findNearestDriver,
  generateMarkers,
  updateDriverLocations
} from "@/lib/map";
import { useDriverStore, useLocationStore } from "@/store";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, Keyboard, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT, Region } from "react-native-maps";
import { GoogleTextInput } from "./GoogleTextInput";
import { IconSymbol } from "./ui/IconSymbol";

// Default region
const DEFAULT_REGION: Region = {
  latitude: 13.7563,
  longitude: 100.5018,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [driveTime, setDriveTime] = useState<number | null>(null);
  const [mapRegion, setMapRegion] = useState<Region>(DEFAULT_REGION);
  const [isMapReady, setIsMapReady] = useState(false);
  const mapRef = useRef<MapView | null>(null);
  const driverUpdateTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Get location data from Zustand store
  const { 
    userAddress, 
    userLatitude, 
    userLongitude, 
    destinationAddress, 
    destinationLatitude, 
    destinationLongitude 
  } = useLocationStore();

  // Get driver data from Zustand store
  const { 
    drivers, 
    nearestDriver, 
    setDrivers, 
    setNearestDriver,
    updateDriverLocation 
  } = useDriverStore();

  // Check for API key on component mount
  useEffect(() => {
    const apiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
    if (!apiKey) {
      const error = "Google Maps API key is missing. Please check your .env.local file.";
      console.error('Map:', error);
      setErrorMsg(error);
      Alert.alert(
        "Configuration Error",
        "Google Maps API key is not configured. Please add EXPO_PUBLIC_GOOGLE_API_KEY to your .env.local file.",
        [{ text: "OK" }]
      );
      return;
    }
    
    console.log('Map: Google Maps API key is configured', apiKey ? 'Present' : 'Missing');
  }, []);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }
        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
        console.log('Map: Location obtained:', loc.coords);
      } catch (error) {
        console.error('Map: Error getting location:', error);
        setErrorMsg("Failed to get location");
      }
    })();
  }, []);

  // Update map region when location data changes
  useEffect(() => {
    const newRegion = calculateRegion(
      userLatitude,
      userLongitude,
      destinationLatitude,
      destinationLongitude
    );
    
    console.log('Map: Updating region:', {
      userLat: userLatitude,
      userLng: userLongitude,
      destLat: destinationLatitude,
      destLng: destinationLongitude,
      newRegion
    });
    
    setMapRegion(newRegion);
  }, [userLatitude, userLongitude, destinationLatitude, destinationLongitude]);

  // Initialize driver updates when user location is available
  useEffect(() => {
    if (userLatitude && userLongitude) {
      console.log('Map: Initializing driver updates');
      
      // Initial driver setup
      const updatedDrivers = updateDriverLocations(drivers);
      setDrivers(updatedDrivers);

      const nearest = findNearestDriver(userLatitude, userLongitude, updatedDrivers);
      setNearestDriver(nearest);

      if (nearest) {
        const time = calculateDriveTime(
          userLatitude,
          userLongitude,
          nearest.currentLocation.latitude,
          nearest.currentLocation.longitude
        );
        setDriveTime(time);
      }

      // Set up periodic driver updates (every 10 seconds)
      driverUpdateTimer.current = setInterval(() => {
        const currentDrivers = useDriverStore.getState().drivers;
        const updatedDrivers = updateDriverLocations(currentDrivers);
        setDrivers(updatedDrivers);

        const nearest = findNearestDriver(userLatitude, userLongitude, updatedDrivers);
        setNearestDriver(nearest);

        if (nearest) {
          const time = calculateDriveTime(
            userLatitude,
            userLongitude,
            nearest.currentLocation.latitude,
            nearest.currentLocation.longitude
          );
          setDriveTime(time);
        }
      }, 10000);

      // Cleanup timer on unmount or when user location changes
      return () => {
        if (driverUpdateTimer.current) {
          clearInterval(driverUpdateTimer.current);
          driverUpdateTimer.current = null;
        }
      };
    }
  }, [userLatitude, userLongitude]); // Only depend on user location

  // Generate markers for the map
  const markers = generateMarkers(
    { latitude: userLatitude, longitude: userLongitude, address: userAddress },
    destinationLatitude && destinationLongitude 
      ? { latitude: destinationLatitude, longitude: destinationLongitude, address: destinationAddress }
      : null,
    drivers
  );

  console.log('Map: Rendering with', {
    region: mapRegion,
    markersCount: markers.length,
    userLocation: { lat: userLatitude, lng: userLongitude },
    driversCount: drivers.length,
    isMapReady,
    hasApiKey: !!process.env.EXPO_PUBLIC_GOOGLE_API_KEY
  });

    const handleSearch = async () => {
    if (!search) return;
    
    const apiKey = process.env.EXPO_PUBLIC_GEOAPIFY_KEY;
    if (!apiKey) {
      setErrorMsg('Geoapify API key is not configured');
      return;
    }
    
    console.log('Map: Starting geocoding search for:', search);
    console.log('Map: Using API key:', apiKey ? 'Present' : 'Missing');
    
    try {
      const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(search)}&apiKey=${apiKey}&format=json&limit=5`;
      console.log('Map: Making request to:', url);
      
      const response = await fetch(url);
      
      console.log('Map: Response status:', response.status);
      console.log('Map: Response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Map: HTTP error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Map: API response data:', JSON.stringify(data, null, 2));
      console.log('Map: Response type:', typeof data);
      console.log('Map: Response keys:', Object.keys(data));
      
      // Check different possible response structures
      let features = null;
      if (data.features) {
        features = data.features;
        console.log('Map: Found features in data.features:', features.length);
      } else if (data.results) {
        features = data.results;
        console.log('Map: Found results in data.results:', features.length);
      } else if (Array.isArray(data)) {
        features = data;
        console.log('Map: Response is direct array:', features.length);
      }
      
      if (features && features.length > 0) {
        console.log('Map: Found features/results:', features.length);
        const feature = features[0];
        console.log('Map: First feature:', JSON.stringify(feature, null, 2));
        
        // Handle different coordinate formats
        let lat, lng;
        if (feature.geometry && feature.geometry.coordinates) {
          [lng, lat] = feature.geometry.coordinates;
          console.log('Map: Extracted coordinates from geometry:', { lat, lng });
        } else if (feature.lat && feature.lon) {
          lat = feature.lat;
          lng = feature.lon;
          console.log('Map: Extracted coordinates from lat/lon:', { lat, lng });
        } else if (feature.latitude && feature.longitude) {
          lat = feature.latitude;
          lng = feature.longitude;
          console.log('Map: Extracted coordinates from latitude/longitude:', { lat, lng });
        } else {
          console.error('Map: No coordinates found in feature');
          setErrorMsg('No coordinates found in location data');
          return;
        }
        
        // Update destination in store
        const { setDestinationLocation } = useLocationStore.getState();
        setDestinationLocation({
          latitude: lat,
          longitude: lng,
          address: search
        });

        if (mapRef.current) {
          const newRegion = calculateRegion(userLatitude, userLongitude, lat, lng);
          mapRef.current.animateToRegion(newRegion, 1000);
        }
        Keyboard.dismiss();
        
        // Redirect to find-ride screen
        router.push('/find-ride');
      } else {
        console.log('Map: No features/results found in response');
        console.log('Map: Response structure:', Object.keys(data));
        setErrorMsg('Location not found - no results returned');
      }
    } catch (err) {
      console.error('Map: Geocoding error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setErrorMsg(`Failed to fetch location: ${errorMessage}`);
    }
  };

  // Don't render map if API key is missing
  if (!process.env.EXPO_PUBLIC_GOOGLE_API_KEY) {
    return (
      <View className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <Text className="text-lg font-semibold text-red-600 mb-2">
          Google Maps API Key Missing
        </Text>
        <Text className="text-center text-gray-600">
          Please add EXPO_PUBLIC_GOOGLE_API_KEY to your .env.local file
        </Text>
        {errorMsg && <Text className="text-red-500 mt-4">{errorMsg}</Text>}
      </View>
    );
  }

  return (
    <View className="bg-white rounded-lg overflow-hidden">
      <Text className="text-lg font-semibold mb-1">Current Location</Text>
      {/* Search Input */}
      <View className="border-b border-gray-100">
        <GoogleTextInput
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
          placeholder="Choose your pickup location."
        />
      </View>

      {/* Map Container */}
      <View style={{ height: 300 }} className="mt-4">
        <MapView
          provider={PROVIDER_DEFAULT}
          ref={mapRef}
          style={{ flex: 1 }}
          showsUserLocation
          initialRegion={mapRegion}
          region={mapRegion}
          onMapReady={() => {
            console.log('Map: Map is ready');
            setIsMapReady(true);
          }}
        >
          {markers.map((marker) => (
            <Marker 
              key={marker.id} 
              coordinate={marker.coordinate}
              title={marker.title}
              description={marker.description}
              pinColor={marker.pinColor}
            />
          ))}
        </MapView>
      </View>

      {/* Driver info display */}
      {nearestDriver && (
        <View className="flex flex-col g-4 bg-gray-50 p-3 border border-gray-200">
          <Text className="text-sm font-semibold text-gray-700">
            Nearest Driver: {nearestDriver.name}
          </Text>
          <Text className="text-xs text-gray-500">
            {nearestDriver.vehicle.color} {nearestDriver.vehicle.model} • {nearestDriver.rating} <IconSymbol name="star.fill" color={"gray"} size={8} />
          </Text>
          <Text className="text-xs text-gray-500">
            ETA: {nearestDriver.estimatedArrival}min • Drive time: {driveTime}min
          </Text>
        </View>
      )}
      
      {/* Error Message */}
      {errorMsg && (
        <View className="p-4 bg-red-50 border-t border-red-200">
          <Text className="text-red-600 text-sm">{errorMsg}</Text>
        </View>
      )}
      
      {/* Debug info - only in development */}
      {/* {__DEV__ && (
        <View className="bg-gray-100 p-2 mx-4 mb-2 rounded">
          <Text className="text-xs text-gray-600">
            Debug: Region: {JSON.stringify(mapRegion).substring(0, 100)}...
          </Text>
          <Text className="text-xs text-gray-600">
            Markers: {markers.length} | Drivers: {drivers.length} | Map Ready: {isMapReady ? 'Yes' : 'No'}
          </Text>
          <Text className="text-xs text-gray-600">
            API Key: {process.env.EXPO_PUBLIC_GOOGLE_API_KEY ? 'Configured' : 'Missing'}
          </Text>
        </View>
      )} */}
    </View>
  );
}