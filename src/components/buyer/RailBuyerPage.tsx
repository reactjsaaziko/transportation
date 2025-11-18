import { useState } from 'react';
import { Calendar, Plus } from 'lucide-react';
import { useNavigate } from 'react-router';

type TransportMode = 'Road' | 'Rail' | 'Air' | 'Water';

const RailBuyerPage = () => {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<TransportMode>('Rail');
  const [selectedWagon, setSelectedWagon] = useState('');

  const handleSubmit = () => {
    navigate('/dashboard/order-submission');
  };

  const wagonTypes = [
    { id: 'open-wagon', name: 'Open wagon', image: '/svg/r1.svg' },
    { id: 'covered-wagon', name: 'Covered wagon', image: '/svg/r2.svg' },
    { id: 'tank-wagon', name: 'Tank wagon', image: '/svg/r3.svg' },
    { id: 'flat-wagon', name: 'Flat wagon', image: '/svg/r4.svg' },
    { id: 'brake-van', name: 'Brake van', image: '/svg/r5.svg' },
    { id: 'hopper-wagon', name: 'Hopper wagon', image: '/svg/r6.svg' },
    { id: 'well-wagon', name: 'Well wagon', image: '/svg/r3.svg' },
  ];

  const wagonSpecs = [
    { type: 'TATA ACE', size: '7 L x 4.8 W x 4.8 H', weight: 'Max Load 850 Kgs', type2: 'TAURUS 25 T (14 TYRE)', size2: '24 L x 7.3 W x 7 H', weight2: 'Max Load 21 Ton' },
    { type: 'ASHOK LEYLAND DOST', size: '7 L x 4.8 W x 4.8 H', weight: 'Max Load 1 Ton', type2: 'TAURUS 21 T (12 TYRE)', size2: '28 L x 7.8 W x 7 H', weight2: 'Max Load 25 Ton' },
    { type: 'MAHINDRA BOLERO PICK UP', size: '8 L x 4.8 W x 4.8 H', weight: 'Max Load 1.5 Ton', type2: 'CONTAINER 20 FT', size2: '20 L x 8 W x 8.6 H', weight2: 'Max Load 6.5 Ton' },
    { type: 'TATA 407', size: '9 L x 5.5 W x 5 H', weight: 'Max Load 2.5 Ton', type2: '20 FEET OPEN ALL SIDE (ODC)', size2: '32 L x 8 W x 8 H', weight2: 'Max Load 18 Ton' },
    { type: 'EICHER 14 FEET', size: '14 L x 6 W x 6.5 H', weight: 'Max Load 4 Ton', type2: '28-32 FEET OPEN-TRAILOR JCB ODC', size2: '32 L x 8 W x 8 H', weight2: 'Max Load 20 Ton' },
    { type: 'EICHER 19 FEET', size: '17 L x 6 W x 7 H', weight: 'Max Load 5 Ton', type2: '32 FEET OPEN-TRAILOR ODC', size2: '32 L x 8 W x 10 H', weight2: 'Max Load 7/14 Ton' },
    { type: 'EICHER 17 FEET', size: '19 L x 7 W x 7 H', weight: 'Max Load 7/8/9 Ton', type2: 'EICHER 17 FEET', size2: '20 L x 8 W x 8 H', weight2: 'Max Load 7 Ton' },
    { type: 'TATA 22 FEET', size: '22 L x 7.5 W x 7 H', weight: 'Max Load 10 Ton', type2: '40 FEET OPEN-TRAILOR ODC', size2: '32 L x 8 W x 12 H', weight2: 'Max Load 7 Ton' },
    { type: 'TATA TRUCK (6 TYRE)', size: '17.5 L x 7 W x 7 H', weight: 'Max Load 9 Ton', type2: 'TAURUS 21 T (12 TYRE)', size2: '40 L x 8 W x 8 H', weight2: 'Max Load 32 Ton' },
  ];

  const countries = ['India', 'China', 'Bangladesh', 'Vietnam'];
  const states = ['Gujarat', 'Maharashtra', 'Karnataka', 'Tamil Nadu'];
  const cities = ['Surat', 'Mumbai', 'Bangalore', 'Chennai'];

  return (
    <div className="pb-12">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl border border-gray-200 bg-white shadow-sm">
          {/* Header Section */}
          <div className="border-b border-gray-100 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <button className="rounded-xl bg-blue-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600">
                  + Add Truck
                </button>
                
                <select className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none">
                  {countries.map(country => (
                    <option key={country}>{country}</option>
                  ))}
                </select>

                <div className="flex flex-wrap items-center gap-2">
                  {(['Road', 'Rail', 'Air', 'Water'] as TransportMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setSelectedMode(mode)}
                      className={`rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
                        selectedMode === mode
                          ? 'border-blue-500 bg-blue-50 text-blue-600'
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="text-sm text-gray-600">No. of Wagon</div>
            </div>
          </div>

          {/* Truck Type Table */}
          <div className="border-b border-gray-100 px-6 py-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-3 text-left font-semibold text-gray-700">Truck Type</th>
                    <th className="pb-3 text-left font-semibold text-gray-700">Size (FT)</th>
                    <th className="pb-3 text-left font-semibold text-gray-700">Max Weight</th>
                    <th className="pb-3 text-left font-semibold text-gray-700">Truck Type</th>
                    <th className="pb-3 text-left font-semibold text-gray-700">Size (FT)</th>
                    <th className="pb-3 text-left font-semibold text-gray-700">Max Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {wagonSpecs.map((spec, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-2.5 font-medium text-gray-800">{spec.type}</td>
                      <td className="py-2.5 text-gray-600">{spec.size}</td>
                      <td className="py-2.5 text-gray-600">{spec.weight}</td>
                      <td className="py-2.5 font-medium text-gray-800">{spec.type2}</td>
                      <td className="py-2.5 text-gray-600">{spec.size2}</td>
                      <td className="py-2.5 text-gray-600">{spec.weight2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Wagon Selection Section */}
          <div className="border-b border-gray-100 p-6">
            <div className="mb-4">
              <select className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none w-64">
                <option>Select Your Model</option>
              </select>
            </div>
            
            <div className="grid grid-cols-4 gap-4 mb-6">
              {wagonTypes.map((wagon) => (
                <button
                  key={wagon.id}
                  onClick={() => setSelectedWagon(wagon.id)}
                  className={`p-4 border-2 rounded-lg transition-all hover:shadow-md ${
                    selectedWagon === wagon.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className={`w-full h-24 rounded-lg flex items-center justify-center p-3 ${
                      selectedWagon === wagon.id ? 'bg-blue-50' : 'bg-gray-50'
                    }`}>
                      <img 
                        src={wagon.image} 
                        alt={wagon.name}
                        className="h-full object-contain"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700 text-center">
                      {wagon.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-3">
              <button 
                onClick={() => setSelectedWagon('')}
                className="px-8 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                disabled={!selectedWagon}
                className={`px-8 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  !selectedWagon
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Select
              </button>
            </div>
          </div>

          {/* Origin Section */}
          <div className="border-b border-gray-100 p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-700">Origin</h3>
            
            {/* Country, State, City Selection with Dropdowns */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Country</label>
                <select className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none">
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">State</label>
                <select className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none">
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Cities</label>
                <select className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none">
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Personal Name and Date */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Personal Name</label>
                <input
                  type="text"
                  placeholder="Personal Name"
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Date</label>
                <div className="flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 shadow-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>14, Jan 2023</span>
                </div>
              </div>
            </div>

            {/* E-mail */}
            <div className="space-y-2 mb-4">
              <label className="text-sm font-medium text-gray-600">E-mail</label>
              <input
                type="email"
                placeholder="E-mail"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Contact Number */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Contact Number</label>
              <input
                type="tel"
                placeholder="Contact Number"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Destination Section */}
          <div className="border-b border-gray-100 p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-700">Destination</h3>
            
            {/* Country, State, City Selection with Dropdowns */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Country</label>
                <select className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none">
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">State</label>
                <select className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none">
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Cities</label>
                <select className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none">
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Receiver Name and Date */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Receiver Name</label>
                <input
                  type="text"
                  placeholder="Receiver Name"
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Date</label>
                <div className="flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 shadow-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>14, Jan 2023</span>
                </div>
              </div>
            </div>

            {/* Contact Number */}
            <div className="space-y-2 mb-6">
              <label className="text-sm font-medium text-gray-600">Contact Number</label>
              <input
                type="tel"
                placeholder="Contact Number"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Add Button */}
            <div>
              <button className="flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600">
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="p-6 flex justify-center">
            <button 
              onClick={handleSubmit}
              className="rounded-2xl bg-blue-500 px-12 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RailBuyerPage;
