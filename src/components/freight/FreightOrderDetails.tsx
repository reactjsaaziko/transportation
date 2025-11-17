import { Calendar, ChevronDown, FileLock2, FileText, Phone, PhoneCall } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { freightOrders } from './freightData';

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
      <span>{value}</span>
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

const FreightOrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [isTimelineOpen, setIsTimelineOpen] = useState(true);

  const order = useMemo(() => freightOrders.find((item) => item.id === orderId), [orderId]);

  if (!order) {
    return <div className="py-20 text-center text-gray-500">Freight order not found.</div>;
  }

  return (
    <div className="pb-12">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
            <Chip label={order.origin} />
            {order.stopover && <Chip label={order.stopover} />}
            <Chip label={order.destination} />
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
            <DetailInput label="Vessel Name" value={order.vesselName} />
            <DetailInput label="Shipping Line" value={order.shippingLine} />
            <DetailInput label="Transit Time" value={order.transitTime} />
            <DetailInput label="ETA" value="28/05/2023" />
            <DetailInput label="ETA" value="01/05/2023" />
            <DetailInput label="Cutoff Date" value="05/05/2023" />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <TimelineButton label="BL Upload" icon={<FileLock2 className="h-4 w-4" />} />
            <TimelineButton label="Invoice Packing" icon={<FileText className="h-4 w-4" />} />
            <TimelineButton label="Booking Receipt" icon={<FileLock2 className="h-4 w-4" />} />
            <TimelineButton label="Shipping Instruction" icon={<FileText className="h-4 w-4" />} />
          </div>

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
                <TimelineButton label="Booking Receipt" icon={<FileLock2 className="h-4 w-4" />} />
                <TimelineButton label="BL Draft" icon={<FileText className="h-4 w-4" />} />
                <TimelineButton label="BL For Checking" icon={<FileLock2 className="h-4 w-4" />} />
                <TimelineButton label="BL" icon={<FileLock2 className="h-4 w-4" />} />
              </div>
            )}
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <DetailInput
              label="Document Handover"
              value="14 Jan, 2023"
              icon={<Calendar className="h-4 w-4 text-gray-500" />}
            />
            <TimelineButton label="Upload Invoice" icon={<FileLock2 className="h-4 w-4" />} />
            <TimelineButton label="Payment Receipt" icon={<FileText className="h-4 w-4" />} />
          </div>
        </SectionCard>

        <SectionCard title="Tautliner (Curainsider) #Pick Up 1">
          <div className="grid gap-6 lg:grid-cols-[260px,1fr]">
            <div className="space-y-3 text-sm text-gray-600">
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="text-center text-gray-500">Cargo Volume : 29.50 m3</div>
                <div className="text-center text-gray-500">Cargo Weight : 14,500.00 kg</div>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm text-center text-gray-500">
                Chart Placeholder
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <DetailInput label="Product" value={order.product} />
                <DetailInput label="Types of Cargo" value={order.cargoType} />
                <DetailInput label="Total" value={order.totalPackages} />
                <DetailInput label="Cargo Volume" value={`${order.cargoVolume} (32% volume)`} />
                <DetailInput label="Cargo Weight" value={`${order.cargoWeight} (1% of max weight)`} />
              </div>

              <div className="overflow-hidden rounded-2xl border border-gray-200">
                <table className="min-w-full text-sm text-gray-700">
                  <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Packages</th>
                      <th className="px-4 py-3 text-left">Size</th>
                      <th className="px-4 py-3 text-left">Weight</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-gray-200">
                      <td className="px-4 py-3">Big Bags</td>
                      <td className="px-4 py-3">10</td>
                      <td className="px-4 py-3">10*50*60cm</td>
                      <td className="px-4 py-3">9000.00 kg</td>
                    </tr>
                    <tr className="border-t border-gray-200">
                      <td className="px-4 py-3">Sacks</td>
                      <td className="px-4 py-3">100</td>
                      <td className="px-4 py-3">50*110*90cm</td>
                      <td className="px-4 py-3">4500.00 kg</td>
                    </tr>
                    <tr className="border-t border-gray-200">
                      <td className="px-4 py-3">Boxes</td>
                      <td className="px-4 py-3">100</td>
                      <td className="px-4 py-3">20*20*50cm</td>
                      <td className="px-4 py-3">1000.00 kg</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Tautliner (Curainsider) #Pick Up 2">
          <div className="space-y-4 text-sm text-gray-600">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <DetailInput label="Product" value="Tea" />
              <DetailInput label="Types of Cargo" value="Normal Container Cargo" />
              <DetailInput label="Total" value="360 packages" />
              <DetailInput label="Cargo Volume" value="42.25 m3 (32% volume)" />
              <DetailInput label="Cargo Weight" value="17,500.00 kg (1% of max weight)" />
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200">
              <table className="min-w-full text-sm text-gray-700">
                <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Packages</th>
                    <th className="px-4 py-3 text-left">Size</th>
                    <th className="px-4 py-3 text-left">Weight</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-200">
                    <td className="px-4 py-3">Big Bags</td>
                    <td className="px-4 py-3">10</td>
                    <td className="px-4 py-3">10*50*60cm</td>
                    <td className="px-4 py-3">9000.00 kg</td>
                  </tr>
                  <tr className="border-t border-gray-200">
                    <td className="px-4 py-3">Sacks</td>
                    <td className="px-4 py-3">150</td>
                    <td className="px-4 py-3">50*110*90cm</td>
                    <td className="px-4 py-3">6750.00 kg</td>
                  </tr>
                  <tr className="border-t border-gray-200">
                    <td className="px-4 py-3">Boxes</td>
                    <td className="px-4 py-3">200</td>
                    <td className="px-4 py-3">20*20*50cm</td>
                    <td className="px-4 py-3">2000.00 kg</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Contact & Factory Info">
          <div className="grid gap-6 md:grid-cols-2">
            <DetailInput
              label="Admin Contact Person"
              value="Aaziko"
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
            <DetailInput
              label="Factory Address"
              value="34, katargam GIDC, Surat"
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
          </div>

          <div className="mt-4 space-y-2">
            <div className="text-sm font-semibold text-gray-600">Note :</div>
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-sm text-gray-500">
              Factory Stuffing
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default FreightOrderDetails;
