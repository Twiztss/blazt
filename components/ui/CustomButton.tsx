import { buttonProps } from "@/types/props"
import { Text, TouchableOpacity } from "react-native"

const getBgVariant = (variant : string) => {
    
    switch (variant) {
        case "secondary" :
            return "bg-gray-500"
        case "danger" :
            return "bg-red-500"
        case "success" :
            return "bg-green-500"
        case "outline" :
            return "bg-transparent border border-orange-300 border-1"
        default :
            return "bg-orange-600"
    }
} 

const getTextVariant = (variant: string) => {
    switch (variant) {
        case 'primary':
            return 'text-white font-bold';
        case 'secondary':
            return 'text-gray-500 font-medium';
        case 'danger':
            return 'text-red-600 font-bold';
        case 'success':
            return 'text-green-600 font-bold';
        case 'default':
        default:
            return 'text-orange-500 font-semibold';
    }
}

const CustomButton = ({ onPress, title, bgVariant, textVariant, className, style, disabled } : buttonProps) => {

    const bv = bgVariant ? getBgVariant(bgVariant) : ""
    const tv = textVariant ? getTextVariant(textVariant) : "" 

  return (
    <TouchableOpacity
        onPress={onPress}
        style={style}
        className={`w-full rounded-full flex items-center justify-center shadow-md shadow-neutral-400/70 ${bv} ${className} ${disabled ? 'opacity-50' : ''}`}
        disabled={disabled}
    >
        <Text className={`text-xl px-6 py-4 ${tv}`}>{title}</Text>
    </TouchableOpacity>
  )
}

export default CustomButton
