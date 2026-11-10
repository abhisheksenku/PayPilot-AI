import React from 'react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#F5F7FA]">
      <div className="max-w-md w-full p-8 rounded-2xl bg-white border border-gray-200 shadow-sm text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-[#0070BA]/10 text-[#0070BA] font-extrabold text-xl flex items-center justify-center mx-auto">
          P
        </div>
        <h1 className="text-2xl font-bold text-gray-900">PayPilot AI</h1>
        <p className="text-sm text-gray-600">
          Scaffold initialized. Ready for PayPal Developer Console Shell and Studio.
        </p>
      </div>
    </div>
  );
}
