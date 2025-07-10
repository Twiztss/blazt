import { IconSymbolName } from "@/components/ui/IconSymbol"
import { User } from "./user"

export type buttonProps = {
    onPress : () => void,
    title? : string,
    bgVariant? : "primary" | "secondary" | "danger" | "outline" | "success",
    textVariant? : "primary" | "default" | "secondary" | "danger" | "success",
    iconLeft? : React.ComponentType<any> 
    iconRight? : React.ComponentType<any>,
    style? : Object, 
    className? : string,
    disabled?: boolean,
}

export enum KeyboardTypeEnum {
  DEFAULT = 'default',
  EMAIL_ADDRESS = 'email-address',
  NUMERIC = 'numeric',
  PHONE_PAD = 'phone-pad',
  NUMBER_PAD = 'number-pad',
  DECIMAL_PAD = 'decimal-pad',
  URL = 'url',
  ASCII_CAPABLE = 'ascii-capable',
  NUMBERS_AND_PUNCTUATION = 'numbers-and-punctuation',
  NAME_PHONE_PAD = 'name-phone-pad',
  TWITTER = 'twitter',
  WEB_SEARCH = 'web-search',
  VISIBLE_PASSWORD = 'visible-password'
}

export type fieldProps = {
    label : string,
    labelStyle : string,
    placeholder : string,
    haveIcon : boolean,
    icon? : IconSymbolName,
    value : string,
    secureTextEntry? : true | false,
    containerStyle? : string,
    inputStyle : string,
    iconStyle? : string,
    className? : string,
    keyboardType? : KeyboardTypeEnum,
    onChangeText : (s : any) => void
}

export type RideCardProps = {
  id : number,
  title : string,
  amount : number,
  datePurchased : Date,
  price : number,
}

export type HistoryCardProps = User;