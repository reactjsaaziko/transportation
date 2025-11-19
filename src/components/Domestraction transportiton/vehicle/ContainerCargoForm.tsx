import { useState } from 'react';

interface ContainerCargoFormProps {
  onClose: () => void;
}

const ContainerCargoForm = ({ onClose }: ContainerCargoFormProps) => {
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

  const updateForm = (key: keyof typeof form, value: string) => setForm((prev) => ({ ...prev, [key]: value }));
  const toggleSpacing = (key: keyof typeof spacing) => setSpacing((prev) => ({ ...prev, [key]: !prev[key] }));
  const toggleAdvancedSpacing = (key: keyof typeof advancedSpacing) =>
    setAdvancedSpacing((prev) => ({ ...prev, [key]: !prev[key] }));
  const updateAdvancedValue = (key: keyof typeof advancedValues, value: string) =>
    setAdvancedValues((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-6">
      <section>
        <div className="mb-4 text-sm font-medium text-gray-600">2. SELECT CARGO dimensions</div>
        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <div className="flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/30 p-6">
            <svg viewBox="0 0 200 240" className="h-52 w-52">
              <defs>
                <linearGradient id="cylTop" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#DBEAFE" />
                  <stop offset="100%" stopColor="#BFDBFE" />
                </linearGradient>
              </defs>
              
              {/* Shadow */}
              <ellipse cx="100" cy="195" rx="45" ry="12" fill="#E5E7EB" opacity="0.4" />
              
              {/* Cylinder body */}
              <rect x="60" y="70" width="80" height="110" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="2" />
              
              {/* Top ellipse */}
              <ellipse cx="100" cy="70" rx="40" ry="15" fill="url(#cylTop)" stroke="#93C5FD" strokeWidth="2" />
              
              {/* Bottom ellipse */}
              <ellipse cx="100" cy="180" rx="40" ry="15" fill="#BFDBFE" stroke="#93C5FD" strokeWidth="2" />
              
              {/* Height arrow - left */}
              <line x1="35" y1="70" x2="35" y2="180" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="32" y1="70" x2="38" y2="70" stroke="#9CA3AF" strokeWidth="1" />
              <line x1="32" y1="180" x2="38" y2="180" stroke="#9CA3AF" strokeWidth="1" />
              <text x="15" y="130" fill="#9CA3AF" fontSize="10" fontWeight="500">Height</text>
              
              {/* Radius arrow - bottom */}
              <line x1="100" y1="205" x2="140" y2="205" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="100" y1="202" x2="100" y2="208" stroke="#9CA3AF" strokeWidth="1" />
              <line x1="140" y1="202" x2="140" y2="208" stroke="#9CA3AF" strokeWidth="1" />
              <text x="120" y="220" fill="#9CA3AF" fontSize="10" fontWeight="500" textAnchor="middle">Radius</text>
            </svg>
          </div>

          <div className="grid gap-4">
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

      <section className="grid gap-6 border-t border-gray-200 pt-6 lg:grid-cols-[1fr_auto_1fr]">
        <div>
          <div className="mb-4 text-sm font-medium text-gray-600">3. SPACING SETTINGS ?</div>
          <div className="space-y-4">
            {[
              { key: 'tiltLength', label: 'Tilt to Length' },
              { key: 'tiltWidth', label: 'Tilt to Widht' },
            ].map((option, index) => (
              <label key={option.key} className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={spacing[option.key as keyof typeof spacing]}
                  onChange={() => toggleSpacing(option.key as keyof typeof spacing)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <div className="flex flex-1 flex-col gap-3">
                  <span className="text-sm font-medium text-gray-500">{option.label}</span>
                  <div className="flex items-center gap-2">
                    {index === 0 ? (
                      <>
                        {/* Tilt to Length: Vertical → Horizontal */}
                        <svg viewBox="0 0 70 80" className="h-18 w-16">
                          <ellipse cx="35" cy="20" rx="22" ry="8" fill="#BFDBFE" stroke="#93C5FD" strokeWidth="1.2" />
                          <rect x="13" y="20" width="44" height="40" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="1.2" />
                          <ellipse cx="35" cy="60" rx="22" ry="8" fill="#BFDBFE" stroke="#93C5FD" strokeWidth="1.2" />
                        </svg>
                        <svg viewBox="0 0 24 24" className="h-5 w-5">
                          <path d="M6 12 L18 12 M15 9 L18 12 L15 15" stroke="#93C5FD" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                        </svg>
                        <svg viewBox="0 0 90 70" className="h-16 w-20">
                          <ellipse cx="20" cy="35" rx="8" ry="22" fill="#BFDBFE" stroke="#93C5FD" strokeWidth="1.2" />
                          <rect x="20" y="13" width="50" height="44" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="1.2" />
                          <ellipse cx="70" cy="35" rx="8" ry="22" fill="#BFDBFE" stroke="#93C5FD" strokeWidth="1.2" />
                        </svg>
                      </>
                    ) : (
                      <>
                        {/* Tilt to Width: 3 cylinders → 3x3 grid */}
                        <svg viewBox="0 0 100 80" className="h-18 w-22">
                          {[0, 1, 2].map((i) => (
                            <g key={i} transform={`translate(${i * 30}, 0)`}>
                              <ellipse cx="20" cy="20" rx="12" ry="5" fill="#BFDBFE" stroke="#93C5FD" strokeWidth="1" />
                              <rect x="8" y="20" width="24" height="35" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="1" />
                              <ellipse cx="20" cy="55" rx="12" ry="5" fill="#BFDBFE" stroke="#93C5FD" strokeWidth="1" />
                            </g>
                          ))}
                        </svg>
                        <svg viewBox="0 0 24 24" className="h-5 w-5">
                          <path d="M6 12 L18 12 M15 9 L18 12 L15 15" stroke="#93C5FD" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                        </svg>
                        <svg viewBox="0 0 100 100" className="h-22 w-22">
                          {[0, 1, 2].map((row) =>
                            [0, 1, 2].map((col) => (
                              <g key={`${row}-${col}`} transform={`translate(${col * 30}, ${row * 30})`}>
                                <ellipse cx="18" cy="12" rx="10" ry="4" fill="#BFDBFE" stroke="#93C5FD" strokeWidth="0.8" />
                                <rect x="8" y="12" width="20" height="18" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="0.8" />
                                <ellipse cx="18" cy="30" rx="10" ry="4" fill="#BFDBFE" stroke="#93C5FD" strokeWidth="0.8" />
                              </g>
                            ))
                          )}
                        </svg>
                      </>
                    )}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="hidden lg:block w-px bg-gray-200" />

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
                <svg viewBox="0 0 90 110" className="h-28 w-24">
                  {/* Bottom cylinder */}
                  <ellipse cx="45" cy="75" rx="22" ry="8" fill="#BFDBFE" stroke="#93C5FD" strokeWidth="1.2" />
                  <rect x="23" y="75" width="44" height="25" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="1.2" />
                  <ellipse cx="45" cy="100" rx="22" ry="8" fill="#BFDBFE" stroke="#93C5FD" strokeWidth="1.2" />
                  
                  {/* Middle cylinder */}
                  <ellipse cx="45" cy="45" rx="22" ry="8" fill="#BFDBFE" stroke="#93C5FD" strokeWidth="1.2" />
                  <rect x="23" y="45" width="44" height="25" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="1.2" />
                  <ellipse cx="45" cy="70" rx="22" ry="8" fill="#BFDBFE" stroke="#93C5FD" strokeWidth="1.2" />
                  
                  {/* Top cylinder */}
                  <ellipse cx="45" cy="15" rx="22" ry="8" fill="#BFDBFE" stroke="#93C5FD" strokeWidth="1.2" />
                  <rect x="23" y="15" width="44" height="25" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="1.2" />
                  <ellipse cx="45" cy="40" rx="22" ry="8" fill="#BFDBFE" stroke="#93C5FD" strokeWidth="1.2" />
                  
                  {/* Kg label for mass */}
                  {option.key === 'mass' && (
                    <g>
                      <ellipse cx="55" cy="25" rx="12" ry="8" fill="#93C5FD" stroke="#60A5FA" strokeWidth="1" />
                      <text x="50" y="28" fill="white" fontSize="8" fontWeight="600">Kg</text>
                    </g>
                  )}
                  
                  {/* Height measurement for height option */}
                  {option.key === 'height' && (
                    <g>
                      <line x1="12" y1="20" x2="12" y2="95" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="3 3" />
                      <line x1="9" y1="20" x2="15" y2="20" stroke="#9CA3AF" strokeWidth="1" />
                      <line x1="9" y1="95" x2="15" y2="95" stroke="#9CA3AF" strokeWidth="1" />
                    </g>
                  )}
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

export default ContainerCargoForm;
