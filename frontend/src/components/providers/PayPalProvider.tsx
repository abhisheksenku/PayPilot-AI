'use client';

import React from 'react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const initialOptions = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'AV0S4YrrJ5vv49VyJQ7LMRJcG02nVl0JPRIbaCLBnZOtMiHNisN6zv_TEatS3A68e7MfxBAWVUZXhhti',
  currency: 'USD',
  intent: 'capture',
};

export const PayPalProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <PayPalScriptProvider options={initialOptions}>
      {children}
    </PayPalScriptProvider>
  );
};
