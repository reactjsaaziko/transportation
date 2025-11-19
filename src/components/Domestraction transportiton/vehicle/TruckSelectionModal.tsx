import React, { useState } from 'react';
import { X, LayoutGrid, Truck } from 'lucide-react';

interface TruckSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (truckId: string) => void;
}

type TabType = 'container' | 'truck';

interface TruckOption {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const TruckSelectionModal: React.FC<TruckSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('truck');
  const [selectedTruckId, setSelectedTruckId] = useState<string | null>(TRUCK_OPTIONS[0]?.id ?? null);

  if (!isOpen) return null;

  const handleSelect = () => {
    if (selectedTruckId) {
      console.log('Selected truck:', selectedTruckId);
      onSelect(selectedTruckId);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[900px] overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">Container & Truck Type</h2>
          <button
            type="button"
            className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-gray-200 px-6">
          <button
            type="button"
            onClick={() => setActiveTab('container')}
            className={`relative flex items-center gap-2 border-b-2 px-2 pb-3 pt-4 text-sm font-semibold transition-colors ${
              activeTab === 'container'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <LayoutGrid className={`h-4 w-4 ${activeTab === 'container' ? 'text-blue-500' : 'text-gray-400'}`} />
            Container
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('truck')}
            className={`relative flex items-center gap-2 border-b-2 px-2 pb-3 pt-4 text-sm font-semibold transition-colors ${
              activeTab === 'truck'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Truck className={`h-4 w-4 ${activeTab === 'truck' ? 'text-blue-500' : 'text-gray-400'}`} />
            Truck
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[600px] overflow-y-auto p-8">
          {activeTab === 'container' && (
            <div className="flex min-h-[300px] items-center justify-center">
              <p className="text-sm text-gray-500">Container selection coming soon...</p>
            </div>
          )}

          {activeTab === 'truck' && (
            <TruckCardGrid
              trucks={TRUCK_OPTIONS}
              selectedId={selectedTruckId}
              onSelect={setSelectedTruckId}
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4">
          <button
            type="button"
            className="rounded-lg bg-gray-200 px-6 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`rounded-lg px-8 py-2.5 text-sm font-semibold text-white shadow-sm transition ${
              selectedTruckId
                ? 'bg-[#4A90FF] hover:bg-[#3A80EF]'
                : 'cursor-not-allowed bg-blue-200'
            }`}
            disabled={!selectedTruckId}
            onClick={handleSelect}
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
};

// TruckCardGrid Component
interface TruckCardGridProps {
  trucks: TruckOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const TruckCardGrid: React.FC<TruckCardGridProps> = ({ trucks, selectedId, onSelect }) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {trucks.map((truck) => (
        <TruckCard
          key={truck.id}
          truck={truck}
          isSelected={selectedId === truck.id}
          onSelect={() => onSelect(truck.id)}
        />
      ))}
    </div>
  );
};

// TruckCard Component
interface TruckCardProps {
  truck: TruckOption;
  isSelected: boolean;
  onSelect: () => void;
}

const TruckCard: React.FC<TruckCardProps> = ({ truck, isSelected, onSelect }) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative flex flex-col items-center rounded-2xl border-2 bg-white p-6 transition-all duration-200 ${
        isSelected
          ? 'border-[#4A90FF] shadow-lg shadow-blue-100/50'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
      }`}
    >
      {/* Truck Title */}
      <h3 className="mb-6 min-h-[40px] text-center text-sm font-semibold text-gray-800">
        {truck.name}
      </h3>

      {/* Truck Icon/Illustration */}
      <div className="mb-6 flex h-32 w-full items-center justify-center rounded-xl bg-gray-50 p-4">
        {truck.icon}
      </div>

      {/* Learn More Link */}
      <p
        className={`text-xs font-semibold uppercase tracking-wide transition-colors ${
          isSelected ? 'text-blue-500' : 'text-gray-400 group-hover:text-blue-400'
        }`}
      >
        Learn More
      </p>
    </button>
  );
};

// Truck Icon Components (SVG Illustrations)
const TautlinerIcon = () => (
  <svg viewBox="0 0 120 60" className="h-full w-full max-w-[200px]" fill="none">
    <defs>
      <linearGradient id="tautliner-grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#a8b8d8" />
        <stop offset="100%" stopColor="#9dacc4" />
      </linearGradient>
    </defs>
    {/* Trailer */}
    <rect x="15" y="20" width="65" height="22" rx="2" fill="url(#tautliner-grad)" stroke="#6b7fa8" strokeWidth="1.5" />
    {/* Vertical lines for curtain effect */}
    {[...Array(10)].map((_, i) => (
      <line
        key={i}
        x1={20 + i * 6}
        y1="22"
        x2={20 + i * 6}
        y2="40"
        stroke="#7a8aa8"
        strokeWidth="0.8"
        opacity="0.5"
      />
    ))}
    {/* Cab */}
    <path
      d="M 80 42 L 80 22 Q 80 20 82 20 L 100 20 Q 102 20 102 22 L 102 42 Z"
      fill="#9eaec7"
      stroke="#6b7fa8"
      strokeWidth="1.5"
    />
    {/* Windshield */}
    <rect x="84" y="22" width="14" height="8" rx="1" fill="#6b7f9e" stroke="#6b7fa8" strokeWidth="1" />
    {/* Side window */}
    <rect x="84" y="32" width="8" height="6" rx="1" fill="#6b7f9e" stroke="#6b7fa8" strokeWidth="1" />
    {/* Wheels */}
    <circle cx="95" cy="45" r="4" fill="#3a4a5e" stroke="#556275" strokeWidth="1.5" />
    <circle cx="95" cy="45" r="2" fill="#7a8494" />
    <circle cx="30" cy="45" r="4" fill="#3a4a5e" stroke="#556275" strokeWidth="1.5" />
    <circle cx="30" cy="45" r="2" fill="#7a8494" />
    <circle cx="38" cy="45" r="4" fill="#3a4a5e" stroke="#556275" strokeWidth="1.5" />
    <circle cx="38" cy="45" r="2" fill="#7a8494" />
  </svg>
);

const RefrigeratedTruckIcon = () => (
  <svg viewBox="0 0 120 60" className="h-full w-full max-w-[200px]" fill="none">
    <defs>
      <linearGradient id="reefer-grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#a8b8d8" />
        <stop offset="100%" stopColor="#9dacc4" />
      </linearGradient>
    </defs>
    {/* Trailer */}
    <rect x="15" y="20" width="65" height="22" rx="2" fill="url(#reefer-grad)" stroke="#6b7fa8" strokeWidth="1.5" />
    {/* Cooling unit */}
    <rect x="18" y="23" width="10" height="16" rx="1" fill="#7c94bf" stroke="#6b7fa8" strokeWidth="1.2" />
    <line x1="20" y1="26" x2="20" y2="36" stroke="#5a7199" strokeWidth="1.5" />
    <line x1="26" y1="26" x2="26" y2="36" stroke="#5a7199" strokeWidth="1.5" />
    {/* Snowflake icon */}
    <circle cx="23" cy="31" r="2.5" fill="#4a9fef" opacity="0.9" />
    <line x1="23" y1="28.5" x2="23" y2="33.5" stroke="white" strokeWidth="1" />
    <line x1="20.5" y1="31" x2="25.5" y2="31" stroke="white" strokeWidth="1" />
    <line x1="21.2" y1="28.8" x2="24.8" y2="33.2" stroke="white" strokeWidth="0.8" />
    <line x1="21.2" y1="33.2" x2="24.8" y2="28.8" stroke="white" strokeWidth="0.8" />
    {/* Cab */}
    <path
      d="M 80 42 L 80 22 Q 80 20 82 20 L 100 20 Q 102 20 102 22 L 102 42 Z"
      fill="#9eaec7"
      stroke="#6b7fa8"
      strokeWidth="1.5"
    />
    <rect x="84" y="22" width="14" height="8" rx="1" fill="#6b7f9e" stroke="#6b7fa8" strokeWidth="1" />
    <rect x="84" y="32" width="8" height="6" rx="1" fill="#6b7f9e" stroke="#6b7fa8" strokeWidth="1" />
    {/* Wheels */}
    <circle cx="95" cy="45" r="4" fill="#3a4a5e" stroke="#556275" strokeWidth="1.5" />
    <circle cx="95" cy="45" r="2" fill="#7a8494" />
    <circle cx="30" cy="45" r="4" fill="#3a4a5e" stroke="#556275" strokeWidth="1.5" />
    <circle cx="38" cy="45" r="4" fill="#3a4a5e" stroke="#556275" strokeWidth="1.5" />
  </svg>
);

const IsothermTruckIcon = () => (
  <svg viewBox="0 0 120 60" className="h-full w-full max-w-[200px]" fill="none">
    <defs>
      <linearGradient id="isotherm-grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#a8b8d8" />
        <stop offset="100%" stopColor="#9dacc4" />
      </linearGradient>
    </defs>
    {/* Trailer with insulation lines */}
    <rect x="15" y="20" width="65" height="22" rx="2" fill="url(#isotherm-grad)" stroke="#6b7fa8" strokeWidth="1.5" />
    <rect x="17" y="22" width="61" height="18" rx="1" fill="none" stroke="#7a8aa8" strokeWidth="1" strokeDasharray="3 2" opacity="0.6" />
    {/* Cooling unit smaller */}
    <rect x="18" y="25" width="8" height="12" rx="1" fill="#8ca4c4" stroke="#6b7fa8" strokeWidth="1" />
    <line x1="20" y1="27" x2="20" y2="35" stroke="#6a8ab0" strokeWidth="1" />
    <line x1="24" y1="27" x2="24" y2="35" stroke="#6a8ab0" strokeWidth="1" />
    {/* Temperature icon */}
    <circle cx="22" cy="31" r="2" fill="#4a9fef" opacity="0.8" />
    {/* Cab */}
    <path
      d="M 80 42 L 80 22 Q 80 20 82 20 L 100 20 Q 102 20 102 22 L 102 42 Z"
      fill="#9eaec7"
      stroke="#6b7fa8"
      strokeWidth="1.5"
    />
    <rect x="84" y="22" width="14" height="8" rx="1" fill="#6b7f9e" stroke="#6b7fa8" strokeWidth="1" />
    <rect x="84" y="32" width="8" height="6" rx="1" fill="#6b7f9e" stroke="#6b7fa8" strokeWidth="1" />
    {/* Wheels */}
    <circle cx="95" cy="45" r="4" fill="#3a4a5e" stroke="#556275" strokeWidth="1.5" />
    <circle cx="95" cy="45" r="2" fill="#7a8494" />
    <circle cx="30" cy="45" r="4" fill="#3a4a5e" stroke="#556275" strokeWidth="1.5" />
    <circle cx="38" cy="45" r="4" fill="#3a4a5e" stroke="#556275" strokeWidth="1.5" />
  </svg>
);

const MegaTrailerIcon = () => (
  <svg viewBox="0 0 120 60" className="h-full w-full max-w-[200px]" fill="none">
    <defs>
      <linearGradient id="mega-grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#a8b8d8" />
        <stop offset="100%" stopColor="#9dacc4" />
      </linearGradient>
    </defs>
    {/* Larger trailer */}
    <rect x="12" y="17" width="70" height="26" rx="2" fill="url(#mega-grad)" stroke="#6b7fa8" strokeWidth="1.5" />
    {/* Vertical panels */}
    {[...Array(12)].map((_, i) => (
      <line
        key={i}
        x1={17 + i * 5.5}
        y1="19"
        x2={17 + i * 5.5}
        y2="41"
        stroke="#7a8aa8"
        strokeWidth="0.8"
        opacity="0.4"
      />
    ))}
    {/* Cab */}
    <path
      d="M 82 43 L 82 20 Q 82 18 84 18 L 102 18 Q 104 18 104 20 L 104 43 Z"
      fill="#9eaec7"
      stroke="#6b7fa8"
      strokeWidth="1.5"
    />
    <rect x="86" y="20" width="14" height="9" rx="1" fill="#6b7f9e" stroke="#6b7fa8" strokeWidth="1" />
    <rect x="86" y="31" width="8" height="7" rx="1" fill="#6b7f9e" stroke="#6b7fa8" strokeWidth="1" />
    {/* Wheels */}
    <circle cx="97" cy="46" r="4" fill="#3a4a5e" stroke="#556275" strokeWidth="1.5" />
    <circle cx="97" cy="46" r="2" fill="#7a8494" />
    <circle cx="28" cy="46" r="4" fill="#3a4a5e" stroke="#556275" strokeWidth="1.5" />
    <circle cx="36" cy="46" r="4" fill="#3a4a5e" stroke="#556275" strokeWidth="1.5" />
  </svg>
);

const JumboIcon = () => (
  <svg viewBox="0 0 120 60" className="h-full w-full max-w-[200px]" fill="none">
    <defs>
      <linearGradient id="jumbo-grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#a8b8d8" />
        <stop offset="100%" stopColor="#9dacc4" />
      </linearGradient>
    </defs>
    {/* Extra-long trailer */}
    <rect x="8" y="16" width="76" height="27" rx="2" fill="url(#jumbo-grad)" stroke="#6b7fa8" strokeWidth="1.5" />
    {/* Multiple sections */}
    <line x1="45" y1="18" x2="45" y2="41" stroke="#7a8aa8" strokeWidth="1.5" opacity="0.3" />
    {/* Panels */}
    {[...Array(14)].map((_, i) => (
      <line
        key={i}
        x1={13 + i * 5}
        y1="18"
        x2={13 + i * 5}
        y2="41"
        stroke="#7a8aa8"
        strokeWidth="0.8"
        opacity="0.4"
      />
    ))}
    {/* Cab */}
    <path
      d="M 84 43 L 84 19 Q 84 17 86 17 L 104 17 Q 106 17 106 19 L 106 43 Z"
      fill="#9eaec7"
      stroke="#6b7fa8"
      strokeWidth="1.5"
    />
    <rect x="88" y="19" width="14" height="9" rx="1" fill="#6b7f9e" stroke="#6b7fa8" strokeWidth="1" />
    <rect x="88" y="30" width="8" height="7" rx="1" fill="#6b7f9e" stroke="#6b7fa8" strokeWidth="1" />
    {/* Wheels */}
    <circle cx="99" cy="46" r="4" fill="#3a4a5e" stroke="#556275" strokeWidth="1.5" />
    <circle cx="99" cy="46" r="2" fill="#7a8494" />
    <circle cx="25" cy="46" r="4" fill="#3a4a5e" stroke="#556275" strokeWidth="1.5" />
    <circle cx="33" cy="46" r="4" fill="#3a4a5e" stroke="#556275" strokeWidth="1.5" />
    <circle cx="50" cy="46" r="4" fill="#3a4a5e" stroke="#556275" strokeWidth="1.5" />
  </svg>
);

const CustomTruckIcon = () => (
  <svg viewBox="0 0 120 60" className="h-full w-full max-w-[200px]" fill="none">
    <defs>
      <linearGradient id="custom-grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#c8d4e8" />
        <stop offset="100%" stopColor="#b4c4d9" />
      </linearGradient>
    </defs>
    {/* Dashed trailer for custom */}
    <rect
      x="15"
      y="20"
      width="65"
      height="22"
      rx="3"
      fill="url(#custom-grad)"
      stroke="#6b7fa8"
      strokeWidth="1.5"
      strokeDasharray="4 3"
      opacity="0.8"
    />
    {/* Question mark or tools icon */}
    <text x="47" y="36" fontSize="16" fill="#6b7fa8" fontWeight="bold" textAnchor="middle">
      ?
    </text>
    {/* Cab */}
    <path
      d="M 80 42 L 80 22 Q 80 20 82 20 L 100 20 Q 102 20 102 22 L 102 42 Z"
      fill="#9eaec7"
      stroke="#6b7fa8"
      strokeWidth="1.5"
      strokeDasharray="4 3"
      opacity="0.8"
    />
    <rect x="84" y="22" width="14" height="8" rx="1" fill="#6b7f9e" stroke="#6b7fa8" strokeWidth="1" opacity="0.8" />
    <rect x="84" y="32" width="8" height="6" rx="1" fill="#6b7f9e" stroke="#6b7fa8" strokeWidth="1" opacity="0.8" />
    {/* Wheels */}
    <circle cx="95" cy="45" r="4" fill="#3a4a5e" stroke="#556275" strokeWidth="1.5" opacity="0.8" />
    <circle cx="95" cy="45" r="2" fill="#7a8494" />
    <circle cx="30" cy="45" r="4" fill="#3a4a5e" stroke="#556275" strokeWidth="1.5" opacity="0.8" />
    <circle cx="38" cy="45" r="4" fill="#3a4a5e" stroke="#556275" strokeWidth="1.5" opacity="0.8" />
  </svg>
);

// Truck Options Data
const TRUCK_OPTIONS: TruckOption[] = [
  {
    id: 'tautliner',
    name: 'Tautliner (Curtainsider)',
    icon: <TautlinerIcon />,
  },
  {
    id: 'refrigerated',
    name: 'Refrigerated Truck',
    icon: <RefrigeratedTruckIcon />,
  },
  {
    id: 'isotherm',
    name: 'Isotherm Truck',
    icon: <IsothermTruckIcon />,
  },
  {
    id: 'mega-trailer',
    name: 'Mega-trailer',
    icon: <MegaTrailerIcon />,
  },
  {
    id: 'jumbo',
    name: 'Jumbo',
    icon: <JumboIcon />,
  },
  {
    id: 'custom',
    name: 'Custom truck',
    icon: <CustomTruckIcon />,
  },
];

export default TruckSelectionModal;
