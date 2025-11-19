interface FreightSidebarProps {
  activeMenu: string;
  onMenuChange: (menu: string) => void;
}

const FreightSidebar = ({ activeMenu, onMenuChange }: FreightSidebarProps) => {
  const menuItems = [
    { id: 'freight-service', label: 'Service' },
    { id: 'freight-order', label: 'Order' },
    { id: 'freight-contact', label: 'Contact us' },
    { id: 'freight-ai', label: 'AI Assistant' },
  ];

  return (
    <div className="w-[22rem] min-h-screen border-r border-gray-200 bg-white">
      <div className="p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onMenuChange(item.id)}
            className={`flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-sm transition-colors ${
              activeMenu === item.id
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="font-medium">{item.label}</span>
            <span className="text-lg leading-none">›</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FreightSidebar;
