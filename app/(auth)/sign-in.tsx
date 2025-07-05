import InputField from "@/components/InputField"
import OAuth from "@/components/OAuth"
import CustomButton from "@/components/ui/CustomButton"
import { useAuth, useSignIn } from "@clerk/clerk-expo"
import { Link, Redirect, useRouter } from "expo-router"
import { useState } from "react"
import { Alert, ScrollView, Text, View } from "react-native"

const SignIn = () => {

  const { isSignedIn } = useAuth() 
  
    if (isSignedIn) {
      <Redirect href="./(tabs)/home"/>
    }

  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()
  const [form, setForm] = useState({
    email : "",
    password : ""
  })

    // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password : form.password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/(tabs)/home')
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err : any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      Alert.alert("Error", err.errors[0].longMessage)
    }
  }

  return (
    <ScrollView className="flex-1 bg-white">
       <View className="flex-1 bg-white">
          <View className="relative w-full h-[250px]">
            <View className="bg-gray-200 z-0 w-full h-[250px]"></View>
            <Text className="text-3xl font-bold text-black absolute left-5 bottom-5 self-end">Log In</Text>    
          </View>
          <View className="flex flex-col gap-1 p-5">
            <InputField 
              label="Email"
              labelStyle=""
              inputStyle=""
              placeholder="example@gmail.com"
              secureTextEntry={false}
              haveIcon={true}
              icon="person"
              value={form.email}
              onChangeText={(value : string) => setForm({...form, email : value})}
            />
            <InputField 
              label="Password"
              labelStyle=""
              inputStyle=""
              placeholder="Secure password here"
              secureTextEntry={true}
              haveIcon={true}
              icon="key.horizontal"
              value={form.password}
              onChangeText={(value : string) => setForm({...form, password : value})}
            />

            <CustomButton 
              title={"Continue"} 
              textVariant="primary" 
              bgVariant="primary"
              onPress={onSignInPress}
              className="mt-6 py-0 w-full" 
            />

            <OAuth />

            <Link href={"./sign-up"} className="flex flex-row gap-4 text-lg text-center text-gray-400 mt-5">
              <Text>Already have an account?</Text>
              <Text className="text-orange-500 mx-3"> Create account</Text>
            </Link>

          </View>
       </View>
    </ScrollView>
  )
}

export default SignIn

