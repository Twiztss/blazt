import React from 'react';
import { View } from 'react-native';

type Step = 'confirmation' | 'driver-selection' | 'final-confirmation';

interface StepIndicatorProps {
  currentStep: Step;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <View className="flex-row justify-center items-center mb-6">
      <View className={`w-3 h-3 rounded-full ${currentStep === 'confirmation' ? 'bg-blue-500' : 'bg-gray-300'}`} />
      <View className={`w-8 h-1 mx-2 ${currentStep === 'driver-selection' || currentStep === 'final-confirmation' ? 'bg-blue-500' : 'bg-gray-300'}`} />
      <View className={`w-3 h-3 rounded-full ${currentStep === 'driver-selection' ? 'bg-blue-500' : 'bg-gray-300'}`} />
      <View className={`w-8 h-1 mx-2 ${currentStep === 'final-confirmation' ? 'bg-blue-500' : 'bg-gray-300'}`} />
      <View className={`w-3 h-3 rounded-full ${currentStep === 'final-confirmation' ? 'bg-blue-500' : 'bg-gray-300'}`} />
    </View>
  );
}; 