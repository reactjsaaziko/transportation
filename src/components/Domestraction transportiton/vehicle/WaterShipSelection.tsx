import { useState } from 'react';
import { Plus } from 'lucide-react';

interface WaterShipSelectionProps {
  onCancel: () => void;
  onSelect: (shipType: string, shipData: { id: string; name: string; image: string }) => void;
}

const WaterShipSelection = ({ onCancel, onSelect }: WaterShipSelectionProps) => {
  const [selectedShip, setSelectedShip] = useState('');

  const shipTypes = [
    { id: 'general-cargo', name: 'General cargo', image: '/svg/w1.svg' },
    { id: 'bulk-carriers', name: 'Bulk carriers', image: '/svg/w2.svg' },
    { id: 'containerships', name: 'Containerships', image: '/svg/w3.svg' },
    { id: 'tanker-market', name: 'Tanker Market', image: '/svg/w4.svg' },
    { id: 'specialized', name: 'Specialized', image: '/svg/w5.svg' },
  ];

  const handleSelect = () => {
    if (selectedShip) {
      const shipData = selectedShip === 'custom' 
        ? { id: 'custom', name: 'Custom', image: '/svg/w1.svg' }
        : shipTypes.find(s => s.id === selectedShip) || { id: selectedShip, name: selectedShip, image: '/svg/w1.svg' };
      onSelect(selectedShip, shipData);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6">
      {/* Ship Types Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {shipTypes.map((ship) => (
          <button
            key={ship.id}
            onClick={() => setSelectedShip(ship.id)}
            className={`p-4 border-2 rounded-lg transition-all hover:shadow-md ${
              selectedShip === ship.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              {/* Ship Image */}
              <div className={`w-full h-32 rounded-lg flex items-center justify-center p-3 ${
                selectedShip === ship.id ? 'bg-blue-50' : 'bg-gray-50'
              }`}>
                <img 
                  src={ship.image} 
                  alt={ship.name}
                  className="h-full object-contain"
                />
              </div>
              <span className="text-sm font-medium text-gray-700 text-center">
                {ship.name}
              </span>
            </div>
          </button>
        ))}

        {/* Custom Ship Button */}
        <button
          onClick={() => setSelectedShip('custom')}
          className={`p-4 border-2 rounded-lg hover:shadow-md flex flex-col items-center justify-center gap-3 transition-all ${
            selectedShip === 'custom'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 bg-white hover:border-blue-300'
          }`}
        >
          <div className={`w-full h-32 rounded-lg flex items-center justify-center ${
            selectedShip === 'custom' ? 'bg-blue-50' : 'bg-blue-50'
          }`}>
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
          disabled={!selectedShip}
          className={`px-8 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            !selectedShip
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

export default WaterShipSelection;
