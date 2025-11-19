import { useState } from 'react';

interface SackCargoFormProps {
  onClose: () => void;
}

const SackCargoForm = ({ onClose }: SackCargoFormProps) => {
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
          {/* 3D Sack Illustration */}
          <div className="flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/30 p-6">
            <svg viewBox="0 0 220 250" className="h-52 w-52">
              <defs>
                <linearGradient id="sackTop" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E0ECFF" />
                  <stop offset="50%" stopColor="#C6DBFE" />
                  <stop offset="100%" stopColor="#A7C7FB" />
                </linearGradient>
              </defs>

              {/* Base shadow */}
              <ellipse cx="110" cy="205" rx="65" ry="18" fill="#E5E7EB" opacity="0.5" />

              {/* Pillow body */}
              <path
                d="M60 95 Q60 70 110 60 Q160 70 160 95 L160 165 Q160 190 110 200 Q60 190 60 165 Z"
                fill="#CFE1FF"
                stroke="#8CB4F8"
                strokeWidth="2"
              />

              {/* Top ellipse */}
              <ellipse cx="110" cy="90" rx="55" ry="22" fill="url(#sackTop)" stroke="#8CB4F8" strokeWidth="2" />

              {/* Mid dashed seam */}
              <path d="M65 150 Q110 165 155 150" fill="none" stroke="#8CB4F8" strokeWidth="1.2" strokeDasharray="4 4" opacity="0.6" />

              {/* Side dotted seams */}
              <path d="M80 85 L80 170" stroke="#8CB4F8" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
              <path d="M140 85 L140 170" stroke="#8CB4F8" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />

              {/* Dimension arrows */}
              {/* Height */}
              <line x1="35" y1="95" x2="35" y2="170" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="31" y1="95" x2="39" y2="95" stroke="#9CA3AF" strokeWidth="1" />
              <line x1="31" y1="170" x2="39" y2="170" stroke="#9CA3AF" strokeWidth="1" />
              <text x="20" y="135" fill="#9CA3AF" fontSize="10" fontWeight="500">Height</text>

              {/* Width */}
              <line x1="60" y1="215" x2="160" y2="215" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="60" y1="212" x2="60" y2="218" stroke="#9CA3AF" strokeWidth="1" />
              <line x1="160" y1="212" x2="160" y2="218" stroke="#9CA3AF" strokeWidth="1" />
              <text x="110" y="232" fill="#9CA3AF" fontSize="10" fontWeight="500" textAnchor="middle">Width</text>

              {/* Length */}
              <line x1="175" y1="125" x2="205" y2="125" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="175" y1="122" x2="175" y2="128" stroke="#9CA3AF" strokeWidth="1" />
              <line x1="205" y1="122" x2="205" y2="128" stroke="#9CA3AF" strokeWidth="1" />
              <text x="190" y="116" fill="#9CA3AF" fontSize="10" fontWeight="500" textAnchor="middle">Length</text>
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
                  {/* Sack transformation illustrations */}
                  <div className="flex items-center gap-2">
                    <svg viewBox="0 0 110 80" className="h-18 w-24">
                      <path d="M25 30 Q25 18 55 12 Q85 18 85 30 L85 48 Q85 60 55 65 Q25 60 25 48 Z" fill="#DBEAFE" stroke="#8CB4F8" strokeWidth="1.2" />
                      <ellipse cx="55" cy="28" rx="32" ry="12" fill="#BFDBFE" stroke="#8CB4F8" strokeWidth="1.2" />
                      <path d="M30 48 Q55 54 80 48" fill="none" stroke="#8CB4F8" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                      <line x1="18" y1="30" x2="18" y2="55" stroke="#9CA3AF" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.7" />
                      <line x1="32" y1="63" x2="78" y2="63" stroke="#9CA3AF" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.7" />
                    </svg>
                    <svg viewBox="0 0 24 24" className="h-5 w-5">
                      <path d="M6 12 L18 12 M15 9 L18 12 L15 15" stroke="#93C5FD" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                    </svg>
                    <svg viewBox="0 0 80 100" className="h-20 w-18">
                      <path d="M25 40 Q25 30 40 25 Q55 30 55 40 L55 70 Q55 80 40 85 Q25 80 25 70 Z" fill="#DBEAFE" stroke="#8CB4F8" strokeWidth="1.2" />
                      <ellipse cx="40" cy="38" rx="18" ry="8" fill="#BFDBFE" stroke="#8CB4F8" strokeWidth="1.2" />
                      <path d="M28 65 Q40 70 52 65" fill="none" stroke="#8CB4F8" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                      <line x1="20" y1="40" x2="20" y2="78" stroke="#9CA3AF" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.7" />
                      <line x1="60" y1="42" x2="67" y2="42" stroke="#9CA3AF" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.7" />
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
                {/* Stacked sacks icon - 3D isometric */}
                <svg viewBox="0 0 90 110" className="h-28 w-24">
                  {/* Bottom sack - gray */}
                  <path d="M25 70 L25 88 L45 98 L45 80 Z" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="1.2" />
                  <path d="M45 80 L45 98 L65 88 L65 70 Z" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1.2" />
                  <path d="M25 70 L45 80 L65 70 L45 60 Z" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="1.2" />
                  
                  {/* Middle sack - light blue */}
                  <path d="M25 45 L25 63 L45 73 L45 55 Z" fill="#93C5FD" stroke="#60A5FA" strokeWidth="1.2" />
                  <path d="M45 55 L45 73 L65 63 L65 45 Z" fill="#DBEAFE" stroke="#60A5FA" strokeWidth="1.2" />
                  <path d="M25 45 L45 55 L65 45 L45 35 Z" fill="#BFDBFE" stroke="#60A5FA" strokeWidth="1.2" />
                  
                  {/* Top sack - blue with handle */}
                  <path d="M25 20 L25 38 L45 48 L45 30 Z" fill="#93C5FD" stroke="#60A5FA" strokeWidth="1.2" />
                  <path d="M45 30 L45 48 L65 38 L65 20 Z" fill="#DBEAFE" stroke="#60A5FA" strokeWidth="1.2" />
                  <path d="M25 20 L45 30 L65 20 L45 10 Z" fill="#BFDBFE" stroke="#60A5FA" strokeWidth="1.2" />
                  
                  {/* Handle on top sack */}
                  <path d="M40 10 L40 5 L50 5 L50 10" fill="none" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="40" cy="7" r="2" fill="#93C5FD" stroke="#60A5FA" strokeWidth="1" />
                  <circle cx="50" cy="7" r="2" fill="#93C5FD" stroke="#60A5FA" strokeWidth="1" />
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

export default SackCargoForm;
