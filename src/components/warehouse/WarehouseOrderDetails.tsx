import {
  Calendar,
  Copy,
  Download,
  MapPin,
  Phone,
  PhoneCall,
  Truck,
  User,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface DonutSegment {
  value: number;
  color: string;
}

interface ShipmentBreakdownItem {
  name: string;
  packages: string;
  size: string;
  weight: string;
  color: string;
}

export interface WarehouseShipment {
  id: string;
  title: string;
  product: string;
  cargoType: string;
  total: string;
  cargoVolume: string;
  cargoWeight: string;
  image: string;
  chartSegments: DonutSegment[];
  breakdown: ShipmentBreakdownItem[];
}

export interface WarehouseOrderDetail {
  id: string;
  orderReference: string;
  warehouseName: string;
  associatePersonName: string;
  contactNumber: string;
  cargoArrivalDate: string;
  transporter: {
    driverName: string;
    contactNumber: string;
    vehicleNumber: string;
  };
  cargoSummary: {
    weight: string;
    volume: string;
  };
  shipments: WarehouseShipment[];
  receivedFrom: {
    title: string;
    companyName: string;
    contactPersonName: string;
    address: string;
    contactNumber: string;
  };
}

interface WarehouseOrderDetailsProps {
  detail: WarehouseOrderDetail;
  onBack: () => void;
}

const DonutChart = ({ segments }: { segments: DonutSegment[] }) => {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  let cumulative = 0;

  return (
    <div className="relative flex items-center justify-center">
      <svg viewBox="0 0 36 36" className="h-28 w-28 -rotate-90">
        <circle cx="18" cy="18" r={radius} fill="transparent" stroke="#E5E7EB" strokeWidth="4" />
        {segments.map((segment, index) => {
          const segmentLength = (segment.value / total) * circumference;
          const dashArray = `${segmentLength} ${circumference}`;
          const dashOffset = -(cumulative / total) * circumference;
          cumulative += segment.value;

          return (
            <circle
              key={`${segment.color}-${index}`}
              cx="18"
              cy="18"
              r={radius}
              fill="transparent"
              stroke={segment.color}
              strokeWidth="4"
              strokeDasharray={dashArray}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
            />
          );
        })}
        <circle cx="18" cy="18" r="11" fill="white" />
      </svg>
      <div className="absolute text-xs font-semibold text-gray-600">Load</div>
    </div>
  );
};

const InfoCard = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: LucideIcon;
}) => (
  <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.08)]">
    {Icon ? (
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E3F2FD] text-[#2F80ED]">
        <Icon className="h-4 w-4" />
      </span>
    ) : null}
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
      <p className="text-sm font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);

const WarehouseOrderDetails = ({ detail, onBack }: WarehouseOrderDetailsProps) => {
  const topInfo = [
    {
      label: 'Associate Person Name',
      value: detail.associatePersonName,
      icon: User,
    },
    {
      label: 'Contact Number',
      value: detail.contactNumber,
      icon: Phone,
    },
    {
      label: 'Cargo Arrival Date',
      value: detail.cargoArrivalDate,
      icon: Calendar,
    },
  ];

  const transporterInfo = [
    {
      label: 'Driver Name',
      value: detail.transporter.driverName,
    },
    {
      label: 'Contact Number',
      value: detail.transporter.contactNumber,
    },
    {
      label: 'Vehicle Number',
      value: detail.transporter.vehicleNumber,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-8">
      <div className="rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-6 md:p-8">
          <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-500">
                    <Truck className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{detail.warehouseName}</p>
                    <p className="text-xs font-medium text-gray-500">Order #{detail.orderReference}</p>
                  </div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Weight :</span>
                    <span className="font-semibold text-gray-900">{detail.cargoSummary.weight}</span>
                  </div>
                  <div className="my-3 h-px border-t border-dashed border-gray-200" />
                  <div className="flex items-center justify-between">
                    <span>Volume :</span>
                    <span className="font-semibold text-gray-900">{detail.cargoSummary.volume}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {topInfo.map((info) => (
                  <InfoCard key={info.label} label={info.label} value={info.value} icon={info.icon} />
                ))}
              </div>

              <div className="rounded-2xl border border-gray-200 px-4 py-4 md:px-6 md:py-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Transporter Details</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  {transporterInfo.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900"
                    >
                      <div className="text-[11px] font-medium uppercase tracking-wide text-gray-400">{item.label}</div>
                      <div className="mt-1 text-sm text-gray-700">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8 p-6 md:p-8">
          {detail.shipments.map((shipment) => {
            const detailRows = [
              { label: 'Product', value: shipment.product },
              { label: 'Types of Cargo', value: shipment.cargoType },
              { label: 'Total', value: shipment.total },
              { label: 'Cargo Volume', value: shipment.cargoVolume },
              { label: 'Cargo Weight', value: shipment.cargoWeight },
            ];

            return (
              <section
                key={shipment.id}
                className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8"
              >
                <header className="text-sm font-semibold text-gray-900">{shipment.title}</header>

                <div className="mt-4 grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
                  <div className="flex items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 p-6">
                    <img src={shipment.image} alt={shipment.title} className="h-28 w-full object-contain" />
                  </div>

                  <div className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
                    {detailRows.map((row) => (
                      <div key={`${shipment.id}-${row.label}`} className="flex items-center gap-4 text-sm text-gray-700">
                        <span className="text-gray-500">{row.label} :</span>
                        <span className="h-6 border-l border-dashed border-gray-300" />
                        <span className="font-semibold text-gray-900">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="my-6 h-px border-t border-dashed border-gray-200" />

                <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
                  <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-6">
                    <DonutChart segments={shipment.chartSegments} />
                    <div className="text-sm font-semibold text-gray-700">Load Distribution</div>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-gray-200">
                    <div className="grid grid-cols-4 border-b border-gray-200 bg-gray-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      <span>Name</span>
                      <span className="text-center">Packages</span>
                      <span className="text-center">Size</span>
                      <span className="text-right">Weight</span>
                    </div>
                    {shipment.breakdown.map((item, index) => (
                      <div
                        key={`${shipment.id}-${item.name}`}
                        className={`grid grid-cols-4 items-center px-4 py-3 text-sm text-gray-700 ${
                          index !== shipment.breakdown.length - 1 ? 'border-b border-gray-200' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2 font-medium text-gray-900">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                          {item.name}
                        </div>
                        <span className="text-center font-semibold text-gray-900">{item.packages}</span>
                        <span className="text-center text-gray-600">{item.size}</span>
                        <span className="text-right font-semibold text-gray-900">{item.weight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          })}

          <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
            <header className="text-sm font-semibold text-gray-900">{detail.receivedFrom.title}</header>

            <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_240px]">
              <div className="space-y-4">
                {[
                  { label: 'Company Name', value: detail.receivedFrom.companyName },
                  { label: 'Contact Person Name', value: detail.receivedFrom.contactPersonName },
                  { label: 'Address', value: detail.receivedFrom.address, withIcon: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4 text-sm text-gray-700">
                    <span className="min-w-[160px] text-gray-500">{item.label} :</span>
                    <span className="h-6 border-l border-dashed border-gray-300" />
                    <span className="flex items-center gap-2 font-semibold text-gray-900">
                      {item.value}
                      {item.withIcon ? (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-500">
                          <MapPin className="h-3.5 w-3.5" />
                        </span>
                      ) : null}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col justify-between gap-4">
                <div className="space-y-4 text-sm text-gray-700">
                  <div className="flex items-center gap-4">
                    <span className="min-w-[60px] text-gray-500">Contact :</span>
                    <span className="h-6 border-l border-dashed border-gray-300" />
                    <span className="font-semibold text-gray-900">{detail.receivedFrom.contactNumber}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                  <button className="flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50">
                    <PhoneCall className="h-4 w-4" />
                    Call
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-gray-100 px-6 py-6 md:px-8">
          <button className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50">
            <Download className="h-4 w-4" />
            Export to PDF
          </button>
          <button className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50">
            <Copy className="h-4 w-4" />
            Copy request
          </button>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarehouseOrderDetails;
