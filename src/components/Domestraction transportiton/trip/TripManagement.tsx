import { useState } from 'react';
import { Calendar, Lock } from 'lucide-react';
import TripDetails from './TripDetails';

type TripStatus = 'Yet to confirm' | 'Current' | 'Upcoming' | 'Completed';

interface Trip {
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
  status: TripStatus;
  invoiceStatus?: 'Pending' | 'Payment Transfer';
}

interface TripManagementProps {
  onViewDetails?: (trip: Trip) => void;
}

const TripManagement = ({ onViewDetails }: TripManagementProps = {}) => {
  const [activeTab, setActiveTab] = useState<TripStatus>('Yet to confirm');
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const handleViewDetails = (trip: Trip) => {
    if (onViewDetails) {
      onViewDetails(trip);
    } else {
      setSelectedTrip(trip);
    }
  };

  const handleBack = () => {
    setSelectedTrip(null);
  };

  // If a trip is selected, show details page
  if (selectedTrip) {
    return <TripDetails trip={selectedTrip} onBack={handleBack} />;
  }

  const tabs: TripStatus[] = ['Yet to confirm', 'Current', 'Upcoming', 'Completed'];

  // Pending trips (Yet to confirm)
  const pendingTrips: Trip[] = [
    {
      id: '1',
      orderId: '151515',
      fromLocation: 'City, Stat , Country',
      toLocation: 'City, Stat , Country',
      viaLocation: 'City, Stat , Country',
      date: '14, Jan, 2023',
      product: 'Plastic Cup',
      goodsType: 'Normal',
      total: '210 packages',
      coast: 'INR 2000/SB',
      tripKm: '45km approx',
      cargoWeight: '14500.00 kg',
      cargoVolume: '29.50 M3',
      status: 'Yet to confirm',
    },
    {
      id: '2',
      orderId: '151515',
      fromLocation: 'City, Stat , Country',
      toLocation: 'City, Stat , Country',
      viaLocation: 'City, Stat , Country',
      date: '14, Jan, 2023',
      product: 'Plastic Cup',
      goodsType: 'Normal',
      total: '210 packages',
      coast: 'INR 2000/SB',
      tripKm: '45km approx',
      cargoWeight: '14500.00 kg',
      cargoVolume: '29.50 M3',
      status: 'Yet to confirm',
    },
  ];

  // Current trips
  const currentTrips: Trip[] = [
    {
      id: '3',
      tripId: '151515',
      fromLocation: 'City, Stat , Country',
      toLocation: 'City, Stat , Country',
      viaLocation: 'City, Stat , Country',
      date: '14, Jan, 2023',
      product: 'Plastic Cup',
      goodsType: 'Normal',
      total: '210 packages',
      coast: 'INR 2000/SB',
      price: 'INR 2000/SB',
      tripKm: '45km approx',
      cargoWeight: '14500.00 kg',
      cargoVolume: '29.50 M3',
      status: 'Current',
      invoiceStatus: 'Pending',
    },
    {
      id: '3b',
      tripId: '151515',
      fromLocation: 'City, Stat , Country',
      toLocation: 'City, Stat , Country',
      viaLocation: 'City, Stat , Country',
      date: '14, Jan, 2023',
      product: 'Plastic Cup',
      goodsType: 'Normal',
      total: '210 packages',
      coast: 'INR 2000/SB',
      price: 'INR 2000/SB',
      tripKm: '45km approx',
      cargoWeight: '14500.00 kg',
      cargoVolume: '29.50 M3',
      status: 'Current',
      invoiceStatus: 'Payment Transfer',
    },
  ];

  // Upcoming trips
  const upcomingTrips: Trip[] = [
    {
      id: '4',
      orderId: '151515',
      fromLocation: 'City, Stat , Country',
      toLocation: 'City, Stat , Country',
      viaLocation: 'City, Stat , Country',
      date: '14, Jan, 2023',
      product: 'Plastic Cup',
      goodsType: 'Normal',
      total: '210 packages',
      coast: 'INR 2000/SB',
      tripKm: '45km approx',
      cargoWeight: '14500.00 kg',
      cargoVolume: '29.50 M3',
      status: 'Upcoming',
    },
    {
      id: '4b',
      orderId: '151515',
      fromLocation: 'City, Stat , Country',
      toLocation: 'City, Stat , Country',
      viaLocation: 'City, Stat , Country',
      date: '14, Jan, 2023',
      product: 'Plastic Cup',
      goodsType: 'Normal',
      total: '210 packages',
      coast: 'INR 2000/SB',
      tripKm: '45km approx',
      cargoWeight: '14500.00 kg',
      cargoVolume: '29.50 M3',
      status: 'Upcoming',
    },
  ];

  // Completed trips
  const completedTrips: Trip[] = [
    {
      id: '5',
      tripId: '151515',
      fromLocation: 'City, Stat , Country',
      toLocation: 'City, Stat , Country',
      viaLocation: 'City, Stat , Country',
      date: '14, Jan, 2023',
      product: 'Plastic Cup',
      goodsType: 'Normal',
      total: '210 packages',
      coast: 'INR 2000/SB',
      price: 'INR 2000/SB',
      tripKm: '45km approx',
      cargoWeight: '14500.00 kg',
      cargoVolume: '29.50 M3',
      status: 'Completed',
      invoiceStatus: 'Pending',
    },
    {
      id: '5b',
      tripId: '151515',
      fromLocation: 'City, Stat , Country',
      toLocation: 'City, Stat , Country',
      viaLocation: 'City, Stat , Country',
      date: '14, Jan, 2023',
      product: 'Plastic Cup',
      goodsType: 'Normal',
      total: '210 packages',
      coast: 'INR 2000/SB',
      price: 'INR 2000/SB',
      tripKm: '45km approx',
      cargoWeight: '14500.00 kg',
      cargoVolume: '29.50 M3',
      status: 'Completed',
      invoiceStatus: 'Payment Transfer',
    },
  ];

  // Get trips based on active tab
  const getTripsForTab = (): Trip[] => {
    switch (activeTab) {
      case 'Yet to confirm':
        return pendingTrips;
      case 'Current':
        return currentTrips;
      case 'Upcoming':
        return upcomingTrips;
      case 'Completed':
        return completedTrips;
      default:
        return pendingTrips;
    }
  };

  const trips = getTripsForTab();

  return (
    <div className="min-h-screen">
      {/* Tabs */}
      <div className="flex items-center gap-3 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === tab
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Trip Cards */}
      <div className="space-y-4">
        {trips.map((trip) => (
          <div
            key={trip.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-5"
          >
            {/* UPCOMING TAB - Show route with locations */}
            {trip.status === 'Upcoming' && (
              <>
                <div className="flex items-start justify-between mb-4">
                  {/* Left Section: Badge + Truck + Route */}
                  <div className="flex items-start gap-3">
                    {/* LCL Badge and Truck Icon */}
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-10 h-6 bg-green-600 rounded flex items-center justify-center">
                        <span className="text-xs font-semibold text-white">LCL</span>
                      </div>
                      <div className="w-12 h-10 bg-gray-100 rounded flex items-center justify-center p-1">
                        <img
                          src="/images/1.png"
                          alt="Vehicle"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>

                    {/* Route */}
                    <div className="flex items-center gap-3 pt-1">
                      {/* Location A */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-blue-500">A</span>
                        <span className="text-sm text-gray-600">{trip.fromLocation}</span>
                      </div>
                      
                      {/* Plus Symbol */}
                      <span className="text-gray-400 text-sm">+</span>
                      
                      {/* Location B */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-blue-500">B</span>
                        <span className="text-sm text-gray-600">{trip.toLocation}</span>
                      </div>
                      
                      {/* Plus Symbol */}
                      <span className="text-gray-400 text-sm">+</span>
                      
                      {/* Location C */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-blue-500">C</span>
                        <span className="text-sm text-gray-600">{trip.viaLocation}</span>
                      </div>
                      
                      {/* Date */}
                      <div className="flex items-center gap-2 ml-4 px-3 py-1.5 bg-white border border-gray-200 rounded">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{trip.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Order ID */}
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-sm text-gray-600 font-medium">
                      Order I'd : {trip.orderId}
                    </span>
                  </div>
                </div>

                {/* Details Table */}
                <div className="bg-gray-50/80 rounded-lg p-4 mb-3">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2.5">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">Product :</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-sm text-gray-800">{trip.product}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">Trip km</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-sm text-gray-800">{trip.tripKm}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">Goods Types :</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-sm text-gray-800">{trip.goodsType}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">Cargo Weight :</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-sm text-gray-800">{trip.cargoWeight}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">Total :</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-sm text-gray-800">{trip.total}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">Cargo Volume :</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-sm text-gray-800">{trip.cargoVolume}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">Coast :</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-sm text-gray-800">{trip.coast}</span>
                    </div>
                  </div>
                </div>

                {/* View Details Link */}
                <div className="flex justify-end">
                  <button 
                    onClick={() => handleViewDetails(trip)}
                    className="text-sm text-gray-700 hover:text-blue-600 underline font-medium"
                  >
                    View Details
                  </button>
                </div>
              </>
            )}

            {/* CURRENT TAB - Show route with E-Way Bill */}
            {trip.status === 'Current' && (
              <>
                <div className="flex items-start justify-between mb-4">
                  {/* Left Section: Badge + Truck + Route */}
                  <div className="flex items-start gap-3">
                    {/* LCL Badge and Truck Icon */}
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-10 h-6 bg-green-600 rounded flex items-center justify-center">
                        <span className="text-xs font-semibold text-white">LCL</span>
                      </div>
                      <div className="w-12 h-10 bg-gray-100 rounded flex items-center justify-center p-1">
                        <img
                          src="/images/1.png"
                          alt="Vehicle"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>

                    {/* Route */}
                    <div className="flex items-center gap-3 pt-1">
                      {/* Location A */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-blue-500">A</span>
                        <span className="text-sm text-gray-600">{trip.fromLocation}</span>
                      </div>
                      
                      {/* Plus Symbol */}
                      <span className="text-gray-400 text-sm">+</span>
                      
                      {/* Location B */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-blue-500">B</span>
                        <span className="text-sm text-gray-600">{trip.toLocation}</span>
                      </div>
                      
                      {/* Plus Symbol */}
                      <span className="text-gray-400 text-sm">+</span>
                      
                      {/* Location C */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-blue-500">C</span>
                        <span className="text-sm text-gray-600">{trip.viaLocation}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Trip ID, Date, E-Way Bill */}
                  <div className="flex flex-col items-end gap-3">
                    <span className="text-sm text-gray-600 font-medium">
                      Trip I'd : {trip.tripId}
                    </span>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{trip.date}</span>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">E-Way Bill</span>
                    </button>
                  </div>
                </div>

                {/* Details Table */}
                <div className="bg-gray-50/80 rounded-lg p-4 mb-3">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2.5">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">Product :</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-sm text-gray-800">{trip.product}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">Trip km</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-sm text-gray-800">{trip.tripKm}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">Goods Types :</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-sm text-gray-800">{trip.goodsType}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">Cargo Weight :</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-sm text-gray-800">{trip.cargoWeight}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">Total :</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-sm text-gray-800">{trip.total}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">Cargo Volume :</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-sm text-gray-800">{trip.cargoVolume}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">Coast :</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-sm text-gray-800">{trip.coast}</span>
                    </div>
                  </div>
                </div>

                {/* View Details Link */}
                <div className="flex justify-end">
                  <button 
                    onClick={() => handleViewDetails(trip)}
                    className="text-sm text-gray-700 hover:text-blue-600 underline font-medium"
                  >
                    View Details
                  </button>
                </div>
              </>
            )}

            {/* COMPLETED TAB - Similar to Current but different styling */}
            {trip.status === 'Completed' && (
              <>
                <div className="flex items-start justify-between mb-4">
                  {/* Left Section: Badge + Truck only */}
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-10 h-6 bg-green-600 rounded flex items-center justify-center">
                        <span className="text-xs font-semibold text-white">LCL</span>
                      </div>
                      <div className="w-12 h-10 bg-gray-100 rounded flex items-center justify-center p-1">
                        <img
                          src="/images/1.png"
                          alt="Vehicle"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Trip ID, Date, Status */}
                  <div className="flex flex-col items-end gap-3">
                    <span className="text-sm text-gray-600 font-medium">
                      Trip I'd : {trip.tripId}
                    </span>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{trip.date}</span>
                    </div>
                    <div className="px-4 py-2 bg-white border border-gray-300 rounded-lg">
                      <span className="text-sm text-gray-700">Completed</span>
                    </div>
                  </div>
                </div>

                {/* Details Table */}
                <div className="bg-gray-50/80 rounded-lg p-4 mb-3">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2.5">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">Product :</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-sm text-gray-800">{trip.product}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">Trip km</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-sm text-gray-800">{trip.tripKm}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">Goods Types :</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-sm text-gray-800">{trip.goodsType}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">Cargo Weight :</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-sm text-gray-800">{trip.cargoWeight}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">Total :</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-sm text-gray-800">{trip.total}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">Cargo Volume :</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-sm text-gray-800">{trip.cargoVolume}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">Price :</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-sm text-gray-800">{trip.price}</span>
                    </div>
                  </div>
                </div>

                {/* Invoice Section */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                      <span className="text-sm font-medium text-gray-700">Invoice</span>
                      <Lock className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="text-sm text-gray-600">{trip.invoiceStatus}</span>
                  </div>
                  <button 
                    onClick={() => handleViewDetails(trip)}
                    className="text-sm text-gray-700 hover:text-blue-600 underline font-medium"
                  >
                    View Details
                  </button>
                </div>
              </>
            )}

            {/* YET TO CONFIRM TAB - Keep original design */}
            {trip.status === 'Yet to confirm' && (
              <>
                <div className="flex items-start justify-between mb-4">
                  {/* Left Section: Badge + Truck + Route */}
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-10 h-6 bg-green-600 rounded flex items-center justify-center">
                        <span className="text-xs font-semibold text-white">LCL</span>
                      </div>
                      <div className="w-12 h-10 bg-gray-100 rounded flex items-center justify-center p-1">
                        <img
                          src="/images/1.png"
                          alt="Vehicle"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>

                    {/* Route */}
                    <div className="flex items-center gap-3 pt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-blue-500">A</span>
                        <span className="text-sm text-gray-600">{trip.fromLocation}</span>
                      </div>
                      <span className="text-gray-400 text-sm">+</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-blue-500">B</span>
                        <span className="text-sm text-gray-600">{trip.toLocation}</span>
                      </div>
                      <span className="text-gray-400 text-sm">+</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-blue-500">C</span>
                        <span className="text-sm text-gray-600">{trip.viaLocation}</span>
                      </div>
                      <div className="flex items-center gap-2 ml-4 px-3 py-1.5 bg-white border border-gray-200 rounded">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{trip.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Section */}
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-sm text-gray-600 font-medium">
                      Order I'd : {trip.orderId}
                    </span>
                    <div className="flex flex-col gap-2">
                      <button className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors min-w-[100px]">
                        Accept
                      </button>
                      <button className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors min-w-[100px]">
                        Decline
                      </button>
                    </div>
                  </div>
                </div>

                {/* Details Table */}
                <div className="bg-gray-50/80 rounded-lg p-4 mb-3">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2.5">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">Product :</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-sm text-gray-800">{trip.product}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">Trip km</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-sm text-gray-800">{trip.tripKm}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">Goods Types :</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-sm text-gray-800">{trip.goodsType}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">Cargo Weight :</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-sm text-gray-800">{trip.cargoWeight}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">Total :</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-sm text-gray-800">{trip.total}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">Cargo Volume :</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-sm text-gray-800">{trip.cargoVolume}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">Coast :</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-sm text-gray-800">{trip.coast}</span>
                    </div>
                  </div>
                </div>

                {/* View Details Link */}
                <div className="flex justify-end">
                  <button 
                    onClick={() => handleViewDetails(trip)}
                    className="text-sm text-gray-700 hover:text-blue-600 underline font-medium"
                  >
                    View Details
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TripManagement;
