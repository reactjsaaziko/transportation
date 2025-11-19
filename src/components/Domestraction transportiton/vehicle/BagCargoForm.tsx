import { useState } from 'react';

interface BagCargoFormProps {
  onClose: () => void;
}

const BagCargoForm = ({ onClose }: BagCargoFormProps) => {
  const [form, setForm] = useState({
    productName: 'New Product',
    colour: '#1bb24b',
    length: '100',
    width: '100',
    height: '100',
    weight: '100',
    quantity: '100',
  });

  const [spacing, setSpacing] = useState({
    tiltLength: false,
    tiltWidth: false,
    tiltHeight: false,
  });

  const [advancedSpacing, setAdvancedSpacing] = useState({
    layerCount: false,
    mass: false,
    height: false,
    disableStacking: false,
  });

  const [advancedValues, setAdvancedValues] = useState({
    layerCount: '',
    mass: '0',
    height: '0',
  });

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
    <div className="space-y-6">
      {/* Section 2: Dimensions */}
      <section>
        <div className="mb-4 text-sm font-medium text-gray-600">2. SELECT CARGO dimensions</div>
        
        <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
          {/* 3D Bag Illustration */}
          <div className="flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/30 p-6">
            <svg viewBox="0 0 200 260" className="h-52 w-52">
              <defs>
                <linearGradient id="bagFillMain" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#DBEAFE" />
                  <stop offset="50%" stopColor="#BFDBFE" />
                  <stop offset="100%" stopColor="#93C5FD" />
                </linearGradient>
              </defs>
              
              {/* 3D Isometric Bag - matching image */}
              {/* Left face */}
              <path 
                d="M70 90 L70 180 L100 200 L100 110 Z" 
                fill="#93C5FD" 
                stroke="#60A5FA" 
                strokeWidth="1.5"
              />
              
              {/* Right face */}
              <path 
                d="M100 110 L100 200 L130 180 L130 90 Z" 
                fill="url(#bagFillMain)" 
                stroke="#60A5FA" 
                strokeWidth="1.5"
              />
              
              {/* Top face */}
              <ellipse cx="100" cy="90" rx="30" ry="15" fill="#BFDBFE" stroke="#60A5FA" strokeWidth="1.5" />
              
              {/* Handles - left */}
              <path 
                d="M75 90 L75 70 C75 65 80 60 85 60 L90 60" 
                fill="none" 
                stroke="#60A5FA" 
                strokeWidth="2" 
                strokeLinecap="round"
              />
              <circle cx="75" cy="75" r="5" fill="#93C5FD" stroke="#60A5FA" strokeWidth="1.5" />
              <circle cx="75" cy="75" r="2" fill="white" />
              
              {/* Handles - right */}
              <path 
                d="M125 90 L125 70 C125 65 120 60 115 60 L110 60" 
                fill="none" 
                stroke="#60A5FA" 
                strokeWidth="2" 
                strokeLinecap="round"
              />
              <circle cx="125" cy="75" r="5" fill="#93C5FD" stroke="#60A5FA" strokeWidth="1.5" />
              <circle cx="125" cy="75" r="2" fill="white" />
              
              {/* Center vertical line for depth */}
              <line x1="100" y1="90" x2="100" y2="200" stroke="#60A5FA" strokeWidth="1" opacity="0.5" />
              
              {/* Dimension arrows */}
              {/* Height arrow - left */}
              <line x1="45" y1="90" x2="45" y2="180" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="2,2" />
              <line x1="42" y1="90" x2="48" y2="90" stroke="#9CA3AF" strokeWidth="1" />
              <line x1="42" y1="180" x2="48" y2="180" stroke="#9CA3AF" strokeWidth="1" />
              <text x="25" y="140" fill="#9CA3AF" fontSize="9" fontWeight="500">Height</text>
              
              {/* Width arrow - bottom */}
              <line x1="70" y1="215" x2="130" y2="215" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="2,2" />
              <line x1="70" y1="212" x2="70" y2="218" stroke="#9CA3AF" strokeWidth="1" />
              <line x1="130" y1="212" x2="130" y2="218" stroke="#9CA3AF" strokeWidth="1" />
              <text x="95" y="228" fill="#9CA3AF" fontSize="9" fontWeight="500" textAnchor="middle">Width</text>
              
              {/* Length arrow - right */}
              <line x1="145" y1="135" x2="175" y2="135" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="2,2" />
              <line x1="145" y1="132" x2="145" y2="138" stroke="#9CA3AF" strokeWidth="1" />
              <line x1="175" y1="132" x2="175" y2="138" stroke="#9CA3AF" strokeWidth="1" />
              <text x="160" y="128" fill="#9CA3AF" fontSize="9" fontWeight="500" textAnchor="middle">Length</text>
            </svg>
          </div>

          {/* Form Fields */}
          <div className="grid gap-4">
            {/* Product Name and Colour */}
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-xs font-medium text-gray-500">Product Name</span>
                <input
                  type="text"
                  placeholder="New Product"
                  className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={form.productName}
                  onChange={(e) => updateForm('productName', e.target.value)}
                />
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-medium text-gray-500">Colour</span>
                <div className="relative">
                  <input
                    type="text"
                    value={form.colour}
                    onChange={(e) => updateForm('colour', e.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 pr-12 text-sm text-gray-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <input
                    type="color"
                    value={form.colour}
                    onChange={(e) => updateForm('colour', e.target.value)}
                    className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 cursor-pointer rounded border-0"
                  />
                </div>
              </label>
            </div>

            {/* Dimensions Row */}
            <div className="grid gap-4 md:grid-cols-3">
              {['length', 'width', 'height'].map((dimension) => (
                <label key={dimension} className="grid gap-2">
                  <span className="text-xs font-medium capitalize text-gray-500">{dimension}</span>
                  <div className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                    <input
                      type="number"
                      placeholder="100"
                      value={form[dimension as 'length' | 'width' | 'height']}
                      onChange={(e) => updateForm(dimension as keyof typeof form, e.target.value)}
                      className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                    />
                    <span className="text-xs font-medium text-gray-500">mm</span>
                  </div>
                </label>
              ))}
            </div>

            {/* Weight, Quantity, Prediction Row */}
            <div className="grid gap-4 md:grid-cols-3">
              <label className="grid gap-2">
                <span className="text-xs font-medium text-gray-500">Weight</span>
                <div className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                  <input
                    type="number"
                    placeholder="100"
                    value={form.weight}
                    onChange={(e) => updateForm('weight', e.target.value)}
                    className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                  />
                  <span className="text-xs font-medium text-gray-500">mm</span>
                </div>
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-medium text-gray-500">Quantity</span>
                <div className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                  <input
                    type="number"
                    placeholder="100"
                    value={form.quantity}
                    onChange={(e) => updateForm('quantity', e.target.value)}
                    className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                  />
                  <span className="text-xs font-medium text-gray-500">mm</span>
                </div>
              </label>
              <div className="flex items-end">
                <button
                  type="button"
                  className="w-full rounded-xl bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-600 transition hover:bg-blue-100"
                >
                  Prediction
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sections 3 & 4: Spacing Settings */}
      <section className="grid gap-6 border-t border-gray-200 pt-6 lg:grid-cols-[1fr_auto_1fr]">
        {/* Section 3 */}
        <div>
          <div className="mb-4 text-sm font-medium text-gray-600">3. SPACING SETTINGS ?</div>
          <div className="space-y-4">
            {[
              { key: 'tiltLength', label: 'Tilt to Length' },
              { key: 'tiltWidth', label: 'Tilt to Widht' },
              { key: 'tiltHeight', label: 'Tilt to Height' },
            ].map((option) => (
              <label key={option.key} className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={spacing[option.key as keyof typeof spacing]}
                  onChange={() => toggleSpacing(option.key as keyof typeof spacing)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <div className="flex flex-1 flex-col gap-3">
                  <span className="text-sm font-medium text-gray-500">{option.label}</span>
                  {/* Bag transformation illustrations */}
                  <div className="flex items-center gap-2">
                    {/* Before bag - 3D isometric */}
                    <svg viewBox="0 0 70 90" className="h-20 w-18">
                      {/* Left face */}
                      <path d="M20 25 L20 60 L35 70 L35 35 Z" fill="#93C5FD" stroke="#60A5FA" strokeWidth="1.2" />
                      {/* Right face */}
                      <path d="M35 35 L35 70 L50 60 L50 25 Z" fill="#DBEAFE" stroke="#60A5FA" strokeWidth="1.2" />
                      {/* Top */}
                      <ellipse cx="35" cy="25" rx="15" ry="8" fill="#BFDBFE" stroke="#60A5FA" strokeWidth="1.2" />
                      {/* Handles */}
                      <path d="M25 25 L25 18 C25 15 30 15 35 15 C40 15 45 15 45 18 L45 25" fill="none" stroke="#60A5FA" strokeWidth="1.5" />
                      <circle cx="25" cy="20" r="3" fill="#93C5FD" stroke="#60A5FA" strokeWidth="1" />
                      <circle cx="45" cy="20" r="3" fill="#93C5FD" stroke="#60A5FA" strokeWidth="1" />
                    </svg>
                    
                    {/* Arrow */}
                    <svg viewBox="0 0 24 24" className="h-5 w-5">
                      <path d="M6 12 L18 12 M15 9 L18 12 L15 15" stroke="#93C5FD" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                    </svg>
                    
                    {/* After bag - rotated/tilted */}
                    <svg viewBox="0 0 90 90" className="h-20 w-22">
                      {/* Left face */}
                      <path d="M25 35 L25 65 L45 75 L45 45 Z" fill="#93C5FD" stroke="#60A5FA" strokeWidth="1.2" />
                      {/* Right face */}
                      <path d="M45 45 L45 75 L65 65 L65 35 Z" fill="#DBEAFE" stroke="#60A5FA" strokeWidth="1.2" />
                      {/* Top */}
                      <ellipse cx="45" cy="35" rx="20" ry="10" fill="#BFDBFE" stroke="#60A5FA" strokeWidth="1.2" />
                      {/* Handles */}
                      <path d="M30 35 L30 25 C30 22 37 22 45 22 C53 22 60 22 60 25 L60 35" fill="none" stroke="#60A5FA" strokeWidth="1.5" />
                      <circle cx="30" cy="28" r="3" fill="#93C5FD" stroke="#60A5FA" strokeWidth="1" />
                      <circle cx="60" cy="28" r="3" fill="#93C5FD" stroke="#60A5FA" strokeWidth="1" />
                    </svg>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="hidden lg:block w-px bg-gray-200"></div>

        {/* Section 4 */}
        <div>
          <div className="mb-4 text-sm font-medium text-gray-600">4. SPACING SETTINGS ?</div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'layerCount', label: 'Layer Count', unit: null, hasInput: true, valueKey: 'layerCount' },
              { key: 'mass', label: 'Mass', unit: 'Kg', hasInput: true, valueKey: 'mass' },
              { key: 'height', label: 'Height', unit: 'mm', hasInput: true, valueKey: 'height' },
              { key: 'disableStacking', label: 'Disable stacking', unit: null, hasInput: false, valueKey: null },
            ].map((option) => (
              <label key={option.key} className="flex flex-col items-center gap-3">
                {/* Stacked bags icon - 3D isometric */}
                <svg viewBox="0 0 90 110" className="h-28 w-24">
                  {/* Bottom bag - gray */}
                  <path d="M25 70 L25 88 L45 98 L45 80 Z" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="1.2" />
                  <path d="M45 80 L45 98 L65 88 L65 70 Z" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1.2" />
                  <ellipse cx="45" cy="70" rx="20" ry="10" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="1.2" />
                  
                  {/* Middle bag - light blue */}
                  <path d="M25 45 L25 63 L45 73 L45 55 Z" fill="#93C5FD" stroke="#60A5FA" strokeWidth="1.2" />
                  <path d="M45 55 L45 73 L65 63 L65 45 Z" fill="#DBEAFE" stroke="#60A5FA" strokeWidth="1.2" />
                  <ellipse cx="45" cy="45" rx="20" ry="10" fill="#BFDBFE" stroke="#60A5FA" strokeWidth="1.2" />
                  
                  {/* Top bag - blue with handles */}
                  <path d="M25 20 L25 38 L45 48 L45 30 Z" fill="#93C5FD" stroke="#60A5FA" strokeWidth="1.2" />
                  <path d="M45 30 L45 48 L65 38 L65 20 Z" fill="#DBEAFE" stroke="#60A5FA" strokeWidth="1.2" />
                  <ellipse cx="45" cy="20" rx="20" ry="10" fill="#BFDBFE" stroke="#60A5FA" strokeWidth="1.2" />
                  
                  {/* Handles on top bag */}
                  <path d="M30 20 L30 12 C30 10 37 10 45 10 C53 10 60 10 60 12 L60 20" fill="none" stroke="#60A5FA" strokeWidth="1.5" />
                  <circle cx="30" cy="15" r="3" fill="#93C5FD" stroke="#60A5FA" strokeWidth="1" />
                  <circle cx="60" cy="15" r="3" fill="#93C5FD" stroke="#60A5FA" strokeWidth="1" />
                </svg>

                <div className="flex w-full items-center gap-2">
                  <input
                    type="checkbox"
                    checked={advancedSpacing[option.key as keyof typeof advancedSpacing]}
                    onChange={() => toggleAdvancedSpacing(option.key as keyof typeof advancedSpacing)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="flex-1 text-sm font-medium text-gray-500">{option.label}</span>
                </div>

                {option.hasInput && (
                  <div className="flex w-full items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                    <input
                      type="number"
                      placeholder="0"
                      value={option.valueKey ? advancedValues[option.valueKey as keyof typeof advancedValues] : '0'}
                      onChange={(e) => option.valueKey && updateAdvancedValue(option.valueKey as keyof typeof advancedValues, e.target.value)}
                      disabled={!advancedSpacing[option.key as keyof typeof advancedSpacing]}
                      className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none disabled:text-gray-400"
                    />
                    {option.unit && <span className="text-xs font-medium text-gray-500">{option.unit}</span>}
                  </div>
                )}
              </label>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Buttons */}
      <div className="flex items-center justify-center gap-3 border-t border-gray-200 pt-6">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl bg-gray-100 px-8 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="button"
          className="rounded-xl bg-blue-500 px-12 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default BagCargoForm;
