import { Text, View } from "react-native"
import CustomButton from "./ui/CustomButton"

const OAuth = () => {

    const handleGoogleSignIn = () => {
        
    }

  return (
    <View>
        <View className="flex flex-row justify-center items-center mt-4 gap-x-3">
            <View className="flex-1 h-[1px] bg-gray-200"/>
            <Text className="text-lg">Or</Text>
            <View className="flex-1 h-[1px] bg-gray-200"/>
        </View>

        <CustomButton
            title="Log In with Google"
            onPress={() => { console.log("To auth")}}
            className="mt-5 w-full shadow-none border"
            textVariant="default"
            style={{ borderColor: '#f97316' }}
        />
    </View>
  )
}

export default OAuth
