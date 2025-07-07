import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface ActionButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  title,
  onPress,
  disabled = false,
  variant = 'primary'
}) => {
  const getButtonStyle = () => {
    if (disabled) {
      return 'bg-gray-300';
    }
    return variant === 'primary' ? 'bg-blue-500' : 'bg-gray-500';
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`w-full py-4 rounded-lg ${getButtonStyle()}`}
    >
      <Text className="text-white text-center font-semibold text-lg">
        {title}
      </Text>
    </TouchableOpacity>
  );
}; 