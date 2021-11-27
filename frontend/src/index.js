import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

  (async () => {
    const { publishableKey } = await fetch('/config').then((response) =>
      response.json(),
    );

    console.log(publishableKey);
    const stripePromise = loadStripe(publishableKey);

    ReactDOM.render(
      <Elements stripe={stripePromise}>
        <App />
      </Elements>,
      document.getElementById('root'),
    );
  })();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
