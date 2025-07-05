import { getLocationName } from "@/lib/fetch";
import { HistoryCardProps } from "@/types/props";
import { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { IconSymbol } from "./ui/IconSymbol";

export const HistoryCard = ({ name, timestamp, location, price }: HistoryCardProps) => {

    const [locationName, setLocationName] = useState<string | null>(null);

    useEffect(() => {
    const fetchLocation = async () => {
      const name = await getLocationName(location.lat,location.lng);
      setLocationName(name);
    };

    fetchLocation();
  }, [location.lat, location.lng]);

    // Marker location
    const markerLat = location.lat;
    const markerLng = location.lng;

    // Offset
    const offsetLat = 0.001; // north
    const offsetLng = 0.001; // east

    // Center location adjusted
    const centerLat = markerLat + offsetLat;
    const centerLng = markerLng + offsetLng;

    const geoapifyUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-bright-smooth&width=600&height=600&center=lonlat:${centerLng},${centerLat}&zoom=${15}&marker=lonlat:${markerLng},${markerLat}&apiKey=${process.env.EXPO_PUBLIC_GEOAPIFY_KEY}`;

    return (
        <TouchableOpacity className="flex flex-row items-center justify-between bg-gray-50 p-3 mb-2 rounded-lg gap-4">
            <Image 
                    source={{ uri: geoapifyUrl }} 
                    resizeMode="contain"
                    className="w-1/6 border border-gray-100 aspect-square"
            /> 
            <View className="flex flex-col justify-start gap-1 w-2/3">
                <Text className="font-medium text-base">{name}</Text>
                <View className="flex flex-row items-center gap-4">
                    <View className="flex flex-row items-center gap-2">
                        <IconSymbol name="arrow.right.square.fill" color={"darkgray"} size={12}/>
                        <Text className="font-medium text-xs text-gray-400">{locationName?.split(',')[0].slice(0,10) + "..."}</Text>
                    </View>
                    <View className="flex flex-row items-center gap-1">
                        <IconSymbol name="pin.fill" color={"darkgray"} size={12}/>
                        <Text className="font-medium text-xs text-gray-400">{locationName?.split(',')[1]}</Text>
                    </View>
                </View>
                <Text className="text-gray-500 text-sm">{new Date(timestamp).toLocaleString()}</Text>
            </View>
            <Text className="font-medium text-base items-end">${price}</Text>
        </TouchableOpacity>
    );
};