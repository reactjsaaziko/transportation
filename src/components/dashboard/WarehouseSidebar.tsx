import { ChevronRight } from 'lucide-react';

interface WarehouseSidebarProps {
  activeMenu: string;
  onMenuChange: (menu: string) => void;
}

const menuItems = [
  { id: 'manage-warehouse', label: 'Manage warehouse' },
  { id: 'warehouse-account', label: 'Account' },
  { id: 'warehouse-order', label: 'Order' },
  { id: 'warehouse-contact-us', label: 'Contact us' },
  { id: 'warehouse-ai-assistant', label: 'AI Assistant' },
];

const WarehouseSidebar = ({ activeMenu, onMenuChange }: WarehouseSidebarProps) => {
  return (
    <div className="w-[22rem] min-h-screen border-r border-gray-200 bg-white">
      <div className="p-3">
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
