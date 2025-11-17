import { useState } from 'react';
import {
  Calendar,
  Phone,
  Truck,
  User,
  Upload,
  FileCheck,
  Send,
  Warehouse,
  MapPin,
  PhoneCall,
  FileText,
} from 'lucide-react';

interface DonutSegment {
  value: number;
  color: string;
}

interface CargoBreakdownItem {
  name: string;
  packages: string;
  size: string;
  weight: string;
  color: string;
}

interface CargoPickup {
  id: string;
  title: string;
  product: string;
  cargoType: string;
  total: string;
  cargoVolume: string;
  cargoWeight: string;
  image: string;
  chartSegments: DonutSegment[];
  breakdown: CargoBreakdownItem[];
}

interface WarehouseCurrentOrderData {
  id: string;
  orderReference: string;
  warehouseName: string;
  weight: string;
  volume: string;
  associatePersonName: string;
  contactNumber: string;
  cargoArrivalDate: string;
  transporter: {
    driverName: string;
    contactNumber: string;
    vehicleNumber: string;
    inDate: string;
    inTime: string;
    receiverBy: string;
  };
  despatchTransporter: {
    driverName: string;
    contactNumber: string;
    vehicleNumber: string;
    outDate: string;
    outTime: string;
    despatchBy: string;
  };
  cargoPickups: CargoPickup[];
  receivedFrom: {
    title: string;
    companyName: string;
    contactPersonName: string;
    address: string;
    contactNumber: string;
  };
}

interface WarehouseCurrentOrderDetailsProps {
  data: WarehouseCurrentOrderData;
  onBack: () => void;
}

type TabType = 'yet-to-confirm' | 'current' | 'upcoming' | 'completed';

const DonutChart = ({ segments }: { segments: DonutSegment[] }) => {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  let cumulative = 0;

  return (
    <div className="relative flex items-center justify-center">
      <svg viewBox="0 0 36 36" className="h-32 w-32 -rotate-90">
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
    </div>
  );
};

const WarehouseCurrentOrderDetails = ({ data, onBack }: WarehouseCurrentOrderDetailsProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('current');

  const tabs: { id: TabType; label: string }[] = [
    { id: 'yet-to-confirm', label: 'Yet to confirm' },
    { id: 'current', label: 'Current' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'completed', label: 'Completed' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-8">
      <div className="rounded-3xl border border-gray-200 bg-white shadow-sm">
        {/* Tabs Header */}
        <div className="border-b border-gray-200 px-6 py-4 md:px-8">
          <div className="flex flex-wrap gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-lg px-5 py-2 text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 md:p-8">
          <div className="grid gap-6 lg:grid-cols-[200px_minmax(0,1fr)]">
            {/* Warehouse Info Sidebar */}
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white">
                  <Warehouse className="h-8 w-8 text-gray-700" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{data.warehouseName}</p>
                </div>
                <div className="w-full space-y-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm">
                  <div className="flex items-center justify-between text-gray-600">
                    <span className="text-xs">Weight :</span>
                    <span className="font-semibold text-gray-900">{data.weight}</span>
                  </div>
                  <div className="h-px border-t border-dashed border-gray-200" />
                  <div className="flex items-center justify-between text-gray-600">
                    <span className="text-xs">Volume :</span>
                    <span className="font-semibold text-gray-900">{data.volume}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="space-y-6">
              {/* Top Row - Associate & Contact */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={data.associatePersonName}
                      placeholder="Associate Person Name"
                      className="flex-1 text-sm font-medium text-gray-900 outline-none placeholder:text-gray-400"
                      readOnly
                    />
                  </div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={data.contactNumber}
                      placeholder="Contact Number"
                      className="flex-1 text-sm font-medium text-gray-900 outline-none placeholder:text-gray-400"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* Cargo Arrival Date */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-700">Cargo Arrival Date :</label>
                <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={data.cargoArrivalDate}
                      className="flex-1 text-sm font-medium text-gray-900 outline-none"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* Transporter Details */}
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Transporter Details :
                </h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={data.transporter.driverName}
                        placeholder="Driver Name"
                        className="flex-1 text-sm font-medium text-gray-900 outline-none placeholder:text-gray-400"
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={data.transporter.contactNumber}
                        placeholder="Contact Number"
                        className="flex-1 text-sm font-medium text-gray-900 outline-none placeholder:text-gray-400"
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Truck className="h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={data.transporter.vehicleNumber}
                        placeholder="Vehicle Number"
                        className="flex-1 text-sm font-medium text-gray-900 outline-none placeholder:text-gray-400"
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                {/* In Date, Time, Receiver */}
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-xs font-medium text-gray-500">In Date :</label>
                    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          value={data.transporter.inDate}
                          placeholder="Driver Name"
                          className="flex-1 text-sm font-medium text-gray-900 outline-none placeholder:text-gray-400"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-gray-500">Time</label>
                    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                      <input
                        type="text"
                        value={data.transporter.inTime}
                        placeholder="9:00 PM"
                        className="w-full text-sm font-medium text-gray-900 outline-none placeholder:text-gray-400"
                        readOnly
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-gray-500">Receiver By</label>
                    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                      <input
                        type="text"
                        value={data.transporter.receiverBy}
                        placeholder="Name"
                        className="w-full text-sm font-medium text-gray-900 outline-none placeholder:text-gray-400"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Document & Image - Received */}
              <div>
                <h3 className="mb-3 text-xs font-semibold text-gray-700">Document & Image</h3>
                <div className="flex flex-wrap gap-4">
                  <button className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                    <Upload className="h-4 w-4" />
                    Upload Photo
                  </button>
                  <button className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                    <FileCheck className="h-4 w-4" />
                    Document Recieved
                  </button>
                </div>
              </div>

              {/* Document & Image - Dispatch */}
              <div>
                <h3 className="mb-3 text-xs font-semibold text-gray-700">Document & Image</h3>
                <div className="flex flex-wrap gap-4">
                  <button className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                    <Upload className="h-4 w-4" />
                    Upload Photo
                  </button>
                  <button className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                    <Send className="h-4 w-4" />
                    Document Dispatch
                  </button>
                </div>
              </div>

              {/* Despatch Transporter Details */}
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Despatch Transporter Details :
                </h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={data.despatchTransporter.driverName}
                        placeholder="Driver Name"
                        className="flex-1 text-sm font-medium text-gray-900 outline-none placeholder:text-gray-400"
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={data.despatchTransporter.contactNumber}
                        placeholder="Contact Number"
                        className="flex-1 text-sm font-medium text-gray-900 outline-none placeholder:text-gray-400"
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Truck className="h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={data.despatchTransporter.vehicleNumber}
                        placeholder="Vehicle Number"
                        className="flex-1 text-sm font-medium text-gray-900 outline-none placeholder:text-gray-400"
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                {/* Out Date, Time, Despatch By */}
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-xs font-medium text-gray-500">Out Date :</label>
                    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          value={data.despatchTransporter.outDate}
                          placeholder="Driver Name"
                          className="flex-1 text-sm font-medium text-gray-900 outline-none placeholder:text-gray-400"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-gray-500">Time</label>
                    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                      <input
                        type="text"
                        value={data.despatchTransporter.outTime}
                        placeholder="9:00 PM"
                        className="w-full text-sm font-medium text-gray-900 outline-none placeholder:text-gray-400"
                        readOnly
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-gray-500">Despatch By</label>
                    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                      <input
                        type="text"
                        value={data.despatchTransporter.despatchBy}
                        placeholder="Name"
                        className="w-full text-sm font-medium text-gray-900 outline-none placeholder:text-gray-400"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cargo Pickup Cards */}
          <div className="mt-8 space-y-8">
            {data.cargoPickups.map((pickup) => (
              <div key={pickup.id} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-6 text-sm font-semibold text-gray-900">{pickup.title}</h3>

                <div className="grid gap-6 lg:grid-cols-[200px_minmax(0,1fr)]">
                  {/* 3D Cargo Image */}
                  <div className="flex items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 p-6">
                    <img src={pickup.image} alt={pickup.title} className="h-24 w-full object-contain" />
                  </div>

                  {/* Cargo Details Grid */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-gray-500">Product :</span>
                      <span className="h-6 border-l border-dashed border-gray-300" />
                      <span className="font-semibold text-gray-900">{pickup.product}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-gray-500">Types of Cargo :</span>
                      <span className="h-6 border-l border-dashed border-gray-300" />
                      <span className="font-semibold text-gray-900">{pickup.cargoType}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-gray-500">Total :</span>
                      <span className="h-6 border-l border-dashed border-gray-300" />
                      <span className="font-semibold text-gray-900">{pickup.total}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-gray-500">Cargo Volume :</span>
                      <span className="h-6 border-l border-dashed border-gray-300" />
                      <span className="font-semibold text-gray-900">{pickup.cargoVolume}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm sm:col-span-2">
                      <span className="text-gray-500">Cargo Weight :</span>
                      <span className="h-6 border-l border-dashed border-gray-300" />
                      <span className="font-semibold text-gray-900">{pickup.cargoWeight}</span>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="my-6 h-px border-t border-dashed border-gray-200" />

                {/* Chart and Breakdown Table */}
                <div className="grid gap-6 lg:grid-cols-[200px_minmax(0,1fr)]">
                  {/* Donut Chart */}
                  <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-6">
                    <DonutChart segments={pickup.chartSegments} />
                  </div>

                  {/* Breakdown Table */}
                  <div className="overflow-hidden rounded-2xl border border-gray-200">
                    <div className="grid grid-cols-4 border-b border-gray-200 bg-gray-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      <span>Name</span>
                      <span className="text-center">Packages</span>
                      <span className="text-center">Size</span>
                      <span className="text-right">Weight</span>
                    </div>
                    {pickup.breakdown.map((item, index) => (
                      <div
                        key={`${pickup.id}-${item.name}`}
                        className={`grid grid-cols-4 items-center px-4 py-3 text-sm ${
                          index !== pickup.breakdown.length - 1 ? 'border-b border-gray-200' : ''
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
              </div>
            ))}
          </div>

          {/* Received From Section */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-sm font-semibold text-gray-900">{data.receivedFrom.title}</h3>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_240px]">
              {/* Left Side - Company Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <span className="min-w-[180px] text-gray-500">Company Name :</span>
                  <span className="h-6 border-l border-dashed border-gray-300" />
                  <span className="font-semibold text-gray-900">{data.receivedFrom.companyName}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="min-w-[180px] text-gray-500">Contact Person Name :</span>
                  <span className="h-6 border-l border-dashed border-gray-300" />
                  <span className="font-semibold text-gray-900">{data.receivedFrom.contactPersonName}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="min-w-[180px] text-gray-500">Address :</span>
                  <span className="h-6 border-l border-dashed border-gray-300" />
                  <span className="flex items-center gap-2 font-semibold text-gray-900">
                    {data.receivedFrom.address}
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-500">
                      <MapPin className="h-3.5 w-3.5" />
                    </span>
                  </span>
                </div>
              </div>

              {/* Right Side - Contact & Actions */}
              <div className="flex flex-col justify-between gap-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="min-w-[70px] text-gray-500">Contact :</span>
                    <span className="h-6 border-l border-dashed border-gray-300" />
                    <span className="font-semibold text-gray-900">{data.receivedFrom.contactNumber}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                  <button className="flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50">
                    <PhoneCall className="h-4 w-4" />
                    Call
                  </button>
                  <button className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50">
                    <span className="text-lg">⋮</span>
                  </button>
                </div>
              </div>
            </div>

            {/* More Details Link */}
            <div className="mt-4 flex justify-end">
              <button className="text-sm font-medium text-gray-500 transition hover:text-gray-700">
                More Details
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-center gap-3 border-t border-gray-200 px-6 py-6 md:px-8">
          <button className="flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600">
            <FileText className="h-4 w-4" />
            Export to PDF
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50">
            Copy request
          </button>
          <button
            onClick={onBack}
            className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarehouseCurrentOrderDetails;
