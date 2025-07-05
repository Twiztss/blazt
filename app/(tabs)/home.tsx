import GoogleMapView from '@/components/GoogleMapView'
import { HistoryCard } from '@/components/HistoryCard'
import { SignOutButton } from '@/components/SignOutButton'
import { IconSymbol, IconSymbolName } from '@/components/ui/IconSymbol'
import { users } from '@/data/userData'
import { useLocationStore } from '@/store'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { getCurrentPositionAsync, LocationAccuracy, LocationObject, requestForegroundPermissionsAsync, reverseGeocodeAsync, watchPositionAsync } from 'expo-location'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type Service = { id : string, title : string, icon : IconSymbolName}

const SERVICES : Service[] = [
  { id: '1', title: 'Trip', icon: "car.front.waves.down" },
  { id: '2', title: 'Delivery', icon: "box.truck" },
  { id: '3', title: 'Air Delivery', icon: "airplane.departure" },
];

export default function Page() {
  const { user } = useUser()
  const [pickup, setPickup] = useState('')
  const { userAddress, userLatitude, userLongitude, destinationAddress, destinationLatitude, destinationLongitude, setUserLocation } = useLocationStore()

  const [ hasPermission, setHasPermission ] = useState(false)
  const [ locationSubscription, setLocationSubscription ] = useState<any>(null)
  
  useEffect(() => {
    const requestLocation = async () => {
      try {
        // Request foreground permissions only for Expo Go compatibility
        let { status: foregroundStatus } = await requestForegroundPermissionsAsync()

        if (foregroundStatus !== "granted") {
          setHasPermission(false)
          Alert.alert(
            "Location Permission Required",
            "This app needs location access to show your position on the map and find nearby drivers. Please enable location permissions in your device settings.",
            [{ text: "OK" }]
          )
          console.log("Foreground location permission denied")
          return
        }

        setHasPermission(true)

        // Get initial location
        const getInitialLocation = async () => {
          try {
            const location: LocationObject = await getCurrentPositionAsync({
              accuracy: LocationAccuracy.High,
              timeInterval: 5000, // Update every 5 seconds
              distanceInterval: 10, // Update when moved 10 meters
            })

            // Reverse geocode to get address
            const addressResult = await reverseGeocodeAsync({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            })

            const address = addressResult[0] 
              ? `${addressResult[0].street || ''} ${addressResult[0].city || ''} ${addressResult[0].region || ''}`.trim()
              : 'Unknown location'

            // Store in zustand store
            setUserLocation({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              address: address,
            })

            console.log('Initial location set:', { latitude: location.coords.latitude, longitude: location.coords.longitude, address })
          } catch (error) {
            console.error('Error getting initial location:', error)
            Alert.alert(
              "Location Error",
              "Unable to get your current location. Please check your GPS settings and try again.",
              [{ text: "OK" }]
            )
          }
        }

        // Set up location watching for dynamic updates (foreground only)
        const startLocationWatching = async () => {
          try {
            const subscription = await watchPositionAsync(
              {
                accuracy: LocationAccuracy.High,
                timeInterval: 10000, // Update every 10 seconds
                distanceInterval: 20, // Update when moved 20 meters
              },
              async (location: LocationObject) => {
                try {
                  // Reverse geocode to get address
                  const addressResult = await reverseGeocodeAsync({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                  })

                  const address = addressResult[0] 
                    ? `${addressResult[0].street || ''} ${addressResult[0].city || ''} ${addressResult[0].region || ''}`.trim()
                    : 'Unknown location'

                  // Update store with new location
                  setUserLocation({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    address: address,
                  })

                  console.log('Location updated:', { latitude: location.coords.latitude, longitude: location.coords.longitude, address })
                } catch (error) {
                  console.error('Error updating location:', error)
                }
              }
            )

            setLocationSubscription(subscription)
            console.log('Location watching started')
          } catch (error) {
            console.error('Error starting location watching:', error)
            // Continue without location watching if it fails
          }
        }

        // Get initial location and start watching
        await getInitialLocation()
        await startLocationWatching()

      } catch (error) {
        console.error('Error in location setup:', error)
        setHasPermission(false)
        Alert.alert(
          "Location Setup Error",
          "There was an error setting up location services. Please restart the app and try again.",
          [{ text: "OK" }]
        )
      }
    }

    requestLocation()

    // Cleanup function to stop location watching when component unmounts
    return () => {
      if (locationSubscription) {
        locationSubscription.remove()
        console.log('Location watching stopped')
      }
    }
  }, []) // Empty dependency array to run only once on mount

  return (
    <SafeAreaView className="flex-1 bg-white">
      <SignedIn>
        <View className="flex flex-row w-11/12 justify-between items-center p-5">
          <View className="flex flex-col py-4">
            <Text className="text-lg font-semibold">Welcome Back</Text>
            <Text className="text-2xl font-bold">{user?.emailAddresses[0].emailAddress}</Text>
          </View>
          <View className="flex flex-row gap-2 items-center">
            <IconSymbol name='arrow.2.circlepath' size={16} color={"gray"} />
            <SignOutButton />
          </View>
        </View>
        {/* Main Content Area - Scrollable */}
        <ScrollView className="flex-1 w-full rounded-t-2xl -mt-6 p-5 gap-6" contentContainerStyle={{ gap: 24, paddingBottom: 32 }}>
          <GoogleMapView />
          <View className="gap-4">
            <Text className="text-lg font-semibold mb-1 left-3">Services</Text>
            {/* Service Types */}
            <View className="flex-row justify-around mb-4">
              {SERVICES.map((service : Service) => (
                <TouchableOpacity
                  key={service.id}
                  className="flex flex-col justify-center items-center bg-gray-50 p-4 rounded-lg w-1/4 aspect-square"
                >
                  <IconSymbol name={service.icon} color={"darkgray"} />
                  <Text className="text-base text-center font-medium">{service.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View className="gap-2">
            <Text className="text-lg font-semibold mb-1 left-3">History</Text>
            {users.length === 0 ? (
              <View className="items-center justify-center mt-4">
                <IconSymbol name="malaysianringgitsign.gauge.chart.lefthalf.righthalf" color="darkgray" size={64} />
                <Text className="text-gray-500 text-lg">Ride cannot be found</Text>
              </View>
            ) : (
              users.map((item) => <HistoryCard key={item.id} {...item} />)
            )}
          </View>
        </ScrollView>
      </SignedIn>
      <SignedOut>
        <SafeAreaView className="flex flex-col w-full h-full justify-center items-center">
          <Text className="text-2xl font-semibold text-gray-800 mb-8 text-center">
            You have successfully logged out.
          </Text>

          <TouchableOpacity
            onPress={() => router.replace('./(auth)/sign-in')}
            className="w-full bg-blue-600 py-3 rounded-lg mb-4"
          >
            <Text className="text-white text-center font-medium">Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.replace('./(auth)/sign-up')}
            className="w-full border border-blue-600 py-3 rounded-lg"
          >
            <Text className="text-blue-600 text-center font-medium">Sign Up</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </SignedOut>
    </SafeAreaView>
  )
}