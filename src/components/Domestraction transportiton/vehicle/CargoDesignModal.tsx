import { useEffect, useMemo, useState } from 'react';
import BagCargoForm from './BagCargoForm';
import SackCargoForm from './SackCargoForm';
import ContainerCargoForm from './ContainerCargoForm';
import DrumCargoForm from './DrumCargoForm';
import RollCargoForm from './RollCargoForm';
import {
  useGetCargoTypesQuery,
  type CargoTypeSpec,
  type SpacingSettings,
  type StuffingSettings,
} from '@/services/transportApi';

export interface CargoFormSubmission {
  type: string;
  productName: string;
  colour: string;
  length: string;
  width: string;
  height: string;
  weight: string;
  quantity: string;
  // Per-product spacing/stuffing settings forwarded into the
  // /load-calculator/api/calculate-multiple-containers request body.
  spacingSettings?: SpacingSettings;
  stuffingSettings?: StuffingSettings;
}

interface CargoDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (data: CargoFormSubmission) => void;
  // When provided, the modal opens in edit mode: the cargo type is locked
  // to `initialData.type`, the form fields are prefilled, and the submit
  // button reads "Update". Submission still flows through `onAdd` — the
  // caller decides whether to add a new row or update an existing one.
  initialData?: CargoFormSubmission;
}

// Display order for cargo type tiles. The actual list of types comes from the
// /load-calculator/api/cargo-types endpoint; types not yet supported by the
// individual forms are marked disabled in the UI.
const CARGO_TYPE_ORDER = ['box', 'bigbags', 'sacks', 'barrels', 'roll', 'pipes', 'bulk'] as const;
const DISABLED_CARGO_TYPES = new Set<string>(['pipes', 'bulk']);

// Fallback list shown while the API request is in-flight or if it fails.
const FALLBACK_CARGO_TYPES = CARGO_TYPE_ORDER.map((id) => ({
  id,
  label: id,
  disabled: DISABLED_CARGO_TYPES.has(id),
  spec: undefined as CargoTypeSpec | undefined,
}));

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

// Cargo Type Icons — line-art style matching the reference image.
// When `active` is true, the parent tile is solid blue so icons render in white.
const CargoTypeIcon = ({ type, active, disabled = false }: { type: string; active: boolean; disabled?: boolean }) => {
  const stroke = disabled ? '#D1D5DB' : active ? '#FFFFFF' : '#9CA3AF';
  const fill = active ? 'rgba(255,255,255,0.18)' : 'none';
  const sw = 1.6;

  switch (type) {
    case 'box':
      // 3D isometric cube with visible top/left/right faces
      return (
        <svg viewBox="0 0 48 48" className="h-10 w-10">
          <path d="M24 8 L40 16 L40 33 L24 41 L8 33 L8 16 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
          <path d="M8 16 L24 24 L40 16" fill="none" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
          <path d="M24 24 L24 41" stroke={stroke} strokeWidth={sw} />
        </svg>
      );
    case 'bigbags':
      // Shopping bag with two handle loops
      return (
        <svg viewBox="0 0 48 48" className="h-10 w-10">
          <path d="M11 17 L37 17 L35 41 L13 41 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
          <path d="M17 17 C17 10, 31 10, 31 17" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <path d="M21 17 L21 21" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <path d="M27 17 L27 21" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </svg>
      );
    case 'sacks':
      // Pouch/sack with cinched neck
      return (
        <svg viewBox="0 0 48 48" className="h-10 w-10">
          <path d="M14 16 Q14 12 18 11 L30 11 Q34 12 34 16 L36 38 Q36 42 30 42 L18 42 Q12 42 12 38 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
          <ellipse cx="24" cy="13" rx="10" ry="3" fill="none" stroke={stroke} strokeWidth={sw} />
          <path d="M14 25 Q24 30 34 25" fill="none" stroke={stroke} strokeWidth={sw * 0.8} opacity="0.7" />
        </svg>
      );
    case 'barrels':
      // Cylindrical drum with horizontal hoops
      return (
        <svg viewBox="0 0 48 48" className="h-10 w-10">
          <ellipse cx="24" cy="11" rx="11" ry="3.5" fill={fill} stroke={stroke} strokeWidth={sw} />
          <path d="M13 11 L13 37" stroke={stroke} strokeWidth={sw} />
          <path d="M35 11 L35 37" stroke={stroke} strokeWidth={sw} />
          <path d="M13 37 Q24 41 35 37" fill="none" stroke={stroke} strokeWidth={sw} />
          <line x1="13" y1="20" x2="35" y2="20" stroke={stroke} strokeWidth={sw * 0.8} />
          <line x1="13" y1="29" x2="35" y2="29" stroke={stroke} strokeWidth={sw * 0.8} />
        </svg>
      );
    case 'roll':
      // Horizontal cylinder roll with end opening visible
      return (
        <svg viewBox="0 0 48 48" className="h-10 w-10">
          <path d="M11 16 L37 16" stroke={stroke} strokeWidth={sw} />
          <path d="M11 32 L37 32" stroke={stroke} strokeWidth={sw} />
          <ellipse cx="11" cy="24" rx="3.5" ry="8" fill={fill} stroke={stroke} strokeWidth={sw} />
          <ellipse cx="37" cy="24" rx="3.5" ry="8" fill={fill} stroke={stroke} strokeWidth={sw} />
          <ellipse cx="37" cy="24" rx="1.6" ry="4" fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
        </svg>
      );
    case 'pipes':
      // Two stacked tubes with circular hollow ends
      return (
        <svg viewBox="0 0 48 48" className="h-10 w-10">
          {/* Top tube */}
          <path d="M11 12 L37 12" stroke={stroke} strokeWidth={sw} />
          <path d="M11 22 L37 22" stroke={stroke} strokeWidth={sw} />
          <ellipse cx="11" cy="17" rx="3" ry="5" fill={fill} stroke={stroke} strokeWidth={sw} />
          <ellipse cx="37" cy="17" rx="3" ry="5" fill={fill} stroke={stroke} strokeWidth={sw} />
          <ellipse cx="37" cy="17" rx="1.4" ry="2.5" fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
          {/* Bottom tube */}
          <path d="M11 26 L37 26" stroke={stroke} strokeWidth={sw} />
          <path d="M11 36 L37 36" stroke={stroke} strokeWidth={sw} />
          <ellipse cx="11" cy="31" rx="3" ry="5" fill={fill} stroke={stroke} strokeWidth={sw} />
          <ellipse cx="37" cy="31" rx="3" ry="5" fill={fill} stroke={stroke} strokeWidth={sw} />
          <ellipse cx="37" cy="31" rx="1.4" ry="2.5" fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
        </svg>
      );
    case 'bulk':
      // Pile/cone triangle
      return (
        <svg viewBox="0 0 48 48" className="h-10 w-10">
          <path d="M8 39 L24 11 L40 39 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
};

// Tilt Illustrations: a "before" box → arrow → "after" box, where the after-box
// is rotated/transformed depending on the tilt axis. Active = blue, otherwise gray.
const TiltIllustration = ({ type, active }: { type: 'length' | 'width' | 'height'; active: boolean }) => {
  const stroke = active ? '#60A5FA' : '#D1D5DB';
  const top = active ? '#DBEAFE' : '#F3F4F6';
  const right = active ? '#A7C7FB' : '#E5E7EB';
  const left = active ? '#93C5FD' : '#D1D5DB';

  // Reusable isometric 3D box drawn at (cx,cy), with given length, width, height
  const Box = ({ cx, cy, l, w, h }: { cx: number; cy: number; l: number; w: number; h: number }) => {
    // l = depth back-right, w = depth back-left, h = vertical
    const ax = cx, ay = cy; // anchor: bottom-front corner
    const tx = ax, ty = ay - h; // top-front
    const trx = ax + l, try_ = ay - h - l * 0.5; // top-right
    const tlx = ax - w, tly = ay - h - w * 0.5; // top-left
    const ttx = ax + l - w, tty = ay - h - l * 0.5 - w * 0.5; // top-back
    const brx = ax + l, bry = ay - l * 0.5; // bottom-right
    const blx = ax - w, bly = ay - w * 0.5; // bottom-left
    return (
      <g>
        {/* Top */}
        <path d={`M${tx} ${ty} L${trx} ${try_} L${ttx} ${tty} L${tlx} ${tly} Z`} fill={top} stroke={stroke} strokeWidth="1" strokeLinejoin="round" />
        {/* Right */}
        <path d={`M${tx} ${ty} L${trx} ${try_} L${brx} ${bry} L${ax} ${ay} Z`} fill={right} stroke={stroke} strokeWidth="1" strokeLinejoin="round" />
        {/* Left */}
        <path d={`M${tx} ${ty} L${tlx} ${tly} L${blx} ${bly} L${ax} ${ay} Z`} fill={left} stroke={stroke} strokeWidth="1" strokeLinejoin="round" />
      </g>
    );
  };

  return (
    <svg viewBox="0 0 130 60" className="h-16 w-full">
      {/* Before — standard box */}
      <Box cx={28} cy={50} l={18} w={18} h={16} />

      {/* Arrow */}
      <path d="M62 38 L80 38 M75 34 L80 38 L75 42" stroke={stroke} strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />

      {/* After — transformed depending on tilt axis */}
      {type === 'length' && <Box cx={92} cy={50} l={28} w={14} h={14} />}
      {type === 'width' && <Box cx={108} cy={52} l={10} w={10} h={32} />}
      {type === 'height' && <Box cx={96} cy={50} l={20} w={20} h={8} />}
    </svg>
  );
};

// Section 4 illustrations: stacked layers with optional Kg badge or height ruler.
// Variants: 'layers' (numbered 1-4), 'mass' (Kg bag overlay), 'height' (vertical ruler)
const StackedBoxIcon = ({ type, active }: { type: 'layers' | 'mass' | 'height'; active: boolean }) => {
  const stroke = active ? '#60A5FA' : '#9CA3AF';
  const top = active ? '#DBEAFE' : '#F3F4F6';
  const right = active ? '#A7C7FB' : '#E5E7EB';
  const left = active ? '#93C5FD' : '#D1D5DB';
  const labelColor = active ? '#3B82F6' : '#9CA3AF';

  // Render a single thin slab in isometric view at vertical center y
  const Slab = ({ y, height = 6 }: { y: number; height?: number }) => (
    <g>
      {/* Top */}
      <path d={`M28 ${y} L48 ${y - 8} L68 ${y} L48 ${y + 8} Z`} fill={top} stroke={stroke} strokeWidth="1" strokeLinejoin="round" />
      {/* Right */}
      <path d={`M48 ${y + 8} L68 ${y} L68 ${y + height} L48 ${y + 8 + height} Z`} fill={right} stroke={stroke} strokeWidth="1" strokeLinejoin="round" />
      {/* Left */}
      <path d={`M28 ${y} L48 ${y + 8} L48 ${y + 8 + height} L28 ${y + height} Z`} fill={left} stroke={stroke} strokeWidth="1" strokeLinejoin="round" />
    </g>
  );

  // Layer y-positions (top → bottom): 4 thin slabs stacked
  const slabs = [
    { y: 18, num: 4 },
    { y: 32, num: 3 },
    { y: 46, num: 2 },
    { y: 60, num: 1 },
  ];

  return (
    <svg viewBox="0 0 92 84" className="h-20 w-20">
      {/* Stack of 4 slabs */}
      {slabs.map((s) => (
        <Slab key={s.y} y={s.y} height={6} />
      ))}

      {/* Layer numbers 1-4 on the right face (only for 'layers' variant) */}
      {type === 'layers' &&
        slabs.map((s) => (
          <text
            key={`n-${s.y}`}
            x="76"
            y={s.y + 12}
            fill={labelColor}
            fontSize="8"
            fontWeight="700"
            textAnchor="middle"
          >
            {s.num}
          </text>
        ))}

      {/* Mass: Kg bag overlay in the center-front */}
      {type === 'mass' && (
        <g>
          <rect x="36" y="34" width="24" height="20" rx="2" fill="white" stroke={stroke} strokeWidth="1.4" />
          {/* bag handle */}
          <path d="M40 34 C40 28, 56 28, 56 34" fill="none" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
          <text x="48" y="48" fill={labelColor} fontSize="9" fontWeight="700" textAnchor="middle">
            Kg
          </text>
        </g>
      )}

      {/* Height: vertical ruler with arrowheads + tick marks on the left */}
      {type === 'height' && (
        <g>
          <line x1="14" y1="14" x2="14" y2="74" stroke={stroke} strokeWidth="1" />
          <path d="M11 17 L14 14 L17 17" fill="none" stroke={stroke} strokeWidth="1" strokeLinecap="round" />
          <path d="M11 71 L14 74 L17 71" fill="none" stroke={stroke} strokeWidth="1" strokeLinecap="round" />
          <line x1="12" y1="26" x2="16" y2="26" stroke={stroke} strokeWidth="1" />
          <line x1="12" y1="38" x2="16" y2="38" stroke={stroke} strokeWidth="1" />
          <line x1="12" y1="50" x2="16" y2="50" stroke={stroke} strokeWidth="1" />
          <line x1="12" y1="62" x2="16" y2="62" stroke={stroke} strokeWidth="1" />
        </g>
      )}
    </svg>
  );
};

const CargoDesignModal = ({ isOpen, onClose, onAdd, initialData }: CargoDesignModalProps) => {
  const isEdit = !!initialData;
  // Fetch cargo type catalog from backend (GET /load-calculator/api/cargo-types).
  // Drives the section-1 tile list, sub-form selection, and default dimensions.
  const { data: cargoTypesResp } = useGetCargoTypesQuery();
  const apiCargoTypes = cargoTypesResp?.data;

  // Build the section-1 tile list from API data, preserving the desired display
  // order. Types not yet supported by sub-forms (pipes, bulk) stay disabled.
  const cargoTypes = useMemo(() => {
    if (!apiCargoTypes) return FALLBACK_CARGO_TYPES;
    const ordered = CARGO_TYPE_ORDER.filter((id) => apiCargoTypes[id]).map((id) => ({
      id,
      label: id,
      disabled: DISABLED_CARGO_TYPES.has(id),
      spec: apiCargoTypes[id],
    }));
    // Append any extra types returned by the API that aren't in our display order
    const extras = Object.keys(apiCargoTypes)
      .filter((id) => !CARGO_TYPE_ORDER.includes(id as (typeof CARGO_TYPE_ORDER)[number]))
      .map((id) => ({ id, label: id, disabled: true, spec: apiCargoTypes[id] }));
    return [...ordered, ...extras];
  }, [apiCargoTypes]);

  const [selectedCargoType, setSelectedCargoType] = useState(
    initialData?.type ?? 'box',
  );

  const selectedSpec = apiCargoTypes?.[selectedCargoType];
  const apiDefaults = selectedSpec?.defaultDimensions;

  const [form, setForm] = useState({
    productName: initialData?.productName ?? 'new product',
    colour: initialData?.colour ?? '#c93c8a',
    length: initialData?.length ?? '100',
    width: initialData?.width ?? '100',
    height: initialData?.height ?? '100',
    weight: initialData?.weight ?? '1',
    quantity: initialData?.quantity ?? '1',
  });

  // When opened in edit mode, sync the modal state to the row being edited
  // each time `initialData` changes (i.e. when the user clicks the gear on
  // a different row before closing the modal in between).
  useEffect(() => {
    if (!initialData) return;
    setSelectedCargoType(initialData.type);
    setForm({
      productName: initialData.productName,
      colour: initialData.colour,
      length: initialData.length,
      width: initialData.width,
      height: initialData.height,
      weight: initialData.weight,
      quantity: initialData.quantity,
    });
  }, [initialData]);

  // When the selected cargo type changes (and we have an API spec for it),
  // pre-fill the dimensions from the spec's defaultDimensions. Skip when
  // editing — the user's existing dimensions should not be clobbered.
  useEffect(() => {
    if (isEdit) return;
    if (apiDefaults) {
      setForm((prev) => ({
        ...prev,
        length: String(apiDefaults.length),
        width: String(apiDefaults.width),
        height: String(apiDefaults.height),
      }));
    }
  }, [selectedCargoType, apiDefaults, isEdit]);

  // Apply tilting capabilities from the API spec to derive section-3 defaults
  // for the inline box form. Falls back to the static defaults when the API
  // hasn't responded yet.
  const initialSpacing = useMemo(() => {
    if (!selectedSpec?.tilting) return defaultSpacing;
    return {
      tiltLength: !!selectedSpec.tilting.length,
      tiltWidth: !!selectedSpec.tilting.width,
      tiltHeight: !!selectedSpec.tilting.height,
    };
  }, [selectedSpec]);

  const [spacing, setSpacing] = useState(defaultSpacing);
  useEffect(() => {
    setSpacing(initialSpacing);
  }, [initialSpacing]);

  const [advancedSpacing, setAdvancedSpacing] = useState(() => ({
    ...defaultAdvancedSpacing,
    ...(initialData?.stuffingSettings?.layersCount !== undefined && {
      layerCount: true,
    }),
    ...(initialData?.stuffingSettings?.mass !== undefined && { mass: true }),
    ...(initialData?.stuffingSettings?.height !== undefined && { height: true }),
    ...(initialData?.stuffingSettings?.disableStacking && {
      disableStacking: true,
    }),
  }));
  const [advancedValues, setAdvancedValues] = useState({
    layerCount:
      initialData?.stuffingSettings?.layersCount !== undefined
        ? String(initialData.stuffingSettings.layersCount)
        : '',
    mass:
      initialData?.stuffingSettings?.mass !== undefined
        ? String(initialData.stuffingSettings.mass)
        : '0',
    height:
      initialData?.stuffingSettings?.height !== undefined
        ? String(initialData.stuffingSettings.height)
        : '0',
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

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20 px-4" onClick={onClose}>
      <div
        className="max-h-[95vh] w-full max-w-7xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="space-y-6 bg-white px-6 py-6">
          <section>
            <div className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-700">
              <span className="text-blue-500">1.</span> SELECT CARGO TYPE
            </div>
            <div className="grid grid-cols-7 gap-3">
              {cargoTypes.map((cargo) => {
                const active = selectedCargoType === cargo.id;
                // Edit mode locks the type — switching cargo type would
                // change required dimensions (e.g. width vs diameter) and
                // invalidate the row, so we only let the user change
                // measurements/settings, not type.
                const disabled = cargo.disabled || (isEdit && !active);
                return (
                  <button
                    key={cargo.id}
                    type="button"
                    disabled={disabled}
                    aria-disabled={disabled}
                    title={
                      isEdit && !active
                        ? 'Cargo type is locked while editing'
                        : disabled
                          ? 'Coming soon'
                          : undefined
                    }
                    className={`flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-center transition ${
                      disabled
                        ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 opacity-60'
                        : active
                          ? 'border-blue-500 bg-blue-500 text-white'
                          : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      if (disabled) return;
                      setSelectedCargoType(cargo.id);
                    }}
                  >
                    <CargoTypeIcon type={cargo.id} active={active && !disabled} disabled={disabled} />
                    <span
                      className={`text-sm ${
                        disabled ? 'text-gray-400' : active ? 'text-white' : 'text-gray-600'
                      }`}
                    >
                      {cargo.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {selectedCargoType === 'bigbags' ? (
            <BagCargoForm onClose={onClose} onAdd={onAdd} initialData={initialData} />
          ) : selectedCargoType === 'sacks' ? (
            <SackCargoForm onClose={onClose} onAdd={onAdd} initialData={initialData} />
          ) : selectedCargoType === 'barrels' ? (
            <DrumCargoForm onClose={onClose} onAdd={onAdd} initialData={initialData} />
          ) : selectedCargoType === 'roll' ? (
            <RollCargoForm onClose={onClose} onAdd={onAdd} initialData={initialData} />
          ) : selectedCargoType === 'pipes' ? (
            <ContainerCargoForm onClose={onClose} />
          ) : (
            <>
            <section className="rounded-2xl bg-gray-50/70 p-5">
              <div className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-700">
                <span className="text-blue-500">2.</span> SELECT CARGO DIMENSIONS
              </div>
            <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
              <div className="flex items-center justify-center rounded-2xl bg-white p-4">
                <svg viewBox="0 0 220 220" className="h-44 w-44">
                  <defs>
                    <linearGradient id="boxTopFace" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#E0ECFF" />
                      <stop offset="100%" stopColor="#BFDBFE" />
                    </linearGradient>
                    <linearGradient id="boxLeftFace" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#A7C7FB" />
                      <stop offset="100%" stopColor="#7BA5F3" />
                    </linearGradient>
                    <linearGradient id="boxRightFace" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#BFDBFE" />
                      <stop offset="100%" stopColor="#93C5FD" />
                    </linearGradient>
                  </defs>

                  {/* 3D Isometric Box: top, left-front, right-front faces */}
                  <path d="M110 35 L180 70 L110 105 L40 70 Z" fill="url(#boxTopFace)" stroke="#7BA5F3" strokeWidth="1.4" strokeLinejoin="round" />
                  <path d="M40 70 L40 140 L110 175 L110 105 Z" fill="url(#boxLeftFace)" stroke="#7BA5F3" strokeWidth="1.4" strokeLinejoin="round" />
                  <path d="M180 70 L180 140 L110 175 L110 105 Z" fill="url(#boxRightFace)" stroke="#7BA5F3" strokeWidth="1.4" strokeLinejoin="round" />

                  {/* Dashed dimension brackets */}
                  {/* Height (left vertical) */}
                  <line x1="22" y1="78" x2="22" y2="148" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="22" y1="78" x2="40" y2="70" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
                  <line x1="22" y1="148" x2="40" y2="140" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
                  <text x="18" y="115" fill="#6B7280" fontSize="11" fontWeight="500" textAnchor="end">Height</text>

                  {/* Width (bottom-left diagonal) */}
                  <line x1="40" y1="155" x2="110" y2="190" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="40" y1="140" x2="40" y2="155" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
                  <line x1="110" y1="175" x2="110" y2="190" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
                  <text x="58" y="208" fill="#6B7280" fontSize="11" fontWeight="500">Width</text>

                  {/* Length (bottom-right diagonal) */}
                  <line x1="180" y1="155" x2="110" y2="190" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="180" y1="140" x2="180" y2="155" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
                  <text x="135" y="208" fill="#6B7280" fontSize="11" fontWeight="500">Length</text>
                </svg>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-xs font-medium text-gray-500">Product Name</span>
                    <input
                      type="text"
                      placeholder="new product"
                      className="rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      value={form.productName}
                      onChange={(event) => updateForm('productName', event.target.value)}
                      required
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
                        onChange={(event) => updateForm('colour', event.target.value)}
                        className="absolute inset-0 h-full w-full cursor-pointer rounded-full opacity-0"
                        aria-label="Select colour"
                      />
                    </div>
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {(['length', 'width', 'height'] as const).map((dimension) => (
                    <label key={dimension} className="grid gap-2">
                      <span className="text-xs font-medium capitalize text-gray-500">{dimension}</span>
                      <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                        <input
                          type="number"
                          placeholder="100"
                          min="0"
                          step="1"
                          value={form[dimension]}
                          onChange={(event) => updateForm(dimension, event.target.value)}
                          className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                          required
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
                        min="0"
                        step="0.01"
                        value={form.weight}
                        onChange={(event) => updateForm('weight', event.target.value)}
                        className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                        required
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
                        min="1"
                        step="1"
                        value={form.quantity}
                        onChange={(event) => updateForm('quantity', event.target.value)}
                        className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                        required
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

          <section className="grid gap-6 lg:grid-cols-2">
            <div>
              <div className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-700">
                <span className="text-blue-500">3.</span> SPACING SETTINGS{' '}
                <span className="text-gray-400">?</span>
              </div>
              <div className="space-y-4">
                {([
                  { key: 'tiltLength', label: 'Tilt to Length', type: 'length', axis: 'length' as const },
                  { key: 'tiltWidth', label: 'Tilt to Width', type: 'width', axis: 'width' as const },
                  { key: 'tiltHeight', label: 'Tilt to Height', type: 'height', axis: 'height' as const },
                ] as const).map((option) => {
                  const checked = spacing[option.key as keyof typeof spacing];
                  // Driven by the API: if the cargo type's `tilting` flag for this
                  // axis is false, the option is disabled in the UI.
                  const disabled = selectedSpec?.tilting
                    ? !selectedSpec.tilting[option.axis]
                    : option.axis === 'height';
                  return (
                    <label
                      key={option.key}
                      className={`flex items-start gap-3 rounded-lg p-4 ${disabled ? 'opacity-60' : 'bg-gray-50/50'}`}
                    >
                      <input
                        type="checkbox"
                        checked={checked && !disabled}
                        disabled={disabled}
                        onChange={() => !disabled && toggleSpacing(option.key as keyof typeof spacing)}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed"
                      />
                      <div className="flex flex-1 flex-col gap-3">
                        <span className="flex items-center gap-2 text-sm font-medium text-gray-600">
                          {option.label}
                          {disabled && (
                            <span
                              className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-gray-300 text-[10px] font-semibold text-gray-400"
                              title={`This option is not available for ${selectedCargoType}`}
                            >
                              ?
                            </span>
                          )}
                        </span>
                        <TiltIllustration type={option.type} active={checked && !disabled} />
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-700">
                <span className="text-blue-500">4.</span> STUFFING SETTINGS{' '}
                <span className="text-gray-400">?</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {([
                  { key: 'layerCount', label: 'Layers Count', unit: null, icon: 'layers', valueKey: 'layerCount', hasInput: true, hasIcon: true },
                  { key: 'mass', label: 'Mass', unit: 'kg', icon: 'mass', valueKey: 'mass', hasInput: true, hasIcon: true },
                  { key: 'height', label: 'Height', unit: 'mm', icon: 'height', valueKey: 'height', hasInput: true, hasIcon: true },
                  { key: 'disableStacking', label: 'Disable stacking', unit: null, icon: 'layers', valueKey: null, hasInput: false, hasIcon: false },
                ] as const).map((option) => {
                  const checked = advancedSpacing[option.key as keyof typeof advancedSpacing];
                  return (
                    <div key={option.key} className="flex items-center gap-3 rounded-lg bg-gray-50/50 p-3">
                      <div className="flex-shrink-0">
                        {option.hasIcon ? (
                          <StackedBoxIcon type={option.icon} active={checked} />
                        ) : (
                          <div className="h-20 w-20" />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col gap-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleAdvancedSpacing(option.key as keyof typeof advancedSpacing)}
                            className="h-4 w-4 flex-shrink-0 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                          />
                          <span>{option.label}</span>
                        </label>
                        {option.hasInput && (
                          <div className="flex w-full items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                            <input
                              type="number"
                              placeholder="0"
                              min="0"
                              step="1"
                              value={option.valueKey ? advancedValues[option.valueKey as keyof typeof advancedValues] : '0'}
                              onChange={(e) => option.valueKey && updateAdvancedValue(option.valueKey as keyof typeof advancedValues, e.target.value)}
                              disabled={!checked}
                              className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none disabled:text-gray-400"
                            />
                            {option.unit && <span className="text-xs font-semibold text-gray-500">{option.unit}</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

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
              onClick={() => {
                onAdd?.({
                  type: selectedCargoType,
                  ...form,
                  spacingSettings: {
                    tiltToLength: spacing.tiltLength,
                    tiltToWidth: spacing.tiltWidth,
                    tiltToHeight: spacing.tiltHeight,
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
              }}
              className="rounded-lg bg-blue-500 px-12 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              {isEdit ? 'Update' : 'Add'}
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
