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
    hub: 'Global Logistics',
    status: 'ACTIVE',
  },
  {
    id: 'res-carrier-dhl',
    name: 'DHL International Express',
    role: 'Cross-Border Air',
    hub: 'Worldwide Express',
    status: 'ACTIVE',
  },
  {
    id: 'res-agent-ai',
    name: 'PayPal Autonomous Dispatcher',
    role: 'AI Escrow & Release',
    hub: 'Cloud Autonomous Agent',
    status: 'ONLINE',
  },
];

const DEFAULT_EVENTS: FulfillmentEvent[] = [
  {
    id: 'evt-1',
    resourceId: 'res-hub-1',
    name: 'ORD-8850: ASUS ROG Zephyrus G16 Allocation',
    orderId: 'ORD-8850',
    startDate: '2026-11-10 09:00',
    endDate: '2026-11-11 14:00',
    eventColor: 'purple',
    iconCls: 'b-fa b-fa-laptop',
    status: 'Completed',
  },
  {
    id: 'evt-2',
    resourceId: 'res-carrier-fedex',
    name: 'ORD-8850: Next-Day Air Express Transit',
    orderId: 'ORD-8850',
    startDate: '2026-11-11 14:30',
    endDate: '2026-11-13 18:00',
    eventColor: 'blue',
    iconCls: 'b-fa b-fa-plane',
    status: 'In Transit',
  },
  {
    id: 'evt-3',
    resourceId: 'res-hub-2',
    name: 'ORD-8842: Lenovo LOQ 15 Inspection & Packing',
    orderId: 'ORD-8842',
    startDate: '2026-11-09 08:00',
    endDate: '2026-11-10 11:00',
    eventColor: 'green',
    iconCls: 'b-fa b-fa-box-check',
    status: 'Completed',
  },
  {
    id: 'evt-4',
    resourceId: 'res-carrier-fedex',
    name: 'ORD-8842: Final Mile Delivery (San Francisco)',
    orderId: 'ORD-8842',
    startDate: '2026-11-10 11:30',
    endDate: '2026-11-11 16:00',
    eventColor: 'teal',
    iconCls: 'b-fa b-fa-truck',
    status: 'Delivered',
  },
  {
    id: 'evt-5',
    resourceId: 'res-hub-1',
    name: 'ORD-8837: MacBook Pro 14 Quality Benchmark',
    orderId: 'ORD-8837',
    startDate: '2026-11-09 13:00',
    endDate: '2026-11-10 17:00',
    eventColor: 'indigo',
    iconCls: 'b-fa b-fa-microchip',
    status: 'Completed',
  },
  {
    id: 'evt-6',
    resourceId: 'res-carrier-dhl',
    name: 'ORD-8837: International Cross-Border Air',
    orderId: 'ORD-8837',
    startDate: '2026-11-10 18:00',
    endDate: '2026-11-13 12:00',
    eventColor: 'orange',
    iconCls: 'b-fa b-fa-plane-departure',
    status: 'In Transit',
  },
  {
    id: 'evt-7',
    resourceId: 'res-agent-ai',
    name: 'PayPilot Swarm: Real-time Price Lock & Escrow Hold',
    startDate: '2026-11-09 00:00',
    endDate: '2026-11-14 23:59',
    eventColor: 'cyan',
    iconCls: 'b-fa b-fa-shield-halved',
    status: 'Autonomous Guard Active',
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
      width: 240,
    },
    {
      text: 'Operational Role',
      field: 'role',
      width: 170,
    },
    {
      text: 'Base / Hub',
      field: 'hub',
      width: 150,
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
    <div className="space-y-3">
      {/* Bryntum Toolbar */}
      <div className="flex items-center justify-between bg-[#1E293B] border border-[#334155] rounded-xl px-4 py-2.5 text-xs text-gray-300">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-white">Bryntum High-Performance Scheduler Engine</span>
          <span className="text-gray-400 font-mono">v7.3.8</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-gray-400 mr-1">Zoom Preset:</span>
          {(['hourAndDay', 'dayAndWeek', 'weekAndMonth'] as const).map((preset) => (
            <button
              key={preset}
              onClick={() => handleZoom(preset)}
              className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
                activePreset === preset
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-[#0F172A] text-gray-300 hover:bg-[#334155]'
              }`}
            >
              {preset === 'hourAndDay' ? 'Hour/Day' : preset === 'dayAndWeek' ? 'Day/Week' : 'Week/Month'}
            </button>
          ))}
        </div>
      </div>

      <div
        className="bryntum-scheduler-container rounded-xl overflow-hidden border border-[#2D3748] shadow-2xl bg-[#0F172A]"
        style={{ height }}
      >
        <BryntumScheduler
          ref={schedulerRef}
          startDate={startDate}
          endDate={endDate}
          viewPreset={activePreset}
          rowHeight={58}
          barMargin={7}
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
