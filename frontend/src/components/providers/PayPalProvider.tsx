'use client';

import React from 'react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const PAYPAL_CLIENT_ID =
  process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ||
  'AV0S4YrrJ5vv49VyJQ7LMRJcG02nVl0JPRIbaCLBnZOtMiHNisN6zv_TEatS3A68e7MfxBAWVUZXhhti';

export const PayPalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <PayPalScriptProvider
      options={{
        clientId: PAYPAL_CLIENT_ID,
        currency: 'INR',
        intent: 'capture',
        components: 'buttons',
        enableFunding: 'card,paylater',
      }}
    >
      {children}
    </PayPalScriptProvider>
  );
};
