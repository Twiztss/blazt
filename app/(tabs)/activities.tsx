import { IconSymbol } from "@/components/ui/IconSymbol";
import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Placeholder for static map preview (replace with real map snapshot if needed)
const getMapPreviewUrl = (lat: number, lng: number) =>
  `https://maps.geoapify.com/v1/staticmap?style=osm-bright-smooth&width=600&height=300&center=lonlat:${lng},${lat}&zoom=14&marker=lonlat:${lng},${lat}&apiKey=${process.env.EXPO_PUBLIC_GEOAPIFY_KEY}`;

const upcomingTrip = {
  id: 100,
  type: "UberX",
  vehicleIcon: "house.fill" as import("@/components/ui/IconSymbol").IconSymbolName,
  pickup: "123 Main St, Midtown",
  dropoff: "456 Park Ave, Uptown",
  date: new Date(Date.now() + 1000 * 60 * 60 * 24),
  lat: 40.758,
  lng: -73.9855,
};

const pastRides = [
  {
    id: 1,
    pickup: "123 Main St, Midtown",
    dropoff: "456 Park Ave, Uptown",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
    fare: 18.75,
    lat: 40.758,
    lng: -73.9855,
  },
  {
    id: 2,
    pickup: "789 Broadway, Downtown",
    dropoff: "321 5th Ave, Midtown",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    fare: 12.50,
    lat: 40.741,
    lng: -73.989,
  },
];

const Activities = () => {
  const [expandedRide, setExpandedRide] = useState<number | null>(null);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Text className="text-4xl font-bold left-5 mt-5">Activities</Text>
      <ScrollView className="flex-1 w-full" contentContainerStyle={{ padding: 16, gap: 24 }}>
        {/* Upcoming Trip */}
        <View className="bg-white rounded-xl shadow-md p-4 flex-row items-center gap-4 mb-2">
          <View className="bg-blue-100 rounded-full p-3">
            <IconSymbol name={upcomingTrip.vehicleIcon} color="#2563eb" size={28} />
          </View>
          <View className="flex-1">
            <Text className="text-base md:text-lg font-semibold text-gray-800 mb-1">Upcoming Trip</Text>
            <Text className="text-gray-600 text-sm mb-1">{upcomingTrip.type}</Text>
            <Text className="text-gray-700 text-xs mb-1">{upcomingTrip.pickup} → {upcomingTrip.dropoff}</Text>
            <Text className="text-blue-600 font-semibold text-xs md:text-sm">
              {upcomingTrip.date.toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
            </Text>
          </View>
          <TouchableOpacity className="bg-blue-600 px-4 py-2 rounded-full active:opacity-75" onPress={() => {}}>
            <Text className="text-white font-semibold text-xs md:text-sm">Trip details</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Rides */}
        <Text className="text-lg md:text-xl font-bold text-gray-800 mb-2">Recent Rides</Text>
        <View className="gap-6">
          {pastRides.map((ride) => (
            <View key={ride.id} className="bg-white rounded-xl shadow-md p-0 overflow-hidden">
              {/* Date label */}
              <View className="bg-blue-50 px-4 py-2">
                <Text className="text-blue-700 font-semibold text-xs md:text-sm">
                  {ride.date.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                </Text>
              </View>
              {/* Map preview (tap to expand) */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setExpandedRide(expandedRide === ride.id ? null : ride.id)}
                className="w-full h-40 md:h-56 bg-gray-200 justify-center items-center"
              >
                <Image
                  source={{ uri: getMapPreviewUrl(ride.lat, ride.lng) }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
                {/* Destination marker overlay */}
                <View className="absolute bottom-2 right-2 bg-white/80 rounded-full px-3 py-1 flex-row items-center gap-1">
                  <IconSymbol name="mappin.and.ellipse" color="#2563eb" size={16} />
                  <Text className="text-xs text-blue-700 font-semibold">Destination</Text>
                </View>
              </TouchableOpacity>
              {/* Ride details */}
              <View className="p-4 gap-2">
                <View className="flex-row items-center gap-2 mb-1">
                  <IconSymbol name="arrow.up.right" color="#22c55e" size={16} />
                  <Text className="text-gray-700 text-sm md:text-base font-medium flex-1">{ride.pickup}</Text>
                </View>
                <View className="flex-row items-center gap-2 mb-1">
                  <IconSymbol name="arrow.down.left" color="#2563eb" size={16} />
                  <Text className="text-gray-700 text-sm md:text-base font-medium flex-1">{ride.dropoff}</Text>
                </View>
                <View className="flex-row items-center justify-between mt-2">
                  <Text className="text-gray-500 text-xs md:text-sm">Fare</Text>
                  <Text className="text-lg md:text-xl font-bold text-gray-800">${ride.fare.toFixed(2)}</Text>
                </View>
                {/* Action buttons */}
                <View className="flex-row gap-3 mt-3">
                  <TouchableOpacity className="flex-1 bg-blue-50 py-2 rounded-full items-center active:opacity-75">
                    <Text className="text-blue-700 font-semibold text-xs md:text-sm">Tip</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-1 bg-blue-50 py-2 rounded-full items-center active:opacity-75">
                    <Text className="text-blue-700 font-semibold text-xs md:text-sm">Rate</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-1 bg-blue-600 py-2 rounded-full items-center active:opacity-75">
                    <Text className="text-white font-semibold text-xs md:text-sm">Rebook</Text>
                  </TouchableOpacity>
                </View>
                {/* Expanded details (optional, animated) */}
                {expandedRide === ride.id && (
                  <View className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <Text className="text-gray-600 text-xs md:text-sm">Full trip details and receipt coming soon...</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Activities;
