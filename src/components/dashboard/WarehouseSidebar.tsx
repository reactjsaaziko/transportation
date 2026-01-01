import { ChevronRight, Truck, FileText, Warehouse, Ship, ClipboardCheck, Shield } from 'lucide-react';

interface WarehouseSidebarProps {
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

const menuItems = [
  { id: 'manage-warehouse', label: 'Manage Warehouse' },
  { id: 'warehouse-account', label: 'Account' },
  { id: 'warehouse-order', label: 'Order' },
  { id: 'warehouse-contact-us', label: 'Contact Us' },
  { id: 'warehouse-ai-assistant', label: 'AI Assistant' },
];

const WarehouseSidebar = ({ activeMenu, onMenuChange, activeTab, onTabChange }: WarehouseSidebarProps) => {
  return (
    <div className="w-[22rem] min-h-screen border-r border-gray-200 bg-white">
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
        {menuItems.map((item) => (
          <div key={item.id} className="mb-2">
            <button
              onClick={() => onMenuChange(item.id)}
              className={`flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-sm transition-colors ${
                activeMenu === item.id
                  ? 'bg-blue-500 text-white shadow'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="font-medium">{item.label}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WarehouseSidebar;
