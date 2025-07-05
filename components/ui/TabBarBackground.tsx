import type { ViewProps } from "react-native";
import { View } from "react-native";

// This is a shim for web and Android where the tab bar is generally opaque.
const TabBarBackground = (props: ViewProps) => <View {...props} />;

export default TabBarBackground;

export function useBottomTabOverflow() {
  return 0;
}
