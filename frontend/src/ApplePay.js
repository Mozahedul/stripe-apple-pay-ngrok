import {
  PaymentRequestButtonElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import StatusMessages, { useMessages } from './StatusMessages';

const ApplePay = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [messages, addMessages] = useMessages();

  useEffect(() => {
    if (stripe || elements) {
      const pr = stripe.paymentRequest({
        currency: 'usd', // required
        country: 'US', // required
        total: {
          // required
          label: 'Demo payment',
          amount: 1999,
        },
        requestPayerEmail: true, // optional
        requestPayerName: true, // optional
      });

      pr.canMakePayment().then((result) => {
        // we have to check whether we get object or not
        if (result) {
          // show some button on the page
          setPaymentRequest(pr);
        }
      });

      // paymentRequest object emits several events.
      // one of them is cancel event
      // But we will work with payment method event
      // with payment method event we have to register a handler

      // Create payment intent on the server
      // confirm payment intent on the client

      pr.on('paymentmethod', async (e) => {
        const { error: backendError, clientSecret } = await fetch(
          '/create-payment-intent',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              paymentMethodType: 'card',
              currency: 'usd',
            }),
          },
        ).then((r) => r.json());

        if (backendError) {
          e.complete('fail');
          addMessages('Payment Failed');
          addMessages(backendError.message);
          return;
        }

        const { error, paymentIntent } = await stripe.confirmCardPayment(
          clientSecret,
          {
            payment_method: e.paymentMethod.id,
          },
          {
            // with handleAction, we handle any next action that is required
            // for a payment flow as for example 3D secure flow for secure customer authentication in Europe that prompt a modal or redirect to a page
            // We don't have a modal open or don't redirect to any page
            // for this we have used here false for this modal or redirection will not occur automatically.
            // because when modal open that have some limitations
            // to handle manually, we set false
            handleActions: false,
          },
        );
        if (error) {
          e.complete('fail');
          return;
        }
        e.complete('success');
        if (paymentIntent.status === 'requires_action') {
          stripe.confirmCardPayment(clientSecret);
        }

        addMessages(`Payment ${paymentIntent.status}: ${paymentIntent.id}`);
      });
    }
  }, [stripe, elements, addMessages]);

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={6}>
          <Link to="/">
            <Button className="btn btn-light btn-sm">Home</Button>
          </Link>
          <h2>Apple Pay - Payment Form</h2>
          {/* load payment request button element after checking the instance of payment request object */}
          {paymentRequest && (
            <PaymentRequestButtonElement options={{ paymentRequest }} />
          )}

          <StatusMessages messages={messages} />
        </Col>
      </Row>
    </Container>
  );
};

export default ApplePay;
