import { IconSymbol } from "@/components/ui/IconSymbol";
import { SectionList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const sections = [
    {
      title: "Membership",
      data: [
        { id: "status", label: "Status", value: "Gold Member" },
        { id: "level", label: "Level", value: "Tier 3" },
      ],
    },
    {
      title: "Payment",
      data: [
        { id: "card", label: "Current Method", value: "•••• 1234 (Visa)" },
        { id: "change", label: "Change Payment Method" },
      ],
    },
    {
      title: "Settings",
      data: [
        { id: "membership", label: "Manage Membership" },
        { id: "general", label: "General Settings" },
      ],
    },
    {
      title: "Support",
      data: [
        { id: "help", label: "Help Center" },
        { id: "contact", label: "Contact Us" },
      ],
    },
  ];

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      className="flex-row justify-between items-center bg-white px-5 py-4 border-b border-gray-100 active:bg-blue-50"
      onPress={() => console.log(`Tapped ${item.id}`)}
      activeOpacity={0.7}
    >
      <Text className="text-base text-gray-800 font-medium">{item.label}</Text>
      {item.value && <Text className="text-gray-500 font-semibold">{item.value}</Text>}
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section: { title } }: any) => (
    <View className="bg-gray-50 px-5 py-2 border-t border-gray-100">
      <Text className="text-gray-500 font-semibold tracking-wide uppercase text-xs">{title}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Profile Card */}
      <View className="w-full items-center pt-8 pb-6 px-4 bg-gradient-to-b from-blue-500 to-blue-400 rounded-b-3xl mb-4">
        <View className="w-24 h-24 rounded-full bg-white border-4 border-blue-200 shadow-lg items-center justify-center mb-3">
          <IconSymbol name="person.crop.circle.fill" color="#3b82f6" size={80} />
        </View>
        <Text className="text-2xl font-bold text-black mb-1">John Doe</Text>
        <Text className="text-base text-blue-300 mb-2">johndoe@email.com</Text>
        <View className="flex-row gap-2 mt-2">
          <TouchableOpacity className="bg-white/80 px-4 py-2 rounded-full active:bg-blue-100">
            <Text className="text-blue-600 font-semibold">Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Section List */}
      <View className="flex-1 w-full max-w-2xl self-center rounded-2xl overflow-hidden bg-white/80 shadow-md">
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          className="flex-1"
          stickySectionHeadersEnabled
          contentContainerStyle={{ paddingBottom: 32 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Profile;
