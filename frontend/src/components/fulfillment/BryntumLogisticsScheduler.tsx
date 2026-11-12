'use client';

import React, { useRef, useState, useMemo, Component, ErrorInfo } from 'react';
import { BryntumScheduler } from '@bryntum/scheduler-react';
import '@bryntum/scheduler/scheduler.css';
import '@bryntum/scheduler/stockholm-dark.css';
import {
  Calendar,
  Truck,
  ShieldCheck,
  Clock,
  Warehouse,
  Plane,
  RefreshCw,
  Maximize2,
  CheckCircle2,
  Info,
} from 'lucide-react';

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

// Error boundary to gracefully capture any Canvas/Bryntum engine initialization failure
class BryntumErrorBoundary extends Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('Bryntum Scheduler render caught by boundary, using timeline fallback:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// High-fidelity fallback timeline component
function LogisticsTimelineFallback({
  resources,
  events,
  startDate,
  endDate,
}: {
  resources: FulfillmentResource[];
  events: FulfillmentEvent[];
  startDate: Date;
  endDate: Date;
}) {
  const days: { date: Date; label: string; sub: string }[] = useMemo(() => {
    const list = [];
    const cur = new Date(startDate);
    while (cur <= endDate) {
      list.push({
        date: new Date(cur),
        label: cur.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' }),
        sub: cur.toLocaleDateString('en-US', { weekday: 'short' }),
      });
      cur.setDate(cur.getDate() + 1);
    }
    return list;
  }, [startDate, endDate]);

  const totalTime = endDate.getTime() - startDate.getTime();

  return (
    <div className="bg-slate-950 text-slate-100 rounded-xl overflow-x-auto border border-slate-800 p-4">
      <div className="min-w-[900px]">
        {/* Header timeline */}
        <div className="grid grid-cols-12 border-b border-slate-800 pb-3 text-sm font-semibold text-slate-400">
          <div className="col-span-4 pl-3">Fulfillment Facility / Carrier</div>
          <div className="col-span-8 grid grid-cols-7 text-center text-xs">
            {days.slice(0, 7).map((d, i) => (
              <div key={i} className="border-l border-slate-800 px-1 py-0.5">
                <span className="text-white block font-medium">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Resources rows */}
        <div className="divide-y divide-slate-800/70">
          {resources.map((res) => {
            const resEvents = events.filter((e) => String(e.resourceId) === String(res.id));
            return (
              <div key={res.id} className="grid grid-cols-12 py-3.5 items-center hover:bg-slate-900/40 transition-colors">
                <div className="col-span-4 pl-3 pr-4">
                  <div className="font-semibold text-white text-sm flex items-center gap-2">
                    {res.name.includes('Depot') || res.name.includes('Hub') ? (
                      <Warehouse className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : res.name.includes('Air') || res.name.includes('DHL') || res.name.includes('FedEx') ? (
                      <Plane className="w-4 h-4 text-blue-400 shrink-0" />
                    ) : (
                      <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                    )}
                    <span className="truncate">{res.name}</span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>{res.role}</span>
                    <span>•</span>
                    <span className="text-slate-500">{res.hub}</span>
                  </div>
                </div>

                <div className="col-span-8 relative h-12 flex items-center border-l border-slate-800/80 bg-slate-900/20 rounded px-2">
                  {resEvents.length === 0 ? (
                    <span className="text-xs text-slate-500 italic pl-2">Standby — ready for incoming order allocation</span>
                  ) : (
                    resEvents.map((evt) => {
                      const s = new Date(evt.startDate).getTime();
                      const e = new Date(evt.endDate).getTime();
                      const leftPct = Math.max(0, Math.min(100, ((s - startDate.getTime()) / totalTime) * 100));
                      const widthPct = Math.max(12, Math.min(100 - leftPct, ((e - s) / totalTime) * 100));

                      const bg =
                        evt.eventColor === 'purple'
                          ? 'bg-purple-900/80 border-purple-500 text-purple-200'
                          : evt.eventColor === 'blue'
                          ? 'bg-blue-900/80 border-blue-500 text-blue-200'
                          : evt.eventColor === 'green'
                          ? 'bg-emerald-900/80 border-emerald-500 text-emerald-200'
                          : evt.eventColor === 'orange'
                          ? 'bg-amber-900/80 border-amber-500 text-amber-200'
                          : 'bg-cyan-900/80 border-cyan-500 text-cyan-200';

                      return (
                        <div
                          key={evt.id}
                          className={`absolute top-1.5 bottom-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold flex items-center justify-between shadow-md truncate cursor-pointer transition-transform hover:scale-[1.01] ${bg}`}
                          style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                          title={`${evt.name} (${evt.startDate} to ${evt.endDate})`}
                        >
                          <span className="truncate">{evt.name}</span>
                          <span className="ml-2 text-[10px] px-1.5 py-0.2 rounded bg-black/40 uppercase tracking-wider shrink-0">
                            {evt.status || 'Active'}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function BryntumLogisticsScheduler({
  resources = DEFAULT_RESOURCES,
  events = DEFAULT_EVENTS,
  height = 560,
  viewPreset = 'dayAndWeek',
  startDate = new Date(2026, 10, 8),
  endDate = new Date(2026, 10, 16),
}: BryntumLogisticsSchedulerProps) {
  const schedulerRef = useRef<BryntumScheduler>(null);
  const [activePreset, setActivePreset] = useState<string>(viewPreset);
  const [selectedFacilityFilter, setSelectedFacilityFilter] = useState<'ALL' | 'DEPOT' | 'AIR' | 'ESCROW'>('ALL');

  const filteredResources = useMemo(() => {
    if (selectedFacilityFilter === 'DEPOT') {
      return resources.filter((r) => r.role.includes('Hub') || r.role.includes('Warehouse'));
    }
    if (selectedFacilityFilter === 'AIR') {
      return resources.filter((r) => r.role.includes('Express') || r.role.includes('Courier') || r.role.includes('Air'));
    }
    if (selectedFacilityFilter === 'ESCROW') {
      return resources.filter((r) => r.role.includes('Settlement') || r.role.includes('Escrow'));
    }
    return resources;
  }, [resources, selectedFacilityFilter]);

  const filteredResourceIds = useMemo(() => new Set(filteredResources.map((r) => String(r.id))), [filteredResources]);

  const filteredEvents = useMemo(() => {
    return events.filter((e) => filteredResourceIds.has(String(e.resourceId)));
  }, [events, filteredResourceIds]);

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

  const fallback = (
    <LogisticsTimelineFallback
      resources={filteredResources}
      events={filteredEvents}
      startDate={startDate}
      endDate={endDate}
    />
  );

  return (
    <div className="space-y-3 font-sans">
      {/* Clean Enterprise Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-900 border border-slate-800 rounded-xl px-5 py-3 gap-3 text-sm">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-white text-sm">Fulfillment Schedule Timeline</span>
          </div>
          <span className="text-slate-500 text-sm hidden sm:inline">|</span>
          
          {/* Facility Filter Chips */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSelectedFacilityFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedFacilityFilter === 'ALL'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All Routes ({filteredEvents.length} events)
            </button>
            <button
              onClick={() => setSelectedFacilityFilter('DEPOT')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedFacilityFilter === 'DEPOT'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Depots
            </button>
            <button
              onClick={() => setSelectedFacilityFilter('AIR')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedFacilityFilter === 'AIR'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Air Express
            </button>
            <button
              onClick={() => setSelectedFacilityFilter('ESCROW')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedFacilityFilter === 'ESCROW'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Escrow
            </button>
          </div>
        </div>

        {/* Time Preset Controls */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-xs sm:text-sm mr-1">Time Scale:</span>
          {(['hourAndDay', 'dayAndWeek', 'weekAndMonth'] as const).map((preset) => (
            <button
              key={preset}
              onClick={() => handleZoom(preset)}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
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

      {/* Bryntum Scheduler Engine with Seamless Visual Fallback */}
      <BryntumErrorBoundary fallback={fallback}>
        <div
          className="bryntum-scheduler-container rounded-xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950"
          style={{ height }}
        >
          <BryntumScheduler
            ref={schedulerRef}
            startDate={startDate}
            endDate={endDate}
            viewPreset={activePreset}
            rowHeight={64}
            barMargin={8}
            resources={filteredResources}
            events={filteredEvents}
            columns={columns}
            eventColor="indigo"
          />
        </div>
      </BryntumErrorBoundary>
    </div>
  );
}

export default BryntumLogisticsScheduler;
