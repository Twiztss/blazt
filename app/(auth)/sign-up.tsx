import InputField from "@/components/InputField"
import OAuth from "@/components/OAuth"
import CustomButton from "@/components/ui/CustomButton"
import { fetchAPI } from "@/lib/fetch"
import { KeyboardTypeEnum } from "@/types/props"
import { useSignUp } from "@clerk/clerk-expo"
import { Link, router } from "expo-router"
import { useState } from "react"
import { Alert, ScrollView, Text, View } from "react-native"
import { ReactNativeModal } from "react-native-modal"

const SignUp = () => {

  const { isLoaded, signUp, setActive } = useSignUp()
  const [ successModal, setSuccessModal] = useState(false)

  const [form, setForm] = useState({
    username : "",
    email : "",
    password : ""
  })

  const [verification, setVerification] = useState({
    state : "default",
    error : "",
    code : ""
  })

  const handleSubmit = () => {
    console.log(form)
  }

    // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress : form.email,
        password : form.password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setVerification({
        ...verification,
        state : "pending",
      })
    } catch (err : any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      Alert.alert("Error", err.errors[0].longMessage)
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code : verification.code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {

        // Create DB Here
        await fetchAPI('/(api)/user', {
          method : 'POST',
          body : JSON.stringify({
            name : form.username,
            email : form.email,
            clerkId : signUpAttempt.createdUserId
          })
        })

        await setActive({ session: signUpAttempt.createdSessionId })
        setVerification({...verification, state: "success"})
        router.replace('/')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        setVerification({...verification, error : "Verification Failed", state: "failed"})
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      setVerification({...verification, error : "Catched error", state : "failed"})
      // console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <ScrollView className="flex-1 bg-white">
       <View className="flex-1 bg-white">
          <View className="relative w-full h-[250px]">
            <View className="bg-gray-200 z-0 w-full h-[250px]"></View>
            <Text className="text-3xl font-bold text-black absolute left-5 bottom-5 self-end">Create Your Account</Text>    
          </View>
          <View className="flex flex-col gap-1 p-5">
            <InputField 
              label="Username"
              labelStyle=""
              inputStyle=""
              placeholder="Enter your name"
              secureTextEntry={false}
              haveIcon={true}
              icon="person"
              value={form.username}
              onChangeText={(value : string) => setForm({...form, username : value})}
            />
            <InputField 
              label="Email"
              labelStyle=""
              inputStyle=""
              placeholder="example@gmail.com"
              secureTextEntry={false}
              haveIcon={true}
              icon="mail.and.text.magnifyingglass.rtl"
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
              onPress={onSignUpPress}
              className="mt-6 py-0 w-full" 
            />

            <OAuth />

            <Link href={"./sign-in"} className="text-lg text-center text-gray-400 mt-5">
              <Text>
                Already have an account?
                <Text className="text-orange-500 mx-2"> Login</Text>
              </Text>
            </Link>

            <ReactNativeModal 
              isVisible={verification.state === "pending"} 
              onModalHide={() => {
                if (verification.state === "success") { setSuccessModal(true) } 
                }}
            >
              <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
                <Text className="text-2xl font-extrabold mb-2">Verification</Text>
                <Text className="font-normal mb-5 text-gray-400">We've sent the verification code to {form.email === "" ? form.email : "randomguy@somemail.com"}.</Text>

                <InputField 
                  label="Code"
                  labelStyle=""
                  inputStyle=""
                  haveIcon={false}
                  placeholder="123456"
                  value={verification.code}
                  onChangeText={(code) => setVerification({ ...verification, code : code })}
                  keyboardType={KeyboardTypeEnum.NUMERIC} 
                />

                {verification.error && (
                  <Text className="text-red-500">
                    {verification.error}
                  </Text>
                )}

                <CustomButton title="Verify Email" onPress={onVerifyPress} textVariant="primary" className="mt-5 bg-green-500" />

              </View>
            </ReactNativeModal>  

            <ReactNativeModal isVisible={successModal}>
              <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
                <Text className="text-3xl font-bold text-center">Verified</Text>
                <Text className="text-base text-gray-400 font-normal text-center mt-2">You have successfully verified your account.</Text>
                <CustomButton 
                  title="Browse Home" 
                  onPress={() => {
                    setSuccessModal(false)
                    router.push('/(tabs)/home')
                  }} 
                  className="mt-5" 
                  bgVariant="success" 
                  textVariant="primary" />
              </View>
            </ReactNativeModal>

          </View>
       </View>
    </ScrollView>
  )
}

export default SignUp