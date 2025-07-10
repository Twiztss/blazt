import { mockDrivers } from "@/lib/map"
import { DriverStore } from "@/types/driver"
import { LocationStore } from "@/types/location"
import { create } from "zustand"

export const useLocationStore = create<LocationStore>((set) => ({
    userAddress: null,
    userLongitude: null,
    userLatitude: null,
    destinationAddress: null,
    destinationLongitude: null,
    destinationLatitude: null,

    setUserLocation: ({ latitude, longitude, address } : { latitude: number, longitude: number, address: string }) => set({ userLatitude: latitude, userLongitude: longitude, userAddress: address }),
    setDestinationLocation: ({ latitude, longitude, address } : { latitude: number, longitude: number, address: string }) => set({ destinationLatitude: latitude, destinationLongitude: longitude, destinationAddress: address }),
}))

export const useDriverStore = create<DriverStore>((set, get) => ({
    // Initial state
    drivers: mockDrivers,
    selectedDriver: null,
    nearestDriver: null,
    isLoadingDrivers: false,
    driverError: null,

    // Actions
    setDrivers: (drivers) => set({ drivers }),
    
    addDriver: (driver) => set((state) => ({ 
        drivers: [...state.drivers, driver] 
    })),
    
    updateDriver: (driverId, updates) => set((state) => ({
        drivers: state.drivers.map(driver => 
            driver.id === driverId ? { ...driver, ...updates } : driver
        ),
        // Update selected driver if it's the one being updated
        selectedDriver: state.selectedDriver?.id === driverId 
            ? { ...state.selectedDriver, ...updates } 
            : state.selectedDriver,
        // Update nearest driver if it's the one being updated
        nearestDriver: state.nearestDriver?.id === driverId 
            ? { ...state.nearestDriver, ...updates } 
            : state.nearestDriver
    })),
    
    removeDriver: (driverId) => set((state) => ({
        drivers: state.drivers.filter(driver => driver.id !== driverId),
        selectedDriver: state.selectedDriver?.id === driverId ? null : state.selectedDriver,
        nearestDriver: state.nearestDriver?.id === driverId ? null : state.nearestDriver
    })),
    
    selectDriver: (driver) => set({ selectedDriver: driver }),
    
    setNearestDriver: (driver) => set({ nearestDriver: driver }),
    
    updateDriverLocation: (driverId, latitude, longitude, address) => set((state) => ({
        drivers: state.drivers.map(driver => 
            driver.id === driverId 
                ? { 
                    ...driver, 
                    currentLocation: { latitude, longitude, address },
                    estimatedArrival: Math.max(1, driver.estimatedArrival + Math.floor(Math.random() * 3) - 1) // Simulate ETA change
                  } 
                : driver
        ),
        // Update selected driver if it's the one being updated
        selectedDriver: state.selectedDriver?.id === driverId 
            ? { 
                ...state.selectedDriver, 
                currentLocation: { latitude, longitude, address },
                estimatedArrival: Math.max(1, state.selectedDriver.estimatedArrival + Math.floor(Math.random() * 3) - 1)
              } 
            : state.selectedDriver,
        // Update nearest driver if it's the one being updated
        nearestDriver: state.nearestDriver?.id === driverId 
            ? { 
                ...state.nearestDriver, 
                currentLocation: { latitude, longitude, address },
                estimatedArrival: Math.max(1, state.nearestDriver.estimatedArrival + Math.floor(Math.random() * 3) - 1)
              } 
            : state.nearestDriver
    })),
    
    updateDriverAvailability: (driverId, isAvailable) => set((state) => ({
        drivers: state.drivers.map(driver => 
            driver.id === driverId ? { ...driver, isAvailable } : driver
        ),
        // Update selected driver if it's the one being updated
        selectedDriver: state.selectedDriver?.id === driverId 
            ? { ...state.selectedDriver, isAvailable } 
            : state.selectedDriver,
        // Update nearest driver if it's the one being updated
        nearestDriver: state.nearestDriver?.id === driverId 
            ? { ...state.nearestDriver, isAvailable } 
            : state.nearestDriver
    })),
    
    setLoadingDrivers: (loading) => set({ isLoadingDrivers: loading }),
    
    setDriverError: (error) => set({ driverError: error }),
    
    clearDriverError: () => set({ driverError: null }),
}))

// Export message store
export { useMessageStore } from './messageStore'
