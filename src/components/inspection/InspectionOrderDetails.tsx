import { Calendar, ChevronDown, FileLock2, FileText } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetWorkAssignmentByIdQuery } from '@/services/workAssignmentApi';

type InspectionTab = 'Yet to confirm' | 'Current' | 'Upcoming' | 'Completed';

const tabs: InspectionTab[] = ['Yet to confirm', 'Current', 'Upcoming', 'Completed'];

const STATUS_TAB_MAP: Record<string, InspectionTab> = {
  pending: 'Yet to confirm',
  assigned: 'Yet to confirm',
  acknowledged: 'Upcoming',
  in_progress: 'Current',
  pending_review: 'Completed',
  completed: 'Completed',
};

const formatDate = (iso?: string) => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
};

const formatTime = (iso?: string) => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
};

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

  const { data, isFetching, isError } = useGetWorkAssignmentByIdQuery(
    orderId || '',
    { skip: !orderId },
  );

  const wa: any = (data as any)?.data;

  if (isFetching) {
    return <div className="py-20 text-center text-gray-500">Loading...</div>;
  }

  if (isError || !wa) {
    return (
      <div className="py-20 text-center text-gray-500">Order details not found.</div>
    );
  }

  const activeTab: InspectionTab = STATUS_TAB_MAP[wa.status] || 'Yet to confirm';
  const isCurrent = activeTab === 'Current';
  const isUpcoming = activeTab === 'Upcoming';

  const city = wa?.location?.city || '—';
  const goodsType = wa?.goodsType || wa?.priority || '—';
  const goodsName = wa?.product || wa?.title || '—';
  const inspectionDate = formatDate(wa?.dueDate || wa?.assignedAt);
  const cargoVolume = wa?.cargoVolume || '—';
  const cargoWeight = wa?.cargoWeight || '—';
  const inspectionType = wa?.inspectionType || wa?.assignmentType || '—';
  const totalPackages =
    wa?.totalPackages || (wa?.packages ? `${wa.packages} packages` : '—');
  const address = wa?.address || wa?.location?.address || '—';
  const contactPerson = wa?.assignedByName || '—';
  const orderRef = wa?.assignmentId || wa?._id || '—';
  const criteria = wa?.specialInstructions || wa?.description || '';

  return (
    <div className="pb-12">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
        <div className="flex flex-wrap items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex flex-wrap gap-3">
            {tabs.map((tab) => (
              <span
                key={tab}
                aria-disabled={activeTab !== tab}
                className={`rounded-full px-5 py-2 text-sm font-medium border select-none ${
                  activeTab === tab
                    ? 'border-blue-200 bg-blue-50 text-blue-600'
                    : 'border-gray-200 bg-gray-50 text-gray-400 opacity-60 cursor-not-allowed pointer-events-none'
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
            <TagField label="City" value={city} />
            <TagField label="Goods Type" value={goodsType} />
            <TagField label="Goods Name" value={goodsName} />
            <TagField label="Date of Inspection" value={inspectionDate} />
            <TagField label="Cargo Volume" value={cargoVolume} />
            <TagField label="Cargo Weight" value={cargoWeight} />
            <TagField label="Type of Inspection" value={inspectionType} />
            <TagField label="Total" value={totalPackages} />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <TextField label="Factory Address" value={address} />
            <TextField
              label="Contact Details"
              value={`Admin contact Person : ${contactPerson}`}
              icon={<FileText className="h-4 w-4 text-blue-500" />}
            />
          </div>

          {(isCurrent || isUpcoming) && (
            <div className="grid gap-6 md:grid-cols-2">
              <TextField label="Cargo Volume" value={cargoVolume} />
              <TextField label="Cargo Weight" value={cargoWeight} />
              <TextField label="Type of Inspection" value={inspectionType} />
              <TextField label="Order Reference" value={`Order Id : ${orderRef}`} />
            </div>
          )}

          {isCurrent && (
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
                    date={formatDate(wa?.startedAt || wa?.assignedAt)}
                    time={formatTime(wa?.startedAt || wa?.assignedAt)}
                    inspector={contactPerson}
                  />
                  <TimelineField
                    label="Complete Inspection"
                    date={formatDate(wa?.completedAt || wa?.dueDate)}
                    time={formatTime(wa?.completedAt || wa?.dueDate)}
                    inspector={contactPerson}
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
              {criteria || 'Details will be updated soon.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectionOrderDetails;
