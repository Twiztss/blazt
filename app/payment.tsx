import { IconSymbol } from '@/components/ui/IconSymbol';
import { useStripe } from '@stripe/stripe-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

export default function PaymentPage() {
  const params = useLocalSearchParams();
  const amount = typeof params.amount === 'string' ? parseFloat(params.amount) : Number(params.amount);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const handlePayWithSheet = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Math.round(amount * 100) })
      });
      const { clientSecret, error: intentError } = await response.json();
      if (intentError || !clientSecret) {
        setError(intentError || 'Failed to get payment intent.');
        setLoading(false);
        return;
      }
      const { error: sheetError } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'Blazt',
      });
      if (sheetError) {
        setError(sheetError.message);
        setLoading(false);
        return;
      }
      const { error: presentError } = await presentPaymentSheet();
      if (presentError) {
        setError(presentError.message);
      } else {
        router.replace('/');
      }
    } catch (err: any) {
      setError(err.message || 'Payment failed.');
    } finally {
      setLoading(false);
    }
  };

  if (!amount || isNaN(amount)) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-lg font-semibold text-red-500">Invalid payment amount.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-200 relative">
      <LinearGradient
        colors={["#f8fafc", "#e0e7ef"]}
        className="absolute inset-0 h-full w-full"
        style={{ zIndex: 2 }}
      />
      <View className="flex-1 justify-center items-center z-10">
      <View className="absolute top-8 left-4 flex flex-row items-center gap-2">
        <TouchableOpacity
          onPress={() => router.push('/find-ride')}
          className="rounded-full p-2 shadow-lg"
        >
          <IconSymbol
            name="chevron.left" 
            color="#374151" 
            size={16} 
          />
        </TouchableOpacity>
        <Text className='text-2xl font-bold'>Go Back</Text>
      </View>
        <View className="w-11/12 max-w-xl bg-white rounded-3xl p-7 shadow-lg shadow-black/10 self-center items-center">
          <Image source={require('../assets/images/stripe-logo.png')} className="w-24 h-8 mb-3 mt-0" resizeMode="contain" />
          <Text className="text-3xl font-bold text-gray-900 mb-1 text-center">Payment</Text>
          <Text className="text-base text-indigo-500 font-semibold mb-3 text-center">Secure checkout powered by Stripe</Text>
          <Text className="text-2xl font-bold text-emerald-500 mb-2 text-center">${amount.toFixed(2)}</Text>
          <Text className="text-base text-gray-500 mb-6 text-center">
            Enter your card details to complete your ride booking.
          </Text>
          {error && <Text className="text-base font-semibold text-red-500 mb-3 text-center">{error}</Text>}
          <Pressable
            className="bg-indigo-500 rounded-xl py-4 px-12 mt-2 w-full items-center justify-center shadow-md shadow-indigo-500/20"
            style={({ pressed }) => pressed && { opacity: 0.8 }}
            onPress={handlePayWithSheet}
            accessibilityRole="button"
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-lg font-bold text-white tracking-wider">Pay Now</Text>
            )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
} 