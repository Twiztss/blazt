import { Text, View } from 'react-native';
import MapView, { PROVIDER_DEFAULT } from 'react-native-maps';

export default function SimpleMapTest() {
  const testRegion = {
    latitude: 13.7563,
    longitude: 100.5018,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={{ height: 300, backgroundColor: 'white', margin: 10, borderRadius: 10, overflow: 'hidden' }}>
      <Text style={{ padding: 10, fontSize: 14, fontWeight: 'bold', backgroundColor: 'white' }}>
        Simple Map Test
      </Text>
      <MapView
        provider={PROVIDER_DEFAULT}
        style={{ flex: 1 }}
        initialRegion={testRegion}
        showsUserLocation
      />
    </View>
  );
} 