import { useState } from 'react';
import { ChevronDown, Truck, FileText, Warehouse, Ship, ClipboardCheck, Shield } from 'lucide-react';

interface LoadCalculatorSidebarProps {
  activeMenu: string;
  onMenuChange: (menu: string) => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const serviceTabs = [
  { id: 'Domestic Transportation', label: 'Domestic Transportation', icon: Truck },
  { id: 'CHA', label: 'CHA', icon: FileText },
  { id: 'Warehouse', label: 'Warehouse', icon: Warehouse },
  { id: 'Freight Forwarding', label: 'Freight Forwarding', icon: Ship },
  { id: 'Inspection', label: 'Inspection', icon: ClipboardCheck },
  { id: 'Insurance', label: 'Insurance', icon: Shield },
];

const LoadCalculatorSidebar: React.FC<LoadCalculatorSidebarProps> = ({ activeMenu, onMenuChange, activeTab, onTabChange }) => {
  const [isVehicleOpen, setIsVehicleOpen] = useState(true);

  return (
    <div className="w-[22rem] bg-white border-r border-gray-200 min-h-screen">
      {/* Service Tabs Section */}
      {onTabChange && (
        <div className="p-3 border-b border-gray-200">
          <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Services</h3>
          <div className="space-y-1">
            {serviceTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Menu Items Section */}
      <div className="p-3">
        <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Menu</h3>
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
            <div className="mt-2 space-y-1 ml-2">
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
