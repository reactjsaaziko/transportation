import { useMemo, useState } from 'react';
import { Calendar, Truck, AlertTriangle, FileText } from 'lucide-react';

import WarehouseOrderDetails, { WarehouseOrderDetail } from './WarehouseOrderDetails';
import WarehouseCurrentOrderDetails from './WarehouseCurrentOrderDetails';

type OrderStatus = 'yet-to-confirm' | 'current' | 'upcoming' | 'completed';

interface Order {
  id: string;
  orderId: string;
  status: OrderStatus;
  product: string;
  goodsTypes: string;
  total: string;
  days: string;
  cargoVolume: string;
  cargoWeight: string;
  eta: string;
  price: string;
  badges?: string[];
  valueOfGoods?: string;
  invoiceStatus?: string;
  paymentStatus?: string;
  statusLabel?: string;
}

const tabConfig: { id: OrderStatus; label: string }[] = [
  { id: 'yet-to-confirm', label: 'Yet to confirm' },
  { id: 'current', label: 'Current' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' },
];

const ordersMock: Order[] = [
  {
    id: '1',
    orderId: '151515',
    status: 'current',
    product: 'Plastic Cup',
    goodsTypes: 'Normal',
    total: '210 packages',
    days: '3 Days',
    cargoVolume: '29.50 m3 (32% volume)',
    cargoWeight: '14500.00 kg (% of max weight)',
    eta: '14, Jan, 2023',
    price: '1000/Day',
    badges: ['FCL', '20 FT', 'Normal'],
  },
  {
    id: '2',
    orderId: '151515',
    status: 'current',
    product: 'Plastic Cup',
    goodsTypes: 'Normal',
    total: '210 packages',
    days: '3 Days',
    cargoVolume: '29.50 m3 (32% volume)',
    cargoWeight: '14500.00 kg (% of max weight)',
    eta: '14, Jan, 2023',
    price: '1000/Day',
    badges: ['FCL', '20 FT', 'Normal'],
  },
  {
    id: '3',
    orderId: '221199',
    status: 'yet-to-confirm',
    product: 'Glass Bottles',
    goodsTypes: 'Fragile',
    total: '85 packages',
    days: '5 Days',
    cargoVolume: '18.70 m3 (46% volume)',
    cargoWeight: '9800.00 kg (% of max weight)',
    eta: '21, Jan, 2023',
    price: '1300/Day',
  },
  {
    id: '4',
    orderId: '774433',
    status: 'upcoming',
    product: 'Paper Plates',
    goodsTypes: 'Normal',
    total: '320 packages',
    days: '2 Days',
    cargoVolume: '24.10 m3 (28% volume)',
    cargoWeight: '11200.00 kg (% of max weight)',
    eta: '28, Jan, 2023',
    price: '900/Day',
  },
  {
    id: '5',
    orderId: '991177',
    status: 'completed',
    product: 'Steel Rods',
    goodsTypes: 'Heavy',
    total: '140 packages',
    days: '4 Days',
    cargoVolume: '34.80 m3 (51% volume)',
    cargoWeight: '18800.00 kg (% of max weight)',
    eta: '02, Jan, 2023',
    price: '1600/Day',
    badges: ['FCL', '20 FT', 'Heavy'],
    valueOfGoods: 'INR , USDT',
    invoiceStatus: 'Invoice',
    paymentStatus: 'Pending',
    statusLabel: 'Completed',
  },
  {
    id: '6',
    orderId: '151515',
    status: 'completed',
    product: 'Plastic Cup',
    goodsTypes: 'Normal',
    total: '210 packages',
    days: '3 Days',
    cargoVolume: '29.50 m3 (32% volume)',
    cargoWeight: '14500.00 kg (% of max weight)',
    eta: '14, Jan, 2023',
    price: '1000/Day',
    badges: ['FCL', '20 FT', 'Normal'],
    valueOfGoods: 'INR , USDT',
    invoiceStatus: 'Invoice',
    paymentStatus: 'Pending',
    statusLabel: 'Completed',
  },
];

const orderDetailsMock: Record<string, WarehouseOrderDetail> = {
  '4': {
    id: '4',
    orderReference: '774433',
    warehouseName: 'Warehouse',
    associatePersonName: 'Associate Person Name',
    contactNumber: '+91 989898 1234',
    cargoArrivalDate: '25 Jan, 2023',
    transporter: {
      driverName: 'Rameshbhai Patel',
      contactNumber: '+91 989898 0505',
      vehicleNumber: 'GJ-05-SM-2525',
    },
    cargoSummary: {
      weight: '145000.00 kg',
      volume: '29.50 m3',
    },
    shipments: [
      {
        id: 'pickup-1',
        title: 'Tautliner ( Curainsider ) #Pick Up 1',
        product: 'Plastic Cup',
        cargoType: 'Normal Container Cargo',
        total: '210 packages',
        cargoVolume: '29.50 m3 (32% volume)',
        cargoWeight: '14500.00 kg (% of max weight)',
        image: '/images/1.png',
        chartSegments: [
          { value: 50, color: '#2F80ED' },
          { value: 30, color: '#8B5CF6' },
          { value: 20, color: '#F97316' },
        ],
        breakdown: [
          {
            name: 'Big bags',
            packages: '10',
            size: '10*50*60cm',
            weight: '9000.00 kg',
            color: '#2F80ED',
          },
          {
            name: 'Sacks',
            packages: '100',
            size: '50*10*90cm',
            weight: '4500.00 kg',
            color: '#8B5CF6',
          },
          {
            name: 'Boxes 1',
            packages: '100',
            size: '20*20*50cm',
            weight: '1000.00 kg',
            color: '#F97316',
          },
        ],
      },
      {
        id: 'pickup-2',
        title: 'Tautliner ( Curainsider ) #Pick Up 2',
        product: 'Tea',
        cargoType: 'Normal Container Cargo',
        total: '360 packages',
        cargoVolume: '42.25 m3 (52% volume)',
        cargoWeight: '1750.00 kg (% of max weight)',
        image: '/images/1.png',
        chartSegments: [
          { value: 45, color: '#2F80ED' },
          { value: 35, color: '#8B5CF6' },
          { value: 20, color: '#F97316' },
        ],
        breakdown: [
          {
            name: 'Big bags',
            packages: '10',
            size: '10*50*60cm',
            weight: '9000.00 kg',
            color: '#2F80ED',
          },
          {
            name: 'Sacks',
            packages: '150',
            size: '50*10*90cm',
            weight: '6750.00 kg',
            color: '#8B5CF6',
          },
          {
            name: 'Boxes 1',
            packages: '200',
            size: '20*20*50cm',
            weight: '2000.00 kg',
            color: '#F97316',
          },
        ],
      },
    ],
    receivedFrom: {
      title: 'Tautliner ( Curainsider ) #Received From',
      companyName: 'Aaziko',
      contactPersonName: 'Rajesh bhai',
      address: 'Okha Port',
      contactNumber: '+91 989898 0505',
    },
  },
};

// Mock data for current orders with full form details
const currentOrderDetailsMock: Record<string, any> = {
  '1': {
    id: '1',
    orderReference: '151515',
    warehouseName: 'Warehouse',
    weight: '145000.00 kg',
    volume: '29.50 m3',
    associatePersonName: 'Associate Person Name',
    contactNumber: 'Contact Number',
    cargoArrivalDate: '25, Jan, 2023',
    transporter: {
      driverName: 'Driver Name',
      contactNumber: 'Contact Number',
      vehicleNumber: 'Vehicle Number',
      inDate: 'Driver Name',
      inTime: '9:00 PM',
      receiverBy: 'Name',
    },
    despatchTransporter: {
      driverName: 'Driver Name',
      contactNumber: 'Contact Number',
      vehicleNumber: 'Vehicle Number',
      outDate: 'Driver Name',
      outTime: '9:00 PM',
      despatchBy: 'Name',
    },
    cargoPickups: [
      {
        id: 'pickup-1',
        title: 'Tautliner ( Curainsider ) #Pick Up 1',
        product: 'Plastic Cup',
        cargoType: 'Normal Container Cargo',
        total: '210 packages',
        cargoVolume: '29.50 m3 (32% volume)',
        cargoWeight: '14500.00 kg (% of max weight)',
        image: '/images/1.png',
        chartSegments: [
          { value: 50, color: '#2F80ED' },
          { value: 30, color: '#8B5CF6' },
          { value: 20, color: '#10B981' },
        ],
        breakdown: [
          {
            name: 'Big bags',
            packages: '10',
            size: '10*50*60cm',
            weight: '9000.00 kg',
            color: '#2F80ED',
          },
          {
            name: 'Sacks',
            packages: '100',
            size: '50*10*90cm',
            weight: '4500.00 kg',
            color: '#8B5CF6',
          },
          {
            name: 'Boxes 1',
            packages: '100',
            size: '20*20*50cm',
            weight: '1000.00 kg',
            color: '#10B981',
          },
        ],
      },
      {
        id: 'pickup-2',
        title: 'Tautliner ( Curainsider ) #Pick Up 2',
        product: 'Tea',
        cargoType: 'Normal Container Cargo',
        total: '360 packages',
        cargoVolume: '42.25 m3 (52% volume)',
        cargoWeight: '1750.00 kg (% of max weight)',
        image: '/images/1.png',
        chartSegments: [
          { value: 45, color: '#2F80ED' },
          { value: 35, color: '#8B5CF6' },
          { value: 20, color: '#10B981' },
        ],
        breakdown: [
          {
            name: 'Big bags',
            packages: '10',
            size: '10*50*60cm',
            weight: '9000.00 kg',
            color: '#2F80ED',
          },
          {
            name: 'Sacks',
            packages: '150',
            size: '50*10*90cm',
            weight: '6750.00 kg',
            color: '#8B5CF6',
          },
          {
            name: 'Boxes 1',
            packages: '200',
            size: '20*20*50cm',
            weight: '2000.00 kg',
            color: '#10B981',
          },
        ],
      },
    ],
    receivedFrom: {
      title: 'Tautliner ( Curainsider ) #Received From',
      companyName: 'Aaziko',
      contactPersonName: 'Rajesh bhai',
      address: 'Okha Port',
      contactNumber: '+91 989898 0505',
    },
  },
  '2': {
    id: '2',
    orderReference: '151515',
    warehouseName: 'Warehouse',
    weight: '145000.00 kg',
    volume: '29.50 m3',
    associatePersonName: 'Associate Person Name',
    contactNumber: 'Contact Number',
    cargoArrivalDate: '25, Jan, 2023',
    transporter: {
      driverName: 'Driver Name',
      contactNumber: 'Contact Number',
      vehicleNumber: 'Vehicle Number',
      inDate: 'Driver Name',
      inTime: '9:00 PM',
      receiverBy: 'Name',
    },
    despatchTransporter: {
      driverName: 'Driver Name',
      contactNumber: 'Contact Number',
      vehicleNumber: 'Vehicle Number',
      outDate: 'Driver Name',
      outTime: '9:00 PM',
      despatchBy: 'Name',
    },
    cargoPickups: [
      {
        id: 'pickup-1',
        title: 'Tautliner ( Curainsider ) #Pick Up 1',
        product: 'Plastic Cup',
        cargoType: 'Normal Container Cargo',
        total: '210 packages',
        cargoVolume: '29.50 m3 (32% volume)',
        cargoWeight: '14500.00 kg (% of max weight)',
        image: '/images/1.png',
        chartSegments: [
          { value: 50, color: '#2F80ED' },
          { value: 30, color: '#8B5CF6' },
          { value: 20, color: '#10B981' },
        ],
        breakdown: [
          {
            name: 'Big bags',
            packages: '10',
            size: '10*50*60cm',
            weight: '9000.00 kg',
            color: '#2F80ED',
          },
          {
            name: 'Sacks',
            packages: '100',
            size: '50*10*90cm',
            weight: '4500.00 kg',
            color: '#8B5CF6',
          },
          {
            name: 'Boxes 1',
            packages: '100',
            size: '20*20*50cm',
            weight: '1000.00 kg',
            color: '#10B981',
          },
        ],
      },
    ],
    receivedFrom: {
      title: 'Tautliner ( Curainsider ) #Received From',
      companyName: 'Aaziko',
      contactPersonName: 'Rajesh bhai',
      address: 'Okha Port',
      contactNumber: '+91 989898 0505',
    },
  },
};

const WarehouseOrders = () => {
  const [activeTab, setActiveTab] = useState<OrderStatus>('yet-to-confirm');
  const [selectedDetail, setSelectedDetail] = useState<WarehouseOrderDetail | null>(null);
  const [selectedCurrentDetail, setSelectedCurrentDetail] = useState<any>(null);

  const filteredOrders = useMemo(() => ordersMock.filter((order) => order.status === activeTab), [activeTab]);

  const handleViewDetails = (order: Order) => {
    // For current tab, use the new detailed view
    if (order.status === 'current') {
      const currentDetail = currentOrderDetailsMock[order.id];
      if (currentDetail) {
        setSelectedCurrentDetail(currentDetail);
      }
    } else {
      // For other tabs, use the existing detail view
      const detail = orderDetailsMock[order.id];
      if (detail) {
        setSelectedDetail(detail);
      }
    }
  };

  const renderOrderCard = (order: Order) => {
    const detailRows = [
      { label: 'Product', value: order.product },
      { label: 'Goods Types', value: order.goodsTypes },
      { label: 'Total', value: order.total },
      { label: 'No. Of Days', value: order.days },
      { label: 'Cargo Volume', value: order.cargoVolume },
      { label: 'Cargo Weight', value: order.cargoWeight },
    ];

    const badges = order.badges ?? ['FCL', '20 FT', 'Normal'];
    const useUnifiedLayout = activeTab === 'current' || activeTab === 'yet-to-confirm' || activeTab === 'upcoming';

    if (activeTab === 'completed') {
      return (
        <div key={order.id} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
            <div className="flex shrink-0 flex-col items-center gap-3 self-stretch rounded-3xl border border-slate-200 bg-white p-4 text-center shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
                <AlertTriangle className="h-6 w-6 text-orange-500" />
              </div>
              <div className="w-full space-y-1.5 text-[10px] font-semibold text-slate-600">
                {badges.map((badge) => (
                  <div key={badge} className="rounded-md bg-slate-50 py-1 uppercase tracking-wide">
                    {badge}
                  </div>
                ))}
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
                <Truck className="h-6 w-6 text-orange-500" />
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="rounded-3xl border border-blue-100 p-5">
                <dl className="space-y-3 text-sm text-slate-600">
                  {detailRows.map((row, index) => (
                    <div
                      key={row.label}
                      className={`grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-6 gap-y-1 pb-3 font-medium ${
                        index !== detailRows.length - 1 ? 'border-b border-dashed border-blue-200' : 'pb-0'
                      }`}
                    >
                      <dt className="text-slate-500">{row.label} :</dt>
                      <dd className="font-semibold text-slate-900">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {order.valueOfGoods ? (
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600">
                  <span className="text-slate-500">Value Of Goods :</span>
                  <span className="text-slate-900">{order.valueOfGoods}</span>
                </div>
              ) : null}
            </div>

            <div className="flex shrink-0 flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:max-w-[17rem]">
              <div className="text-right text-sm font-semibold text-slate-500">
                Order Id : <span className="font-bold text-slate-900">{order.orderId}</span>
              </div>

              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">ETA</div>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-gray-50 px-3 py-2.5 text-sm font-semibold text-slate-800">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  {order.eta}
                </div>
              </div>

              <div className="space-y-2">
                {order.invoiceStatus ? (
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-gray-50 px-3 py-2.5 text-sm font-semibold text-slate-700"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-slate-400" />
                      {order.invoiceStatus}
                    </span>
                  </button>
                ) : null}
                {order.paymentStatus ? (
                  <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-500">
                    {order.paymentStatus}
                  </div>
                ) : null}
              </div>

              <div className="mt-auto flex flex-col items-end gap-3">
                <button
                  type="button"
                  className="rounded-full bg-blue-500 px-6 py-2 text-sm font-semibold text-white shadow-sm"
                >
                  {order.statusLabel ?? 'Completed'}
                </button>
                <button
                  type="button"
                  onClick={() => handleViewDetails(order)}
                  className="text-sm font-semibold text-blue-500 underline-offset-4 transition hover:underline"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (!useUnifiedLayout) {
      return (
        <div
          key={order.id}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <div className="flex w-full max-w-[5rem] flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
                <AlertTriangle className="h-6 w-6 text-orange-500" />
              </div>
              <div className="w-full space-y-1.5 text-center text-[10px] font-medium text-gray-600">
                {badges.map((badge) => (
                  <div key={badge} className="rounded-md bg-slate-50 py-1 uppercase tracking-wide">
                    {badge}
                  </div>
                ))}
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
                <Truck className="h-6 w-6 text-orange-500" />
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-4 lg:flex-row">
              <div className="flex-1 space-y-3 rounded-2xl border border-blue-100 bg-blue-50/30 p-5">
                {detailRows.map((row, index) => (
                  <div
                    key={row.label}
                    className={`flex items-center justify-between text-sm ${
                      index !== detailRows.length - 1 ? 'border-b border-dashed border-blue-200 pb-3' : ''
                    }`}
                  >
                    <span className="font-medium text-gray-600">{row.label} :</span>
                    <span className="font-semibold text-gray-900">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex w-full max-w-[14rem] flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-right text-sm font-semibold text-gray-600">
                Order Id : <span className="font-bold text-gray-900">{order.orderId}</span>
              </div>

              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">ETA</div>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-gray-50 px-3 py-2.5 text-sm font-semibold text-gray-800">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {order.eta}
                </div>
              </div>

              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Price</div>
                <div className="rounded-xl border border-slate-200 bg-gray-50 px-3 py-2.5 text-center text-sm font-semibold text-gray-800">
                  {order.price}
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <button
                  type="button"
                  className="w-full rounded-xl border border-blue-200 bg-white px-5 py-2.5 text-sm font-semibold text-blue-500 transition hover:bg-blue-50"
                >
                  Accept
                </button>
                <button
                  type="button"
                  className="w-full rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                >
                  Decline
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleViewDetails(order)}
                className="self-end text-sm font-semibold text-blue-500 underline-offset-4 transition hover:underline"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div key={order.id} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
          <div className="flex shrink-0 flex-col items-center gap-3 self-stretch rounded-3xl border border-slate-200 bg-white p-4 text-center shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
              <AlertTriangle className="h-6 w-6 text-orange-500" />
            </div>
            <div className="w-full space-y-1.5 text-[10px] font-semibold text-slate-600">
              {badges.map((badge) => (
                <div key={badge} className="rounded-md bg-slate-50 py-1 uppercase tracking-wide">
                  {badge}
                </div>
              ))}
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
              <Truck className="h-6 w-6 text-orange-500" />
            </div>
          </div>

          <div className="flex-1 rounded-3xl border border-slate-200 bg-white/80 p-5">
            <dl className="space-y-3 text-sm text-slate-600">
              {detailRows.map((row, index) => (
                <div
                  key={row.label}
                  className={`grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-6 gap-y-1 pb-3 font-medium ${
                    index !== detailRows.length - 1 ? 'border-b border-dashed border-slate-200' : 'pb-0'
                  }`}
                >
                  <dt className="text-slate-500">{row.label} :</dt>
                  <dd className="font-semibold text-slate-900">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="flex shrink-0 flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:max-w-[17rem]">
            <div className="text-right text-sm font-semibold text-slate-500">
              Order Id : <span className="font-bold text-slate-900">{order.orderId}</span>
            </div>
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">ETA</div>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-gray-50 px-3 py-2.5 text-sm font-semibold text-slate-800">
                <Calendar className="h-4 w-4 text-slate-400" />
                {order.eta}
              </div>
            </div>
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Price</div>
              <div className="rounded-xl border border-slate-200 bg-gray-50 px-3 py-2.5 text-center text-sm font-semibold text-slate-800">
                {order.price}
              </div>
            </div>

            {activeTab === 'yet-to-confirm' ? (
              <div className="flex flex-col gap-2.5">
                <button
                  type="button"
                  className="w-full rounded-xl border border-blue-200 bg-white px-5 py-2.5 text-sm font-semibold text-blue-500 transition hover:bg-blue-50"
                >
                  Accept
                </button>
                <button
                  type="button"
                  className="w-full rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                >
                  Decline
                </button>
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => handleViewDetails(order)}
              className={`self-end text-sm font-semibold text-blue-500 underline-offset-4 transition hover:underline ${
                activeTab === 'yet-to-confirm' ? '' : 'mt-auto'
              }`}
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (selectedCurrentDetail) {
    return <WarehouseCurrentOrderDetails data={selectedCurrentDetail} onBack={() => setSelectedCurrentDetail(null)} />;
  }

  if (selectedDetail) {
    return <WarehouseOrderDetails detail={selectedDetail} onBack={() => setSelectedDetail(null)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-wrap gap-3">
          {tabConfig.map((tab) => (
            <button
              key={tab.id}
              type="button"
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

        <div className="mt-6 space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-blue-200 py-20 text-center text-gray-500">
              No orders in this category
            </div>
          ) : (
            filteredOrders.map((order) => renderOrderCard(order))
          )}
        </div>
      </div>
    </div>
  );
};

export default WarehouseOrders;
