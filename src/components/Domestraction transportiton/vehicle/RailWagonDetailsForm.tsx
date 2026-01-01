import { useState } from 'react';
import { Camera, Plus, Minus } from 'lucide-react';

interface RailWagonDetailsFormProps {
  wagonType: string;
  onCancel: () => void;
  onSubmit: (data: any) => void;
}

const RailWagonDetailsForm = ({ wagonType, onCancel, onSubmit }: RailWagonDetailsFormProps) => {
  const [quantity, setQuantity] = useState(1);
  const [dimensions, setDimensions] = useState({
    length: '13600',
    width: '2500',
    height: '2650',
    maxWeight: '2650'
  });
  const [loadingTime, setLoadingTime] = useState({ time: '', hour: '' });
  const [afterFreeTime, setAfterFreeTime] = useState({ price: '', hour: '' });
  const [priceRange, setPriceRange] = useState({ min: '0-10', max: '' });
  const [selectedUnit, setSelectedUnit] = useState('km');
  const [minDistance, setMinDistance] = useState('');
  const [perDayAverage, setPerDayAverage] = useState('');

  // Map wagon type IDs to display names
  const wagonTypeNames: { [key: string]: string } = {
    'open-wagon': 'Open Wagon',
    'covered-wagon': 'Covered wagon',
    'tank-wagon': 'Tank wagon',
    'flat-wagon': 'Flat wagon',
    'brake-van': 'Brake van',
    'hopper-wagon': 'Hopper wagon'
  };

  // Map wagon type IDs to image paths
  const wagonTypeImages: { [key: string]: string } = {
    'open-wagon': '/svg/r1.svg',
    'covered-wagon': '/svg/r2.svg',
    'tank-wagon': '/svg/r3.svg',
    'flat-wagon': '/svg/r4.svg',
    'brake-van': '/svg/r5.svg',
    'hopper-wagon': '/svg/r6.svg'
  };

  const handleSubmit = () => {
    const formData = {
      wagonType,
      quantity,
      dimensions,
      loadingTime,
      afterFreeTime,
      priceRange,
      unit: selectedUnit,
      minDistance,
      perDayAverage
    };
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Wagon Image and Dimensions */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="flex items-start gap-6">
          {/* Wagon Image with Quantity */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center mb-3 border border-gray-200">
              <img 
                src={wagonTypeImages[wagonType] || '/svg/r1.svg'} 
                alt={wagonTypeNames[wagonType] || 'Wagon'}
                className="w-full h-full object-contain p-2"
              />
            </div>
            <div className="text-xs text-gray-600 text-center mb-2">
              {wagonTypeNames[wagonType] || 'Open Wagon'}
            </div>
            <div className="flex items-center justify-center gap-2">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <Minus className="w-4 h-4 text-gray-600" />
              </button>
              <span className="w-8 text-center font-medium text-gray-700">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <Plus className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Dimensions Grid */}
          <div className="flex-1 grid grid-cols-4 gap-4">
            {/* Length */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Length</label>
              <div className="relative">
                <input
                  type="text"
                  value={dimensions.length}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-100 cursor-not-allowed text-gray-600"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">Ft</span>
              </div>
            </div>

            {/* Width */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Width</label>
              <div className="relative">
                <input
                  type="text"
                  value={dimensions.width}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-100 cursor-not-allowed text-gray-600"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">Ft</span>
              </div>
            </div>

            {/* Height */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Height</label>
              <div className="relative">
                <input
                  type="text"
                  value={dimensions.height}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-100 cursor-not-allowed text-gray-600"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">Ft</span>
              </div>
            </div>

            {/* Max Weight */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Max Weight</label>
              <div className="relative">
                <input
                  type="text"
                  value={dimensions.maxWeight}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-100 cursor-not-allowed text-gray-600"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">Ft</span>
              </div>
            </div>
          </div>
        </div>

        {/* Image Upload Buttons */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white transition-colors">
            <Camera className="w-4 h-4" />
            Vehicle/Container Image
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white transition-colors">
            <Camera className="w-4 h-4" />
            Vehicle/Container Number
          </button>
        </div>
      </div>

      {/* Loading/Unloading Free Time and After Free Time */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Loading/Unloading Free Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Loading/ Unloading Free time</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Time</label>
              <input
                type="text"
                value={loadingTime.time}
                onChange={(e) => setLoadingTime({ ...loadingTime, time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <div className="text-xs text-gray-600 font-medium">Hour</div>
            </div>
          </div>
        </div>

        {/* After Free Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">After Free time</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Price</label>
              <input
                type="text"
                value={afterFreeTime.price}
                onChange={(e) => setAfterFreeTime({ ...afterFreeTime, price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <div className="text-xs text-gray-600 font-medium">Hour</div>
            </div>
          </div>
        </div>
      </div>

      {/* Price Range and Distance */}
      <div className="flex items-end gap-3 mb-6">
        {/* Price Range Min */}
        <div className="flex-1">
          <input
            type="text"
            value={priceRange.min}
            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
            placeholder="0-10"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Price Label */}
        <div className="flex-1">
          <input
            type="text"
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
            placeholder="Price"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Currency Dropdown */}
        <div className="relative flex-shrink-0">
          <select className="px-3 py-2 pr-8 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white appearance-none cursor-pointer hover:bg-gray-50 focus:outline-none focus:border-blue-500">
            <option>₹</option>
            <option>$</option>
            <option>€</option>
          </select>
          <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Unit Dropdown */}
        <div className="relative flex-shrink-0">
          <select 
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            className="px-3 py-2 pr-8 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white appearance-none cursor-pointer hover:bg-gray-50 focus:outline-none focus:border-blue-500"
          >
            <option value="km">Km</option>
            <option value="mile">Mile</option>
            <option value="cbm">CBM</option>
          </select>
          <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Add Button */}
        <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          <Plus className="w-5 h-5" />
        </button>

        {/* Minimum Distance */}
        <div className="flex-1">
          <input
            type="text"
            value={minDistance}
            onChange={(e) => setMinDistance(e.target.value)}
            placeholder="Minimum  KM/Mile/CBM"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Per Day Average */}
        <div className="flex-1">
          <input
            type="text"
            value={perDayAverage}
            onChange={(e) => setPerDayAverage(e.target.value)}
            placeholder="Per Day Avarage km"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-3">
        <button 
          onClick={onCancel}
          className="px-8 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button 
          onClick={handleSubmit}
          className="px-8 py-2.5 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default RailWagonDetailsForm;
