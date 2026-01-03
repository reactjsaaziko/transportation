import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, MapPin, Plus, X } from 'lucide-react';
import { useCreateWarehouseMutation } from '../../services/warehouseApi';

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

interface WarehouseFacilitiesProps {
  onCancel?: () => void;
  onSuccess?: () => void;
}

const WarehouseFacilities: React.FC<WarehouseFacilitiesProps> = ({ onCancel, onSuccess }) => {
  // Get service provider ID from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const serviceProviderId = user?.id || user?._id || '';

  const [warehouseName, setWarehouseName] = useState('');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('');
  const [unit, setUnit] = useState('Sq meter');
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [facilityData, setFacilityData] = useState<Record<string, any>>({});
  const [createWarehouse, { isLoading: isSubmitting }] = useCreateWarehouseMutation();
  
  const unitDropdownRef = useRef<HTMLDivElement>(null);

  // Close unit dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (unitDropdownRef.current && !unitDropdownRef.current.contains(event.target as Node)) {
        setShowUnitDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleCard = (id: string) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const updateFacilityData = (facilityId: string, field: string, value: any) => {
    setFacilityData((prev) => ({
      ...prev,
      [facilityId]: {
        ...prev[facilityId],
        [field]: value,
      },
    }));
  };

  const toggleFeature = (facilityId: string, featureIndex: number) => {
    const currentData = facilityData[facilityId] || {};
    const features = currentData.features || [];
    const newFeatures = [...features];
    newFeatures[featureIndex] = !newFeatures[featureIndex];
    updateFacilityData(facilityId, 'features', newFeatures);
  };

  const toggleGoods = (facilityId: string, goodsIndex: number) => {
    const currentData = facilityData[facilityId] || {};
    const goods = currentData.goods || [];
    const newGoods = [...goods];
    newGoods[goodsIndex] = !newGoods[goodsIndex];
    updateFacilityData(facilityId, 'goods', newGoods);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!serviceProviderId) {
      alert('Please login to add warehouse');
      return;
    }
    
    // Collect all selected facilities from the form
    const allFacilityCards = [...facilityCards, ...additionalFacilityCards];
    const selectedFacilityCards = allFacilityCards.filter((facility) => expandedCards[facility.id]);
    
    // Map facility IDs to proper facility type names
    const facilityTypeMap: Record<string, string> = {
      'general': 'General Warehouses',
      'cold-storage': 'Cold Storage Warehouses',
      'bulk-storage': 'Bulk Storage Warehouses',
      'hazardous': 'Hazardous Material Warehouses',
      'bonded': 'Bonded Warehouses',
      'automated': 'Automated Warehouses',
      'open-storage': 'Open Storage Warehouses',
      'liquid-storage': 'Liquids/Cylindrical Storage Warehouses',
      'climate-controlled': 'Air-conditioned/Climate-controlled Warehouses',
      'transit': 'Transit Warehouses'
    };
    
    // Build facilities array with proper structure using tracked data
    const facilities = selectedFacilityCards.map((facility) => {
      const data = facilityData[facility.id] || {};
      return {
        type: facilityTypeMap[facility.id] || 'General Warehouses',
        pricing: {
          price: parseFloat(data.price) || 0,
          day: parseInt(data.day) || 1,
          minAmount: { 
            value: parseFloat(data.minAmount) || 0, 
            unit: data.minUnit || 'KG' 
          }
        },
        features: facility.features.map((f, index) => ({
          name: f.label,
          available: data.features?.[index] || f.isSelected || false
        })),
        goodsStored: facility.goodsStored.map((g, index) => ({
          name: g.label,
          canStore: data.goods?.[index] || g.isSelected || false
        }))
      };
    });
    
    try {
      await createWarehouse({
        name: warehouseName,
        address: {
          street: address,
          area: 'N/A',
          city: 'N/A',
          state: 'N/A',
          country: 'India',
          pincode: '000000'
        },
        totalArea: {
          value: parseFloat(area),
          unit: unit
        },
        facilities: facilities.length > 0 ? facilities : [{
          type: 'General Warehouses',
          pricing: {
            price: 0,
            day: 1,
            minAmount: { value: 0, unit: 'KG' }
          },
          features: [],
          goodsStored: []
        }],
        serviceProviderId: serviceProviderId
      } as any).unwrap();
      
      alert('Warehouse added successfully!');
      // Reset form
      setWarehouseName('');
      setAddress('');
      setArea('');
      setUnit('Sq meter');
      setExpandedCards({});
      setFacilityData({});
      // Call success callback
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Error submitting warehouse:', error);
      alert(error?.data?.message || 'Error adding warehouse');
    }
  };

  const allFacilityCards = [...facilityCards, ...additionalFacilityCards];

  return (
    <form onSubmit={handleSubmit} className="min-h-screen bg-gray-50 px-4 py-6 md:px-8">
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
            value={warehouseName}
            onChange={(e) => setWarehouseName(e.target.value)}
            required
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
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
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
              type="number"
              placeholder="Area"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-400 focus:bg-white"
            />
          </div>

          <div ref={unitDropdownRef} className="flex flex-col relative">
            <label className="text-sm font-medium text-gray-700">Unite</label>
            <button
              type="button"
              onClick={() => setShowUnitDropdown(!showUnitDropdown)}
              className="mt-2 rounded-2xl border border-gray-200 bg-white p-4 text-left"
            >
              <div className="flex items-center justify-between text-sm font-semibold text-gray-700">
                <span>{unit}</span>
                {showUnitDropdown ? (
                  <ChevronUp className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </button>
            {showUnitDropdown && (
              <div className="absolute top-full mt-1 w-full z-10 rounded-2xl border border-gray-200 bg-white p-3 shadow-lg">
                <div className="space-y-2 text-sm text-gray-600">
                  {unitOptions.map((unitOption) => (
                    <button
                      key={unitOption}
                      type="button"
                      onClick={() => {
                        setUnit(unitOption);
                        setShowUnitDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 ${
                        unit === unitOption ? 'bg-blue-50 text-blue-600 font-medium' : ''
                      }`}
                    >
                      {unitOption}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Facilities */}
        <div className="mt-10">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-gray-900">Warehouse Facilities</h2>
            <p className="text-sm text-gray-500 mt-1">Click on any facility to expand and view details</p>
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {allFacilityCards.map((facility) => (
              <div
                key={facility.id}
                className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <button
                  type="button"
                  onClick={() => toggleCard(facility.id)}
                  className="w-full flex items-center justify-between mb-4 text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                >
                  <span>{facility.title}</span>
                  {expandedCards[facility.id] ? (
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  )}
                </button>

                {expandedCards[facility.id] && (
                  <>
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2">
                    <label className="text-xs font-semibold text-gray-700">Price</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={facilityData[facility.id]?.price || ''}
                      onChange={(e) => updateFacilityData(facility.id, 'price', e.target.value)}
                      className="mt-1 w-full bg-transparent text-sm font-medium text-gray-900 outline-none"
                    />
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2">
                    <label className="text-xs font-semibold text-gray-700">Day</label>
                    <input
                      type="number"
                      placeholder="1"
                      value={facilityData[facility.id]?.day || ''}
                      onChange={(e) => updateFacilityData(facility.id, 'day', e.target.value)}
                      className="mt-1 w-full bg-transparent text-sm font-medium text-gray-900 outline-none"
                    />
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2">
                    <label className="text-xs font-semibold text-gray-700">Min Amount</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={facilityData[facility.id]?.minAmount || ''}
                      onChange={(e) => updateFacilityData(facility.id, 'minAmount', e.target.value)}
                      className="mt-1 w-full bg-transparent text-sm font-medium text-gray-900 outline-none"
                    />
                    <select
                      value={facilityData[facility.id]?.minUnit || 'KG'}
                      onChange={(e) => updateFacilityData(facility.id, 'minUnit', e.target.value)}
                      className="mt-1 w-full bg-transparent text-[10px] font-medium text-gray-500 outline-none"
                    >
                      <option value="KG">KG</option>
                      <option value="Tone">Tone</option>
                    </select>
                  </div>
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
                        className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-50"
                      >
                        <span>{feature.label}</span>
                        <input
                          type="checkbox"
                          checked={facilityData[facility.id]?.features?.[index] || feature.isSelected || false}
                          onChange={() => toggleFeature(facility.id, index)}
                          className="h-4 w-4 text-blue-500 focus:ring-blue-500 rounded"
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
                        className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-50"
                      >
                        <span>{good.label}</span>
                        <input
                          type="checkbox"
                          checked={facilityData[facility.id]?.goods?.[index] || good.isSelected || false}
                          onChange={() => toggleGoods(facility.id, index)}
                          className="h-4 w-4 text-blue-500 focus:ring-blue-500 rounded"
                        />
                      </label>
                    ))}
                  </div>
                </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => {
              if (onCancel) {
                onCancel();
              } else {
                setWarehouseName('');
                setAddress('');
                setArea('');
                setUnit('Sq meter');
                setExpandedCards({});
                setFacilityData({});
              }
            }}
            className="rounded-xl border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-blue-500 px-8 py-3 text-sm font-medium text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? 'Adding...' : 'Add Warehouse'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default WarehouseFacilities;
