import { AlertCircle, Calendar, ChevronDown, FileLock2, FileText, Loader2, Phone, PhoneCall } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetFreightOrderByIdQuery } from '@/services/freightApi';

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-3xl border border-gray-200 bg-white shadow-sm">
    <div className="border-b border-gray-100 px-6 py-4 text-sm font-semibold text-gray-600">{title}</div>
    <div className="px-6 py-5">{children}</div>
  </div>
);

const Chip = ({ label }: { label: string }) => (
  <span className="rounded-full border border-dashed border-blue-200 bg-blue-50 px-4 py-1 text-xs font-semibold text-blue-600">
    {label}
  </span>
);

const DetailInput = ({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) => (
  <div className="space-y-1">
    <div className="text-sm font-medium text-gray-500">{label}</div>
    <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">
      <span>{value || '-'}</span>
      {icon}
    </div>
  </div>
);

const TimelineButton = ({ label, icon }: { label: string; icon?: React.ReactNode }) => (
  <button className="flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700">
    {label}
    {icon}
  </button>
);

const formatDate = (iso?: string) => {
  if (!iso) return '-';
  try {
    return new Date(iso).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
};

const FreightOrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [isTimelineOpen, setIsTimelineOpen] = useState(true);

  const { data, isLoading, isError, error } = useGetFreightOrderByIdQuery(orderId as string, {
    skip: !orderId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-3 text-gray-600">Loading freight order...</span>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-gray-600 mb-4">Failed to load freight order</p>
        <p className="text-sm text-gray-400 mb-4">
          {(error as any)?.data?.message || 'Order not found or unavailable'}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white font-medium hover:bg-blue-600"
        >
          Back
        </button>
      </div>
    );
  }

  const order = data.data;

  return (
    <div className="pb-12">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
            <Chip label={order.origin?.port || order.origin?.city || 'Origin'} />
            {order.stopover && <Chip label={order.stopover.port || order.stopover.city} />}
            <Chip label={order.destination?.port || order.destination?.city || 'Destination'} />
          </div>
          <button
            onClick={() => navigate(-1)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Back
          </button>
        </div>

        <SectionCard title="Vessel & Documentation">
          <div className="grid gap-6 lg:grid-cols-4">
            <DetailInput label="Vessel Name" value={order.transport?.vesselName || '-'} />
            <DetailInput label="Shipping Line" value={order.transport?.shippingLine || '-'} />
            <DetailInput label="Transit Time" value={order.schedule?.transitTime || '-'} />
            <DetailInput label="ETA" value={formatDate(order.schedule?.estimatedArrival)} />
            <DetailInput label="ETD" value={formatDate(order.schedule?.estimatedDeparture)} />
            <DetailInput label="Cargo Ready Date" value={formatDate(order.schedule?.cargoReadyDate)} />
          </div>

          {order.documents && order.documents.length > 0 && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {order.documents.map((doc, idx) => (
                <TimelineButton key={`${doc.name}-${idx}`} label={doc.name} icon={<FileLock2 className="h-4 w-4" />} />
              ))}
            </div>
          )}

          <div className="mt-6 rounded-2xl border border-gray-200">
            <button
              onClick={() => setIsTimelineOpen((prev) => !prev)}
              className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-gray-700"
            >
              <span>Timeline</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isTimelineOpen ? 'rotate-180' : ''}`} />
            </button>
            {isTimelineOpen && (
              <div className="space-y-3 border-t border-gray-100 px-4 py-4">
                {order.communications && order.communications.length > 0 ? (
                  order.communications.map((c, idx) => (
                    <TimelineButton key={`${c.type}-${idx}`} label={`${c.type}: ${c.content}`} icon={<FileText className="h-4 w-4" />} />
                  ))
                ) : (
                  <div className="text-sm text-gray-500">No timeline events yet.</div>
                )}
              </div>
            )}
          </div>
        </SectionCard>

        <SectionCard title="Cargo Details">
          <div className="grid gap-6 lg:grid-cols-[260px,1fr]">
            <div className="space-y-3 text-sm text-gray-600">
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="text-center text-gray-500">
                  Cargo Volume : {order.cargo?.volume ? `${order.cargo.volume} m3` : '-'}
                </div>
                <div className="text-center text-gray-500">
                  Cargo Weight : {order.cargo?.weight ? `${order.cargo.weight} kg` : '-'}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <DetailInput label="Product" value={order.cargo?.product || '-'} />
                <DetailInput label="Types of Cargo" value={order.cargo?.cargoType || '-'} />
                <DetailInput
                  label="Total"
                  value={order.cargo?.packages ? `${order.cargo.packages} packages` : '-'}
                />
                <DetailInput
                  label="Cargo Volume"
                  value={order.cargo?.volume ? `${order.cargo.volume} m3` : '-'}
                />
                <DetailInput
                  label="Cargo Weight"
                  value={order.cargo?.weight ? `${order.cargo.weight} kg` : '-'}
                />
                <DetailInput label="HS Code" value={order.cargo?.hsCode || '-'} />
                <DetailInput label="Container Type" value={order.cargo?.containerType || '-'} />
                <DetailInput label="Mode" value={order.mode || '-'} />
                <DetailInput label="Priority" value={order.priority || '-'} />
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Pricing">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <DetailInput label="Freight Charges" value={`${order.pricing?.currency || ''} ${order.pricing?.freightCharges ?? '-'}`.trim()} />
            <DetailInput label="Handling Charges" value={`${order.pricing?.currency || ''} ${order.pricing?.handlingCharges ?? '-'}`.trim()} />
            <DetailInput label="Customs Duty" value={`${order.pricing?.currency || ''} ${order.pricing?.customsDuty ?? '-'}`.trim()} />
            <DetailInput label="Insurance" value={`${order.pricing?.currency || ''} ${order.pricing?.insurance ?? '-'}`.trim()} />
            <DetailInput label="Additional Charges" value={`${order.pricing?.currency || ''} ${order.pricing?.additionalCharges ?? '-'}`.trim()} />
            <DetailInput label="Discount" value={`${order.pricing?.currency || ''} ${order.pricing?.discount ?? '-'}`.trim()} />
            <DetailInput label="Total" value={`${order.pricing?.currency || ''} ${order.pricing?.total ?? '-'}`.trim()} />
          </div>
        </SectionCard>

        <SectionCard title="Contact & Customer Info">
          <div className="grid gap-6 md:grid-cols-2">
            <DetailInput
              label="Customer"
              value={order.customer?.name || '-'}
              icon={
                <div className="flex gap-2">
                  <button className="rounded-full border border-gray-300 p-2 text-gray-500 hover:bg-gray-50">
                    <Phone className="h-4 w-4" />
                  </button>
                  <button className="rounded-full border border-gray-300 p-2 text-gray-500 hover:bg-gray-50">
                    <PhoneCall className="h-4 w-4" />
                  </button>
                </div>
              }
            />
            <DetailInput label="Company" value={order.customer?.companyName || '-'} />
            <DetailInput label="Phone" value={order.customer?.phone || '-'} />
            <DetailInput label="Email" value={order.customer?.email || '-'} />
            <DetailInput
              label="Address"
              value={order.customer?.address || '-'}
              icon={<Calendar className="h-4 w-4 text-gray-500" />}
            />
          </div>

          {order.notes && (
            <div className="mt-4 space-y-2">
              <div className="text-sm font-semibold text-gray-600">Note :</div>
              <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-sm text-gray-500">
                {order.notes}
              </div>
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
};

export default FreightOrderDetails;
