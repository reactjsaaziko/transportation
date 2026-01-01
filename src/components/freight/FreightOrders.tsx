import { useMemo, useState } from 'react';
import { Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FreightOrderTab, freightOrders } from './freightData';

const tabs: FreightOrderTab[] = ['Yet to confirm', 'Current', 'Upcoming', 'Completed'];

const RouteChip = ({ label }: { label: string }) => (
  <span className="rounded-full border border-dashed border-blue-200 bg-blue-50 px-4 py-1 text-xs font-semibold text-blue-600">
    {label}
  </span>
);

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="space-y-1">
    <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</div>
    <div className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm">
      {value}
    </div>
  </div>
);

const FreightOrders = () => {
  const [activeTab, setActiveTab] = useState<FreightOrderTab>('Yet to confirm');
  const navigate = useNavigate();

  const filteredOrders = useMemo(
    () => freightOrders.filter((order) => order.status === activeTab),
    [activeTab]
  );

  return (
    <div className="pb-12">
      <div className="space-y-8">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-wrap gap-3 border-b border-gray-100 px-6 py-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-6 px-6 py-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex flex-col gap-5 text-sm text-gray-600">
                    <div className="flex flex-wrap items-center gap-3">
                      <RouteChip label={order.origin} />
                      {order.stopover && <RouteChip label={order.stopover} />}
                      <RouteChip label={order.destination} />
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-blue-50/40 p-5">
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <InfoRow label="Product" value={order.product} />
                        <InfoRow label="TT" value={order.transitTime} />
                        <InfoRow label="Cargo Ready Date" value={order.cargoReadyDate} />
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <InfoRow label="Goods Types" value={order.cargoType} />
                        <InfoRow label="Cargo Weight" value={order.cargoWeight} />
                        <InfoRow label="Cargo Volume" value={order.cargoVolume} />
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <InfoRow label="Total" value={order.totalPackages} />
                        <InfoRow label="Vessel Name" value={order.vesselName} />
                        <InfoRow label="Shipping Line" value={order.shippingLine} />
                      </div>
                    </div>

                    {activeTab === 'Completed' && order.invoiceStatus && (
                      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
                        <button className="rounded-full border border-gray-300 px-4 py-1 text-xs font-semibold text-gray-600">
                          Invoice
                        </button>
                        <span className="text-sm font-semibold text-gray-700">{order.invoiceStatus}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-4 lg:items-end">
                    <div className="text-sm font-semibold text-gray-600">
                      {order.tripId ? `Trip Id : ${order.tripId}` : `Order Id : ${order.id}`}
                    </div>
                    {order.hsCode && (
                      <div className="text-sm font-medium text-gray-500">
                        HS Code : <span className="font-semibold text-gray-700">{order.hsCode}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{order.cargoReadyDate}</span>
                    </div>
                    <div className="text-sm font-semibold text-gray-600">
                      Price : <span className="font-semibold text-gray-800">{order.price}</span>
                    </div>

                    {activeTab === 'Yet to confirm' ? (
                      <div className="flex gap-3">
                        <button className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600">
                          Accept
                        </button>
                        <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                          Decline
                        </button>
                      </div>
                    ) : activeTab === 'Completed' ? (
                      <button className="rounded-lg bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                        Completed
                      </button>
                    ) : null}

                    <button
                      onClick={() => navigate(`/dashboard/freight-order/${order.id}`)}
                      className="text-sm font-medium text-blue-600 underline-offset-4 hover:underline"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredOrders.length === 0 && (
              <div className="py-20 text-center text-gray-400">No freight orders yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreightOrders;
