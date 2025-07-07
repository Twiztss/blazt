import { IconSymbol } from '@/components/ui/IconSymbol';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface StepHeaderProps {
  title: string;
  onBack?: () => void;
  showBackButton?: boolean;
}

export const StepHeader: React.FC<StepHeaderProps> = ({ 
  title, 
  onBack, 
  showBackButton = false 
}) => {
  return (
    <View className="flex-row items-center justify-between mb-8">
      {showBackButton ? (
        <TouchableOpacity onPress={onBack} className="p-2">
          <IconSymbol name="chevron.left" color="#6b7280" size={24} />
        </TouchableOpacity>
      ) : (
        <View className="w-10" />
      )}
      <Text className="text-2xl font-bold text-gray-800">{title}</Text>
      <View className="w-10" />
    </View>
  );
}; 