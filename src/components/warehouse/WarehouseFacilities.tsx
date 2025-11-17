import { ChevronDown, MapPin, Plus } from 'lucide-react';

interface FacilityFeature {
  label: string;
  isSelected?: boolean;
}

interface FacilityData {
  id: string;
  title: string;
  features: FacilityFeature[];
  goodsStored: FacilityFeature[];
}

const facilityCards: FacilityData[] = [
  {
    id: 'general',
    title: 'General Warehouses',
    features: [
      { label: 'Standard storage racks/shelves', isSelected: true },
      { label: 'Loading and unloading docks' },
      { label: 'Forklifts and trolleys' },
      { label: 'Security measures like CCTV' },
    ],
    goodsStored: [
      { label: 'Consumer goods', isSelected: true },
      { label: 'Packaged food products' },
      { label: 'Electronics' },
      { label: 'Furniture' },
    ],
  },
  {
    id: 'cold-storage',
    title: 'Cold Storage Warehouses',
    features: [
      { label: 'Temperature-controlled', isSelected: true },
      { label: 'Refrigeration units' },
      { label: 'Insulated walls and doors' },
      { label: 'Temperature monitoring systems' },
    ],
    goodsStored: [
      { label: 'Fresh produce', isSelected: true },
      { label: 'Dairy products' },
      { label: 'Meat, poultry, and seafood' },
      { label: 'Pharmaceuticals' },
    ],
  },
  {
    id: 'bulk-storage',
    title: 'Bulk Storage Warehouses',
    features: [
      { label: 'Large open spaces', isSelected: true },
      { label: 'Silos and bins' },
      { label: 'Heavy machinery for moving bulk items' },
      { label: 'Security measures like CCTV' },
    ],
    goodsStored: [
      { label: 'Grains and cereals', isSelected: true },
      { label: 'Coal and minerals' },
      { label: 'Liquid products like oil and chemicals' },
    ],
  },
];

const unitOptions = ['Sq meter', 'Sq Foot', 'Sq Yard', 'Sq Mile'];

const additionalFacilityCards: FacilityData[] = [
  {
    id: 'hazardous',
    title: 'Hazardous Material Warehouses',
    features: [
      { label: 'Special safety measures and equipment', isSelected: true },
      { label: 'Fireproofing' },
      { label: 'Ventilation systems' },
      { label: 'Spill containment systems' },
    ],
    goodsStored: [
      { label: 'Chemicals', isSelected: true },
      { label: 'Flammable products' },
      { label: 'Radioactive materials' },
      { label: 'Explosives' },
    ],
  },
  {
    id: 'bonded',
    title: 'Bonded Warehouses',
    features: [
      { label: 'Secure storage areas', isSelected: true },
      { label: 'Customs inspection zones' },
      { label: 'Duty payment offices' },
      { label: 'Spill containment systems' },
    ],
    goodsStored: [
      { label: 'Imported goods awaiting customs clearance', isSelected: true },
      { label: 'Goods stored for deferred duty payment' },
    ],
  },
  {
    id: 'automated',
    title: 'Automated Warehouses',
    features: [
      { label: 'Automated Storage and Retrieval Systems (AS/RS)', isSelected: true },
      { label: 'Robotics' },
      { label: 'Conveyor systems' },
    ],
    goodsStored: [
      { label: 'High-volume goods', isSelected: true },
      { label: 'Goods requiring precise handling and tracking' },
    ],
  },
  {
    id: 'open-storage',
    title: 'Open Storage Warehouses',
    features: [
      { label: 'Open spaces, often with roofing', isSelected: true },
      { label: 'May include cranes and other heavy machinery' },
    ],
    goodsStored: [
      { label: 'Lumber', isSelected: true },
      { label: 'Heavy machinery' },
      { label: 'Steel and construction materials' },
    ],
  },
  {
    id: 'liquid-storage',
    title: 'Liquids/Cylindrical Storage Warehouses',
    features: [
      { label: 'Tanks and reservoirs', isSelected: true },
      { label: 'Pipeline systems for filling and distribution' },
    ],
    goodsStored: [
      { label: 'Liquids like oil, gas, and chemicals', isSelected: true },
    ],
  },
  {
    id: 'climate-controlled',
    title: 'Air-conditioned/Climate-controlled Warehouses',
    features: [
      { label: 'Temperature and humidity control systems', isSelected: true },
      { label: 'Sealed storage areas' },
    ],
    goodsStored: [
      { label: 'Art and antiques', isSelected: true },
      { label: 'Delicate electronics' },
      { label: 'Wines and spirits' },
      { label: 'Pharmaceuticals' },
    ],
  },
  {
    id: 'transit',
    title: 'Transit Warehouses',
    features: [
      { label: 'Close to transportation hubs', isSelected: true },
      { label: 'Quick loading and unloading systems' },
    ],
    goodsStored: [
      { label: 'Goods in transit awaiting onward distribution', isSelected: true },
    ],
  },
];

const WarehouseFacilities = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-8">
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-gray-100 pb-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
            <Plus className="h-5 w-5" />
          </span>
          <h1 className="text-lg font-semibold text-gray-900">Add Warehouse</h1>
        </div>

        {/* Name */}
        <div className="mt-6">
          <label className="text-sm font-medium text-gray-700" htmlFor="warehouse-name">
            Name
          </label>
          <input
            id="warehouse-name"
            type="text"
            placeholder="Type Warehouse Name"
            className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-400 focus:bg-white"
          />
        </div>

        {/* Address */}
        <div className="mt-6">
          <label className="text-sm font-medium text-gray-700" htmlFor="warehouse-address">
            Warehouse address
          </label>
          <div className="mt-2 flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-500">
              <MapPin className="h-4 w-4" />
            </span>
            <input
              id="warehouse-address"
              type="text"
              placeholder="107, zircon plus, nr. Ankur school, Aamba Talavadi, Katargam, Surat, Gujarat 395004"
              className="flex-1 border-0 bg-transparent text-sm text-gray-700 outline-none"
            />
          </div>
        </div>

        {/* Area & Unit */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700" htmlFor="warehouse-area">
              Area
            </label>
            <input
              id="warehouse-area"
              type="text"
              placeholder="Area"
              className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-400 focus:bg-white"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Unite</label>
            <div className="mt-2 rounded-2xl border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between text-sm font-semibold text-gray-700">
                <span>Unite</span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
              <div className="mt-3 space-y-2 text-sm text-gray-600">
                {unitOptions.map((unit, index) => (
                  <div
                    key={unit}
                    className={`flex items-center justify-between border-b border-dashed border-gray-200 pb-2 last:border-b-0 last:pb-0`}
                  >
                    <span>{unit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Facilities */}
        <div className="mt-10">
          <h2 className="text-base font-semibold text-gray-900">Warehouse Facilities</h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {facilityCards.map((facility) => (
              <div
                key={facility.id}
                className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-center justify-between text-sm font-semibold text-gray-900">
                  <span>{facility.title}</span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {['Price', 'Day', 'Min Amount'].map((label) => (
                    <div
                      key={`${facility.id}-${label}`}
                      className="rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-center text-xs font-semibold text-gray-700"
                    >
                      <div>{label}</div>
                      <div className="mt-2 grid grid-cols-1 gap-1 text-[10px] font-medium text-gray-500">
                        <span>KG</span>
                        <span>Tone</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Features/Facilities:
                  </label>
                  <input
                    type="text"
                    placeholder="Features/Facilities"
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-400 focus:bg-white"
                  />
                  <div className="mt-3 space-y-2">
                    {facility.features.map((feature, index) => (
                      <label
                        key={`${facility.id}-feature-${index}`}
                        className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
                      >
                        <span>{feature.label}</span>
                        <input
                          type="radio"
                          name={`${facility.id}-features`}
                          defaultChecked={feature.isSelected}
                          className="h-4 w-4 text-blue-500 focus:ring-blue-500"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Goods Stored:
                  </label>
                  <div className="mt-3 space-y-2">
                    {facility.goodsStored.map((good, index) => (
                      <label
                        key={`${facility.id}-goods-${index}`}
                        className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
                      >
                        <span>{good.label}</span>
                        <input
                          type="radio"
                          name={`${facility.id}-goods`}
                          defaultChecked={good.isSelected}
                          className="h-4 w-4 text-blue-500 focus:ring-blue-500"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {additionalFacilityCards.map((facility) => (
            <div
              key={facility.id}
              className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between text-sm font-semibold text-gray-900">
                <span>{facility.title}</span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {['Price', 'Day', 'Min Amount'].map((label) => (
                  <div
                    key={`${facility.id}-${label}`}
                    className="rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-center text-xs font-semibold text-gray-700"
                  >
                    <div>{label}</div>
                    <div className="mt-2 grid grid-cols-1 gap-1 text-[10px] font-medium text-gray-500">
                      <span>KG</span>
                      <span>Tone</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Features/Facilities:
                </label>
                <input
                  type="text"
                  placeholder="Features/Facilities"
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-400 focus:bg-white"
                />
                <div className="mt-3 space-y-2">
                  {facility.features.map((feature, index) => (
                    <label
                      key={`${facility.id}-feature-${index}`}
                      className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
                    >
                      <span>{feature.label}</span>
                      <input
                        type="radio"
                        name={`${facility.id}-features`}
                        defaultChecked={feature.isSelected}
                        className="h-4 w-4 text-blue-500 focus:ring-blue-500"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Goods Stored:
                </label>
                <div className="mt-3 space-y-2">
                  {facility.goodsStored.map((good, index) => (
                    <label
                      key={`${facility.id}-goods-${index}`}
                      className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
                    >
                      <span>{good.label}</span>
                      <input
                        type="radio"
                        name={`${facility.id}-goods`}
                        defaultChecked={good.isSelected}
                        className="h-4 w-4 text-blue-500 focus:ring-blue-500"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WarehouseFacilities;
