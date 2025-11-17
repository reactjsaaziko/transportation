import { MapPin, PhoneCall, Headset, Package } from 'lucide-react';

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
  pickUpTime?: string;
  pickDate?: string;
}

interface CHACargoSummaryProps {
  cargoCards?: CargoCard[];
  contactCards?: ContactCardDetails[];
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

const CHACargoSummary = ({ cargoCards = [], contactCards = [] }: CHACargoSummaryProps) => {
  // Default cargo cards if none provided
  const defaultCargoCards: CargoCard[] = [
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

  // Default contact cards if none provided
  const defaultContactCards: ContactCardDetails[] = [
    {
      id: 'from-info',
      title: 'From',
      companyName: 'Aaziko',
      contactName: 'Rajesh bhai',
      address: 'Okha Port',
      pickUpTime: '23:00',
      pickDate: '14 Jan 2023',
    },
  ];

  const displayCargoCards = cargoCards.length > 0 ? cargoCards : defaultCargoCards;
  const displayContactCards = contactCards.length > 0 ? contactCards : defaultContactCards;

  return (
    <>
      {/* Cargo Summary */}
      <div className="mt-10 space-y-8">
        {displayCargoCards.map((card) => {
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

      {/* Contact Cards */}
      <div className="mt-10 space-y-6">
        {displayContactCards.map((card) => (
          <div key={card.id} className="space-y-4">
            <div className="text-sm font-semibold text-gray-900">{card.title}</div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(220px,280px)]">
                <div className="space-y-4">
                  {[
                    {
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
                    },
                  ].map((item) => (
                    <div
                      key={`${card.id}-${item.label}`}
                      className="flex items-center gap-4 text-sm text-gray-700"
                    >
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
                  {card.pickUpTime && card.pickDate && (
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
                  )}

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
    </>
  );
};

export default CHACargoSummary;
