import { useMemo, useState } from 'react';
import { AlertTriangle, Calendar, FileText, Plane, Search, Ship, Truck } from 'lucide-react';
import CHAOrderDetails from './CHAOrderDetails';

interface Order {
  id: string;
  orderId: string;
  date: string;
  originCity: string;
  destinationCity: string;
  product: string;
  hsCode: string;
  goodsTypes: string;
  cargoWeight: string;
  total: string;
  cargoVolume: string;
  port: string;
  cargoValue: string;
  transportMode: 'sea' | 'air' | 'truck';
  status: 'yet-to-confirm' | 'current' | 'upcoming' | 'completed';
  associatePersonName?: string;
  contactNumber?: string;
  invoiceStatus?: 'pending' | 'completed';
}

const tabConfig = [
  { id: 'yet-to-confirm' as const, label: 'Yet to confirm' },
  { id: 'current' as const, label: 'Current' },
  { id: 'upcoming' as const, label: 'Upcoming' },
  { id: 'completed' as const, label: 'Completed' },
];

const transportConfig = {
  sea: {
    icon: Ship,
    tags: ['FCL', '20 FT', 'Normal'],
    accent: 'text-blue-600',
    iconBg: 'bg-blue-100',
  },
  air: {
    icon: Plane,
    tags: ['Air Cargo', 'Priority', 'Normal'],
    accent: 'text-sky-500',
    iconBg: 'bg-sky-100',
  },
  truck: {
    icon: Truck,
    tags: ['Truck', '20 FT', 'Normal'],
    accent: 'text-orange-500',
    iconBg: 'bg-orange-100',
  },
} as const;

const detailRows: { label: keyof Order; title: string }[] = [
  { label: 'product', title: 'Product' },
  { label: 'hsCode', title: 'HS Code' },
  { label: 'goodsTypes', title: 'Goods Types' },
  { label: 'cargoWeight', title: 'Cargo Weight' },
  { label: 'total', title: 'Total' },
  { label: 'cargoVolume', title: 'Cargo Volume' },
  { label: 'port', title: 'Port' },
  { label: 'cargoValue', title: 'Cargo Value' },
];

const ordersMock: Order[] = [
  {
    id: '1',
    orderId: '151515',
    date: '14, Jan, 2023',
    originCity: 'City, Stat, Country',
    destinationCity: 'City, Stat, Country',
    product: 'Plastic Cup',
    hsCode: '465464',
    goodsTypes: 'Normal',
    cargoWeight: '14500.00 kg',
    total: '210 packages',
    cargoVolume: '29.50 M3',
    port: 'Sahar, Mumbai',
    cargoValue: 'INR 2000/SB',
    transportMode: 'sea',
    status: 'yet-to-confirm',
  },
  {
    id: '2',
    orderId: '151516',
    date: '18, Jan, 2023',
    originCity: 'City, Stat, Country',
    destinationCity: 'City, Stat, Country',
    product: 'Plastic Cup',
    hsCode: '465464',
    goodsTypes: 'Normal',
    cargoWeight: '14500.00 kg',
    total: '210 packages',
    cargoVolume: '29.50 M3',
    port: 'Sahar, Mumbai',
    cargoValue: 'INR 2000/SB',
    transportMode: 'truck',
    status: 'yet-to-confirm',
  },
  {
    id: '3',
    orderId: '151515',
    date: '14, Jan, 2023',
    originCity: 'City, Stat, Country',
    destinationCity: 'City, Stat, Country',
    product: 'Plastic Cup',
    hsCode: '465464',
    goodsTypes: 'Normal',
    cargoWeight: '14500.00 kg',
    total: '210 packages',
    cargoVolume: '29.50 M3',
    port: 'Sahar, Mumbai',
    cargoValue: 'INR 2000/SB',
    transportMode: 'sea',
    status: 'current',
  },
  {
    id: '4',
    orderId: '151515',
    date: '14, Jan, 2023',
    originCity: 'City, Stat, Country',
    destinationCity: 'City, Stat, Country',
    product: 'Plastic Cup',
    hsCode: '465464',
    goodsTypes: 'Normal',
    cargoWeight: '14500.00 kg',
    total: '210 packages',
    cargoVolume: '29.50 M3',
    port: 'Sahar, Mumbai',
    cargoValue: 'INR 2000/SB',
    transportMode: 'truck',
    status: 'current',
  },
  {
    id: '5',
    orderId: '151515',
    date: '14, Jan, 2023',
    originCity: 'City, Stat, Country',
    destinationCity: 'City, Stat, Country',
    product: 'Plastic Cup',
    hsCode: '465464',
    goodsTypes: 'Normal',
    cargoWeight: '14500.00 kg',
    total: '210 packages',
    cargoVolume: '29.50 M3',
    port: 'Sahar, Mumbai',
    cargoValue: 'INR 2000/SB',
    transportMode: 'sea',
    status: 'upcoming',
  },
  {
    id: '6',
    orderId: '151515',
    date: '14, Jan, 2023',
    originCity: 'City, Stat, Country',
    destinationCity: 'City, Stat, Country',
    product: 'Plastic Cup',
    hsCode: '465464',
    goodsTypes: 'Normal',
    cargoWeight: '14500.00 kg',
    total: '210 packages',
    cargoVolume: '29.50 M3',
    port: 'Sahar, Mumbai',
    cargoValue: 'INR 2000/SB',
    transportMode: 'air',
    status: 'upcoming',
  },
  {
    id: '7',
    orderId: '151515',
    date: '14, Jan, 2023',
    originCity: 'City, Stat, Country',
    destinationCity: 'City, Stat, Country',
    product: 'Plastic Cup',
    hsCode: '465464',
    goodsTypes: 'Normal',
    cargoWeight: '14500.00 kg (% of max weight)',
    total: '210 packages',
    cargoVolume: '29.50 m3 (32% volume)',
    port: 'Sahar, Mumbai',
    cargoValue: 'INR 2000/SB',
    transportMode: 'sea',
    status: 'completed',
    associatePersonName: 'RakeshBhai Patel',
    contactNumber: '9898985757',
    invoiceStatus: 'pending',
  },
  {
    id: '8',
    orderId: '151515',
    date: '14, Jan, 2023',
    originCity: 'City, Stat, Country',
    destinationCity: 'City, Stat, Country',
    product: 'Plastic Cup',
    hsCode: '465464',
    goodsTypes: 'Normal',
    cargoWeight: '14500.00 kg (% of max weight)',
    total: '210 packages',
    cargoVolume: '29.50 m3 (32% volume)',
    port: 'Sahar, Mumbai',
    cargoValue: 'INR 2000/SB',
    transportMode: 'truck',
    status: 'completed',
    associatePersonName: 'RakeshBhai Patel',
    contactNumber: '9898985757',
    invoiceStatus: 'pending',
  },
];

const CHAOrders = () => {
  const [activeTab, setActiveTab] = useState<typeof tabConfig[number]['id']>('yet-to-confirm');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = useMemo(
    () => ordersMock.filter((order) => order.status === activeTab),
    [activeTab],
  );

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleBack = () => {
    setSelectedOrder(null);
  };

  // If an order is selected, show the details view
  if (selectedOrder) {
    return (
      <CHAOrderDetails
        order={{
          id: selectedOrder.id,
          orderId: selectedOrder.orderId,
          fromLocation: selectedOrder.originCity,
          toLocation: selectedOrder.destinationCity,
          cargoArrivalDate: selectedOrder.date,
          associatePersonName: selectedOrder.associatePersonName || '',
          contactNumber: selectedOrder.contactNumber || '',
          hsCode: selectedOrder.hsCode,
          cargoVolume: selectedOrder.cargoVolume,
          cargoWeight: selectedOrder.cargoWeight,
          status: selectedOrder.status,
        }}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-3">
          {tabConfig.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-6 py-2 text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-md shadow-blue-200/60'
                  : 'border border-transparent bg-blue-50/80 text-gray-600 hover:border-blue-200 hover:bg-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders, locations or ID"
            className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-14 pr-4 text-sm text-gray-700 shadow-sm outline-none transition focus:border-blue-500 focus:shadow"
          />
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {filteredOrders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-blue-200 py-20 text-center text-gray-500">
            No orders in this category
          </div>
        ) : (
          filteredOrders.map((order) => {
            const transport = transportConfig[order.transportMode];
            const TransportIcon = transport.icon;

            // Yet to confirm layout (original design with Accept/Decline buttons)
            if (activeTab === 'yet-to-confirm') {
              return (
                <div
                  key={order.id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex flex-1 flex-col gap-6 md:flex-row md:items-start">
                      <div className="flex w-full max-w-[6rem] flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
                          <AlertTriangle className="h-7 w-7 text-orange-500" />
                        </div>
                        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${transport.iconBg}`}>
                          <TransportIcon className={`h-6 w-6 ${transport.accent}`} />
                        </div>
                        <div className="flex flex-col items-center gap-1 text-[11px] font-medium text-gray-600">
                          {transport.tags.map((tag) => (
                            <span
                              key={tag}
                              className="w-full rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-center"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col gap-4">
                        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-300 bg-blue-50 text-sm font-semibold text-blue-600">
                              A
                            </div>
                            <div className="min-w-[10rem] text-sm font-medium text-gray-700">{order.originCity}</div>
                          </div>
                          <div className="flex items-center gap-2 text-gray-400">
                            <span className="block h-px w-10 bg-gray-300" />
                            <span className="text-xs font-semibold uppercase tracking-wide">to</span>
                            <span className="block h-px w-10 bg-gray-300" />
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-purple-300 bg-purple-50 text-sm font-semibold text-purple-600">
                              B
                            </div>
                            <div className="min-w-[10rem] text-sm font-medium text-gray-700">{order.destinationCity}</div>
                          </div>
                          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm">
                            <Calendar className="h-4 w-4 text-blue-500" />
                            {order.date}
                          </div>
                        </div>

                        <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2">
                          {detailRows.map((row) => (
                            <div
                              key={row.label}
                              className="flex items-center justify-between gap-3 border-b border-dashed border-slate-200 pb-3 text-sm text-gray-600 last:border-b-0 last:pb-0"
                            >
                              <span className="font-medium text-gray-500">{row.title} :</span>
                              <span className="font-semibold text-gray-800">{order[row.label]}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex w-full max-w-[12rem] flex-col items-end gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-right shadow-sm">
                      <span className="text-sm font-semibold text-gray-600">
                        Trip Id : <span className="font-bold text-gray-900">{order.orderId}</span>
                      </span>
                      <button className="w-full rounded-xl border border-blue-200 bg-white px-5 py-2 text-sm font-semibold text-blue-500 shadow-sm transition hover:bg-blue-500 hover:text-white">
                        Accept
                      </button>
                      <button className="w-full rounded-xl border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-gray-600 shadow-sm transition hover:bg-gray-100">
                        Decline
                      </button>
                      <button 
                        onClick={() => handleViewDetails(order)}
                        className="text-sm font-medium text-blue-500 underline-offset-4 transition hover:underline"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            // Current and Upcoming layout (simplified without action buttons)
            if (activeTab === 'current' || activeTab === 'upcoming') {
              return (
                <div
                  key={order.id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex flex-1 flex-col gap-6 md:flex-row md:items-start">
                      <div className="flex w-full max-w-[6rem] flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
                          <AlertTriangle className="h-7 w-7 text-orange-500" />
                        </div>
                        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${transport.iconBg}`}>
                          <TransportIcon className={`h-6 w-6 ${transport.accent}`} />
                        </div>
                        <div className="flex flex-col items-center gap-1 text-[11px] font-medium text-gray-600">
                          {transport.tags.map((tag) => (
                            <span
                              key={tag}
                              className="w-full rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-center"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col gap-4">
                        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-300 bg-blue-50 text-sm font-semibold text-blue-600">
                              A
                            </div>
                            <div className="min-w-[10rem] text-sm font-medium text-gray-700">{order.originCity}</div>
                          </div>
                          <div className="flex items-center gap-2 text-gray-400">
                            <span className="block h-px w-10 bg-gray-300" />
                            <span className="text-xs font-semibold uppercase tracking-wide">to</span>
                            <span className="block h-px w-10 bg-gray-300" />
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-purple-300 bg-purple-50 text-sm font-semibold text-purple-600">
                              B
                            </div>
                            <div className="min-w-[10rem] text-sm font-medium text-gray-700">{order.destinationCity}</div>
                          </div>
                          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm">
                            <Calendar className="h-4 w-4 text-blue-500" />
                            {order.date}
                          </div>
                        </div>

                        <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2">
                          <div className="flex items-center justify-between gap-3 border-b border-dashed border-slate-200 pb-3 text-sm text-gray-600 last:border-b-0 last:pb-0">
                            <span className="font-medium text-gray-500">Product :</span>
                            <span className="font-semibold text-gray-800">{order.product}</span>
                          </div>
                          <div className="flex items-center justify-between gap-3 border-b border-dashed border-slate-200 pb-3 text-sm text-gray-600 last:border-b-0 last:pb-0">
                            <span className="font-medium text-gray-500">HS Code :</span>
                            <span className="font-semibold text-gray-800">{order.hsCode}</span>
                          </div>
                          <div className="flex items-center justify-between gap-3 border-b border-dashed border-slate-200 pb-3 text-sm text-gray-600 last:border-b-0 last:pb-0">
                            <span className="font-medium text-gray-500">Goods Types :</span>
                            <span className="font-semibold text-gray-800">{order.goodsTypes}</span>
                          </div>
                          <div className="flex items-center justify-between gap-3 border-b border-dashed border-slate-200 pb-3 text-sm text-gray-600 last:border-b-0 last:pb-0">
                            <span className="font-medium text-gray-500">Cargo Weight :</span>
                            <span className="font-semibold text-gray-800">{order.cargoWeight}</span>
                          </div>
                          <div className="flex items-center justify-between gap-3 border-b border-dashed border-slate-200 pb-3 text-sm text-gray-600 last:border-b-0 last:pb-0">
                            <span className="font-medium text-gray-500">Total :</span>
                            <span className="font-semibold text-gray-800">{order.total}</span>
                          </div>
                          <div className="flex items-center justify-between gap-3 border-b border-dashed border-slate-200 pb-3 text-sm text-gray-600 last:border-b-0 last:pb-0">
                            <span className="font-medium text-gray-500">Cargo Volume :</span>
                            <span className="font-semibold text-gray-800">{order.cargoVolume}</span>
                          </div>
                          <div className="flex items-center justify-between gap-3 text-sm text-gray-600">
                            <span className="font-medium text-gray-500">Port :</span>
                            <span className="font-semibold text-gray-800">{order.port}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex w-full max-w-[12rem] flex-col items-end gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-right shadow-sm">
                      <span className="text-sm font-semibold text-gray-600">
                        Trip Id : <span className="font-bold text-gray-900">{order.orderId}</span>
                      </span>
                      <button 
                        onClick={() => handleViewDetails(order)}
                        className="text-sm font-medium text-blue-500 underline-offset-4 transition hover:underline"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            // Completed layout (different structure with associate person info)
            if (activeTab === 'completed') {
              return (
                <div
                  key={order.id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex flex-1 flex-col gap-6 md:flex-row md:items-start">
                      <div className="flex w-full max-w-[6rem] flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
                          <AlertTriangle className="h-7 w-7 text-orange-500" />
                        </div>
                        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${transport.iconBg}`}>
                          <TransportIcon className={`h-6 w-6 ${transport.accent}`} />
                        </div>
                        <div className="flex flex-col items-center gap-1 text-[11px] font-medium text-gray-600">
                          {transport.tags.map((tag) => (
                            <span
                              key={tag}
                              className="w-full rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-center"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col gap-4">
                        <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2">
                          <div className="flex items-center justify-between gap-3 border-b border-dashed border-slate-200 pb-3 text-sm text-gray-600 last:border-b-0 last:pb-0">
                            <span className="font-medium text-gray-500">Associate Person Name :</span>
                            <span className="font-semibold text-gray-800">{order.associatePersonName}</span>
                          </div>
                          <div className="flex items-center justify-between gap-3 border-b border-dashed border-slate-200 pb-3 text-sm text-gray-600 last:border-b-0 last:pb-0">
                            <span className="font-medium text-gray-500">Contact Number :</span>
                            <span className="font-semibold text-gray-800">{order.contactNumber}</span>
                          </div>
                          <div className="flex items-center justify-between gap-3 border-b border-dashed border-slate-200 pb-3 text-sm text-gray-600 last:border-b-0 last:pb-0">
                            <span className="font-medium text-gray-500">Product :</span>
                            <span className="font-semibold text-gray-800">{order.product}</span>
                          </div>
                          <div className="flex items-center justify-between gap-3 border-b border-dashed border-slate-200 pb-3 text-sm text-gray-600 last:border-b-0 last:pb-0">
                            <span className="font-medium text-gray-500">Goods Types :</span>
                            <span className="font-semibold text-gray-800">{order.goodsTypes}</span>
                          </div>
                          <div className="flex items-center justify-between gap-3 border-b border-dashed border-slate-200 pb-3 text-sm text-gray-600 last:border-b-0 last:pb-0">
                            <span className="font-medium text-gray-500">Total :</span>
                            <span className="font-semibold text-gray-800">{order.total}</span>
                          </div>
                          <div className="flex items-center justify-between gap-3 border-b border-dashed border-slate-200 pb-3 text-sm text-gray-600 last:border-b-0 last:pb-0">
                            <span className="font-medium text-gray-500">Cargo Volume :</span>
                            <span className="font-semibold text-gray-800">{order.cargoVolume}</span>
                          </div>
                          <div className="flex items-center justify-between gap-3 text-sm text-gray-600">
                            <span className="font-medium text-gray-500">Cargo Weight :</span>
                            <span className="font-semibold text-gray-800">{order.cargoWeight}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex w-full max-w-[12rem] flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        {order.date}
                      </div>
                      <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium text-gray-600">Invoice</span>
                          <FileText className="h-4 w-4 text-gray-500" />
                        </div>
                        <span className="text-xs font-semibold text-gray-700">{order.invoiceStatus || 'Pending'}</span>
                      </div>
                      <button className="w-full rounded-xl bg-blue-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600">
                        Completed
                      </button>
                      <button 
                        onClick={() => handleViewDetails(order)}
                        className="text-sm font-medium text-blue-500 underline-offset-4 transition hover:underline"
                      >
                        View Details
                      </button>
                      <span className="text-right text-sm font-semibold text-gray-600">
                        Trip Id : <span className="font-bold text-gray-900">{order.orderId}</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            }

            return null;
          })
        )}
      </div>
    </div>
  );
};

export default CHAOrders;
