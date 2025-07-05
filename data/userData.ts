import { User } from "@/types/user";

// Sample Data
export const users: User[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    timestamp: '2025-07-02T10:30:00Z',
    location: { lat: 40.7128, lng: -74.0060 }, // New York
    price : 10,
  },
  {
    id: '2',
    name: 'Bob Smith',
    timestamp: '2025-07-02T11:15:00Z',
    location: { lat: 34.0522, lng: -118.2437 }, // Los Angeles
    price : 2,
  },
  {
    id: '3',
    name: 'Carol Lee',
    timestamp: '2025-07-02T12:45:00Z',
    location: { lat: 51.5074, lng: -0.1278 }, // London
    price : 8,
},
  {
    id: '4',
    name: 'David Kim',
    timestamp: '2025-07-02T14:20:00Z',
    location: { lat: 35.6895, lng: 139.6917 }, // Tokyo
    price : 20,
  },
];