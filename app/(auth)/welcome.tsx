import CustomButton from "@/components/ui/CustomButton"
import { pageData } from "@/constants/Page"
import { router } from "expo-router"
import { useRef, useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Swiper from "react-native-swiper"

const SignUp = () => {

    const swiperPage = useRef<Swiper>(null)
    const [activePage, setActivePage] = useState(0)
    const isLastSlide = activePage === pageData.length - 1 

    return (
        <SafeAreaView className="flex h-screen items-center justify-between">
            <TouchableOpacity className="w-full flex justify-end items-end p-5" onPress={() => router.replace('./sign-up')}>
                <Text className="text-black text-md font-bold">Skip</Text>
            </TouchableOpacity>
            <Swiper
                ref={swiperPage}
                loop={false}
                dot={<View className="w-8 h-2 mx-1 bg-gray-200 rounded-full" />}
                activeDot={<View className="w-10 h-2 mx-1 bg-orange-600 rounded-full" />}
                onIndexChanged={(page) => setActivePage(page)}
            >
                {pageData.map(page => {
                    return (
                        <View key={page.title} className="flex flex-col gap-12 items-center h-full">
                            <View key={page.title} className="flex bg-gray-200 w-3/4 aspect-square rounded-lg shadow-md shadow-slate-300"></View>
                            <View className="flex flex-col gap-3 items-center w-full">
                                <Text className="font-bold w-4/6 text-3xl text-center">{page.title}</Text>
                                <Text className="w-4/6 text-gray-400 text-center text-lg">{page.description}</Text>
                            </View>
                        </View>
                    )
                })}
            </Swiper>
            <CustomButton 
                title={isLastSlide ? "Get Started" : "Next"} 
                textVariant="primary" 
                bgVariant="primary" 
                onPress={() => isLastSlide  ? router.replace("./sign-up") : swiperPage.current?.scrollBy(1)}
                className="w-10/12 m-5" 
            />
        </SafeAreaView>
    )
}

export default SignUp