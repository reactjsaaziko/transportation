import { useState } from 'react';
import { Filter } from 'lucide-react';

interface Vehicle {
  id: string;
  category: string;
  image: string;
  model: string;
  priceRange: string;
  trips: string;
}

const ManageVehicle = () => {
  const [selectedTransportMode, setSelectedTransportMode] = useState('Road');

  const transportModes = [
    { id: 'road', label: 'Road', icon: '🚛' },
    { id: 'rail', label: 'Rail', icon: '🚂' },
    { id: 'air', label: 'Air', icon: '✈️' },
    { id: 'water', label: 'Water', icon: '🚢' },
  ];

  const vehicles: Vehicle[] = [
    {
      id: '1',
      category: 'Tautliner ( Curainsider )',
      image: '/images/1.png',
      model: 'TATA ACE',
      priceRange: '0-100 KM / 5000RS.',
      trips: '1 Trip',
    },
    {
      id: '2',
      category: 'Refrigerated Truck',
      image: '/images/2.png',
      model: 'TAURUS 25 T (14 TYRE)',
      priceRange: '0-100 KM / 5000RS.',
      trips: '2 Trip',
    },
    {
      id: '3',
      category: 'Jumbo',
      image: '/images/5.png',
      model: 'CONTAINER 20 FT',
      priceRange: '0-100 KM / 5000RS.',
      trips: '1 Trip',
    },
  ];

  return (
    <div className="bg-white rounded-lg p-6">
      {/* Header with Transport Modes and Price Increase */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {/* Country Selector */}
          <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            <span className="text-xl">🇮🇳</span>
            <span className="text-sm font-medium text-gray-700">India</span>
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Transport Mode Tabs */}
          {transportModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setSelectedTransportMode(mode.label)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                selectedTransportMode === mode.label
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg">{mode.icon}</span>
              <span className="text-sm font-medium">{mode.label}</span>
            </button>
          ))}
        </div>

        {/* Price Increase Badge with Input */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Price Increased By %</span>
          <input
            type="number"
            placeholder="0"
            className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-4 px-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Catagory</span>
                  <Filter className="w-4 h-4 text-gray-500" />
                </div>
              </th>
              <th className="text-left py-4 px-4">
                <span className="text-sm font-medium text-gray-700">Vehicle</span>
              </th>
              <th className="text-left py-4 px-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Vehicle Model</span>
                  <Filter className="w-4 h-4 text-gray-500" />
                </div>
              </th>
              <th className="text-left py-4 px-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Km/Price</span>
                  <Filter className="w-4 h-4 text-gray-500" />
                </div>
              </th>
              <th className="text-left py-4 px-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Trip</span>
                  <Filter className="w-4 h-4 text-gray-500" />
                </div>
              </th>
              <th className="text-left py-4 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4">
                  <span className="text-sm text-gray-700">{vehicle.category}</span>
                </td>
                <td className="py-4 px-4">
                  <img
                    src={vehicle.image}
                    alt={vehicle.category}
                    className="w-16 h-12 object-contain"
                  />
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-gray-700">{vehicle.model}</span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-gray-700">{vehicle.priceRange}</span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-gray-700">{vehicle.trips}</span>
                </td>
                <td className="py-4 px-4">
                  <button className="text-sm font-medium text-gray-700 hover:text-blue-600 underline">
                    More
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageVehicle;
