import { Driver } from "@/lib/map"

export interface DriverStore {
  // Driver data
  drivers: Driver[]
  selectedDriver: Driver | null
  nearestDriver: Driver | null
  
  // Driver states
  isLoadingDrivers: boolean
  driverError: string | null
  
  // Actions
  setDrivers: (drivers: Driver[]) => void
  addDriver: (driver: Driver) => void
  updateDriver: (driverId: string, updates: Partial<Driver>) => void
  removeDriver: (driverId: string) => void
  selectDriver: (driver: Driver | null) => void
  setNearestDriver: (driver: Driver | null) => void
  updateDriverLocation: (driverId: string, latitude: number, longitude: number, address: string) => void
  updateDriverAvailability: (driverId: string, isAvailable: boolean) => void
  setLoadingDrivers: (loading: boolean) => void
  setDriverError: (error: string | null) => void
  clearDriverError: () => void
} 