import { useLocationStore } from "@/store";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { IconSymbol } from "./ui/IconSymbol";

interface LocationSuggestion {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface GoogleTextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmitEditing?: () => void;
  onLocationSelect?: (data: any, details: any) => void;
}

export const GoogleTextInput = ({ 
  value, 
  onChangeText, 
  placeholder = "Enter pick-up location.",
  onSubmitEditing,
  onLocationSelect
}: GoogleTextInputProps) => {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  
  const { setDestinationLocation } = useLocationStore();

  const handleTextChange = (text: string) => {
    onChangeText(text);
    
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Hide suggestions if text is empty
    if (!text.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Set new timeout for debounced search
    const timeout = setTimeout(() => {
      fetchSuggestions(text);
    }, 300);

    setSearchTimeout(timeout);
  };

  const fetchSuggestions = async (query: string) => {
    if (!query.trim()) return;

    const apiKey = process.env.EXPO_PUBLIC_GEOAPIFY_KEY;
    if (!apiKey) {
      console.error('Geoapify API key is not configured');
      return;
    }

    setIsLoading(true);
    setShowSuggestions(true);

    try {
      const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&apiKey=${apiKey}&format=json&limit=5`;
      
      console.log('Fetching suggestions for:', query);
      console.log('API URL:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response:', JSON.stringify(data, null, 2));
      
      // Check if response has results array (common Geoapify format)
      if (data.results && Array.isArray(data.results) && data.results.length > 0) {
        console.log('Found results array with', data.results.length, 'items');
        const locationSuggestions: LocationSuggestion[] = data.results.map((result: any, index: number) => {
          console.log('Processing result:', result);
          
          // Extract coordinates
          let lat = 0, lng = 0;
          if (result.lat && result.lon) {
            lat = parseFloat(result.lat);
            lng = parseFloat(result.lon);
          } else if (result.geometry && result.geometry.coordinates) {
            if (Array.isArray(result.geometry.coordinates)) {
              [lng, lat] = result.geometry.coordinates;
            }
          }
          
          // Extract name and address - improved parsing
          let name = 'Unknown location';
          let address = '';
          
          // Try to get a meaningful name
          if (result.name) {
            name = result.name;
          } else if (result.street) {
            name = result.street;
            if (result.house_number) {
              name = `${result.house_number} ${result.street}`;
            }
          } else if (result.city) {
            name = result.city;
          } else if (result.county) {
            name = result.county;
          } else if (result.state) {
            name = result.state;
          }
          
          // Build full address
          const addressParts = [];
          if (result.house_number && result.street) {
            addressParts.push(`${result.house_number} ${result.street}`);
          } else if (result.street) {
            addressParts.push(result.street);
          }
          if (result.city) addressParts.push(result.city);
          if (result.state) addressParts.push(result.state);
          if (result.postcode) addressParts.push(result.postcode);
          if (result.country) addressParts.push(result.country);
          
          address = addressParts.join(', ');
          
          // Fallback to formatted address if available
          if (!address && result.formatted) {
            address = result.formatted;
          }
          
          console.log('Extracted data:', { name, address, lat, lng });
          
          return {
            id: `${index}-${result.place_id || result.osm_id || index}`,
            name: name,
            address: address,
            latitude: lat,
            longitude: lng
          };
        }).filter((suggestion: LocationSuggestion) => suggestion.latitude !== 0 && suggestion.longitude !== 0);
        
        console.log('Final suggestions from results:', locationSuggestions);
        setSuggestions(locationSuggestions);
      }
      // Check if response has features array (GeoJSON format)
      else if (data.features && Array.isArray(data.features) && data.features.length > 0) {
        console.log('Found features array with', data.features.length, 'items');
        const locationSuggestions: LocationSuggestion[] = data.features.map((feature: any, index: number) => {
          console.log('Processing feature:', feature);
          
          // Handle different coordinate formats
          let lat = 0, lng = 0;
          if (feature.geometry && feature.geometry.coordinates) {
            if (Array.isArray(feature.geometry.coordinates)) {
              [lng, lat] = feature.geometry.coordinates;
            } else if (feature.geometry.coordinates.lat && feature.geometry.coordinates.lng) {
              lat = feature.geometry.coordinates.lat;
              lng = feature.geometry.coordinates.lng;
            }
          }
          
          // Handle different property formats
          const properties = feature.properties || {};
          let name = 'Unknown location';
          let address = '';
          
          // Try to get a meaningful name
          if (properties.name) {
            name = properties.name;
          } else if (properties.street) {
            name = properties.street;
            if (properties.house_number) {
              name = `${properties.house_number} ${properties.street}`;
            }
          } else if (properties.city) {
            name = properties.city;
          } else if (properties.county) {
            name = properties.county;
          } else if (properties.state) {
            name = properties.state;
          }
          
          // Build full address
          const addressParts = [];
          if (properties.house_number && properties.street) {
            addressParts.push(`${properties.house_number} ${properties.street}`);
          } else if (properties.street) {
            addressParts.push(properties.street);
          }
          if (properties.city) addressParts.push(properties.city);
          if (properties.state) addressParts.push(properties.state);
          if (properties.postcode) addressParts.push(properties.postcode);
          if (properties.country) addressParts.push(properties.country);
          
          address = addressParts.join(', ');
          
          // Fallback to formatted address if available
          if (!address && properties.formatted) {
            address = properties.formatted;
          }
          
          console.log('Extracted data:', { name, address, lat, lng });
          
          return {
            id: `${index}-${properties.place_id || properties.osm_id || index}`,
            name: name,
            address: address,
            latitude: lat,
            longitude: lng
          };
        }).filter((suggestion: LocationSuggestion) => suggestion.latitude !== 0 && suggestion.longitude !== 0);
        
        console.log('Final suggestions from features:', locationSuggestions);
        setSuggestions(locationSuggestions);
      }
      // Check if response is a direct array
      else if (Array.isArray(data) && data.length > 0) {
        console.log('Found direct array with', data.length, 'items');
        const locationSuggestions: LocationSuggestion[] = data.map((item: any, index: number) => {
          console.log('Processing array item:', item);
          
          let lat = 0, lng = 0;
          if (item.lat && item.lon) {
            lat = parseFloat(item.lat);
            lng = parseFloat(item.lon);
          } else if (item.latitude && item.longitude) {
            lat = parseFloat(item.latitude);
            lng = parseFloat(item.longitude);
          }
          
          let name = 'Unknown location';
          let address = '';
          
          // Try to get a meaningful name
          if (item.name) {
            name = item.name;
          } else if (item.street) {
            name = item.street;
            if (item.house_number) {
              name = `${item.house_number} ${item.street}`;
            }
          } else if (item.city) {
            name = item.city;
          } else if (item.county) {
            name = item.county;
          } else if (item.state) {
            name = item.state;
          }
          
          // Build full address
          const addressParts = [];
          if (item.house_number && item.street) {
            addressParts.push(`${item.house_number} ${item.street}`);
          } else if (item.street) {
            addressParts.push(item.street);
          }
          if (item.city) addressParts.push(item.city);
          if (item.state) addressParts.push(item.state);
          if (item.postcode) addressParts.push(item.postcode);
          if (item.country) addressParts.push(item.country);
          
          address = addressParts.join(', ');
          
          // Fallback to formatted address if available
          if (!address && item.formatted) {
            address = item.formatted;
          }
          
          console.log('Extracted data:', { name, address, lat, lng });
          
          return {
            id: `${index}-${item.place_id || item.osm_id || index}`,
            name: name,
            address: address,
            latitude: lat,
            longitude: lng
          };
        }).filter((suggestion: LocationSuggestion) => suggestion.latitude !== 0 && suggestion.longitude !== 0);
        
        console.log('Final suggestions from array:', locationSuggestions);
        setSuggestions(locationSuggestions);
      } else {
        console.log('No recognizable data structure found in response');
        console.log('Response keys:', Object.keys(data));
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionSelect = (suggestion: LocationSuggestion) => {
    onChangeText(suggestion.address);
    setShowSuggestions(false);
    setSuggestions([]);
    
    // Set destination location in store
    setDestinationLocation({
      address: suggestion.address,
      latitude: suggestion.latitude,
      longitude: suggestion.longitude
    });
    
    // Call onLocationSelect if provided
    if (onLocationSelect) {
      onLocationSelect(
        { description: suggestion.address },
        { 
          geometry: { 
            location: { 
              lat: suggestion.latitude, 
              lng: suggestion.longitude 
            } 
          } 
        }
      );
    }
    
    // Navigate to find-ride screen
    router.push('/find-ride');
  };

  const handleInputFocus = () => {
    if (value.trim() && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for touch events
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  return (
    <View className="relative">
      <View className="flex flex-row w-full self-center items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <IconSymbol name="target" color={"darkgray"} size={20} />
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={handleTextChange}
          onSubmitEditing={onSubmitEditing}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          className="flex-1 text-gray-700 font-medium"
        />
        {isLoading && (
          <ActivityIndicator size="small" color="#6b7280" />
        )}
      </View>

      {/* Suggestions Dropdown */}
      {showSuggestions && (suggestions.length > 0 || isLoading) && (
        <View className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-60">
          {/* Debug info */}
          <View className="p-2 bg-yellow-100 border-b border-yellow-200">
            <Text className="text-xs text-yellow-800">
              Debug: isLoading={isLoading.toString()}, suggestions={suggestions.length}
            </Text>
          </View>
          <ScrollView 
            className="max-h-60"
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            {isLoading ? (
              <View className="p-4 items-center">
                <ActivityIndicator size="small" color="#3b82f6" />
                <Text className="text-gray-500 mt-2">Searching...</Text>
              </View>
            ) : suggestions.length > 0 ? (
              suggestions.map((suggestion) => (
                <TouchableOpacity
                  key={suggestion.id}
                  onPress={() => handleSuggestionSelect(suggestion)}
                  className="p-4 border-b border-gray-100 active:bg-gray-50"
                >
                  <View className="flex-row items-start space-x-3">
                    <View className="w-6 h-6 bg-blue-100 rounded-full items-center justify-center mt-1">
                      <IconSymbol name="location.fill" color="#3b82f6" size={12} />
                    </View>
                    <View className="flex-1 ml-3">
                      <Text className="text-gray-800 font-medium text-base mb-1">
                        {suggestion.name}
                      </Text>
                      <Text className="text-gray-500 text-sm" numberOfLines={2}>
                        {suggestion.address}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View className="p-4 items-center">
                <Text className="text-gray-500">No locations found</Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
};