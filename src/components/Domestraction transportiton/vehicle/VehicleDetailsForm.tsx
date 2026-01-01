import { useState } from 'react';
import { Camera, Hash, Minus, Plus, ChevronDown } from 'lucide-react';
import { vehicleFormStyles } from './formStyles';

interface VehicleDetailsFormProps {
  vehicleType: string;
  vehicleModel: string;
  vehicleImage?: string;
  vehicleName?: string;
  onCancel: () => void;
  onSubmit: (data: any) => void;
}

type DimensionKey = 'length' | 'width' | 'height' | 'maxWeight';

const roadDimensionFields: Array<{ key: DimensionKey; label: string; suffix: string }> = [
  { key: 'length', label: 'Length', suffix: 'Ft' },
  { key: 'width', label: 'Width', suffix: 'Ft' },
  { key: 'height', label: 'Height', suffix: 'Ft' },
  { key: 'maxWeight', label: 'Max Weight', suffix: 'Ft' },
] as const;

const defaultRoadDimensions: Record<DimensionKey, string> = {
  length: '13600',
  width: '2500',
  height: '2650',
  maxWeight: '2650',
};

const currencyOptions = ['₹', '$', '€'];
const distanceUnits = [
  { value: 'km', label: 'Km' },
  { value: 'mile', label: 'Mile' },
  { value: 'cbm', label: 'CBM' },
];

const VehicleDetailsForm = ({ vehicleType, vehicleModel, vehicleImage, vehicleName, onCancel, onSubmit }: VehicleDetailsFormProps) => {
  const [quantity, setQuantity] = useState(1);
  const [dimensions] = useState<Record<DimensionKey, string>>(defaultRoadDimensions);
  const [loadingTime, setLoadingTime] = useState({ time: '', hour: '' });
  const [afterFreeTime, setAfterFreeTime] = useState({ price: '', hour: '' });
  const [priceRange, setPriceRange] = useState({ min: '0 - 10', max: '' });
  const [selectedUnit, setSelectedUnit] = useState(distanceUnits[0].value);
  const [selectedCurrency, setSelectedCurrency] = useState(currencyOptions[0]);
  const [minDistance, setMinDistance] = useState('');
  const [perDayAverage, setPerDayAverage] = useState('');

  const badgeValues = ['India', vehicleType, vehicleName || vehicleModel].filter(Boolean) as string[];

  const handleSubmit = () => {
    const formData = {
      vehicleType,
      vehicleModel,
      quantity,
      dimensions,
      loadingTime,
      afterFreeTime,
      priceRange,
      unit: selectedUnit,
      currency: selectedCurrency,
      minDistance,
      perDayAverage,
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
                src={vehicleImage || '/svg/t1.svg'}
                alt={vehicleName || 'Vehicle illustration'}
                className="h-full w-full object-contain p-2"
              />
            </div>
            <div className="text-sm font-semibold text-slate-600">
              {vehicleName || 'Selected Vehicle'}
            </div>
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
            {roadDimensionFields.map(({ key, label, suffix }) => (
              <div key={key} className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  {label}
                </p>
                <div className="relative">
                  <input
                    type="text"
                    value={dimensions[key]}
                    readOnly
                    className={`${vehicleFormStyles.pillStatic} pr-12 text-slate-800`}
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
            <span>Vehicle/Container Image</span>
            <Camera className="h-4 w-4" />
          </button>
          <button type="button" className={vehicleFormStyles.uploadButton}>
            <span>Vehicle/Container Number</span>
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
            {distanceUnits.map((unit) => (
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
          value={minDistance}
          onChange={(e) => setMinDistance(e.target.value)}
          placeholder="Minimum KM/Mile/CBM"
          className={`${vehicleFormStyles.pillInput} flex-1 min-w-[200px]`}
        />
        <input
          type="text"
          value={perDayAverage}
          onChange={(e) => setPerDayAverage(e.target.value)}
          placeholder="Per Day Average km"
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

export default VehicleDetailsForm;
