import { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Truck,
  FileText,
  Warehouse,
  Ship,
  ClipboardCheck,
  Shield,
} from 'lucide-react';

interface SidebarProps {
  activeMenu: string;
  onMenuChange: (menu: string) => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

// Menu items for each service
const serviceMenuItems: Record<
  string,
  Array<{
    id: string;
    label: string;
    hasDropdown?: boolean;
    subItems?: Array<{ id: string; label: string }>;
  }>
> = {
  'Domestic Transportation': [
    {
      id: 'vehicle',
      label: 'Vehicle',
      hasDropdown: true,
      subItems: [
        { id: 'add-vehicle', label: 'Add New Vehicle' },
        { id: 'manage-vehicle', label: 'Manage Vehicle' },
      ],
    },
    { id: 'trip', label: 'Trip' },
    { id: 'account', label: 'Account' },
    { id: 'contact-us', label: 'Contact Us' },
    { id: 'ai-assistant', label: 'AI Assistant' },
  ],
  CHA: [
    { id: 'service', label: 'Service' },
    { id: 'order', label: 'Order' },
    { id: 'contact-us', label: 'Contact Us' },
    { id: 'ai-assistant', label: 'AI Assistant' },
  ],
  Warehouse: [
    { id: 'manage-warehouse', label: 'Manage Warehouse' },
    { id: 'warehouse-account', label: 'Account' },
    { id: 'warehouse-order', label: 'Order' },
    { id: 'warehouse-contact-us', label: 'Contact Us' },
    { id: 'warehouse-ai-assistant', label: 'AI Assistant' },
  ],
  'Freight Forwarding': [
    { id: 'freight-service', label: 'Service' },
    { id: 'freight-order', label: 'Order' },
    { id: 'freight-contact', label: 'Contact Us' },
    { id: 'freight-ai', label: 'AI Assistant' },
  ],
  Inspection: [
    { id: 'inspection-service', label: 'Service' },
    { id: 'inspection-order', label: 'Order' },
    { id: 'inspection-contact', label: 'Contact Us' },
    { id: 'inspection-ai', label: 'AI Assistant' },
  ],
  Insurance: [
    { id: 'insurance-service', label: 'Service' },
    { id: 'insurance-order', label: 'Order' },
    { id: 'insurance-contact', label: 'Contact Us' },
    { id: 'insurance-ai', label: 'AI Assistant' },
  ],
};

const serviceTabs = [
  { id: 'Domestic Transportation', label: 'Domestic Transportation', icon: Truck, comingSoon: false },
  { id: 'CHA', label: 'CHA', icon: FileText, comingSoon: false },
  { id: 'Warehouse', label: 'Warehouse', icon: Warehouse, comingSoon: false },
  { id: 'Freight Forwarding', label: 'Freight Forwarding', icon: Ship, comingSoon: false },
  { id: 'Inspection', label: 'Inspection', icon: ClipboardCheck, comingSoon: false },
  { id: 'Insurance', label: 'Insurance', icon: Shield, comingSoon: true },
];

// Animated dropdown component
interface AnimatedDropdownProps {
  isOpen: boolean;
  children: React.ReactNode;
}

const AnimatedDropdown: React.FC<AnimatedDropdownProps> = ({ isOpen, children }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen, children]);

  return (
    <div
      className="overflow-hidden transition-all duration-300 ease-in-out"
      style={{ height: `${height}px` }}
    >
      <div ref={contentRef}>
        {children}
      </div>
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({
  activeMenu,
  onMenuChange,
  activeTab = 'Domestic Transportation',
  onTabChange,
}) => {
  const [expandedService, setExpandedService] = useState<string | null>(activeTab);
  const [isVehicleOpen, setIsVehicleOpen] = useState(true);

  const handleTabClick = (tabId: string) => {
    if (expandedService === tabId) {
      setExpandedService(null);
    } else {
      setExpandedService(tabId);
      if (onTabChange) {
        onTabChange(tabId);
      }
    }
  };

  const renderMenuItems = (items: (typeof serviceMenuItems)['Domestic Transportation']) => {
    return items.map((item, index) => {
      const isSectionActive =
        item.hasDropdown && item.subItems?.some((sub) => sub.id === activeMenu);

      return (
        <div
          key={item.id}
          className="mb-1 animate-fadeIn"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {item.hasDropdown && item.subItems && item.subItems.length > 0 ? (
            <>
              <button
                onClick={() => {
                  if (item.id === 'vehicle') {
                    setIsVehicleOpen((prev) => !prev);
                  }
                }}
                className={`w-full flex items-center justify-between px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                  isSectionActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:translate-x-1'
                }`}
              >
                <span className="font-medium">{item.label}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    item.id === 'vehicle' && isVehicleOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatedDropdown isOpen={item.id === 'vehicle' && isVehicleOpen}>
                <div className="mt-1 space-y-1 ml-3">
                  {item.subItems?.map((subItem, subIndex) => (
                    <button
                      key={subItem.id}
                      onClick={() => onMenuChange(subItem.id)}
                      className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                        activeMenu === subItem.id
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-gray-600 hover:bg-gray-50 hover:translate-x-1'
                      }`}
                      style={{ animationDelay: `${subIndex * 30}ms` }}
                    >
                      {subItem.label}
                    </button>
                  ))}
                </div>
              </AnimatedDropdown>
            </>
          ) : (
            <button
              onClick={() => onMenuChange(item.id)}
              className={`w-full flex items-center justify-between px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                activeMenu === item.id
                  ? 'bg-blue-100 text-blue-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 hover:translate-x-1'
              }`}
            >
              <span>{item.label}</span>
            </button>
          )}
        </div>
      );
    });
  };

  return (
    <div className="w-[22rem] bg-white border-r border-gray-200 min-h-screen">
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out forwards;
          }
        `}
      </style>
      <div className="p-3">
        <h3 className="px-3 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Services
        </h3>
        <div className="space-y-1">
          {serviceTabs.map((tab) => {
            const Icon = tab.icon;
            const isExpanded = expandedService === tab.id;
            const isActive = activeTab === tab.id;
            const menuItems = serviceMenuItems[tab.id] || [];

            return (
              <div key={tab.id}>
                {/* Service Tab Button */}
                <button
                  onClick={() => !tab.comingSoon && handleTabClick(tab.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-all duration-200 ${
                    tab.comingSoon
                      ? 'text-gray-400 cursor-not-allowed'
                      : isActive
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${isExpanded && !tab.comingSoon ? 'scale-110' : ''}`} />
                    <span className="font-medium">{tab.label}</span>
                    {tab.comingSoon && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-600 rounded-full">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  {!tab.comingSoon && menuItems.length > 0 && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  )}
                </button>

                {/* Menu Items Dropdown with Animation - Only show if not coming soon */}
                {!tab.comingSoon && (
                  <AnimatedDropdown isOpen={isExpanded}>
                    <div className="mt-2 ml-4 pl-3 space-y-1 pb-2">
                      {renderMenuItems(menuItems)}
                    </div>
                  </AnimatedDropdown>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export { Sidebar, serviceTabs, serviceMenuItems };
export default Sidebar;
