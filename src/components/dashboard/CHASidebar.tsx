import { ChevronRight } from 'lucide-react';

interface CHASidebarProps {
  activeMenu: string;
  onMenuChange: (menu: string) => void;
}

const CHASidebar: React.FC<CHASidebarProps> = ({ activeMenu, onMenuChange }) => {
  const menuItems = [
    {
      id: 'service',
      label: 'Service',
    },
    {
      id: 'order',
      label: 'Order',
    },
    {
      id: 'contact-us',
      label: 'Contact us',
    },
    {
      id: 'ai-assistant',
      label: 'AI Assistant',
    },
  ];

  return (
    <div className="w-[22rem] bg-white border-r border-gray-200 min-h-screen">
      <div className="p-3">
        {menuItems.map((item) => (
          <div key={item.id} className="mb-2">
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
          </div>
        ))}
      </div>
    </div>
  );
};

export { CHASidebar };
export default CHASidebar;
