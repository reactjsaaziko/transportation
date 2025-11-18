import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface SidebarProps {
  activeMenu: string;
  onMenuChange: (menu: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeMenu, onMenuChange }) => {
  const [isVehicleOpen, setIsVehicleOpen] = useState(false);
  const [isBuyerOpen, setIsBuyerOpen] = useState(false);

  const menuItems = [
    {
      id: 'vehicle',
      label: 'Vehicle',
      hasDropdown: true,
      subItems: [
        { id: 'add-vehicle', label: 'Add New Vehicle' },
        { id: 'manage-vehicle', label: 'Manage Vehicle' },
      ],
    },
    {
      id: 'buyer',
      label: 'Buyer',
      hasDropdown: true,
      subItems: [
        { id: 'buyer', label: 'Road' },
        { id: 'rail-buyer', label: 'Rail' },
        { id: 'air-buyer', label: 'Air' },
        { id: 'water-buyer', label: 'Water' },
      ],
    },
    {
      id: 'trip',
      label: 'Trip',
      hasDropdown: false,
    },
    {
      id: 'account',
      label: 'Account',
      hasDropdown: false,
    },
    {
      id: 'contact-us',
      label: 'Contatc Us',
      hasDropdown: false,
    },
    {
      id: 'ai-assistant',
      label: 'Ai Assitant',
      hasDropdown: false,
    },
  ];

  return (
    <div className="w-[22rem] bg-white border-r border-gray-200 min-h-screen">
      <div className="p-3">
        {menuItems.map((item) => {
          const isSectionActive =
            item.hasDropdown && item.subItems?.some((sub) => sub.id === activeMenu);

          return (
            <div key={item.id} className="mb-2">
              {item.hasDropdown ? (
                <>
                  <button
                    onClick={() => {
                      if (item.id === 'vehicle') {
                        setIsVehicleOpen((prev) => !prev);
                      } else if (item.id === 'buyer') {
                        setIsBuyerOpen((prev) => !prev);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-lg transition-colors ${
                      isSectionActive
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="font-medium">{item.label}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        (item.id === 'vehicle' && isVehicleOpen) || (item.id === 'buyer' && isBuyerOpen) ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {((item.id === 'vehicle' && isVehicleOpen) || (item.id === 'buyer' && isBuyerOpen)) && item.subItems && (
                    <div className="mt-2 space-y-1">
                      {item.subItems.map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={() => onMenuChange(subItem.id)}
                          className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${
                            activeMenu === subItem.id
                              ? 'bg-blue-50 text-blue-700 font-semibold'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {subItem.label}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => onMenuChange(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-lg transition-colors ${
                    activeMenu === item.id
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { Sidebar };
export default Sidebar;
