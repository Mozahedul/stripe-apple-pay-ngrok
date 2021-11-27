const express = require('express');
const dotenv = require('dotenv');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
dotenv.config();
const app = express();

// Parse form encoded data
app.use(express.json());

// Parse url encoded data
app.use(express.urlencoded({ extended: false }));

// Setup cors
app.use((_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Accept, X-Requested-With, Origin',
  );
  next();
});

app.get('/config', (req, res) => {
  res.json({ publishableKey: process.env.STRIPE_PUBLISH_KEY });
});

app.use('/create-payment-intent', async (req, res) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1099,
    currency: 'usd',
  });

  console.log('from server', paymentIntent);

  res.json({ clientSecret: paymentIntent.client_secret });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `Server is running in the ${process.env.NODE_ENV} mode on port ${PORT}`,
  );
});
