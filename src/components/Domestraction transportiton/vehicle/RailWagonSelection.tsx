import { useState } from 'react';
import { Plus } from 'lucide-react';

interface RailWagonSelectionProps {
  onCancel: () => void;
  onSelect: (wagonType: string) => void;
}

const RailWagonSelection = ({ onCancel, onSelect }: RailWagonSelectionProps) => {
  const [selectedWagon, setSelectedWagon] = useState('');

  const wagonTypes = [
    { id: 'open-wagon', name: 'Open wagon', image: '/svg/r1.svg' },
    { id: 'covered-wagon', name: 'Covered wagon', image: '/svg/r2.svg' },
    { id: 'tank-wagon', name: 'Tank wagon', image: '/svg/r3.svg' },
    { id: 'flat-wagon', name: 'Flat wagon', image: '/svg/r4.svg' },
    { id: 'brake-van', name: 'Brake van', image: '/svg/r5.svg' },
    { id: 'hopper-wagon', name: 'Hopper wagon', image: '/svg/r6.svg' },
  ];

  const handleSelect = () => {
    if (selectedWagon) {
      onSelect(selectedWagon);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6">
      {/* Wagon Types Grid */}
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
              {/* Wagon Image */}
              <div className={`w-full h-32 rounded-lg flex items-center justify-center p-3 ${
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

        {/* Custom Wagon Button */}
        <button
          className="p-4 border-2 border-gray-200 rounded-lg hover:shadow-md flex flex-col items-center justify-center gap-3 bg-white hover:border-blue-300 transition-all"
        >
          <div className="w-full h-32 rounded-lg flex items-center justify-center bg-blue-50">
            <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center">
              <Plus className="w-8 h-8 text-white" />
            </div>
          </div>
          <span className="text-sm font-medium text-gray-700 text-center">
            Custom
          </span>
        </button>
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
          onClick={handleSelect}
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
  );
};

export default RailWagonSelection;
