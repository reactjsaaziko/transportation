interface InspectionSidebarProps {
  activeMenu: string;
  onMenuChange: (menu: string) => void;
}

const InspectionSidebar = ({ activeMenu, onMenuChange }: InspectionSidebarProps) => {
  const menuItems = [
    { id: 'inspection-service', label: 'Service' },
    { id: 'inspection-order', label: 'Order' },
    { id: 'inspection-buyer', label: 'Buyer' },
    { id: 'inspection-contact', label: 'Contact us' },
    { id: 'inspection-ai', label: 'AI Assistant' },
  ];

  return (
    <div className="w-[18rem] bg-white border-r border-gray-200 min-h-screen">
      <div className="p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onMenuChange(item.id)}
            className={`w-full flex justify-between items-center px-4 py-2.5 text-sm rounded-lg transition-colors ${
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

export default InspectionSidebar;
