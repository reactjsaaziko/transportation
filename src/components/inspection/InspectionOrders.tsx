import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { InspectionTab, inspectionOrders } from './inspectionData';

const tabs: InspectionTab[] = ['Yet to confirm', 'Current', 'Upcoming', 'Completed'];

const InspectionOrders = () => {
  const [activeTab, setActiveTab] = useState<InspectionTab>('Yet to confirm');
  const navigate = useNavigate();

  const filteredOrders = inspectionOrders.filter((order) => order.status === activeTab);

  const InfoItem = ({ label, value, helper }: { label: string; value: string; helper?: string }) => (
    <div className="min-w-[150px] space-y-1">
      <div className="font-medium text-gray-500">{label} :</div>
      <div className="text-gray-800 font-semibold">{value}</div>
      {helper && <div className="text-xs text-gray-400">{helper}</div>}
    </div>
  );

  return (
    <div className="pb-12">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
        <div className="flex flex-wrap gap-3 border-b border-gray-100 px-6 py-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
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
                <div className="flex gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="rounded-lg bg-green-100 px-3 py-1 text-xs font-semibold text-green-600">LCL</div>
                  </div>

                  <div className="flex flex-col gap-4 text-sm text-gray-600">
                    <div className="flex flex-wrap gap-6">
                      <InfoItem label="Product" value={order.product} />
                      <InfoItem label="Type of Inspection" value={order.inspectionType} />
                    </div>

                    <div className="flex flex-wrap gap-6">
                      <InfoItem label="Goods Types" value={order.goodsType} />
                      <InfoItem
                        label="Cargo Weight"
                        value={order.cargoWeight}
                        helper={order.cargoWeightDetail}
                      />
                      <InfoItem
                        label="Cargo Volume"
                        value={order.cargoVolume}
                        helper={order.cargoVolumeDetail}
                      />
                    </div>

                    <div className="flex flex-wrap gap-6">
                      <InfoItem label="Total" value={order.totalPackages} />
                      <InfoItem label="Port" value={order.port} />
                      <InfoItem label="Price" value={order.price} />
                    </div>

                    {activeTab === 'Current' && (
                      <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                        <div className="flex flex-wrap gap-6">
                          {order.hsCode && <InfoItem label="HS Code" value={order.hsCode} />}
                        </div>
                        {order.address && (
                          <div className="mt-3 space-y-1">
                            <div className="font-medium text-gray-500">Address :</div>
                            <div className="text-gray-800 font-semibold">{order.address}</div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'Completed' && order.invoiceStatus && (
                      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                        <button className="rounded-full border border-gray-300 px-4 py-1 text-xs font-semibold text-gray-600">
                          Invoice
                        </button>
                        <span className="text-sm font-semibold text-gray-700">{order.invoiceStatus}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-4 lg:items-end">
                  <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{order.inspectionDate}</span>
                  </div>
                  {order.referenceLabel && order.referenceValue && (
                    <div className="text-sm font-semibold text-gray-600">
                      {order.referenceLabel} : {order.referenceValue}
                    </div>
                  )}

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
                    onClick={() => navigate(`/dashboard/inspection-order/${order.id}`)}
                    className="text-sm font-medium text-blue-600 underline-offset-4 hover:underline"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InspectionOrders;
