import { Calendar, ChevronDown, FileLock2, FileText } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { InspectionTab, inspectionOrders } from './inspectionData';

const tabs: InspectionTab[] = ['Yet to confirm', 'Current', 'Upcoming', 'Completed'];

const TagField = ({ label, value }: { label: string; value?: string }) => (
  <div className="space-y-1">
    <div className="text-sm font-medium text-gray-500">{label} :</div>
    <div className="inline-flex items-center rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-700">
      {value || '—'}
    </div>
  </div>
);

const TextField = ({ label, value, icon }: { label: string; value?: string; icon?: React.ReactNode }) => (
  <div className="space-y-1">
    <div className="text-sm font-medium text-gray-500">{label} :</div>
    <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">
      <span>{value || '—'}</span>
      {icon}
    </div>
  </div>
);

const TimelineField = ({ label, date, time, inspector }: { label: string; date: string; time: string; inspector: string }) => (
  <div className="space-y-2">
    <div className="text-sm font-semibold text-gray-600">{label}</div>
    <div className="grid gap-3 md:grid-cols-3">
      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700">
        <Calendar className="h-4 w-4 text-gray-400" />
        {date}
      </div>
      <div className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700">{time}</div>
      <div className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700">{inspector}</div>
    </div>
  </div>
);

const InspectionOrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [isTimelineOpen, setIsTimelineOpen] = useState(true);

  const order = useMemo(() => inspectionOrders.find((item) => item.id === orderId), [orderId]);

  if (!order) {
    return (
      <div className="py-20 text-center text-gray-500">Order details not found.</div>
    );
  }

  const isCurrent = order.status === 'Current';
  const isUpcoming = order.status === 'Upcoming';

  return (
    <div className="pb-12">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
        <div className="flex flex-wrap items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex flex-wrap gap-3">
            {tabs.map((tab) => (
              <span
                key={tab}
                className={`rounded-full px-5 py-2 text-sm font-medium border ${
                  order.status === tab
                    ? 'border-blue-200 bg-blue-50 text-blue-600'
                    : 'border-gray-200 text-gray-500'
                }`}
              >
                {tab}
              </span>
            ))}
          </div>
          <button
            onClick={() => navigate(-1)}
            className="text-sm font-medium text-blue-600 underline-offset-4 hover:underline"
          >
            Back to list
          </button>
        </div>

        <div className="space-y-8 px-6 py-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <TagField label="City" value={order.city} />
            <TagField label="Goods Type" value={order.goodsType} />
            <TagField label="Goods Name" value={order.goodsName} />
            <TagField label="Date of Inspection" value={order.inspectionDate} />
            <TagField label="Cargo Volume" value={order.cargoVolumeDetail || order.cargoVolume} />
            <TagField label="Cargo Weight" value={order.cargoWeightDetail || order.cargoWeight} />
            <TagField label="Type of Inspection" value={order.inspectionType} />
            <TagField label="Total" value={order.totalPackages} />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <TextField label="Factory Address" value={order.address} />
            <TextField label="Contact Details" value={`Admin contact Person : ${order.contactPerson || '—'}`} icon={<FileText className="h-4 w-4 text-blue-500" />} />
          </div>

          {(isCurrent || isUpcoming) && (
            <div className="grid gap-6 md:grid-cols-2">
              <TextField label="Cargo Volume" value={order.cargoVolumeDetail || order.cargoVolume} />
              <TextField label="Cargo Weight" value={order.cargoWeightDetail || order.cargoWeight} />
              <TextField label="Type of Inspection" value={order.inspectionType} />
              <TextField label="Order Reference" value={`${order.referenceLabel || 'Order Id'} : ${order.referenceValue ?? order.id}`} />
            </div>
          )}

          {isCurrent && order.timeline && (
            <div className="rounded-2xl border border-gray-200">
              <button
                className="flex w-full items-center justify-between rounded-2xl px-6 py-4 text-left text-sm font-semibold text-gray-700"
                onClick={() => setIsTimelineOpen((prev) => !prev)}
              >
                <span>Timeline</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isTimelineOpen ? 'rotate-180' : ''}`} />
              </button>
              {isTimelineOpen && (
                <div className="space-y-6 border-t border-gray-100 px-6 py-6">
                  <TimelineField
                    label="Start Inspection"
                    date={order.timeline.startDate}
                    time={order.timeline.startTime}
                    inspector={order.timeline.startInspector}
                  />
                  <TimelineField
                    label="Complete Inspection"
                    date={order.timeline.completeDate}
                    time={order.timeline.completeTime}
                    inspector={order.timeline.completeInspector}
                  />
                  <div className="grid gap-4 md:grid-cols-3">
                    <button className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600">
                      Upload Report
                      <FileLock2 className="h-4 w-4" />
                    </button>
                    <button className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600">
                      Upload Invoice
                      <FileLock2 className="h-4 w-4" />
                    </button>
                    <button className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600">
                      Payment Receipt
                      <FileText className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="space-y-4">
            <div className="text-sm font-semibold text-gray-600">Inspection Criteria :</div>
            <div className="min-h-[120px] rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-sm text-gray-500">
              {order.inspectionCriteria || 'Details will be updated soon.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectionOrderDetails;
