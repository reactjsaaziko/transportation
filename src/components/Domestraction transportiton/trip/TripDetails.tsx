import { useState } from 'react';

import {
  Download,
  Calendar,
  Phone,
  User,
  ChevronDown,
  MapPinned,
  BadgeCheck,
  PhoneCall,
  Headset,
  MapPin,
  UploadCloud,
} from 'lucide-react';

interface TripDetailsProps {
  trip: {
    id: string;
    orderId?: string;
    tripId?: string;
    fromLocation: string;
    toLocation: string;
    viaLocation: string;
    date: string;
    product: string;
    goodsType: string;
    total: string;
    coast: string;
    price?: string;
    tripKm: string;
    cargoWeight: string;
    cargoVolume: string;
    status: string;
    invoiceStatus?: 'Pending' | 'Payment Transfer';
  };
  onBack: () => void;
}

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

interface CargoCard {
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

interface ContactCardDetails {
  id: string;
  title: string;
  companyName: string;
  contactName: string;
  address: string;
  pickUpTime: string;
  pickDate: string;
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

const TripDetails = ({ trip, onBack }: TripDetailsProps) => {
  const [isMapView, setIsMapView] = useState(false);

  const mapUrl =
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31584016.687183045!2d64.51087039262779!3d20.427107855573566!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30635ff6c09bfb31%3A0x62c0a0e6d0ba5d7b!2sIndia!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin';

  if (isMapView) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-8">
        <div className="rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="relative overflow-hidden rounded-3xl">
            <iframe
              title="Route Map"
              src={mapUrl}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[420px] w-full border-0"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/25 via-black/10 to-transparent" />
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setIsMapView(false)}
            className="rounded-lg border border-gray-300 px-10 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  const travelStops = [
    {
      id: 'A',
      label: 'Pick Up 1',
      value: trip.fromLocation,
    },
    {
      id: 'B',
      label: 'Pick Up 2',
      value: trip.toLocation,
    },
    {
      id: 'C',
      label: 'Drop 1',
      value: trip.viaLocation,
    },
    {
      id: 'D',
      label: 'Drop 2',
      value: trip.viaLocation,
    },
  ];

  const infoCards = [
    {
      label: 'Driver Name',
      value: 'Rameshbhai patel',
      icon: User,
    },
    {
      label: 'Order ID',
      value: trip.tripId || trip.orderId,
      icon: MapPinned,
    },
    {
      label: 'Vehicle Number',
      value: 'GJ-05-SM-2525',
      icon: BadgeCheck,
    },
    {
      label: 'Contact',
      value: '+91 989898 0505',
      icon: Phone,
    },
    {
      label: 'Trip Date',
      value: '14 Jan, 2023',
      icon: Calendar,
    },
  ];

  const cargoCards: CargoCard[] = [
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
        { name: 'Big bags', packages: '10', size: '10*50*60cm', weight: '9000.00 kg', color: '#2F80ED' },
        { name: 'Sacks', packages: '100', size: '50*10*90cm', weight: '4500.00 kg', color: '#8B5CF6' },
        { name: 'Boxes 1', packages: '100', size: '20*20*50cm', weight: '1000.00 kg', color: '#F97316' },
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
        { name: 'Big bags', packages: '10', size: '10*50*60cm', weight: '9000.00 kg', color: '#2F80ED' },
        { name: 'Sacks', packages: '150', size: '50*10*90cm', weight: '6750.00 kg', color: '#8B5CF6' },
        { name: 'Boxes 1', packages: '200', size: '20*20*50cm', weight: '2000.00 kg', color: '#F97316' },
      ],
    },
  ];

  const contactCards: ContactCardDetails[] = [
    {
      id: 'pickup-info',
      title: '#Pick Up 1',
      companyName: 'Aaziko',
      contactName: 'Rajesh bhai',
      address: 'Okha Port',
      pickUpTime: '23:00',
      pickDate: '14 Jan 2023',
    },
    {
      id: 'drop-info',
      title: '#Drop',
      companyName: 'Aaziko',
      contactName: 'Rajesh bhai',
      address: 'Okha Port',
      pickUpTime: '23:00',
      pickDate: '14 Jan 2023',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-8">
      {/* Tabs */}
      <div className="mt-2 mb-6 flex flex-wrap items-center gap-3">
        {['Yet to confirm', 'Current', 'Upcoming', 'Completed'].map((tab) => {
          const isActive = tab === 'Current';
          return (
            <button
              key={tab}
              className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Main Content Card */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        {/* Top Section */}
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Vehicle Info */}
          <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5 lg:w-64 xl:w-72">
            <div className="text-sm font-medium text-gray-700">Tautliner ( Curainsider )</div>
            <div className="mt-5 flex items-center justify-center">
              <div className="h-28 w-36 rounded-xl bg-gray-100">
                <img
                  src="/images/1.png"
                  alt="Vehicle"
                  className="h-full w-full object-contain p-3"
                />
              </div>
            </div>
            <div className="mt-4 text-center text-xs font-medium text-gray-600">1 Unit</div>
            <div className="mt-4 space-y-2 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Cargo Volume</span>
                <span className="font-semibold text-gray-800">29.50 m3</span>
              </div>
              <div className="flex justify-between">
                <span>Cargo Weight</span>
                <span className="font-semibold text-gray-800">14500.00 kg</span>
              </div>
            </div>
          </div>

          {/* Info Cards */}
          <div className="flex-1">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {infoCards.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.08)]"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E3F2FD] text-[#2F80ED]">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
                    <p className="text-sm font-semibold text-gray-900">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-gray-100" />

        {/* Your Trip Section */}
        <div>
          <h3 className="text-base font-semibold text-gray-900">Your Trip</h3>
          <p className="mt-1 text-xs uppercase tracking-wide text-gray-400">
            Route & Stops
          </p>

          <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
              {travelStops.map((stop, index) => (
                <div key={stop.id} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2F80ED]/10 text-sm font-semibold text-[#2F80ED]">
                    {stop.id}
                  </div>
                  <div className="min-w-[150px] rounded-xl border border-gray-200 bg-white px-4 py-3">
                    <div className="flex items-center justify-between text-xs font-medium text-gray-400">
                      {stop.label}
                      <ChevronDown className="h-3.5 w-3.5 text-gray-300" />
                    </div>
                    <div className="mt-1 text-sm font-semibold text-gray-900">{stop.value}</div>
                  </div>
                  {index !== travelStops.length - 1 && (
                    <span className="hidden h-px flex-1 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 sm:block" />
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsMapView(true)}
              className="self-start rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition hover:bg-gray-50"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E3F2FD] text-[#2F80ED]">
                <MapPinned className="h-5 w-5" />
              </span>
            </button>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="mt-10">
          <div className="flex items-center gap-2 text-base font-semibold text-gray-900">
            <span>Timeline :</span>
            <ChevronDown className="h-4 w-4" />
          </div>

          <div className="mt-4 space-y-3">
            <button className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
              <span>Invoice / Packing List</span>
              <Download className="h-4 w-4 text-gray-500" />
            </button>
            <button className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
              <span>E- Way Bill</span>
              <Download className="h-4 w-4 text-gray-500" />
            </button>
          </div>

          {/* Trip Milestones */}
          <div className="mt-8 space-y-6">
            <div>
              <div className="flex items-center gap-3 text-sm font-semibold text-gray-900">
                <span>Pick 1</span>
                <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Uploaded By Driver
                </span>
              </div>
              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-4">
                <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  14 Jan, 2023
                </div>
                <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700">
                  22:00 PM
                </div>
                <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700">
                  Handover By
                </div>
                <button className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                  Upload Image
                  <UploadCloud className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold text-gray-900">Pick Up 2</div>
              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-4">
                <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  14 Jan, 2023
                </div>
                <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700">
                  24:00 PM
                </div>
                <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700">
                  Handover By
                </div>
                <button className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                  Upload Image
                  <UploadCloud className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold text-gray-900">Drop</div>
              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-4">
                <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  18 Jan, 2023
                </div>
                <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700">
                  22:00 PM
                </div>
                <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700">
                  Handover To
                </div>
                <button className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                  Upload Image
                  <UploadCloud className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice & Payment */}
        <div className="mt-10 space-y-6">
          <div>
            <div className="text-sm font-semibold text-gray-900">Invoice</div>
            <button className="mt-3 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
              Upload Invoice
              <UploadCloud className="h-4 w-4 text-gray-500" />
            </button>
          </div>

          <div>
            <div className="text-sm font-semibold text-gray-900">Payment Receipt</div>
            <button className="mt-3 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
              Payment Receipt
              <Download className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Cargo Summary */}
        <div className="mt-10 space-y-8">
          {cargoCards.map((card) => {
            const detailRows = [
              { label: 'Product', value: card.product },
              { label: 'Types of Cargo', value: card.cargoType },
              { label: 'Total', value: card.total },
              { label: 'Cargo Volume', value: card.cargoVolume },
              { label: 'Cargo Weight', value: card.cargoWeight },
            ];

            return (
              <div
                key={card.id}
                className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8"
              >
                <div className="text-sm font-semibold text-gray-900">{card.title}</div>

                <div className="mt-4 grid gap-6 lg:grid-cols-[220px_auto]">
                  <div className="flex items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <img src={card.image} alt={card.title} className="h-28 w-full object-contain" />
                  </div>

                  <div className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
                    {detailRows.map((row) => (
                      <div key={row.label} className="flex items-center gap-4 text-sm text-gray-700">
                        <span className="text-gray-500">{row.label} :</span>
                        <span className="h-6 border-l border-dashed border-gray-300" />
                        <span className="font-semibold text-gray-900">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="my-6 h-px border-t border-dashed border-gray-200" />

                <div className="grid gap-6 lg:grid-cols-[220px_auto]">
                  <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <DonutChart segments={card.chartSegments} />
                    <div className="text-sm font-semibold text-gray-700">Load Distribution</div>
                  </div>

                  <div className="rounded-2xl border border-gray-200">
                    <div className="grid grid-cols-4 border-b border-gray-200 bg-gray-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      <span>Name</span>
                      <span className="text-center">Packages</span>
                      <span className="text-center">Size</span>
                      <span className="text-right">Weight</span>
                    </div>
                    {card.breakdown.map((item, index) => (
                      <div
                        key={`${card.id}-${item.name}`}
                        className={`grid grid-cols-4 items-center px-4 py-3 text-sm text-gray-700 ${
                          index !== card.breakdown.length - 1 ? 'border-b border-gray-200' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2 font-medium text-gray-900">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
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
            );
          })}
        </div>

        {/* Pick-up / Drop-Off Contacts */}
        <div className="mt-10 space-y-6">
          {contactCards.map((card) => (
            <div key={card.id} className="space-y-4">
              <div className="text-sm font-semibold text-gray-900">{card.title}</div>
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(220px,280px)]">
                  <div className="space-y-4">
                    {[{
                      label: 'Company Name',
                      value: card.companyName,
                    },
                    {
                      label: 'Contact Person Name',
                      value: card.contactName,
                    },
                    {
                      label: 'Address',
                      value: card.address,
                      withIcon: true,
                    }].map((item) => (
                      <div key={`${card.id}-${item.label}`} className="flex items-center gap-4 text-sm text-gray-700">
                        <span className="min-w-[160px] text-gray-500">{item.label} :</span>
                        <span className="h-6 border-l border-dashed border-gray-300" />
                        <span className="flex items-center gap-2 font-semibold text-gray-900">
                          {item.value}
                          {item.withIcon && (
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-500">
                              <MapPin className="h-3.5 w-3.5" />
                            </span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col justify-between gap-4">
                    <div className="space-y-4 text-sm text-gray-700">
                      <div className="flex items-center gap-4">
                        <span className="min-w-[60px] text-gray-500">Pick Up :</span>
                        <span className="h-6 border-l border-dashed border-gray-300" />
                        <span className="font-semibold text-gray-900">{card.pickUpTime}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="min-w-[60px] text-gray-500">Pick Date :</span>
                        <span className="h-6 border-l border-dashed border-gray-300" />
                        <span className="font-semibold text-gray-900">{card.pickDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3">
                      <button className="flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50">
                        <PhoneCall className="h-4 w-4" />
                        Call
                      </button>
                      <button className="flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50">
                        <Headset className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-end">
                  <button className="text-sm font-semibold text-gray-500 underline-offset-4 hover:text-blue-600 hover:underline">
                    More Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="mt-12 flex flex-col items-center gap-4 border-t border-gray-100 pt-6">
          <div className="flex w-full items-center justify-end">
            <img src="/svg/map-icon.svg" alt="Collaboration" className="h-10 w-10" />
          </div>
          <button
            onClick={onBack}
            className="rounded-lg border border-gray-300 px-10 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripDetails;
