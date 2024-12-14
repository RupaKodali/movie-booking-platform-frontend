// components/PayPalButton.js
'use client';

import { useEffect } from 'react';

const PayPalButton = ({ bookingDetails, onPaymentSuccess }) => {
  useEffect(() => {
    const loadPayPalScript = () => {
      if (document.querySelector('script[src*="paypal.com/sdk/js"]')) return; // Prevent duplicate scripts

      const script = document.createElement('script');
      const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

      if (!clientId) {
        console.error('PayPal Client ID is missing. Please set NEXT_PUBLIC_PAYPAL_CLIENT_ID in your environment variables.');
        return;
      }

      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.onload = () => {
        if (!window.paypal) {
          console.error('PayPal SDK failed to load');
          return;
        }

        window.paypal.Buttons({
          style: {
            layout: 'vertical', // Set to 'horizontal' if preferred
            size: 'responsive',      // Options: 'small', 'medium', 'large', 'responsive'
            color: 'white',      // Options: 'gold', 'blue', 'silver', 'white', 'black'
            shape: 'pill',      // Options: 'rect', 'pill'
            label: 'paypal',    // Options: 'paypal', 'checkout', 'buynow', 'pay'
          },
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: bookingDetails.amount, // Amount for booking
                  },
                },
              ],
            });
          },
          onApprove: (data, actions) => {
            return actions.order.capture().then((details) => {
              onPaymentSuccess(details); // Trigger the success callback
            });
          },
          onError: (err) => {
            console.error('PayPal error:', err);
            alert('Payment failed. Please try again.');
          },
        }).render('#paypal-button-container');
      };

      script.onerror = () => {
        console.error('PayPal SDK script load error');
      };

      document.body.appendChild(script);
    };

    loadPayPalScript();
  }, [bookingDetails, onPaymentSuccess]);

  return <div id="paypal-button-container"></div>;
};

export default PayPalButton;
