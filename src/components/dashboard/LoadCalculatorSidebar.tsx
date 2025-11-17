import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface LoadCalculatorSidebarProps {
  activeMenu: string;
  onMenuChange: (menu: string) => void;
}

const LoadCalculatorSidebar: React.FC<LoadCalculatorSidebarProps> = ({ activeMenu, onMenuChange }) => {
  const [isVehicleOpen, setIsVehicleOpen] = useState(true);

  return (
    <div className="w-[22rem] bg-white border-r border-gray-200 min-h-screen">
      <div className="p-3">
        {/* Vehicle Dropdown */}
        <div className="mb-2">
          <button
            onClick={() => setIsVehicleOpen((prev) => !prev)}
            className="w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-lg transition-colors bg-blue-500 text-white"
          >
            <span className="font-medium">Vehicle</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                isVehicleOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
          {isVehicleOpen && (
            <div className="mt-2 space-y-1">
              <button
                onClick={() => onMenuChange('add-vehicle')}
                className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${
                  activeMenu === 'add-vehicle'
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Add New Vehicle
              </button>
              <button
                onClick={() => onMenuChange('manage-vehicle')}
                className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${
                  activeMenu === 'manage-vehicle'
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Manage Vehicle
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadCalculatorSidebar;
