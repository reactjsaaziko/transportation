import { useState } from 'react';
import { Filter, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { useGetVehiclesByServiceProviderQuery, type Vehicle as VehicleType } from '@/services/vehicleApi';

const ManageVehicle = () => {
  const [selectedTransportMode, setSelectedTransportMode] = useState('Road');

  // Get user ID from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const serviceProviderId = user?.id || user?._id || '';

  // Fetch vehicles from API
  const { data: vehiclesResponse, isLoading, isError, error, refetch } = useGetVehiclesByServiceProviderQuery(
    serviceProviderId,
    { 
      skip: !serviceProviderId,
      refetchOnMountOrArgChange: true,
    }
  );

  const transportModes = [
    { id: 'road', label: 'Road', icon: '🚛' },
    { id: 'rail', label: 'Rail', icon: '🚂' },
    { id: 'air', label: 'Air', icon: '✈️' },
    { id: 'water', label: 'Water', icon: '🚢' },
  ];

  // Filter vehicles by transport mode
  const vehicles = vehiclesResponse?.data?.filter(
    (vehicle: VehicleType) => vehicle.transportationMode === selectedTransportMode
  ) || [];

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

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-3 text-gray-600">Loading vehicles...</span>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="flex flex-col items-center justify-center py-20">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <p className="text-gray-600 mb-4">Failed to load vehicles</p>
          <button
            onClick={() => refetch()}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white font-medium hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Table */}
      {!isLoading && !isError && (
        <div className="overflow-x-auto">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              Showing {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''}
            </p>
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Category</span>
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
                    <span className="text-sm font-medium text-gray-700">Status</span>
                    <Filter className="w-4 h-4 text-gray-500" />
                  </div>
                </th>
                <th className="text-left py-4 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {vehicles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-gray-400">
                    <div className="flex flex-col items-center">
                      <p className="text-lg mb-2">No vehicles found</p>
                      <p className="text-sm">Add a vehicle to get started</p>
                    </div>
                  </td>
                </tr>
              ) : (
                vehicles.map((vehicle: VehicleType) => (
                  <tr key={vehicle._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-700">{vehicle.vehicleType}</span>
                    </td>
                    <td className="py-4 px-4">
                      <img
                        src={vehicle.vehicleImage}
                        alt={vehicle.vehicleType}
                        className="w-16 h-12 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/svg/t1.svg';
                        }}
                      />
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-700">{vehicle.vehicleModel}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-700">
                        {vehicle.pricing?.minimumDistance?.value || 0}-{vehicle.pricing?.minimumDistance?.value ? vehicle.pricing.minimumDistance.value + 100 : 100} {vehicle.pricing?.minimumDistance?.unit || 'KM'} / ₹{vehicle.pricing?.baseRate || 0}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        vehicle.status === 'active' ? 'bg-green-100 text-green-800' :
                        vehicle.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        vehicle.status === 'verified' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {vehicle.status?.charAt(0).toUpperCase() + vehicle.status?.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button className="text-sm font-medium text-gray-700 hover:text-blue-600 underline">
                        More
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageVehicle;
