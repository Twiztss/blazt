# Blazt - Ride Sharing App

A React Native ride-sharing application built with Expo, featuring real-time location tracking, driver management, and interactive maps.

## Features

- 🗺️ Real-time location tracking
- 🚗 Driver management with mock data
- 📍 Interactive Google Maps integration
- 🔄 Dynamic location updates
- 🎯 Nearest driver calculation
- 📱 Modern UI with Tailwind CSS

## Setup

### Prerequisites

- Node.js (v18 or higher)
- Expo CLI
- Google Maps API Key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. **Configure Google Maps API Key**

   Create a `.env.local` file in the root directory and add your Google Maps API key:
   ```
   EXPO_PUBLIC_GOOGLE_API_KEY=your_google_maps_api_key_here
   ```

   **To get a Google Maps API key:**
   1. Go to [Google Cloud Console](https://console.cloud.google.com/)
   2. Create a new project or select existing one
   3. Enable the following APIs:
      - Maps SDK for Android
      - Maps SDK for iOS
      - Geocoding API
      - Places API
   4. Create credentials (API Key)
   5. Add the API key to your `.env.local` file

4. Start the development server:
   ```bash
   npx expo start
   ```

5. Scan the QR code with Expo Go app

## Environment Variables

Required environment variables in `.env.local`:

- `EXPO_PUBLIC_GOOGLE_API_KEY` - Google Maps API key for map functionality

## Project Structure

```
blazt/
├── app/                    # Expo Router app directory
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Main app tabs
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
├── lib/                   # Utility functions
├── store/                 # Zustand state management
├── types/                 # TypeScript type definitions
└── constants/             # App constants
```

## Technologies Used

- **React Native** - Mobile app framework
- **Expo** - Development platform
- **Expo Router** - File-based routing
- **Zustand** - State management
- **React Native Maps** - Map integration
- **Expo Location** - Location services
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety

## Troubleshooting

### Map Not Rendering
- Ensure `EXPO_PUBLIC_GOOGLE_API_KEY` is set in `.env.local`
- Check that Google Maps APIs are enabled in Google Cloud Console
- Verify the API key has proper permissions

### Location Permissions
- The app will request location permissions on first use
- Ensure location services are enabled on your device
