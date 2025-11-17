interface ServiceTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ServiceTabs = ({ activeTab, onTabChange }: ServiceTabsProps) => {
  const tabs = [
    { id: 'Domestic Transportation', label: 'Domestic Transportation' },
    { id: 'CHA', label: 'CHA' },
    { id: 'Warehouse', label: 'Warehouse' },
    { id: 'Freight Forwarding', label: 'Freight Forwarding' },
    { id: 'Inspection', label: 'Inspection' },
    { id: 'Insurance', label: 'Insurance' },
  ];

  return (
    <div className="flex items-center gap-3 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === tab.id
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default ServiceTabs;
