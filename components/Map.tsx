import { users } from "@/data/userData";
import { Image } from "react-native";

export const Map = () => {

    const location = users[0].location

    const markerLat = location.lat;
    const markerLng = location.lng;

    // Offset
    const offsetLat = 0.001; // north
    const offsetLng = 0.001; // east

    // Center location adjusted
    const centerLat = markerLat + offsetLat;
    const centerLng = markerLng + offsetLng;

    const geoapifyUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-bright-smooth&width=1200&height=640&center=lonlat:${centerLng},${centerLat}&zoom=${15}&marker=lonlat:${markerLng},${markerLat}&apiKey=${process.env.EXPO_PUBLIC_GEOAPIFY_KEY}`;

    return (
        <Image 
                source={{ uri: geoapifyUrl }} 
                resizeMode="contain"
                className="border border-gray-100 aspect-video p-4 rounded-md"
        />
    )
}