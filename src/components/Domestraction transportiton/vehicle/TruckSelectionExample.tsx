import React, { useState } from 'react';
import TruckSelectionModal from './TruckSelectionModal';

/**
 * Example Usage of TruckSelectionModal Component
 * 
 * This demonstrates how to use the TruckSelectionModal in your application.
 */
const TruckSelectionExample: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTruckSelect = (truckId: string) => {
    console.log('Selected truck ID:', truckId);
    // Handle the selected truck here
    // e.g., save to state, send to API, etc.
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Truck Selection Modal Demo
        </h1>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-lg bg-blue-500 px-8 py-3 text-white font-semibold shadow-lg hover:bg-blue-600 transition"
        >
          Open Truck Selection Modal
        </button>

        <div className="mt-8 text-sm text-gray-600 max-w-md mx-auto">
          <p className="mb-4">
            Click the button above to open the modal and select a truck type.
          </p>
          <p>
            Features:
          </p>
          <ul className="list-disc list-inside text-left mt-2 space-y-1">
            <li>Container & Truck tabs</li>
            <li>Responsive grid layout (1, 2, or 3 columns)</li>
            <li>Card selection with blue border highlight</li>
            <li>SVG truck illustrations</li>
            <li>Smooth animations and transitions</li>
            <li>Backdrop blur effect</li>
          </ul>
        </div>
      </div>

      {/* Truck Selection Modal */}
      <TruckSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleTruckSelect}
      />
    </div>
  );
};

export default TruckSelectionExample;
