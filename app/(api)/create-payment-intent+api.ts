import Stripe from 'stripe';

export const POST = async (request: Request) => {
  try {
    if (!process.env.STRIPE_SECREY_KEY) {
      throw new Error('STRIPE_SECREY_KEY is not defined.');
    }
    const stripe = new Stripe(process.env.STRIPE_SECREY_KEY, {
      apiVersion: '2025-06-30.basil',
      typescript: true,
    });
    const { amount } = await request.json();
    if (!amount || typeof amount !== 'number') {
      return Response.json({ error: 'Amount is required and must be a number.' }, { status: 400 });
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: {},
    });
    return Response.json({ clientSecret: paymentIntent.client_secret }, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return Response.json({ error: err.message || 'Failed to create PaymentIntent.' }, { status: 500 });
  }
}; 