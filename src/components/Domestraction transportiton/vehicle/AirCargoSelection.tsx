import { useState } from 'react';
import { Plus } from 'lucide-react';

interface AirCargoSelectionProps {
  onCancel: () => void;
  onSelect: (cargoType: string, cargoData: { id: string; name: string; image: string }) => void;
}

const AirCargoSelection = ({ onCancel, onSelect }: AirCargoSelectionProps) => {
  const [selectedCargo, setSelectedCargo] = useState('');

  const cargoTypes = [
    { id: 'general-cargo', name: 'General Cargo', image: '/svg/a1.svg' },
    { id: 'horse-stalls', name: 'Horse Stalls', image: '/svg/a2.svg' },
    { id: 'collapsible', name: 'Collapsible', image: '/svg/a3.svg' },
    { id: 'cool', name: 'Cool', image: '/svg/a4.svg' },
    { id: 'fireproof', name: 'Fireproof', image: '/svg/a5.svg' },
    { id: 'customised', name: 'Customised', image: '/svg/a6.svg' },
  ];

  const handleSelect = () => {
    if (selectedCargo) {
      const cargoData = selectedCargo === 'custom' 
        ? { id: 'custom', name: 'Custom', image: '/svg/a1.svg' }
        : cargoTypes.find(c => c.id === selectedCargo) || { id: selectedCargo, name: selectedCargo, image: '/svg/a1.svg' };
      onSelect(selectedCargo, cargoData);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6">
      {/* Cargo Types Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {cargoTypes.map((cargo) => (
          <button
            key={cargo.id}
            onClick={() => setSelectedCargo(cargo.id)}
            className={`p-4 border-2 rounded-lg transition-all hover:shadow-md ${
              selectedCargo === cargo.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              {/* Cargo Image */}
              <div className={`w-full h-32 rounded-lg flex items-center justify-center p-3 ${
                selectedCargo === cargo.id ? 'bg-blue-50' : 'bg-gray-50'
              }`}>
                <img 
                  src={cargo.image} 
                  alt={cargo.name}
                  className="h-full object-contain"
                />
              </div>
              <span className="text-sm font-medium text-gray-700 text-center">
                {cargo.name}
              </span>
            </div>
          </button>
        ))}

        {/* Custom Cargo Button */}
        <button
          onClick={() => setSelectedCargo('custom')}
          className={`p-4 border-2 rounded-lg hover:shadow-md flex flex-col items-center justify-center gap-3 transition-all ${
            selectedCargo === 'custom'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 bg-white hover:border-blue-300'
          }`}
        >
          <div className={`w-full h-32 rounded-lg flex items-center justify-center ${
            selectedCargo === 'custom' ? 'bg-blue-50' : 'bg-blue-50'
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
          disabled={!selectedCargo}
          className={`px-8 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            !selectedCargo
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

export default AirCargoSelection;
