import { CardField, useStripe } from '@stripe/stripe-react-native';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import CustomButton from './ui/CustomButton';

interface PaymentProps {
  amount: number; // in dollars
  onPaymentSuccess: () => void;
}

const Payment: React.FC<PaymentProps> = ({ amount, onPaymentSuccess }) => {
  const { confirmPayment } = useStripe();
  const [cardDetails, setCardDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Simulate backend call to create a PaymentcccccccIntent
  const createPaymentIntent = async () => {
    try {
      const response = await fetch('/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Math.round(amount * 100) }) // amount in cents
      });
      const data = await response.json();
      return data.clientSecret;
    } catch (err) {
      setError('Failed to initiate payment.');
      throw err;
    }
  };

  const handlePayPress = async () => {
    setError(null);
    if (!cardDetails?.complete) {
      setError('Please enter complete card details.');
      return;
    }
    setLoading(true);
    try {
      const clientSecret = await createPaymentIntent();
      const { paymentIntent, error: stripeError } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
        paymentMethodData: {
          billingDetails: {},
        },
      });
      if (stripeError) {
        setError(stripeError.message);
      } else if (paymentIntent) {
        Alert.alert('Payment Successful', 'Your payment was successful!');
        onPaymentSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Payment failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment</Text>
      <Text style={styles.amount}>Amount: ${amount.toFixed(2)}</Text>
      <CardField
        postalCodeEnabled={true}
        placeholders={{ number: '4242 4242 4242 4242' }}
        cardStyle={styles.card}
        style={styles.cardContainer}
        onCardChange={setCardDetails}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <CustomButton
        title={loading ? 'Processing...' : 'Pay Now'}
        onPress={handlePayPress}
        disabled={loading}
        className="mt-6"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  amount: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  cardContainer: {
    height: 50,
    marginVertical: 20,
  },
  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
});

export default Payment;
