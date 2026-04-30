import { useState } from 'react';
import type { CargoFormSubmission } from './CargoDesignModal';

interface BagCargoFormProps {
  onClose: () => void;
  onAdd?: (data: CargoFormSubmission) => void;
  // When provided, the form prefills from this row and the submit
  // button reads "Update" instead of "Add".
  initialData?: CargoFormSubmission;
}

// Big-bag (FIBC) shape — 3D cubic bag with 3 visible lifting loops at the top
// rhombus corners (top, left, right). Loops are closed vertical ellipses anchored
// at each corner and extending upward. Used in sections 2, 3.
const BigBagShape = ({
  size = 200,
  active = true,
}: {
  size?: number;
  active?: boolean;
}) => {
  const stroke = active ? '#7BA5F3' : '#9CA3AF';
  const top = active ? '#DBEAFE' : '#F3F4F6';
  const right = active ? '#A7C7FB' : '#E5E7EB';
  const left = active ? '#93C5FD' : '#D1D5DB';
  const sw = 1.4;

  // Top rhombus corners (in viewBox 220x240 coord space)
  const tc = { x: 110, y: 60 };  // top/back corner
  const rc = { x: 170, y: 90 };  // right corner
  const lc = { x: 50,  y: 90 };  // left corner

  // Lifting loop: vertical closed ellipse with bottom anchored at (cx, cy)
  const Loop = ({ cx, cy }: { cx: number; cy: number }) => (
    <ellipse cx={cx} cy={cy - 16} rx="5" ry="16" fill="white" stroke={stroke} strokeWidth={sw} />
  );

  return (
    <svg viewBox="0 0 220 240" style={{ width: size, height: size }}>
      {/* 3 lifting loops at visible rhombus corners — drawn behind the top face */}
      <Loop cx={lc.x} cy={lc.y} />
      <Loop cx={rc.x} cy={rc.y} />
      <Loop cx={tc.x} cy={tc.y} />

      {/* Top face (rhombus) */}
      <path
        d={`M${tc.x} ${tc.y} L${rc.x} ${rc.y} L110 120 L${lc.x} ${lc.y} Z`}
        fill={top}
        stroke={stroke}
        strokeWidth={sw}
        strokeLinejoin="round"
      />

      {/* Left face */}
      <path
        d="M50 90 L50 175 L110 205 L110 120 Z"
        fill={left}
        stroke={stroke}
        strokeWidth={sw}
        strokeLinejoin="round"
      />

      {/* Right face */}
      <path
        d="M170 90 L170 175 L110 205 L110 120 Z"
        fill={right}
        stroke={stroke}
        strokeWidth={sw}
        strokeLinejoin="round"
      />

      {/* Vertical fold seams on each face (dashed, subtle) */}
      <path d="M80 102 L80 188" stroke={stroke} strokeWidth="0.8" strokeDasharray="3 3" opacity="0.35" />
      <path d="M140 102 L140 188" stroke={stroke} strokeWidth="0.8" strokeDasharray="3 3" opacity="0.35" />
    </svg>
  );
};

// Stacked big-bags icon for section 4 — 2 bags stacked vertically
// Each bag has 3 closed elliptical loops at the visible rhombus corners
const StackedBigBagsIcon = ({ variant = 'plain' }: { variant?: 'plain' | 'mass' | 'height' }) => {
  const stroke = '#7BA5F3';
  const top = '#DBEAFE';
  const right = '#A7C7FB';
  const left = '#93C5FD';
  const labelColor = '#3B82F6';

  // Single small big-bag positioned with top-rhombus apex at (cx, y)
  // Rhombus: apex(cx, y) → right(cx+16, y+8) → front(cx, y+16) → left(cx-16, y+8)
  // Body extends down from rhombus to (cx, y+36) at front-bottom
  const Bag = ({ cx, y, num }: { cx: number; y: number; num?: number }) => (
    <g>
      {/* 3 loops (drawn behind the rhombus) */}
      <ellipse cx={cx - 16} cy={y + 8 - 8} rx="2.4" ry="8" fill="white" stroke={stroke} strokeWidth="1" />
      <ellipse cx={cx + 16} cy={y + 8 - 8} rx="2.4" ry="8" fill="white" stroke={stroke} strokeWidth="1" />
      <ellipse cx={cx} cy={y - 8} rx="2.4" ry="8" fill="white" stroke={stroke} strokeWidth="1" />

      {/* Top rhombus */}
      <path d={`M${cx} ${y} L${cx + 16} ${y + 8} L${cx} ${y + 16} L${cx - 16} ${y + 8} Z`} fill={top} stroke={stroke} strokeWidth="1" strokeLinejoin="round" />
      {/* Left face */}
      <path d={`M${cx - 16} ${y + 8} L${cx - 16} ${y + 28} L${cx} ${y + 36} L${cx} ${y + 16} Z`} fill={left} stroke={stroke} strokeWidth="1" strokeLinejoin="round" />
      {/* Right face */}
      <path d={`M${cx + 16} ${y + 8} L${cx + 16} ${y + 28} L${cx} ${y + 36} L${cx} ${y + 16} Z`} fill={right} stroke={stroke} strokeWidth="1" strokeLinejoin="round" />

      {num !== undefined && (
        <text x={cx + 10} y={y + 26} fill={labelColor} fontSize="7" fontWeight="700">
          {num}
        </text>
      )}
    </g>
  );

  return (
    <svg viewBox="0 0 96 100" className="h-20 w-20 flex-shrink-0">
      {/* Bottom bag (drawn first so top-bag covers any overlap) */}
      <Bag cx={48} y={48} num={variant === 'plain' ? 1 : undefined} />
      {/* Top bag */}
      <Bag cx={48} y={20} num={variant === 'plain' ? 2 : undefined} />

      {/* Mass: small Kg-bag badge in front-left */}
      {variant === 'mass' && (
        <g>
          <rect x="4" y="60" width="22" height="18" rx="2" fill="white" stroke={stroke} strokeWidth="1.2" />
          <path d="M8 60 C8 54, 22 54, 22 60" fill="none" stroke={stroke} strokeWidth="1" strokeLinecap="round" />
          <text x="15" y="73" fill={labelColor} fontSize="9" fontWeight="700" textAnchor="middle">Kg</text>
        </g>
      )}

      {/* Height: vertical ruler with arrowheads + tick marks */}
      {variant === 'height' && (
        <g>
          <line x1="6" y1="14" x2="6" y2="92" stroke={stroke} strokeWidth="1" />
          <path d="M3 17 L6 14 L9 17" fill="none" stroke={stroke} strokeWidth="1" strokeLinecap="round" />
          <path d="M3 89 L6 92 L9 89" fill="none" stroke={stroke} strokeWidth="1" strokeLinecap="round" />
          <line x1="4" y1="32" x2="8" y2="32" stroke={stroke} strokeWidth="1" />
          <line x1="4" y1="50" x2="8" y2="50" stroke={stroke} strokeWidth="1" />
          <line x1="4" y1="68" x2="8" y2="68" stroke={stroke} strokeWidth="1" />
        </g>
      )}
    </svg>
  );
};

const BagCargoForm = ({ onClose, onAdd, initialData }: BagCargoFormProps) => {
  const isEdit = !!initialData;
  const [form, setForm] = useState({
    productName: initialData?.productName ?? 'new product',
    colour: initialData?.colour ?? '#c93c8a',
    length: initialData?.length ?? '100',
    width: initialData?.width ?? '100',
    height: initialData?.height ?? '100',
    weight: initialData?.weight ?? '1',
    quantity: initialData?.quantity ?? '1',
  });

  const [spacing, setSpacing] = useState({
    tiltLength: !!initialData?.spacingSettings?.tiltToLength,
    tiltWidth: !!initialData?.spacingSettings?.tiltToWidth,
  });

  const [advancedSpacing, setAdvancedSpacing] = useState({
    layerCount: initialData?.stuffingSettings?.layersCount !== undefined,
    mass: initialData?.stuffingSettings?.mass !== undefined,
    height: initialData?.stuffingSettings?.height !== undefined,
    disableStacking: !!initialData?.stuffingSettings?.disableStacking,
  });

  const [advancedValues, setAdvancedValues] = useState({
    layerCount:
      initialData?.stuffingSettings?.layersCount !== undefined
        ? String(initialData.stuffingSettings.layersCount)
        : '0',
    mass:
      initialData?.stuffingSettings?.mass !== undefined
        ? String(initialData.stuffingSettings.mass)
        : '0',
    height:
      initialData?.stuffingSettings?.height !== undefined
        ? String(initialData.stuffingSettings.height)
        : '0',
  });

  const updateForm = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };
  const toggleSpacing = (key: keyof typeof spacing) => {
    setSpacing((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const toggleAdvancedSpacing = (key: keyof typeof advancedSpacing) => {
    // Stuffing options are mutually exclusive: turning one on clears the others.
    setAdvancedSpacing((prev) => {
      const turningOn = !prev[key];
      const cleared = {
        layerCount: false,
        mass: false,
        height: false,
        disableStacking: false,
      };
      return turningOn ? { ...cleared, [key]: true } : cleared;
    });
  };
  const updateAdvancedValue = (key: keyof typeof advancedValues, value: string) => {
    setAdvancedValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleAdd = () => {
    onAdd?.({
      type: 'bigbags',
      ...form,
      spacingSettings: {
        tiltToLength: spacing.tiltLength,
        tiltToWidth: spacing.tiltWidth,
      },
      stuffingSettings: {
        ...(advancedSpacing.layerCount && {
          layersCount: parseInt(advancedValues.layerCount, 10) || 0,
        }),
        ...(advancedSpacing.mass && {
          mass: parseFloat(advancedValues.mass) || 0,
        }),
        ...(advancedSpacing.height && {
          height: parseFloat(advancedValues.height) || 0,
        }),
        ...(advancedSpacing.disableStacking && { disableStacking: true }),
      },
    });
    onClose();
  };

  return (
    <div className="space-y-5">
      {/* Section 2 — Dimensions */}
      <section className="rounded-2xl bg-gray-50/70 p-5">
        <div className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-700">
          <span className="text-blue-500">2.</span> SELECT CARGO DIMENSIONS
        </div>

        <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
          {/* Big-bag illustration with dimension labels */}
          <div className="flex items-center justify-center">
            <svg viewBox="0 0 240 270" className="h-52 w-52">
              {/* 3 lifting loops at the visible top-rhombus corners (top, left, right).
                  Each is a closed vertical ellipse anchored at the corner, extending up. */}
              <ellipse cx="55"  cy="92"  rx="6.5" ry="22" fill="white" stroke="#7BA5F3" strokeWidth="1.5" />
              <ellipse cx="185" cy="92"  rx="6.5" ry="22" fill="white" stroke="#7BA5F3" strokeWidth="1.5" />
              <ellipse cx="120" cy="62"  rx="6.5" ry="22" fill="white" stroke="#7BA5F3" strokeWidth="1.5" />

              {/* Top face (rhombus) */}
              <path d="M120 80 L185 110 L120 140 L55 110 Z" fill="#DBEAFE" stroke="#7BA5F3" strokeWidth="1.5" strokeLinejoin="round" />
              {/* Left face */}
              <path d="M55 110 L55 195 L120 225 L120 140 Z" fill="#93C5FD" stroke="#7BA5F3" strokeWidth="1.5" strokeLinejoin="round" />
              {/* Right face */}
              <path d="M185 110 L185 195 L120 225 L120 140 Z" fill="#A7C7FB" stroke="#7BA5F3" strokeWidth="1.5" strokeLinejoin="round" />

              {/* Vertical fold seams on each face (subtle dashed) */}
              <path d="M85 122 L85 207" stroke="#7BA5F3" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.35" />
              <path d="M155 122 L155 207" stroke="#7BA5F3" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.35" />

              {/* Dashed dimension brackets + labels */}
              {/* Height (left vertical) */}
              <line x1="34" y1="116" x2="34" y2="200" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="34" y1="116" x2="55" y2="110" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
              <line x1="34" y1="200" x2="55" y2="195" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
              <text x="20" y="162" fill="#6B7280" fontSize="11" fontWeight="500">Height</text>

              {/* Width (bottom-left diagonal) */}
              <line x1="46" y1="218" x2="118" y2="252" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="46" y1="218" x2="55" y2="195" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
              <line x1="118" y1="252" x2="120" y2="225" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
              <text x="62" y="262" fill="#6B7280" fontSize="11" fontWeight="500">Width</text>

              {/* Length (bottom-right diagonal) */}
              <line x1="194" y1="218" x2="122" y2="252" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="194" y1="218" x2="185" y2="195" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
              <text x="148" y="262" fill="#6B7280" fontSize="11" fontWeight="500">Length</text>
            </svg>
          </div>

          {/* Form Fields */}
          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-xs font-medium text-gray-500">Product Name</span>
                <input
                  type="text"
                  placeholder="new product"
                  value={form.productName}
                  onChange={(e) => updateForm('productName', e.target.value)}
                  className="rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-medium text-gray-500">Color</span>
                <div className="relative">
                  <div
                    className="h-10 w-full rounded-full border border-gray-200"
                    style={{ backgroundColor: form.colour }}
                  />
                  <input
                    type="color"
                    value={form.colour}
                    onChange={(e) => updateForm('colour', e.target.value)}
                    className="absolute inset-0 h-full w-full cursor-pointer rounded-full opacity-0"
                    aria-label="Select colour"
                  />
                </div>
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {(['length', 'width', 'height'] as const).map((dim) => (
                <label key={dim} className="grid gap-2">
                  <span className="text-xs font-medium capitalize text-gray-500">{dim}</span>
                  <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                    <input
                      type="number"
                      placeholder="100"
                      value={form[dim]}
                      onChange={(e) => updateForm(dim, e.target.value)}
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
                <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                  <input
                    type="number"
                    placeholder="1"
                    value={form.weight}
                    onChange={(e) => updateForm('weight', e.target.value)}
                    className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                  />
                  <span className="text-xs font-medium text-gray-500">kg</span>
                </div>
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-medium text-gray-500">Quantity</span>
                <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                  <input
                    type="number"
                    placeholder="1"
                    value={form.quantity}
                    onChange={(e) => updateForm('quantity', e.target.value)}
                    className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                  />
                </div>
              </label>
              <div className="flex items-end">
                <button
                  type="button"
                  className="w-full rounded-full bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-600 transition hover:bg-blue-100"
                >
                  Prediction
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sections 3 & 4 */}
      <section className="grid gap-5 lg:grid-cols-2">
        {/* Section 3 — Spacing Settings (only Tilt to Length & Tilt to Width for bigbags) */}
        <div className="rounded-2xl bg-gray-50/70 p-5">
          <div className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-700">
            <span className="text-blue-500">3.</span> SPACING SETTINGS{' '}
            <span className="text-gray-400">?</span>
          </div>
          <div className="space-y-4">
            {[
              { key: 'tiltLength', label: 'Tilt to Length', tilted: 'length' as const },
              { key: 'tiltWidth', label: 'Tilt to Width', tilted: 'width' as const },
            ].map((option) => {
              const checked = spacing[option.key as keyof typeof spacing];
              return (
                <div key={option.key} className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleSpacing(option.key as keyof typeof spacing)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                    />
                    {option.label}
                  </label>
                  <div className="flex items-center gap-3 pl-6">
                    {/* Before — standard bigbag */}
                    <BigBagShape size={70} active={checked} />
                    {/* Arrow */}
                    <svg viewBox="0 0 24 24" className="h-5 w-5 flex-shrink-0">
                      <path
                        d="M6 12 L18 12 M15 9 L18 12 L15 15"
                        stroke={checked ? '#60A5FA' : '#9CA3AF'}
                        strokeWidth="1.5"
                        fill="none"
                        strokeLinecap="round"
                      />
                    </svg>
                    {/* After — rotated bigbag */}
                    <div
                      style={{
                        transform: option.tilted === 'width' ? 'rotate(-90deg)' : 'rotate(0deg)',
                      }}
                    >
                      <BigBagShape size={70} active={checked} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 4 — Stuffing Settings */}
        <div className="rounded-2xl bg-gray-50/70 p-5">
          <div className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-700">
            <span className="text-blue-500">4.</span> STUFFING SETTINGS{' '}
            <span className="text-gray-400">?</span>
          </div>
          <div className="grid grid-cols-2 gap-x-5 gap-y-5">
            {/* Layers Count */}
            <div className="flex items-center gap-3">
              <StackedBigBagsIcon variant="plain" />
              <div className="flex-1 space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                  <input
                    type="checkbox"
                    checked={advancedSpacing.layerCount}
                    onChange={() => toggleAdvancedSpacing('layerCount')}
                    className="h-4 w-4 flex-shrink-0 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  Layers Count
                </label>
                <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                  <input
                    type="number"
                    placeholder="0"
                    value={advancedValues.layerCount}
                    onChange={(e) => updateAdvancedValue('layerCount', e.target.value)}
                    disabled={!advancedSpacing.layerCount}
                    className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none disabled:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Mass */}
            <div className="flex items-center gap-3">
              <StackedBigBagsIcon variant="mass" />
              <div className="flex-1 space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                  <input
                    type="checkbox"
                    checked={advancedSpacing.mass}
                    onChange={() => toggleAdvancedSpacing('mass')}
                    className="h-4 w-4 flex-shrink-0 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  Mass
                </label>
                <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                  <input
                    type="number"
                    placeholder="0"
                    value={advancedValues.mass}
                    onChange={(e) => updateAdvancedValue('mass', e.target.value)}
                    disabled={!advancedSpacing.mass}
                    className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none disabled:text-gray-400"
                  />
                  <span className="text-xs font-medium text-gray-500">kg</span>
                </div>
              </div>
            </div>

            {/* Height */}
            <div className="flex items-center gap-3">
              <StackedBigBagsIcon variant="height" />
              <div className="flex-1 space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                  <input
                    type="checkbox"
                    checked={advancedSpacing.height}
                    onChange={() => toggleAdvancedSpacing('height')}
                    className="h-4 w-4 flex-shrink-0 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  Height
                </label>
                <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                  <input
                    type="number"
                    placeholder="0"
                    value={advancedValues.height}
                    onChange={(e) => updateAdvancedValue('height', e.target.value)}
                    disabled={!advancedSpacing.height}
                    className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none disabled:text-gray-400"
                  />
                  <span className="text-xs font-medium text-gray-500">mm</span>
                </div>
              </div>
            </div>

            {/* Disable stacking */}
            <div className="flex items-center gap-3">
              <div className="h-20 w-20 flex-shrink-0" />
              <label className="flex flex-1 items-center gap-2 text-sm font-medium text-gray-600">
                <input
                  type="checkbox"
                  checked={advancedSpacing.disableStacking}
                  onChange={() => toggleAdvancedSpacing('disableStacking')}
                  className="h-4 w-4 flex-shrink-0 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                Disable stacking
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="flex items-center justify-center gap-4 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg bg-blue-50 px-10 py-2.5 text-sm font-semibold text-blue-500 transition hover:bg-blue-100"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleAdd}
          className="rounded-lg bg-blue-500 px-12 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
        >
          {isEdit ? 'Update' : 'Add'}
        </button>
      </div>
    </div>
  );
};

export default BagCargoForm;
