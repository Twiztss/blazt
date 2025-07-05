import { fieldProps } from "@/types/props";
import { Keyboard, KeyboardAvoidingView, Platform, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { IconSymbol } from "./ui/IconSymbol";

const InputField = ({ label, labelStyle, placeholder, secureTextEntry, containerStyle, inputStyle, iconStyle, className, value, onChangeText, keyboardType, icon, haveIcon, ...props} : fieldProps) => {

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="my-2">
            <Text className={`text-lg font-semibold mb-2 ${labelStyle}`}>{label}</Text>
            <View className="flex flex-row justify-start gap-4 items-center bg-neutral-100 rounded-full border border-neutral-100 focus:border-neutral-500 px-4 py-1">
              {haveIcon && <IconSymbol name={icon ? icon : "star"} color={"gray"} className="" size={20}/>}
                <TextInput
                    className="text-base py-2"
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry}
                    placeholderTextColor="#9CA3AF" // Optional: subtle gray placeholder
                    keyboardType={keyboardType}
                />
            </View>
        </View>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default InputField
