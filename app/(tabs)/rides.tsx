import { Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export const Rides = () => {
  return (
    <SafeAreaView className="flex flex-col h-full items-start justify-start p-6">
        <Text className="text-4xl font-bold">Rides</Text>
    </SafeAreaView>
  )
}

export default Rides

