import { useState } from 'react';
import { Camera, Hash, Minus, Plus, ChevronDown } from 'lucide-react';
import { vehicleFormStyles } from './formStyles';

interface WaterShipDetailsFormProps {
  shipType: string;
  shipImage?: string;
  shipName?: string;
  onCancel: () => void;
  onSubmit: (data: any) => void;
}

type DimensionKey = 'length' | 'width' | 'height' | 'maxWeight';

const shipDimensionFields: Array<{ key: DimensionKey; label: string; suffix: string }> = [
  { key: 'length', label: 'Length', suffix: 'm' },
  { key: 'width', label: 'Width', suffix: 'm' },
  { key: 'height', label: 'Height', suffix: 'm' },
  { key: 'maxWeight', label: 'Max Weight', suffix: 'ton' },
] as const;

const defaultShipDimensions: Record<DimensionKey, string> = {
  length: '294',
  width: '32',
  height: '30',
  maxWeight: '200000',
};

const currencyOptions = ['₹', '$', '€'];
const capacityUnits = [
  { value: 'ton', label: 'Ton' },
  { value: 'teu', label: 'TEU' },
  { value: 'cbm', label: 'CBM' },
];

const shipTypeNames: Record<string, string> = {
  'general-cargo': 'General Cargo',
  'bulk-carriers': 'Bulk Carriers',
  containerships: 'Containerships',
  'tanker-market': 'Tanker Market',
  specialized: 'Specialized',
  custom: 'Custom',
};

const WaterShipDetailsForm = ({ shipType, shipImage, shipName, onCancel, onSubmit }: WaterShipDetailsFormProps) => {
  const [quantity, setQuantity] = useState(1);
  const [dimensions, setDimensions] = useState<Record<DimensionKey, string>>(defaultShipDimensions);
  const [loadingTime, setLoadingTime] = useState({ time: '', hour: '' });
  const [afterFreeTime, setAfterFreeTime] = useState({ price: '', hour: '' });
  const [priceRange, setPriceRange] = useState({ min: '0 - 10', max: '' });
  const [selectedUnit, setSelectedUnit] = useState(capacityUnits[0].value);
  const [selectedCurrency, setSelectedCurrency] = useState(currencyOptions[0]);
  const [minCapacity, setMinCapacity] = useState('');
  const [perVoyageAverage, setPerVoyageAverage] = useState('');

  const shipLabel = shipName || shipTypeNames[shipType] || 'Ship';
  const badgeValues = ['Water Freight', shipLabel];

  const handleSubmit = () => {
    const formData = {
      shipType: shipLabel,
      quantity,
      dimensions,
      loadingTime,
      afterFreeTime,
      priceRange,
      unit: selectedUnit,
      currency: selectedCurrency,
      minCapacity,
      perVoyageAverage,
    };

    onSubmit(formData);
  };

  return (
    <div className={vehicleFormStyles.card}>
      <div className="mb-6 flex flex-wrap gap-3">
        {badgeValues.map((badge, index) => (
          <span key={`${badge}-${index}`} className={vehicleFormStyles.badge}>
            {badge}
          </span>
        ))}
      </div>

      <div className={`${vehicleFormStyles.panel} mb-8`}>
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex flex-col items-center gap-4 text-center lg:w-1/4">
            <div className={vehicleFormStyles.imageCard}>
              <img
                src={shipImage || '/svg/w1.svg'}
                alt={shipLabel}
                className="h-full w-full object-contain p-2"
              />
            </div>
            <div className="text-sm font-semibold text-slate-600">{shipLabel}</div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className={`${vehicleFormStyles.circleButton} h-10 w-10`}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-[44px] rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-[0_8px_24px_rgba(15,23,42,0.1)]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className={`${vehicleFormStyles.circleButton} h-10 w-10`}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {shipDimensionFields.map(({ key, label, suffix }) => (
              <div key={key} className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  {label}
                </p>
                <div className="relative">
                  <input
                    type="text"
                    value={dimensions[key]}
                    onChange={(e) =>
                      setDimensions((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                    className={`${vehicleFormStyles.pillInput} pr-12`}
                  />
                  <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase text-slate-400">
                    {suffix}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <button type="button" className={vehicleFormStyles.uploadButton}>
            <span>Ship/Vessel Image</span>
            <Camera className="h-4 w-4" />
          </button>
          <button type="button" className={vehicleFormStyles.uploadButton}>
            <span>Ship/Vessel Number</span>
            <Hash className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-sm font-semibold text-slate-700">Loading/ Unloading Free time</p>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
            <input
              type="text"
              value={loadingTime.time}
              onChange={(e) => setLoadingTime({ ...loadingTime, time: e.target.value })}
              placeholder="Time"
              className={vehicleFormStyles.pillInput}
            />
            <div className={`${vehicleFormStyles.pillStatic} flex items-center justify-center`}>
              Hour
            </div>
          </div>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold text-slate-700">After Free time</p>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
            <input
              type="text"
              value={afterFreeTime.price}
              onChange={(e) => setAfterFreeTime({ ...afterFreeTime, price: e.target.value })}
              placeholder="Price"
              className={vehicleFormStyles.pillInput}
            />
            <div className={`${vehicleFormStyles.pillStatic} flex items-center justify-center`}>
              Hour
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={priceRange.min}
          onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
          placeholder="0 - 10"
          className={`${vehicleFormStyles.pillInput} flex-1 min-w-[160px]`}
        />
        <input
          type="text"
          value={priceRange.max}
          onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
          placeholder="Price"
          className={`${vehicleFormStyles.pillInput} flex-1 min-w-[160px]`}
        />
        <div className="relative">
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className={`${vehicleFormStyles.select} w-[100px]`}
          >
            {currencyOptions.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
        <div className="relative">
          <select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            className={`${vehicleFormStyles.select} w-[130px]`}
          >
            {capacityUnits.map((unit) => (
              <option key={unit.value} value={unit.value}>
                {unit.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
        <button type="button" className={`${vehicleFormStyles.circleButton} h-12 w-12`}>
          <Plus className="h-5 w-5" />
        </button>
        <input
          type="text"
          value={minCapacity}
          onChange={(e) => setMinCapacity(e.target.value)}
          placeholder="Minimum Capacity (Ton/TEU/CBM)"
          className={`${vehicleFormStyles.pillInput} flex-1 min-w-[200px]`}
        />
        <input
          type="text"
          value={perVoyageAverage}
          onChange={(e) => setPerVoyageAverage(e.target.value)}
          placeholder="Per Voyage Average"
          className={`${vehicleFormStyles.pillInput} flex-1 min-w-[200px]`}
        />
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <button type="button" onClick={onCancel} className={vehicleFormStyles.ghostButton}>
          Cancel
        </button>
        <button type="button" onClick={handleSubmit} className={vehicleFormStyles.primaryButton}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default WaterShipDetailsForm;
