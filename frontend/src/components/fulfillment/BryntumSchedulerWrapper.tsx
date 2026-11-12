'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Loader2, Calendar, Truck, ShieldCheck, Clock } from 'lucide-react';
import type { FulfillmentResource, FulfillmentEvent } from './BryntumLogisticsScheduler';

// Dynamically import BryntumScheduler with SSR disabled as required by Bryntum Next.js guide
const DynamicBryntumScheduler = dynamic(
  () => import('./BryntumLogisticsScheduler'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[560px] w-full rounded-xl border border-gray-800 bg-[#0F172A] flex flex-col items-center justify-center text-center p-8">
        <div className="relative mb-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Calendar className="w-8 h-8 animate-pulse" />
          </div>
          <Loader2 className="w-6 h-6 text-indigo-400 animate-spin absolute -top-1 -right-1" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-1">
          Initializing Bryntum Scheduler Engine
        </h3>
        <p className="text-sm text-gray-400 max-w-md">
          Mounting timeline raster, carrier flight paths, and Channel3 warehouse fulfillment schedules...
        </p>
      </div>
    ),
  }
);

interface BryntumSchedulerWrapperProps {
  resources?: FulfillmentResource[];
  events?: FulfillmentEvent[];
  height?: number | string;
  viewPreset?: 'hourAndDay' | 'dayAndWeek' | 'weekAndMonth';
  startDate?: Date;
  endDate?: Date;
}

export function BryntumSchedulerWrapper(props: BryntumSchedulerWrapperProps) {
  return <DynamicBryntumScheduler {...props} />;
}

export default BryntumSchedulerWrapper;
