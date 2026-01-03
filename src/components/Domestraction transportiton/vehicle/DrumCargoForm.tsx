                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              import { useState } from 'react';

interface DrumCargoFormProps {
  onClose: () => void;
}

const DrumCargoForm = ({ onClose }: DrumCargoFormProps) => {
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
            <svg viewBox="0 0 240 200" className="h-48 w-56">
              <defs>
                <linearGradient id="drumSide" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#BFDBFE" />
                  <stop offset="50%" stopColor="#DBEAFE" />
                  <stop offset="100%" stopColor="#BFDBFE" />
                </linearGradient>
              </defs>
              
              {/* Shadow */}
              <ellipse cx="120" cy="155" rx="85" ry="15" fill="#E5E7EB" opacity="0.4" />
              
              {/* Horizontal barrel/drum */}
              {/* Left end cap */}
              <ellipse cx="50" cy="90" rx="18" ry="35" fill="#BFDBFE" stroke="#93C5FD" strokeWidth="2" />
              
              {/* Barrel body */}
              <rect x="50" y="55" width="140" height="70" fill="url(#drumSide)" stroke="#93C5FD" strokeWidth="2" />
              
              {/* Right end cap */}
              <ellipse cx="190" cy="90" rx="18" ry="35" fill="#BFDBFE" stroke="#93C5FD" strokeWidth="2" />
              
              {/* Center band for detail */}
              <line x1="50" y1="75" x2="190" y2="75" stroke="#93C5FD" strokeWidth="1" opacity="0.5" />
              <line x1="50" y1="105" x2="190" y2="105" stroke="#93C5FD" strokeWidth="1" opacity="0.5" />
              
              {/* Height arrow - left */}
              <line x1="25" y1="55" x2="25" y2="125" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="22" y1="55" x2="28" y2="55" stroke="#9CA3AF" strokeWidth="1" />
              <line x1="22" y1="125" x2="28" y2="125" stroke="#9CA3AF" strokeWidth="1" />
              <text x="10" y="95" fill="#9CA3AF" fontSize="10" fontWeight="500">Height</text>
              
              {/* Radius arrow - right */}
              <line x1="190" y1="90" x2="230" y2="90" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="190" y1="87" x2="190" y2="93" stroke="#9CA3AF" strokeWidth="1" />
              <line x1="230" y1="87" x2="230" y2="93" stroke="#9CA3AF" strokeWidth="1" />
              <text x="210" y="80" fill="#9CA3AF" fontSize="10" fontWeight="500" textAnchor="middle">Radius</text>
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
                        {/* Tilt to Length: Horizontal → Vertical */}
                        <svg viewBox="0 0 90 70" className="h-16 w-20">
                          <ellipse cx="20" cy="35" rx="10" ry="24" fill="#BFDBFE" stroke="#93C5FD" strokeWidth="1.2" />
                          <rect x="20" y="15" width="50" height="40" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="1.2" />
                          <ellipse cx="70" cy="35" rx="10" ry="24" fill="#BFDBFE" stroke="#93C5FD" strokeWidth="1.2" />
                        </svg>
                        <svg viewBox="0 0 24 24" className="h-5 w-5">
                          <path d="M6 12 L18 12 M15 9 L18 12 L15 15" stroke="#93C5FD" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                        </svg>
                        <svg viewBox="0 0 70 80" className="h-18 w-16">
                          <ellipse cx="35" cy="20" rx="24" ry="10" fill="#BFDBFE" stroke="#93C5FD" strokeWidth="1.2" />
                          <rect x="13" y="20" width="44" height="40" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="1.2" />
                          <ellipse cx="35" cy="60" rx="24" ry="10" fill="#BFDBFE" stroke="#93C5FD" strokeWidth="1.2" />
                        </svg>
                      </>
                    ) : (
                      <>
                        {/* Tilt to Width: top view circles */}
                        <svg viewBox="0 0 110 50" className="h-16 w-24">
                          {[0, 1, 2].map((i) => (
                            <circle key={i} cx={20 + i * 30} cy="25" r="12" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="1.2" />
                          ))}
                        </svg>
                        <svg viewBox="0 0 24 24" className="h-5 w-5">
                          <path d="M6 12 L18 12 M15 9 L18 12 L15 15" stroke="#93C5FD" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                        </svg>
                        <svg viewBox="0 0 110 90" className="h-20 w-24">
                          {[0, 1, 2].map((row) =>
                            [0, 1, 2].map((col) => (
                              <circle key={`${row}-${col}`} cx={20 + col * 30} cy={20 + row * 25} r="12" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="1" />
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
                <svg viewBox="0 0 130 120" className="h-28 w-28">
                  {/* Pyramid of horizontal barrels */}
                  <g>
                    {[0, 1].map((row) =>
                      [0, 1 + row].map((col) => (
                        <g key={`${row}-${col}`} transform={`translate(${20 + col * 40 - row * 20}, ${70 - row * 25})`}>
                          <ellipse cx="10" cy="20" rx="6" ry="15" fill="#BFDBFE" stroke="#93C5FD" strokeWidth="1.1" />
                          <rect x="10" y="5" width="40" height="30" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="1.1" />
                          <ellipse cx="50" cy="20" rx="6" ry="15" fill="#BFDBFE" stroke="#93C5FD" strokeWidth="1.1" />
                        </g>
                      ))
                    )}
                  </g>

                  {/* Kg label for mass */}
                  {option.key === 'mass' && (
                    <g>
                      <ellipse cx="95" cy="40" rx="14" ry="9" fill="#93C5FD" stroke="#60A5FA" strokeWidth="1" />
                      <text x="89" y="43" fill="white" fontSize="8" fontWeight="600">Kg</text>
                    </g>
                  )}

                  {/* Height measurement */}
                  {option.key === 'height' && (
                    <g>
                      <line x1="18" y1="15" x2="18" y2="95" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="3 3" />
                      <line x1="15" y1="15" x2="21" y2="15" stroke="#9CA3AF" strokeWidth="1" />
                      <line x1="15" y1="95" x2="21" y2="95" stroke="#9CA3AF" strokeWidth="1" />
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

export default DrumCargoForm;
