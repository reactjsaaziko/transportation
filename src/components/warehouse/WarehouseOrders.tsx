import { useMemo, useState } from 'react';
import { Calendar, Truck } from 'lucide-react';

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
    status: 'yet-to-confirm',
    product: 'Plastic Cup',
    goodsTypes: 'Normal',
    total: '210 packages',
    days: '3 Days',
    cargoVolume: '29.50 m3 (32% volume)',
    cargoWeight: '14500.00 kg (% of max weight)',
    eta: '14, Jan, 2023',
    price: '1000/Day',
  },
  {
    id: '2',
    orderId: '151515',
    status: 'yet-to-confirm',
    product: 'Plastic Cup',
    goodsTypes: 'Normal',
    total: '210 packages',
    days: '3 Days',
    cargoVolume: '29.50 m3 (32% volume)',
    cargoWeight: '14500.00 kg (% of max weight)',
    eta: '14, Jan, 2023',
    price: '1000/Day',
  },
];

const WarehouseOrders = () => {
  const [activeTab, setActiveTab] = useState<OrderStatus>('yet-to-confirm');

  const filteredOrders = useMemo(() => ordersMock.filter((order) => order.status === activeTab), [activeTab]);

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
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                  {/* Left side - Icon badges */}
                  <div className="flex w-full max-w-[5rem] flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
                      <span className="text-2xl">📦</span>
                    </div>
                    <div className="w-full space-y-1.5 text-center text-[10px] font-medium text-gray-600">
                      <div className="rounded-md bg-slate-50 py-1">FCL</div>
                      <div className="rounded-md bg-slate-50 py-1">20 FT</div>
                      <div className="rounded-md bg-slate-50 py-1">Normal</div>
                    </div>
                  </div>

                  {/* Middle - Product details */}
                  <div className="flex flex-1 flex-col gap-4 lg:flex-row">
                    <div className="flex-1 space-y-3 rounded-2xl border border-blue-100 bg-blue-50/30 p-5">
                      <div className="flex items-center justify-between border-b border-dashed border-blue-200 pb-3 text-sm">
                        <span className="font-medium text-gray-600">Product :</span>
                        <span className="font-semibold text-gray-900">{order.product}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-dashed border-blue-200 pb-3 text-sm">
                        <span className="font-medium text-gray-600">Goods Types :</span>
                        <span className="font-semibold text-gray-900">{order.goodsTypes}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-dashed border-blue-200 pb-3 text-sm">
                        <span className="font-medium text-gray-600">Total :</span>
                        <span className="font-semibold text-gray-900">{order.total}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-dashed border-blue-200 pb-3 text-sm">
                        <span className="font-medium text-gray-600">No. Of Days :</span>
                        <span className="font-semibold text-gray-900">{order.days}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-dashed border-blue-200 pb-3 text-sm">
                        <span className="font-medium text-gray-600">Cargo Volume :</span>
                        <span className="font-semibold text-gray-900">{order.cargoVolume}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-600">Cargo Weight :</span>
                        <span className="font-semibold text-gray-900">{order.cargoWeight}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right side - ETA, Price, Actions */}
                  <div className="flex w-full max-w-[14rem] flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
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

                    <div className="text-right text-sm font-semibold text-gray-600">
                      Order I'd : <span className="font-bold text-gray-900">{order.orderId}</span>
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

                    <button type="button" className="self-end text-sm font-semibold text-blue-500 underline-offset-4 transition hover:underline">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WarehouseOrders;
