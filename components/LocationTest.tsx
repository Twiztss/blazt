import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

export default function LocationTest() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<string>('Unknown');

  const requestLocationPermission = async () => {
    try {
      console.log('Requesting location permission...');
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);
      
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        Alert.alert('Permission Denied', 'Location permission is required for this app to work.');
        return;
      }

      console.log('Permission granted, getting location...');
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      setErrorMsg(null);
      
      console.log('Location obtained:', currentLocation);
    } catch (error) {
      console.error('Error in location test:', error);
      setErrorMsg(`Error: ${error}`);
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  return (
    <View style={{ padding: 20, backgroundColor: '#f0f0f0', margin: 10, borderRadius: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        Location Test
      </Text>
      
      <Text style={{ marginBottom: 5 }}>
        Permission Status: {permissionStatus}
      </Text>
      
      {location && (
        <View style={{ marginTop: 10 }}>
          <Text>Location obtained successfully!</Text>
          <Text>Latitude: {location.coords.latitude}</Text>
          <Text>Longitude: {location.coords.longitude}</Text>
          <Text>Accuracy: {location.coords.accuracy}m</Text>
        </View>
      )}
      
      {errorMsg && (
        <Text style={{ color: 'red', marginTop: 10 }}>
          Error: {errorMsg}
        </Text>
      )}
      
      <TouchableOpacity 
        onPress={requestLocationPermission}
        style={{ 
          backgroundColor: '#007AFF', 
          padding: 10, 
          borderRadius: 5, 
          marginTop: 10,
          alignItems: 'center'
        }}
      >
        <Text style={{ color: 'white' }}>Test Location Again</Text>
      </TouchableOpacity>
    </View>
  );
} 