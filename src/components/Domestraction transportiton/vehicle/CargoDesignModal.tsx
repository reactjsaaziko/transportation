import { useState } from 'react';
import { X } from 'lucide-react';
import BagCargoForm from './BagCargoForm';
import SackCargoForm from './SackCargoForm';
import ContainerCargoForm from './ContainerCargoForm';
import DrumCargoForm from './DrumCargoForm';

interface CargoDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const cargoTypes = [
  { id: 'box', label: 'Box' },
  { id: 'bag', label: 'Bag' },
  { id: 'sack', label: 'Sack' },
  { id: 'container', label: 'Container' },
  { id: 'drum', label: 'Drum' },
  { id: 'pallet', label: 'Pallet' },
];

const defaultSpacing = {
  tiltLength: true,
  tiltWidth: true,
  tiltHeight: false,
};

const defaultAdvancedSpacing = {
  layerCount: false,
  mass: false,
  height: false,
  disableStacking: false,
};

// 3D Isometric Box Icon - Matching exact image design
const CargoTypeIcon = ({ type, active }: { type: string; active: boolean }) => {
  const strokeColor = active ? '#3B82F6' : '#9CA3AF';
  const fillColor = active ? '#DBEAFE' : 'none';

  switch (type) {
    case 'box':
      return (
        <svg viewBox="0 0 48 48" className="h-12 w-12">
          {/* 3D Isometric Box */}
          <path d="M24 8 L38 16 L38 32 L24 40 L10 32 L10 16 Z" fill={fillColor} stroke={strokeColor} strokeWidth="2" strokeLinejoin="round" />
          <path d="M24 8 L24 24 L38 32 L38 16 Z" fill={active ? '#BFDBFE' : 'none'} stroke={strokeColor} strokeWidth="2" strokeLinejoin="round" />
          <path d="M24 8 L24 24 L10 32 L10 16 Z" fill={active ? '#93C5FD' : 'none'} stroke={strokeColor} strokeWidth="2" strokeLinejoin="round" />
          <line x1="24" y1="8" x2="38" y2="16" stroke={strokeColor} strokeWidth="2" />
          <line x1="24" y1="8" x2="10" y2="16" stroke={strokeColor} strokeWidth="2" />
        </svg>
      );
    case 'bag':
      return (
        <svg viewBox="0 0 48 48" className="h-12 w-12">
          {/* Shopping Bag */}
          <rect x="12" y="16" width="24" height="24" rx="2" fill="none" stroke={strokeColor} strokeWidth="2" />
          <path d="M16 16 L16 12 C16 8 20 8 24 8 C28 8 32 8 32 12 L32 16" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'sack':
      return (
        <svg viewBox="0 0 48 48" className="h-12 w-12">
          {/* Sack/Pouch */}
          <ellipse cx="24" cy="14" rx="10" ry="4" fill="none" stroke={strokeColor} strokeWidth="2" />
          <path d="M14 14 L14 32 C14 36 18 38 24 38 C30 38 34 36 34 32 L34 14" fill="none" stroke={strokeColor} strokeWidth="2" />
          <path d="M14 22 C14 25 18 26 24 26 C30 26 34 25 34 22" fill="none" stroke={strokeColor} strokeWidth="2" />
        </svg>
      );
    case 'container':
      return (
        <svg viewBox="0 0 48 48" className="h-12 w-12">
          {/* Container with horizontal lines */}
          <rect x="10" y="14" width="28" height="24" rx="1" fill="none" stroke={strokeColor} strokeWidth="2" />
          <line x1="10" y1="20" x2="38" y2="20" stroke={strokeColor} strokeWidth="2" />
          <line x1="10" y1="26" x2="38" y2="26" stroke={strokeColor} strokeWidth="2" />
          <line x1="10" y1="32" x2="38" y2="32" stroke={strokeColor} strokeWidth="2" />
        </svg>
      );
    case 'drum':
      return (
        <svg viewBox="0 0 48 48" className="h-12 w-12">
          {/* Drum/Barrel */}
          <ellipse cx="24" cy="12" rx="12" ry="4" fill="none" stroke={strokeColor} strokeWidth="2" />
          <line x1="12" y1="12" x2="12" y2="36" stroke={strokeColor} strokeWidth="2" />
          <line x1="36" y1="12" x2="36" y2="36" stroke={strokeColor} strokeWidth="2" />
          <ellipse cx="24" cy="36" rx="12" ry="4" fill="none" stroke={strokeColor} strokeWidth="2" />
          <line x1="12" y1="18" x2="36" y2="18" stroke={strokeColor} strokeWidth="2" />
          <line x1="12" y1="30" x2="36" y2="30" stroke={strokeColor} strokeWidth="2" />
        </svg>
      );
    case 'pallet':
      return (
        <svg viewBox="0 0 48 48" className="h-12 w-12">
          {/* Pallet - horizontal slats */}
          <rect x="8" y="18" width="32" height="3" fill="none" stroke={strokeColor} strokeWidth="2" />
          <rect x="8" y="27" width="32" height="3" fill="none" stroke={strokeColor} strokeWidth="2" />
          <line x1="12" y1="21" x2="12" y2="27" stroke={strokeColor} strokeWidth="2" />
          <line x1="24" y1="21" x2="24" y2="27" stroke={strokeColor} strokeWidth="2" />
          <line x1="36" y1="21" x2="36" y2="27" stroke={strokeColor} strokeWidth="2" />
        </svg>
      );
    default:
      return null;
  }
};

// 3D Isometric Tilt Illustrations - Matching image with before/after boxes
const TiltIllustration = ({ type, active }: { type: string; active: boolean }) => {
  const strokeColor = active ? '#60A5FA' : '#D1D5DB';
  const fillLight = active ? '#DBEAFE' : '#F3F4F6';
  const fillMedium = active ? '#93C5FD' : '#E5E7EB';
  const fillDark = active ? '#60A5FA' : '#D1D5DB';

  if (type === 'length') {
    return (
      <svg viewBox="0 0 100 50" className="h-20 w-full">
        {/* First box - normal */}
        <path d="M8 20 L18 15 L28 20 L18 25 Z" fill={fillLight} stroke={strokeColor} strokeWidth="1" />
        <path d="M8 20 L8 30 L18 35 L18 25 Z" fill={fillDark} stroke={strokeColor} strokeWidth="1" />
        <path d="M18 25 L28 20 L28 30 L18 35 Z" fill={fillMedium} stroke={strokeColor} strokeWidth="1" />
        
        {/* Arrow */}
        <path d="M35 25 L45 25 M42 22 L45 25 L42 28" stroke={strokeColor} strokeWidth="1" fill="none" />
        
        {/* Second box - tilted to length */}
        <path d="M52 25 L72 20 L92 25 L72 30 Z" fill={fillLight} stroke={strokeColor} strokeWidth="1" />
        <path d="M52 25 L52 30 L72 35 L72 30 Z" fill={fillDark} stroke={strokeColor} strokeWidth="1" />
        <path d="M72 30 L92 25 L92 30 L72 35 Z" fill={fillMedium} stroke={strokeColor} strokeWidth="1" />
      </svg>
    );
  } else if (type === 'width') {
    return (
      <svg viewBox="0 0 100 50" className="h-20 w-full">
        {/* First box - normal */}
        <path d="M8 20 L18 15 L28 20 L18 25 Z" fill={fillLight} stroke={strokeColor} strokeWidth="1" />
        <path d="M8 20 L8 30 L18 35 L18 25 Z" fill={fillDark} stroke={strokeColor} strokeWidth="1" />
        <path d="M18 25 L28 20 L28 30 L18 35 Z" fill={fillMedium} stroke={strokeColor} strokeWidth="1" />
        
        {/* Arrow */}
        <path d="M35 25 L45 25 M42 22 L45 25 L42 28" stroke={strokeColor} strokeWidth="1" fill="none" />
        
        {/* Second box - tilted to width (standing) */}
        <path d="M68 15 L78 12 L88 15 L78 18 Z" fill={fillLight} stroke={strokeColor} strokeWidth="1" />
        <path d="M68 15 L68 35 L78 38 L78 18 Z" fill={fillDark} stroke={strokeColor} strokeWidth="1" />
        <path d="M78 18 L88 15 L88 35 L78 38 Z" fill={fillMedium} stroke={strokeColor} strokeWidth="1" />
      </svg>
    );
  } else {
    return (
      <svg viewBox="0 0 100 50" className="h-20 w-full">
        {/* First box - normal */}
        <path d="M8 20 L18 15 L28 20 L18 25 Z" fill={fillLight} stroke={strokeColor} strokeWidth="1" />
        <path d="M8 20 L8 30 L18 35 L18 25 Z" fill={fillDark} stroke={strokeColor} strokeWidth="1" />
        <path d="M18 25 L28 20 L28 30 L18 35 Z" fill={fillMedium} stroke={strokeColor} strokeWidth="1" />
        
        {/* Arrow */}
        <path d="M35 25 L45 25 M42 22 L45 25 L42 28" stroke={strokeColor} strokeWidth="1" fill="none" />
        
        {/* Second box - tilted to height (flat) */}
        <path d="M60 28 L70 25 L80 28 L70 31 Z" fill={fillLight} stroke={strokeColor} strokeWidth="1" />
        <path d="M60 28 L60 32 L70 35 L70 31 Z" fill={fillDark} stroke={strokeColor} strokeWidth="1" />
        <path d="M70 31 L80 28 L80 32 L70 35 Z" fill={fillMedium} stroke={strokeColor} strokeWidth="1" />
      </svg>
    );
  }
};

// Stacked boxes illustration for advanced spacing - Matching image
const StackedBoxIcon = ({ type, active }: { type: string; active: boolean }) => {
  const strokeColor = active ? '#60A5FA' : '#D1D5DB';
  const fillLight = active ? '#DBEAFE' : '#F3F4F6';
  const fillMedium = active ? '#93C5FD' : '#E5E7EB';
  const fillDark = active ? '#60A5FA' : '#D1D5DB';

  if (type === 'layers') {
    return (
      <svg viewBox="0 0 60 60" className="h-24 w-24">
        {/* 3 layer stack - isometric */}
        {/* Bottom layer */}
        <path d="M10 40 L20 35 L30 40 L20 45 Z" fill={fillLight} stroke={strokeColor} strokeWidth="1" />
        <path d="M10 40 L10 45 L20 50 L20 45 Z" fill={fillDark} stroke={strokeColor} strokeWidth="1" />
        <path d="M20 45 L30 40 L30 45 L20 50 Z" fill={fillMedium} stroke={strokeColor} strokeWidth="1" />
        
        {/* Middle layer */}
        <path d="M10 30 L20 25 L30 30 L20 35 Z" fill={fillLight} stroke={strokeColor} strokeWidth="1" />
        <path d="M10 30 L10 35 L20 40 L20 35 Z" fill={fillDark} stroke={strokeColor} strokeWidth="1" />
        <path d="M20 35 L30 30 L30 35 L20 40 Z" fill={fillMedium} stroke={strokeColor} strokeWidth="1" />
        
        {/* Top layer */}
        <path d="M10 20 L20 15 L30 20 L20 25 Z" fill={fillLight} stroke={strokeColor} strokeWidth="1" />
        <path d="M10 20 L10 25 L20 30 L20 25 Z" fill={fillDark} stroke={strokeColor} strokeWidth="1" />
        <path d="M20 25 L30 20 L30 25 L20 30 Z" fill={fillMedium} stroke={strokeColor} strokeWidth="1" />
      </svg>
    );
  } else if (type === 'mass') {
    return (
      <svg viewBox="0 0 60 60" className="h-24 w-24">
        {/* 3 layer stack - same as layers */}
        {/* Bottom layer */}
        <path d="M10 40 L20 35 L30 40 L20 45 Z" fill={fillLight} stroke={strokeColor} strokeWidth="1" />
        <path d="M10 40 L10 45 L20 50 L20 45 Z" fill={fillDark} stroke={strokeColor} strokeWidth="1" />
        <path d="M20 45 L30 40 L30 45 L20 50 Z" fill={fillMedium} stroke={strokeColor} strokeWidth="1" />
        
        {/* Middle layer */}
        <path d="M10 30 L20 25 L30 30 L20 35 Z" fill={fillLight} stroke={strokeColor} strokeWidth="1" />
        <path d="M10 30 L10 35 L20 40 L20 35 Z" fill={fillDark} stroke={strokeColor} strokeWidth="1" />
        <path d="M20 35 L30 30 L30 35 L20 40 Z" fill={fillMedium} stroke={strokeColor} strokeWidth="1" />
        
        {/* Top layer */}
        <path d="M10 20 L20 15 L30 20 L20 25 Z" fill={fillLight} stroke={strokeColor} strokeWidth="1" />
        <path d="M10 20 L10 25 L20 30 L20 25 Z" fill={fillDark} stroke={strokeColor} strokeWidth="1" />
        <path d="M20 25 L30 20 L30 25 L20 30 Z" fill={fillMedium} stroke={strokeColor} strokeWidth="1" />
      </svg>
    );
  } else {
    return (
      <svg viewBox="0 0 60 60" className="h-24 w-24">
        {/* 3 layer stack with height indicator */}
        {/* Bottom layer */}
        <path d="M15 40 L25 35 L35 40 L25 45 Z" fill={fillLight} stroke={strokeColor} strokeWidth="1" />
        <path d="M15 40 L15 45 L25 50 L25 45 Z" fill={fillDark} stroke={strokeColor} strokeWidth="1" />
        <path d="M25 45 L35 40 L35 45 L25 50 Z" fill={fillMedium} stroke={strokeColor} strokeWidth="1" />
        
        {/* Middle layer */}
        <path d="M15 30 L25 25 L35 30 L25 35 Z" fill={fillLight} stroke={strokeColor} strokeWidth="1" />
        <path d="M15 30 L15 35 L25 40 L25 35 Z" fill={fillDark} stroke={strokeColor} strokeWidth="1" />
        <path d="M25 35 L35 30 L35 35 L25 40 Z" fill={fillMedium} stroke={strokeColor} strokeWidth="1" />
        
        {/* Top layer */}
        <path d="M15 20 L25 15 L35 20 L25 25 Z" fill={fillLight} stroke={strokeColor} strokeWidth="1" />
        <path d="M15 20 L15 25 L25 30 L25 25 Z" fill={fillDark} stroke={strokeColor} strokeWidth="1" />
        <path d="M25 25 L35 20 L35 25 L25 30 Z" fill={fillMedium} stroke={strokeColor} strokeWidth="1" />
        
        {/* Height measurement lines */}
        <line x1="40" y1="15" x2="40" y2="50" stroke={strokeColor} strokeWidth="1" strokeDasharray="2,2" />
        <line x1="38" y1="15" x2="42" y2="15" stroke={strokeColor} strokeWidth="1" />
        <line x1="38" y1="50" x2="42" y2="50" stroke={strokeColor} strokeWidth="1" />
      </svg>
    );
  }
};

const CargoDesignModal = ({ isOpen, onClose }: CargoDesignModalProps) => {
  const [selectedCargoType, setSelectedCargoType] = useState('box');
  const [form, setForm] = useState({
    productName: 'New Product',
    colour: '#1bb24b',
    length: '100',
    width: '100',
    height: '100',
    weight: '100',
    quantity: '100',
  });
  const [spacing, setSpacing] = useState(defaultSpacing);
  const [advancedSpacing, setAdvancedSpacing] = useState(defaultAdvancedSpacing);
  const [advancedValues, setAdvancedValues] = useState({
    layerCount: '',
    mass: '0',
    height: '0',
  });

  if (!isOpen) {
    return null;
  }

  const updateForm = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSpacing = (key: keyof typeof spacing) => {
    setSpacing((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleAdvancedSpacing = (key: keyof typeof advancedSpacing) => {
    setAdvancedSpacing((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const updateAdvancedValue = (key: keyof typeof advancedValues, value: string) => {
    setAdvancedValues((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20 px-4" onClick={onClose}>
      <div
        className="w-full max-w-7xl overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="bg-white px-6 py-5">
          <div className="text-sm font-medium text-gray-600">1. Select Cargo Type</div>
        </div>

        <div className="space-y-6 bg-white px-6 pb-6">
          <section>
            <div className="grid grid-cols-6 gap-3">
              {cargoTypes.map((cargo) => {
                const active = selectedCargoType === cargo.id;
                return (
                  <button
                    key={cargo.id}
                    type="button"
                    className={`flex flex-col items-center rounded-xl border px-3 py-4 text-center transition ${
                      active ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedCargoType(cargo.id)}
                  >
                    <CargoTypeIcon type={cargo.id} active={active} />
                  </button>
                );
              })}
            </div>
          </section>

          {selectedCargoType === 'bag' ? (
            <BagCargoForm onClose={onClose} />
          ) : selectedCargoType === 'sack' ? (
            <SackCargoForm onClose={onClose} />
          ) : selectedCargoType === 'container' ? (
            <ContainerCargoForm onClose={onClose} />
          ) : selectedCargoType === 'drum' ? (
            <DrumCargoForm onClose={onClose} />
          ) : (
            <>
            <section>
              <div className="mb-3 text-sm font-medium text-gray-600">2. SELECT CARGO dimensions</div>
            <div className="grid gap-6 lg:grid-cols-[180px_1fr]">
              <div className="flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/30 p-6">
                <svg viewBox="0 0 120 140" className="h-40 w-40">
                  <defs>
                    <linearGradient id="boxTop" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#C8DDFC" />
                      <stop offset="100%" stopColor="#A8C5F7" />
                    </linearGradient>
                    <linearGradient id="boxLeft" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#7BA5F3" />
                      <stop offset="100%" stopColor="#5B8DEF" />
                    </linearGradient>
                    <linearGradient id="boxRight" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#9BB8F5" />
                      <stop offset="100%" stopColor="#7BA5F3" />
                    </linearGradient>
                  </defs>
                  {/* 3D Isometric Box */}
                  <path d="M60 30 L100 50 L100 100 L60 120 L20 100 L20 50 Z" fill="url(#boxTop)" stroke="#4A7DD9" strokeWidth="1.5" />
                  <path d="M60 30 L60 80 L100 100 L100 50 Z" fill="url(#boxRight)" stroke="#4A7DD9" strokeWidth="1.5" />
                  <path d="M60 30 L60 80 L20 100 L20 50 Z" fill="url(#boxLeft)" stroke="#4A7DD9" strokeWidth="1.5" />
                  {/* Dimension lines */}
                  <line x1="15" y1="50" x2="15" y2="100" stroke="#6B7280" strokeWidth="1" strokeDasharray="3,3" />
                  <line x1="10" y1="50" x2="20" y2="50" stroke="#6B7280" strokeWidth="1" />
                  <line x1="10" y1="100" x2="20" y2="100" stroke="#6B7280" strokeWidth="1" />
                  <line x1="20" y1="105" x2="100" y2="105" stroke="#6B7280" strokeWidth="1" strokeDasharray="3,3" />
                  <line x1="20" y1="100" x2="20" y2="110" stroke="#6B7280" strokeWidth="1" />
                  <line x1="100" y1="100" x2="100" y2="110" stroke="#6B7280" strokeWidth="1" />
                  <line x1="105" y1="50" x2="105" y2="100" stroke="#6B7280" strokeWidth="1" strokeDasharray="3,3" />
                  <line x1="100" y1="50" x2="110" y2="50" stroke="#6B7280" strokeWidth="1" />
                  <line x1="100" y1="100" x2="110" y2="100" stroke="#6B7280" strokeWidth="1" />
                </svg>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2 text-xs font-semibold uppercase tracking-wide text-gray-700">
                    Product Name
                    <input
                      type="text"
                      placeholder="Enter product name"
                      className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      value={form.productName}
                      onChange={(event) => updateForm('productName', event.target.value)}
                      required
                    />
                  </label>
                  <label className="grid gap-2 text-xs font-semibold uppercase tracking-wide text-gray-700">
                    Colour
                    <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                      <div
                        className="flex-1 rounded-full px-3 py-1.5 text-center text-xs font-semibold text-white shadow-sm"
                        style={{ backgroundColor: form.colour }}
                      >
                        {form.colour}
                      </div>
                      <input
                        type="color"
                        value={form.colour}
                        onChange={(event) => updateForm('colour', event.target.value)}
                        className="h-8 w-12 cursor-pointer rounded border-0"
                        aria-label="Select colour"
                      />
                    </div>
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {['length', 'width', 'height'].map((dimension) => (
                    <label key={dimension} className="grid gap-2 text-xs font-semibold uppercase tracking-wide text-gray-700">
                      <span className="capitalize">{dimension}</span>
                      <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                        <input
                          type="number"
                          placeholder="0"
                          min="0"
                          step="1"
                          value={form[dimension as 'length' | 'width' | 'height']}
                          onChange={(event) => updateForm(dimension as keyof typeof form, event.target.value)}
                          className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                          required
                        />
                        <span className="text-xs font-semibold text-gray-500">mm</span>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <label className="grid gap-2 text-xs font-semibold uppercase tracking-wide text-gray-700">
                    Weight
                    <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                      <input
                        type="number"
                        placeholder="0"
                        min="0"
                        step="0.01"
                        value={form.weight}
                        onChange={(event) => updateForm('weight', event.target.value)}
                        className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                        required
                      />
                      <span className="text-xs font-semibold text-gray-500">kg</span>
                    </div>
                  </label>
                  <label className="grid gap-2 text-xs font-semibold uppercase tracking-wide text-gray-700">
                    Quantity
                    <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                      <input
                        type="number"
                        placeholder="0"
                        min="1"
                        step="1"
                        value={form.quantity}
                        onChange={(event) => updateForm('quantity', event.target.value)}
                        className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                        required
                      />
                      <span className="text-xs font-semibold text-gray-500">pcs</span>
                    </div>
                  </label>
                  <div className="flex items-end">
                    <button
                      type="button"
                      className="w-full rounded-lg border border-blue-400 bg-blue-50 px-4 py-2.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-100 hover:border-blue-500"
                    >
                      Prediction
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div>
              <div className="mb-4 text-sm font-medium text-gray-600">3. SPACING SETTINGS ?</div>
              <div className="space-y-4">
                {[
                  { key: 'tiltLength', label: 'Tilt to Length', type: 'length' },
                  { key: 'tiltWidth', label: 'Tilt to Widht', type: 'width' },
                  { key: 'tiltHeight', label: 'Tilt to Height', type: 'height' },
                ].map((option) => (
                  <label key={option.key} className="flex items-start gap-3 rounded-lg bg-gray-50/50 p-4">
                    <input
                      type="checkbox"
                      checked={spacing[option.key as keyof typeof spacing]}
                      onChange={() => toggleSpacing(option.key as keyof typeof spacing)}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                    />
                    <div className="flex flex-1 flex-col gap-3">
                      <span className="text-sm font-medium text-gray-600">{option.label}</span>
                      <TiltIllustration
                        type={option.type}
                        active={spacing[option.key as keyof typeof spacing]}
                      />
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-4 text-sm font-medium text-gray-600">4. SPACING SETTINGS ?</div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: 'layerCount', label: 'Layer Count', unit: null, icon: 'layers', valueKey: 'layerCount', hasInput: true },
                  { key: 'mass', label: 'Mass', unit: 'Kg', icon: 'mass', valueKey: 'mass', hasInput: true },
                  { key: 'height', label: 'Height', unit: 'mm', icon: 'height', valueKey: 'height', hasInput: true },
                  { key: 'disableStacking', label: 'Disable stacking', unit: null, icon: 'height', valueKey: null, hasInput: false },
                ].map((option) => (
                  <label
                    key={option.key}
                    className="flex flex-col items-center gap-3 rounded-lg bg-gray-50/50 p-4"
                  >
                    <div className="flex-shrink-0">
                      <StackedBoxIcon type={option.icon} active={advancedSpacing[option.key as keyof typeof advancedSpacing]} />
                    </div>
                    <div className="flex w-full items-center gap-2">
                      <input
                        type="checkbox"
                        checked={advancedSpacing[option.key as keyof typeof advancedSpacing]}
                        onChange={() => toggleAdvancedSpacing(option.key as keyof typeof advancedSpacing)}
                        className="h-4 w-4 flex-shrink-0 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                      />
                      <span className="flex-1 text-sm font-medium text-gray-600">{option.label}</span>
                    </div>
                    {option.hasInput && (
                      <div className="flex w-full items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                        <input
                          type="number"
                          placeholder="0"
                          min="0"
                          step="1"
                          value={option.valueKey ? advancedValues[option.valueKey as keyof typeof advancedValues] : '0'}
                          onChange={(e) => option.valueKey && updateAdvancedValue(option.valueKey as keyof typeof advancedValues, e.target.value)}
                          disabled={!advancedSpacing[option.key as keyof typeof advancedSpacing]}
                          className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none disabled:text-gray-400"
                        />
                        {option.unit && <span className="text-xs font-semibold text-gray-500">{option.unit}</span>}
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>
          </section>

          <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4 -mx-6 -mb-6 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-6 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-lg bg-blue-500 px-8 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              Add
            </button>
          </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CargoDesignModal;
