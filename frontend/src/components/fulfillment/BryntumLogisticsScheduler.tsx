'use client';

import React, { useRef } from 'react';
import { BryntumScheduler } from '@bryntum/scheduler-react';
import '@bryntum/scheduler/scheduler.css';
import '@bryntum/scheduler/stockholm-dark.css';

export interface FulfillmentResource {
  id: string | number;
  name: string;
  role: string;
  hub: string;
  status: 'ONLINE' | 'ACTIVE' | 'DISPATCHED';
}

export interface FulfillmentEvent {
  id: string | number;
  resourceId: string | number;
  name: string;
  orderId?: string;
  startDate: string;
  endDate: string;
  eventColor?: string;
  iconCls?: string;
  status?: string;
}

interface BryntumLogisticsSchedulerProps {
  resources?: FulfillmentResource[];
  events?: FulfillmentEvent[];
  height?: number | string;
  viewPreset?: 'hourAndDay' | 'dayAndWeek' | 'weekAndMonth';
  startDate?: Date;
  endDate?: Date;
}

const DEFAULT_RESOURCES: FulfillmentResource[] = [
  {
    id: 'res-hub-1',
    name: 'Channel3 West Coast Depot',
    role: 'Primary Hardware Hub',
    hub: 'San Jose, CA',
    status: 'ACTIVE',
  },
  {
    id: 'res-hub-2',
    name: 'Channel3 East Coast Hub',
    role: 'Regional Warehouse',
    hub: 'Newark, NJ',
    status: 'ACTIVE',
  },
  {
    id: 'res-carrier-fedex',
    name: 'FedEx Priority Air Fleet',
    role: 'Express Courier',
    hub: 'Domestic Priority',
    status: 'ACTIVE',
  },
  {
    id: 'res-carrier-dhl',
    name: 'DHL International Express',
    role: 'Cross-Border Air',
    hub: 'Worldwide Priority',
    status: 'ACTIVE',
  },
  {
    id: 'res-agent-ai',
    name: 'PayPal Autonomous Dispatcher',
    role: 'Escrow Settlement',
    hub: 'Fintech Rail',
    status: 'ONLINE',
  },
];

const DEFAULT_EVENTS: FulfillmentEvent[] = [
  {
    id: 'evt-1',
    resourceId: 'res-hub-1',
    name: 'ORD-8850: ASUS ROG Zephyrus G16 (QA & Prep)',
    orderId: 'ORD-8850',
    startDate: '2026-11-09 09:00',
    endDate: '2026-11-10 14:00',
    eventColor: 'purple',
    iconCls: 'b-fa b-fa-laptop',
    status: 'Completed',
  },
  {
    id: 'evt-2',
    resourceId: 'res-carrier-fedex',
    name: 'ORD-8850: FedEx Air Express Transit',
    orderId: 'ORD-8850',
    startDate: '2026-11-10 14:30',
    endDate: '2026-11-12 18:00',
    eventColor: 'blue',
    iconCls: 'b-fa b-fa-plane',
    status: 'In Transit',
  },
  {
    id: 'evt-3',
    resourceId: 'res-hub-2',
    name: 'ORD-8842: Lenovo LOQ 15 (Inspection)',
    orderId: 'ORD-8842',
    startDate: '2026-11-08 08:00',
    endDate: '2026-11-09 11:00',
    eventColor: 'green',
    iconCls: 'b-fa b-fa-box-check',
    status: 'Completed',
  },
  {
    id: 'evt-4',
    resourceId: 'res-carrier-fedex',
    name: 'ORD-8842: Final Mile Delivery',
    orderId: 'ORD-8842',
    startDate: '2026-11-09 11:30',
    endDate: '2026-11-11 16:00',
    eventColor: 'teal',
    iconCls: 'b-fa b-fa-truck',
    status: 'Delivered',
  },
  {
    id: 'evt-5',
    resourceId: 'res-hub-1',
    name: 'ORD-8837: MacBook Pro 14 (Benchmarking)',
    orderId: 'ORD-8837',
    startDate: '2026-11-08 13:00',
    endDate: '2026-11-09 17:00',
    eventColor: 'indigo',
    iconCls: 'b-fa b-fa-microchip',
    status: 'Completed',
  },
  {
    id: 'evt-6',
    resourceId: 'res-carrier-dhl',
    name: 'ORD-8837: DHL International Air',
    orderId: 'ORD-8837',
    startDate: '2026-11-09 18:00',
    endDate: '2026-11-12 12:00',
    eventColor: 'orange',
    iconCls: 'b-fa b-fa-plane-departure',
    status: 'In Transit',
  },
  {
    id: 'evt-7',
    resourceId: 'res-agent-ai',
    name: 'PayPal Autonomous Escrow Lock',
    startDate: '2026-11-08 00:00',
    endDate: '2026-11-13 23:59',
    eventColor: 'cyan',
    iconCls: 'b-fa b-fa-shield-halved',
    status: 'Active',
  },
];

export function BryntumLogisticsScheduler({
  resources = DEFAULT_RESOURCES,
  events = DEFAULT_EVENTS,
  height = 560,
  viewPreset = 'dayAndWeek',
  startDate = new Date(2026, 10, 8),
  endDate = new Date(2026, 10, 16),
}: BryntumLogisticsSchedulerProps) {
  const schedulerRef = useRef<BryntumScheduler>(null);
  const [activePreset, setActivePreset] = React.useState<string>(viewPreset);

  const columns = [
    {
      text: 'Logistics Facility & Carrier',
      field: 'name',
      width: 260,
    },
    {
      text: 'Operational Role',
      field: 'role',
      width: 180,
    },
    {
      text: 'Hub Location',
      field: 'hub',
      width: 160,
    },
  ];

  const handleZoom = (preset: 'hourAndDay' | 'dayAndWeek' | 'weekAndMonth') => {
    setActivePreset(preset);
    if (schedulerRef.current && (schedulerRef.current as any).instance) {
      try {
        (schedulerRef.current as any).instance.zoomTo(preset);
      } catch {
        // Fallback gracefully
      }
    }
  };

  return (
    <div className="space-y-3 font-sans">
      {/* Clean Enterprise Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-900 border border-slate-800 rounded-xl px-5 py-3 gap-3 text-sm">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="font-semibold text-white text-sm">Fulfillment Schedule Timeline</span>
          <span className="text-slate-400 text-sm">| 5 Active Carrier Routes</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-sm mr-1">Time View:</span>
          {(['hourAndDay', 'dayAndWeek', 'weekAndMonth'] as const).map((preset) => (
            <button
              key={preset}
              onClick={() => handleZoom(preset)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                activePreset === preset
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {preset === 'hourAndDay' ? 'Hours' : preset === 'dayAndWeek' ? 'Days' : 'Weeks'}
            </button>
          ))}
        </div>
      </div>

      <div
        className="bryntum-scheduler-container rounded-xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950"
        style={{ height }}
      >
        <BryntumScheduler
          ref={schedulerRef}
          startDate={startDate}
          endDate={endDate}
          viewPreset={activePreset}
          rowHeight={60}
          barMargin={8}
          resources={resources}
          events={events}
          columns={columns}
          eventColor="indigo"
        />
      </div>
    </div>
  );
}

export default BryntumLogisticsScheduler;
