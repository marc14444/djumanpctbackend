// controllers/paymentController.js
import stripe from '../config/stripe.js';

export const createPaymentSession = async (req, res) => {
  try {
    const { items } = req.body;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });
    res.status(200).json({ id: session.id });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la session de paiement', error });
  }
};

export const handlePaymentWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Gérer les événements webhook
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      // Traiter le paiement ici
      break;
    // Ajouter d'autres types d'événements au besoin
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};
