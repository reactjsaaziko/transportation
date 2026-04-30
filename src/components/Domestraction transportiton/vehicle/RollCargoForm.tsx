import { useState } from 'react';
import type { CargoFormSubmission } from './CargoDesignModal';

interface RollCargoFormProps {
  onClose: () => void;
  onAdd?: (data: CargoFormSubmission) => void;
  initialData?: CargoFormSubmission;
}

// Horizontal cylinder/roll lying on its side — used in section 2 and as the
// "before" image in section 3 (rolls sit horizontally by default).
const HorizontalRoll = ({
  width = 130,
  height = 80,
  active = true,
}: {
  width?: number;
  height?: number;
  active?: boolean;
}) => {
  const stroke = active ? '#7BA5F3' : '#9CA3AF';
  const body = active ? '#DBEAFE' : '#F3F4F6';
  const cap = active ? '#BFDBFE' : '#E5E7EB';
  return (
    <svg viewBox="0 0 130 80" style={{ width, height }}>
      {/* Body — rectangle between the two end caps */}
      <path d="M16 12 L102 12 L102 68 L16 68 Z" fill={body} stroke={stroke} strokeWidth="1.4" />
      {/* Right end cap (back) */}
      <ellipse cx="102" cy="40" rx="10" ry="28" fill={cap} stroke={stroke} strokeWidth="1.4" />
      {/* Left end cap (front face — shows the visible circle opening) */}
      <ellipse cx="16" cy="40" rx="10" ry="28" fill={cap} stroke={stroke} strokeWidth="1.4" />
      <ellipse cx="16" cy="40" rx="4" ry="14" fill="none" stroke={stroke} strokeWidth="0.8" opacity="0.5" />
    </svg>
  );
};

// Vertical cylinder/roll standing on its end — "after" image in section 3 (when tilted).
const VerticalRoll = ({
  width = 70,
  height = 110,
  active = true,
}: {
  width?: number;
  height?: number;
  active?: boolean;
}) => {
  const stroke = active ? '#7BA5F3' : '#9CA3AF';
  const body = active ? '#DBEAFE' : '#F3F4F6';
  const top = active ? '#BFDBFE' : '#E5E7EB';
  return (
    <svg viewBox="0 0 70 110" style={{ width, height }}>
      <path d="M10 18 L10 92 Q10 102 35 102 Q60 102 60 92 L60 18 Z" fill={body} stroke={stroke} strokeWidth="1.4" />
      <ellipse cx="35" cy="92" rx="25" ry="9" fill="none" stroke={stroke} strokeWidth="0.8" strokeDasharray="3 3" opacity="0.5" />
      <ellipse cx="35" cy="18" rx="25" ry="9" fill={top} stroke={stroke} strokeWidth="1.4" />
    </svg>
  );
};

// A pile of horizontal rolls (logs) — bottom row of 3, top row of 2 nestled in
// between. Used in section 4 stuffing illustrations.
const StackedRollsIcon = ({ variant = 'plain' }: { variant?: 'plain' | 'mass' | 'height' }) => {
  const stroke = '#7BA5F3';
  const body = '#DBEAFE';
  const cap = '#BFDBFE';
  const labelColor = '#3B82F6';

  // Single small horizontal roll at center (cx, cy)
  const Roll = ({ cx, cy }: { cx: number; cy: number }) => (
    <g>
      <path d={`M${cx - 16} ${cy - 9} L${cx + 16} ${cy - 9} L${cx + 16} ${cy + 9} L${cx - 16} ${cy + 9} Z`} fill={body} stroke={stroke} strokeWidth="0.9" />
      <ellipse cx={cx + 16} cy={cy} rx="4" ry="9" fill={cap} stroke={stroke} strokeWidth="0.9" />
      <ellipse cx={cx - 16} cy={cy} rx="4" ry="9" fill={cap} stroke={stroke} strokeWidth="0.9" />
      <ellipse cx={cx - 16} cy={cy} rx="1.6" ry="4.5" fill="none" stroke={stroke} strokeWidth="0.7" opacity="0.55" />
    </g>
  );

  return (
    <svg viewBox="0 0 100 100" className="h-20 w-20 flex-shrink-0">
      {/* Bottom row — 3 rolls side-by-side */}
      <Roll cx={28} cy={70} />
      <Roll cx={50} cy={70} />
      <Roll cx={72} cy={70} />
      {/* Middle row — 2 rolls nestled between */}
      <Roll cx={39} cy={52} />
      <Roll cx={61} cy={52} />
      {/* Top row — 1 roll on top */}
      <Roll cx={50} cy={34} />

      {/* Mass: Kg bag attached above the pile */}
      {variant === 'mass' && (
        <g>
          <rect x="38" y="2" width="24" height="20" rx="2" fill="white" stroke={stroke} strokeWidth="1.2" />
          <path d="M42 2 C42 -4, 58 -4, 58 2" fill="none" stroke={stroke} strokeWidth="1" strokeLinecap="round" />
          <text x="50" y="16" fill={labelColor} fontSize="9" fontWeight="700" textAnchor="middle">Kg</text>
        </g>
      )}

      {/* Height: vertical ruler on the left */}
      {variant === 'height' && (
        <g>
          <line x1="6" y1="20" x2="6" y2="84" stroke={stroke} strokeWidth="1" />
          <path d="M3 23 L6 20 L9 23" fill="none" stroke={stroke} strokeWidth="1" strokeLinecap="round" />
          <path d="M3 81 L6 84 L9 81" fill="none" stroke={stroke} strokeWidth="1" strokeLinecap="round" />
          <line x1="4" y1="36" x2="8" y2="36" stroke={stroke} strokeWidth="1" />
          <line x1="4" y1="52" x2="8" y2="52" stroke={stroke} strokeWidth="1" />
          <line x1="4" y1="68" x2="8" y2="68" stroke={stroke} strokeWidth="1" />
        </g>
      )}
    </svg>
  );
};

// Roll-placement icons (top-down view): square grid vs hexagonal grid
const PlacementIcon = ({ pattern, active }: { pattern: 'square' | 'hexagon'; active: boolean }) => {
  const stroke = active ? '#7BA5F3' : '#9CA3AF';
  const fill = active ? '#DBEAFE' : '#F3F4F6';
  const top = active ? '#BFDBFE' : '#E5E7EB';

  const Mini = ({ cx, cy }: { cx: number; cy: number }) => (
    <g>
      <path d={`M${cx - 11} ${cy - 8} L${cx - 11} ${cy + 4} Q${cx - 11} ${cy + 8} ${cx} ${cy + 8} Q${cx + 11} ${cy + 8} ${cx + 11} ${cy + 4} L${cx + 11} ${cy - 8} Z`} fill={fill} stroke={stroke} strokeWidth="1" />
      <ellipse cx={cx} cy={cy - 8} rx="11" ry="4" fill={top} stroke={stroke} strokeWidth="1" />
    </g>
  );

  if (pattern === 'square') {
    const cols = [16, 40, 64];
    const rows = [16, 40];
    return (
      <svg viewBox="0 0 80 60" className="h-14 w-20">
        {rows.map((y) => cols.map((x) => <Mini key={`${x}-${y}`} cx={x} cy={y} />))}
      </svg>
    );
  }
  const rows = [
    { y: 14, xs: [14, 36, 58] },
    { y: 30, xs: [25, 47, 69] },
    { y: 46, xs: [14, 36, 58] },
  ];
  return (
    <svg viewBox="0 0 80 60" className="h-14 w-20">
      {rows.map((r) => r.xs.map((x) => <Mini key={`${x}-${r.y}`} cx={x} cy={r.y} />))}
    </svg>
  );
};

const RollCargoForm = ({ onClose, onAdd, initialData }: RollCargoFormProps) => {
  const isEdit = !!initialData;
  // For rolls the serialiser writes: length=cylinder length (form.height),
  // width=diameter, height=diameter. So when prefilling we map back:
  // diameter = initialData.width (or .height); cylinder length = .length.
  const [form, setForm] = useState({
    productName: initialData?.productName ?? 'new product',
    colour: initialData?.colour ?? '#c93c8a',
    diameter: initialData?.width ?? '100',
    height: initialData?.length ?? '100',
    weight: initialData?.weight ?? '1',
    quantity: initialData?.quantity ?? '1',
  });

  const [tiltEnabled, setTiltEnabled] = useState(
    !!initialData?.spacingSettings?.tiltToLength,
  );
  const [rollPlacement, setRollPlacement] = useState<'square' | 'hexagon'>('hexagon');

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
      type: 'roll',
      productName: form.productName,
      colour: form.colour,
      length: form.height,    // For a horizontal roll, "Height" in the form is the cylinder's length
      width: form.diameter,
      height: form.diameter,  // Both cross-section dimensions = diameter
      weight: form.weight,
      quantity: form.quantity,
      spacingSettings: {
        // Rolls tilt along the length (cylinder axis); map the single toggle.
        tiltToLength: tiltEnabled,
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
          {/* Horizontal roll illustration with Height (top) + Radius (right) labels */}
          <div className="flex items-center justify-center">
            <svg viewBox="0 0 240 200" className="h-44 w-48">
              {/* Roll body */}
              <path d="M40 60 L160 60 L160 140 L40 140 Z" fill="#DBEAFE" stroke="#7BA5F3" strokeWidth="1.5" />
              {/* Right end cap */}
              <ellipse cx="160" cy="100" rx="14" ry="40" fill="#BFDBFE" stroke="#7BA5F3" strokeWidth="1.5" />
              {/* Left end cap (front circle) */}
              <ellipse cx="40" cy="100" rx="14" ry="40" fill="#BFDBFE" stroke="#7BA5F3" strokeWidth="1.5" />
              <ellipse cx="40" cy="100" rx="6" ry="20" fill="none" stroke="#7BA5F3" strokeWidth="0.9" opacity="0.5" />

              {/* Height bracket on top (showing the roll's length) */}
              <line x1="40" y1="40" x2="160" y2="40" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="40" y1="40" x2="40" y2="60" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
              <line x1="160" y1="40" x2="160" y2="60" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
              <text x="100" y="32" fill="#6B7280" fontSize="11" fontWeight="500" textAnchor="middle">Height</text>

              {/* Radius label — pointing to right end cap */}
              <line x1="160" y1="100" x2="180" y2="100" stroke="#7BA5F3" strokeWidth="1" />
              <circle cx="160" cy="100" r="2" fill="#7BA5F3" />
              <text x="186" y="104" fill="#6B7280" fontSize="11" fontWeight="500">Radius</text>
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

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-xs font-medium text-gray-500">Diameter</span>
                <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                  <input
                    type="number"
                    placeholder="100"
                    value={form.diameter}
                    onChange={(e) => updateForm('diameter', e.target.value)}
                    className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                  />
                  <span className="text-xs font-medium text-gray-500">mm</span>
                </div>
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-medium text-gray-500">Height</span>
                <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                  <input
                    type="number"
                    placeholder="100"
                    value={form.height}
                    onChange={(e) => updateForm('height', e.target.value)}
                    className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                  />
                  <span className="text-xs font-medium text-gray-500">mm</span>
                </div>
              </label>
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
        {/* Section 3 — Spacing Settings (Tilt + Roll Placement) */}
        <div className="rounded-2xl bg-gray-50/70 p-5">
          <div className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-700">
            <span className="text-blue-500">3.</span> SPACING SETTINGS{' '}
            <span className="text-gray-400">?</span>
          </div>

          {/* Tilt: horizontal → vertical (rolls default to horizontal, tilt stands them up) */}
          <div className="mb-5 space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <input
                type="checkbox"
                checked={tiltEnabled}
                onChange={() => setTiltEnabled((v) => !v)}
                className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              Tilt
            </label>
            <div className="flex items-center gap-3 pl-6">
              <HorizontalRoll width={72} height={44} active={tiltEnabled} />
              <svg viewBox="0 0 24 24" className="h-5 w-5 flex-shrink-0">
                <path
                  d="M6 12 L18 12 M15 9 L18 12 L15 15"
                  stroke={tiltEnabled ? '#60A5FA' : '#9CA3AF'}
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
              <VerticalRoll width={42} height={64} active={tiltEnabled} />
            </div>
          </div>

          {/* Roll Placement */}
          <div className="space-y-3">
            <span className="text-sm font-medium text-gray-600">Roll Placement</span>
            <div className="flex items-center gap-6">
              {(['square', 'hexagon'] as const).map((p) => (
                <label key={p} className="flex flex-col items-center gap-2 cursor-pointer">
                  <PlacementIcon pattern={p} active={rollPlacement === p} />
                  <div className="flex items-center gap-2 text-sm">
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                        rollPlacement === p ? 'border-blue-500' : 'border-gray-300'
                      }`}
                    >
                      {rollPlacement === p && <span className="h-2 w-2 rounded-full bg-blue-500" />}
                    </span>
                    <input
                      type="radio"
                      name="rollPlacement"
                      value={p}
                      checked={rollPlacement === p}
                      onChange={() => setRollPlacement(p)}
                      className="sr-only"
                    />
                    <span className={rollPlacement === p ? 'text-gray-700' : 'text-gray-500'}>
                      {p === 'square' ? 'Square' : 'Hexagon'}
                    </span>
                  </div>
                </label>
              ))}
            </div>
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
              <StackedRollsIcon variant="plain" />
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
              <StackedRollsIcon variant="mass" />
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
              <StackedRollsIcon variant="height" />
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

export default RollCargoForm;
