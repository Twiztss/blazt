import { TextInput, View } from "react-native";
import { IconSymbol } from "./ui/IconSymbol";

interface GoogleTextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmitEditing?: () => void;
}

export const GoogleTextInput = ({ 
  value, 
  onChangeText, 
  placeholder = "Enter pick-up location.",
  onSubmitEditing 
}: GoogleTextInputProps) => {

    return (
    <View className="flex flex-row w-full self-center items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <IconSymbol name="target" color={"darkgray"} size={20} />
        <TextInput
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmitEditing}
            className="flex-1 text-gray-700 font-medium"
        />
    </View>
    )
}