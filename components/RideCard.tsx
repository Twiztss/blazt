import { RideCardProps } from "@/types/props"
import { Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const RideCard = ({ title, amount, datePurchased, price, id,  ...props } : RideCardProps) => {

    const year = datePurchased.getFullYear() 
    const month = datePurchased.getMonth() > 10 ? datePurchased.getMonth() : "0" + datePurchased.getMonth() 
    const day = datePurchased.getDate() > 10 ? datePurchased.getDate() : "0" + datePurchased.getDate() 
    const hour = datePurchased.getHours() > 10 ? datePurchased.getHours() : "0" + datePurchased.getHours() 
    const minute = datePurchased.getMinutes() > 10 ? datePurchased.getMinutes() : "0" + datePurchased.getMinutes() 

  return (
    <SafeAreaView className="flex flex-row justify-between items-center gap-6 -mb-16">
        <View className="w-12 bg-gray-200 aspect-square self-start mt-2 rounded-lg"/>
        <View className="flex flex-col gap-1 w-1/2">
            <Text className="text-xl text-black font-semibold">{title}</Text>
            <Text className="text-base text-gray-700">{amount} Item</Text>
            <Text className="text-lg text-gray-500">{year}/{month}/{day}, {hour}:{minute}</Text>
        </View>
        <Text className="text-xl w-1/2 justify-self-start self-start mt-2">{price * amount}$</Text>
    </SafeAreaView>
  )
}

export default RideCard
