import { Region } from 'react-native-maps'

// Mock driver data for testing
export interface Driver {
  id: string
  name: string
  vehicle: {
    model: string
    plateNumber: string
    color: string
  }
  rating: number
  isAvailable: boolean
  currentLocation: {
    latitude: number
    longitude: number
    address: string
  }
  estimatedArrival: number // in minutes
  pricePerKm: number
}

export const mockDrivers: Driver[] = [
  {
    id: '1',
    name: 'John Smith',
    vehicle: {
      model: 'Toyota Camry',
      plateNumber: 'ABC-123',
      color: 'Silver'
    },
    rating: 4.8,
    isAvailable: true,
    currentLocation: {
      latitude: 37.7749,
      longitude: -122.4194,
      address: 'San Francisco, CA'
    },
    estimatedArrival: 5,
    pricePerKm: 2.5
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    vehicle: {
      model: 'Honda Civic',
      plateNumber: 'XYZ-789',
      color: 'Blue'
    },
    rating: 4.9,
    isAvailable: true,
    currentLocation: {
      latitude: 37.7849,
      longitude: -122.4094,
      address: 'San Francisco, CA'
    },
    estimatedArrival: 8,
    pricePerKm: 2.2
  },
  {
    id: '3',
    name: 'Mike Davis',
    vehicle: {
      model: 'Tesla Model 3',
      plateNumber: 'TES-456',
      color: 'White'
    },
    rating: 4.7,
    isAvailable: true,
    currentLocation: {
      latitude: 37.7649,
      longitude: -122.4294,
      address: 'San Francisco, CA'
    },
    estimatedArrival: 12,
    pricePerKm: 3.0
  }
]

// Calculate the region to display on the map based on user location
export const calculateRegion = (
  userLatitude: number | null,
  userLongitude: number | null,
  destinationLatitude: number | null = null,
  destinationLongitude: number | null = null
): Region => {
  const defaultRegion: Region = {
    latitude: 37.7749, // San Francisco default
    longitude: -122.4194,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  }

  // If no user location, return default region
  if (!userLatitude || !userLongitude) {
    return defaultRegion
  }

  // If only user location is available
  if (!destinationLatitude || !destinationLongitude) {
    return {
      latitude: userLatitude,
      longitude: userLongitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }
  }

  // If both user and destination locations are available, calculate region to fit both
  const minLat = Math.min(userLatitude, destinationLatitude)
  const maxLat = Math.max(userLatitude, destinationLatitude)
  const minLng = Math.min(userLongitude, destinationLongitude)
  const maxLng = Math.max(userLongitude, destinationLongitude)

  const centerLat = (minLat + maxLat) / 2
  const centerLng = (minLng + maxLng) / 2
  const latDelta = (maxLat - minLat) * 1.5 // Add 50% padding
  const lngDelta = (maxLng - minLng) * 1.5

  return {
    latitude: centerLat,
    longitude: centerLng,
    latitudeDelta: Math.max(latDelta, 0.01), // Minimum zoom level
    longitudeDelta: Math.max(lngDelta, 0.01),
  }
}

// Calculate drive time between two points using Haversine formula and average speed
export const calculateDriveTime = (
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  averageSpeedKmh: number = 30 // Default average speed in city traffic
): number => {
  // Haversine formula to calculate distance between two points
  const R = 6371 // Earth's radius in kilometers
  const dLat = (endLat - startLat) * (Math.PI / 180)
  const dLng = (endLng - startLng) * (Math.PI / 180)
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(startLat * (Math.PI / 180)) * Math.cos(endLat * (Math.PI / 180)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c // Distance in kilometers

  // Calculate time in minutes
  const timeInHours = distance / averageSpeedKmh
  const timeInMinutes = timeInHours * 60

  return Math.round(timeInMinutes)
}

// Generate markers for map display
export const generateMarkers = (
  userLocation: { latitude: number | null; longitude: number | null; address: string | null },
  destinationLocation: { latitude: number | null; longitude: number | null; address: string | null } | null = null,
  drivers: Driver[] = []
) => {
  const markers: any[] = []

  // User location marker
  if (userLocation.latitude && userLocation.longitude) {
    markers.push({
      id: 'user',
      coordinate: {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      },
      title: 'Your Location',
      description: userLocation.address || 'Current location',
      pinColor: 'blue',
      type: 'user'
    })
  }

  // Destination marker
  if (destinationLocation && destinationLocation.latitude && destinationLocation.longitude) {
    markers.push({
      id: 'destination',
      coordinate: {
        latitude: destinationLocation.latitude,
        longitude: destinationLocation.longitude,
      },
      title: 'Destination',
      description: destinationLocation.address || 'Destination',
      pinColor: 'red',
      type: 'destination'
    })
  }

  // Driver markers
  drivers.forEach((driver) => {
    if (driver.isAvailable && driver.currentLocation.latitude && driver.currentLocation.longitude) {
      markers.push({
        id: `driver-${driver.id}`,
        coordinate: {
          latitude: driver.currentLocation.latitude,
          longitude: driver.currentLocation.longitude,
        },
        title: `${driver.name} - ${driver.vehicle.model}`,
        description: `${driver.vehicle.color} ${driver.vehicle.plateNumber} • ${driver.rating}⭐ • ${driver.estimatedArrival}min away`,
        pinColor: 'green',
        type: 'driver',
        driver: driver
      })
    }
  })

  return markers
}

// Calculate distance between two points in kilometers
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLng = (lng2 - lng1) * (Math.PI / 180)
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Find nearest available driver
export const findNearestDriver = (
  userLat: number,
  userLng: number,
  drivers: Driver[]
): Driver | null => {
  const availableDrivers = drivers.filter(driver => driver.isAvailable)
  
  if (availableDrivers.length === 0) {
    return null
  }

  let nearestDriver = availableDrivers[0]
  let shortestDistance = calculateDistance(
    userLat,
    userLng,
    nearestDriver.currentLocation.latitude,
    nearestDriver.currentLocation.longitude
  )

  availableDrivers.forEach(driver => {
    const distance = calculateDistance(
      userLat,
      userLng,
      driver.currentLocation.latitude,
      driver.currentLocation.longitude
    )
    
    if (distance < shortestDistance) {
      shortestDistance = distance
      nearestDriver = driver
    }
  })

  return nearestDriver
}

// Update driver locations for testing (simulate movement)
export const updateDriverLocations = (drivers: Driver[]): Driver[] => {
  return drivers.map(driver => ({
    ...driver,
    currentLocation: {
      ...driver.currentLocation,
      latitude: driver.currentLocation.latitude + (Math.random() - 0.5) * 0.001, // Small random movement
      longitude: driver.currentLocation.longitude + (Math.random() - 0.5) * 0.001,
    },
    estimatedArrival: Math.max(1, driver.estimatedArrival + Math.floor(Math.random() * 3) - 1) // Random time adjustment
  }))
}
