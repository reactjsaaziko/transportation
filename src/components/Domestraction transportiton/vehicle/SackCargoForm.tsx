import { useState } from 'react';
import type { CargoFormSubmission } from './CargoDesignModal';

interface SackCargoFormProps {
  onClose: () => void;
  onAdd?: (data: CargoFormSubmission) => void;
  initialData?: CargoFormSubmission;
}

// Color palette for all pillow illustrations
const usePillowColors = (active: boolean) => ({
  stroke: active ? '#7BA5F3' : '#9CA3AF',
  top: active ? '#DBEAFE' : '#F3F4F6',
  right: active ? '#A7C7FB' : '#E5E7EB',
  left: active ? '#93C5FD' : '#D1D5DB',
  cubeStroke: '#9CA3AF',
});

/* ════════════════════════════════════════════════════════════════
   Each Pillow*** below draws a complete isometric scene:
     1. dashed bounding cube
     2. left depth-band (darker)
     3. right depth-band (medium)
     4. top puffy face (lightest, on top)
   The three faces use distinct fills so the 3D shape reads clearly
   even at 84×84 px. Layout/proportion mirrors the SeaRates reference.
   ════════════════════════════════════════════════════════════════ */

// ─── Pillow Geometry — Soft Cushion Silhouette ────────────────────────
// To produce the SeaRates "soft pillow" look, the top-face path uses cubic
// bezier control points that pull TOWARD the cube's center. This makes each
// edge between two corners curve INWARD (concave), which in turn makes the
// 4 corners stick out as bulgy puffs — the classic cushion silhouette.
//
// Compare:
//   Control points NEAR the corners → near-straight edges → DIAMOND/BOX look
//   Control points TOWARD the center → concave edges → PUFFY PILLOW look ✓

// PillowFlat — soft cushion drawn as ONE silhouette path with light fill,
// plus internal "fold" lines showing the 3D depth (top face's bottom edges).
// Subtle concavity — corners visibly bulge but the shape doesn't pinch.
const PillowFlat = ({ size = 84, active = true }: { size?: number; active?: boolean }) => {
  const c = usePillowColors(active);
  // Cube top corners:    top(110,30) right(186,62) front(110,94) left(34,62)
  // Cube bottom corners: top(110,80) right(186,112) front(110,144) left(34,112)
  return (
    <svg viewBox="0 0 220 180" style={{ width: size, height: size }}>
      {/* Faint dashed bounding cube (light, doesn't dominate) */}
      <g opacity="0.4">
        <path d="M110 30 L186 62 L110 94 L34 62 Z" fill="none" stroke={c.cubeStroke} strokeWidth="1" strokeDasharray="3 3" />
        <path d="M110 80 L186 112 L110 144 L34 112 Z" fill="none" stroke={c.cubeStroke} strokeWidth="1" strokeDasharray="3 3" />
        <line x1="110" y1="30" x2="110" y2="80"  stroke={c.cubeStroke} strokeWidth="1" strokeDasharray="3 3" />
        <line x1="186" y1="62" x2="186" y2="112" stroke={c.cubeStroke} strokeWidth="1" strokeDasharray="3 3" />
        <line x1="110" y1="94" x2="110" y2="144" stroke={c.cubeStroke} strokeWidth="1" strokeDasharray="3 3" />
        <line x1="34"  y1="62" x2="34"  y2="112" stroke={c.cubeStroke} strokeWidth="1" strokeDasharray="3 3" />
      </g>

      {/* DEPTH SHADING — front-left & front-right bands (semi-transparent
          darker fills below the top face for 3D depth). No strokes, blends. */}
      <path d="M 110 94 C 97 86 70 75 34 62 C 30 76 30 99 34 112 C 70 118 97 129 110 144 Z"
        fill={c.left} opacity="0.85" />
      <path d="M 110 94 C 123 86 150 75 186 62 C 190 76 190 99 186 112 C 150 118 123 129 110 144 Z"
        fill={c.right} opacity="0.85" />

      {/* TOP face — light fill. Subtle concave edges (15% pull, not dramatic).
          Control points sit 25/75% along each straight edge then nudge 15%
          toward center — gives a clearly soft cushion, not a pinched UFO. */}
      <path d="
        M 110 30
        C 126 42, 158 55, 186 62
        C 158 69, 126 82, 110 94
        C 94 82, 62 69, 34 62
        C 62 55, 94 42, 110 30
        Z
      " fill={c.top} stroke={c.stroke} strokeWidth="1.4" strokeLinejoin="round" />

      {/* OUTER silhouette — the puffy bottom half of the pillow. Sides bulge
          outward subtly. Drawn after fills so its stroke is on top. */}
      <path d="
        M 186 62
        C 188 76 188 99 186 112
        C 150 118 123 129 110 144
        C 97 129 70 118 34 112
        C 32 99 32 76 34 62
      " fill="none" stroke={c.stroke} strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />

      {/* Top horizontal seam */}
      <path d="M 44 62 Q 110 73 176 62" fill="none" stroke={c.stroke} strokeWidth="0.9" strokeDasharray="3 3" opacity="0.6" />
    </svg>
  );
};

// Pillow tilted onto its long axis. Cube length kept same, width and height
// swapped (cube is now narrower / taller).
const PillowTiltedLength = ({ size = 84, active = true }: { size?: number; active?: boolean }) => {
  const c = usePillowColors(active);
  // Cube top: top(110,22) right(158,42) front(110,62) left(62,42). Depth 80.
  return (
    <svg viewBox="0 0 220 180" style={{ width: size, height: size }}>
      <g opacity="0.4">
        <path d="M110 22 L158 42 L110 62 L62 42 Z" fill="none" stroke={c.cubeStroke} strokeWidth="1" strokeDasharray="3 3" />
        <path d="M110 102 L158 122 L110 142 L62 122 Z" fill="none" stroke={c.cubeStroke} strokeWidth="1" strokeDasharray="3 3" />
        <line x1="110" y1="22" x2="110" y2="102" stroke={c.cubeStroke} strokeWidth="1" strokeDasharray="3 3" />
        <line x1="158" y1="42" x2="158" y2="122" stroke={c.cubeStroke} strokeWidth="1" strokeDasharray="3 3" />
        <line x1="110" y1="62" x2="110" y2="142" stroke={c.cubeStroke} strokeWidth="1" strokeDasharray="3 3" />
        <line x1="62"  y1="42" x2="62"  y2="122" stroke={c.cubeStroke} strokeWidth="1" strokeDasharray="3 3" />
      </g>
      <path d="M 110 62 C 102 56 84 50 62 42 C 58 65 58 99 62 122 C 84 127 102 133 110 142 Z"
        fill={c.left} opacity="0.85" />
      <path d="M 110 62 C 118 56 136 50 158 42 C 162 65 162 99 158 122 C 136 127 118 133 110 142 Z"
        fill={c.right} opacity="0.85" />
      <path d="
        M 110 22
        C 120 28, 142 36, 158 42
        C 142 48, 120 56, 110 62
        C 100 56, 78 48, 62 42
        C 78 36, 100 28, 110 22
        Z
      " fill={c.top} stroke={c.stroke} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="
        M 158 42
        C 160 65 160 99 158 122
        C 136 127 118 133 110 142
        C 102 133 84 127 62 122
        C 60 99 60 65 62 42
      " fill="none" stroke={c.stroke} strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M 70 42 Q 110 50 150 42" fill="none" stroke={c.stroke} strokeWidth="0.9" strokeDasharray="3 3" opacity="0.6" />
    </svg>
  );
};

// Pillow rotated 90° to stand on its short edge — tall and narrow.
const PillowTiltedWidth = ({ size = 84, active = true }: { size?: number; active?: boolean }) => {
  const c = usePillowColors(active);
  return (
    <svg viewBox="0 0 220 180" style={{ width: size, height: size }}>
      <g opacity="0.4">
        <path d="M110 16 L140 28 L110 40 L80 28 Z" fill="none" stroke={c.cubeStroke} strokeWidth="1" strokeDasharray="3 3" />
        <path d="M110 146 L140 158 L110 170 L80 158 Z" fill="none" stroke={c.cubeStroke} strokeWidth="1" strokeDasharray="3 3" />
        <line x1="110" y1="16" x2="110" y2="146" stroke={c.cubeStroke} strokeWidth="1" strokeDasharray="3 3" />
        <line x1="140" y1="28" x2="140" y2="158" stroke={c.cubeStroke} strokeWidth="1" strokeDasharray="3 3" />
        <line x1="110" y1="40" x2="110" y2="170" stroke={c.cubeStroke} strokeWidth="1" strokeDasharray="3 3" />
        <line x1="80"  y1="28" x2="80"  y2="158" stroke={c.cubeStroke} strokeWidth="1" strokeDasharray="3 3" />
      </g>
      <path d="M 110 40 C 105 36 92 32 80 28 C 76 60 76 130 80 158 C 92 161 105 165 110 170 Z"
        fill={c.left} opacity="0.85" />
      <path d="M 110 40 C 115 36 128 32 140 28 C 144 60 144 130 140 158 C 128 161 115 165 110 170 Z"
        fill={c.right} opacity="0.85" />
      <path d="
        M 110 16
        C 116 19, 130 25, 140 28
        C 130 31, 116 37, 110 40
        C 104 37, 90 31, 80 28
        C 90 25, 104 19, 110 16
        Z
      " fill={c.top} stroke={c.stroke} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="
        M 140 28
        C 142 60 142 130 140 158
        C 128 161 115 165 110 170
        C 105 165 92 161 80 158
        C 78 130 78 60 80 28
      " fill="none" stroke={c.stroke} strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M 86 28 Q 110 32 134 28" fill="none" stroke={c.stroke} strokeWidth="0.9" strokeDasharray="3 3" opacity="0.6" />
    </svg>
  );
};

// Section 4 — 4 flat pillows stacked vertically, with optional Kg badge or height ruler
const StackedPillowsIcon = ({ variant = 'plain' }: { variant?: 'plain' | 'mass' | 'height' }) => {
  const stroke = '#7BA5F3';
  const top = '#DBEAFE';
  const right = '#A7C7FB';
  const left = '#93C5FD';
  const labelColor = '#3B82F6';

  // Single small puffy pillow centered at (cx, cy_top).
  // Diamond corners (top, right, bottom, left) → cubic bezier control points
  // pulled toward center → concave edges → bulgy corners (cushion silhouette).
  const Pillow = ({ cx, cy }: { cx: number; cy: number }) => (
    <g>
      {/* Front depth band — top edge follows the pillow's front-left and
          front-right edges (concave inward), bottom edge is offset by 6px. */}
      <path
        d={`M ${cx - 26} ${cy + 8}
            C ${cx - 18} ${cy + 11} ${cx - 9} ${cy + 13} ${cx} ${cy + 16}
            C ${cx + 9} ${cy + 13} ${cx + 18} ${cy + 11} ${cx + 26} ${cy + 8}
            L ${cx + 26} ${cy + 14}
            C ${cx + 18} ${cy + 17} ${cx + 9} ${cy + 19} ${cx} ${cy + 22}
            C ${cx - 9} ${cy + 19} ${cx - 18} ${cy + 17} ${cx - 26} ${cy + 14}
            Z`}
        fill={left}
        stroke={stroke}
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
      {/* Top puffy face — concave edges, bulgy corners. Control points pull
          toward the pillow's center (cx, cy+8). */}
      <path
        d={`M ${cx} ${cy}
            C ${cx + 9} ${cy + 3} ${cx + 18} ${cy + 5} ${cx + 26} ${cy + 8}
            C ${cx + 18} ${cy + 11} ${cx + 9} ${cy + 13} ${cx} ${cy + 16}
            C ${cx - 9} ${cy + 13} ${cx - 18} ${cy + 11} ${cx - 26} ${cy + 8}
            C ${cx - 18} ${cy + 5} ${cx - 9} ${cy + 3} ${cx} ${cy}
            Z`}
        fill={top}
        stroke={stroke}
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
      {/* Right side accent — slightly darker right wedge for depth */}
      <path
        d={`M ${cx + 18} ${cy + 11}
            C ${cx + 22} ${cy + 13} ${cx + 25} ${cy + 14} ${cx + 26} ${cy + 14}
            L ${cx + 26} ${cy + 8}
            C ${cx + 22} ${cy + 9} ${cx + 18} ${cy + 11} ${cx + 18} ${cy + 11}
            Z`}
        fill={right}
        stroke={stroke}
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
    </g>
  );

  return (
    <svg viewBox="0 0 100 100" className="h-20 w-20 flex-shrink-0">
      {/* 4 puffy pillows stacked vertically (back-to-front order) */}
      <Pillow cx={50} cy={56} />
      <Pillow cx={50} cy={42} />
      <Pillow cx={50} cy={28} />
      <Pillow cx={50} cy={14} />

      {/* Mass: Kg bag badge attached at top */}
      {variant === 'mass' && (
        <g>
          <rect x="38" y="0" width="24" height="20" rx="2" fill="white" stroke={stroke} strokeWidth="1.2" />
          <path d="M42 0 C42 -6, 58 -6, 58 0" fill="none" stroke={stroke} strokeWidth="1" strokeLinecap="round" />
          <text x="50" y="14" fill={labelColor} fontSize="9" fontWeight="700" textAnchor="middle">Kg</text>
        </g>
      )}

      {/* Height: vertical ruler with arrowheads + tick marks */}
      {variant === 'height' && (
        <g>
          <line x1="6" y1="14" x2="6" y2="82" stroke={stroke} strokeWidth="1" />
          <path d="M3 17 L6 14 L9 17" fill="none" stroke={stroke} strokeWidth="1" strokeLinecap="round" />
          <path d="M3 79 L6 82 L9 79" fill="none" stroke={stroke} strokeWidth="1" strokeLinecap="round" />
          <line x1="4" y1="30" x2="8" y2="30" stroke={stroke} strokeWidth="1" />
          <line x1="4" y1="46" x2="8" y2="46" stroke={stroke} strokeWidth="1" />
          <line x1="4" y1="64" x2="8" y2="64" stroke={stroke} strokeWidth="1" />
        </g>
      )}
    </svg>
  );
};

const SackCargoForm = ({ onClose, onAdd, initialData }: SackCargoFormProps) => {
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
      type: 'sacks',
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
          {/* Flat pillow with dashed bounding cube + dimension labels.
              Geometry (viewBox 280×240):
                Cube top rhombus:    top(140,50) right(220,90) front(140,130) left(60,90)
                Cube bottom rhombus: top(140,110) right(220,150) front(140,190) left(60,150)
                Cube depth: 60 px
              The pillow's top face matches the cube's top rhombus (so its 4
              corners sit at the cube's top corners, giving a clear diamond
              silhouette). Cubic bezier control points sit very close to each
              corner, so segments stay near-straight (= visible diamond, not
              a smoothed-out oval). */}
          <div className="flex items-center justify-center">
            <svg viewBox="0 0 280 240" className="h-48 w-48">
              {/* Dashed bounding cube */}
              <g opacity="0.65">
                <path d="M140 50 L220 90 L140 130 L60 90 Z" fill="none" stroke="#9CA3AF" strokeWidth="1.2" strokeDasharray="4 3" />
                <path d="M140 110 L220 150 L140 190 L60 150 Z" fill="none" stroke="#9CA3AF" strokeWidth="1.2" strokeDasharray="4 3" />
                <line x1="140" y1="50"  x2="140" y2="110" stroke="#9CA3AF" strokeWidth="1.2" strokeDasharray="4 3" />
                <line x1="220" y1="90"  x2="220" y2="150" stroke="#9CA3AF" strokeWidth="1.2" strokeDasharray="4 3" />
                <line x1="140" y1="130" x2="140" y2="190" stroke="#9CA3AF" strokeWidth="1.2" strokeDasharray="4 3" />
                <line x1="60"  y1="90"  x2="60"  y2="150" stroke="#9CA3AF" strokeWidth="1.2" strokeDasharray="4 3" />
              </g>

              {/* Depth shading — front-left and front-right bands.
                  Semi-transparent fills give 3D depth without being separate
                  panels with visible joins. */}
              <path
                d="M 140 130 C 126 117 98 105 60 90 C 54 108 54 132 60 150 C 98 157 126 171 140 190 Z"
                fill="#93C5FD"
                opacity="0.85"
              />
              <path
                d="M 140 130 C 154 117 182 105 220 90 C 226 108 226 132 220 150 C 182 157 154 171 140 190 Z"
                fill="#A7C7FB"
                opacity="0.85"
              />

              {/* TOP face — soft cushion. Subtle concavity (15% pull toward
                  center), so corners visibly bulge but the shape doesn't
                  pinch into a UFO. */}
              <path
                d="
                  M 140 50
                  C 158 60, 196 80, 220 90
                  C 196 100, 158 120, 140 130
                  C 122 120, 84 100, 60 90
                  C 84 80, 122 60, 140 50
                  Z
                "
                fill="#DBEAFE"
                stroke="#7BA5F3"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />

              {/* Outer silhouette stroke — pillow's outer boundary, with
                  subtle outward bulges on the sides. */}
              <path
                d="
                  M 220 90
                  C 224 108 224 132 220 150
                  C 182 157 154 171 140 190
                  C 126 171 98 157 60 150
                  C 56 132 56 108 60 90
                "
                fill="none"
                stroke="#7BA5F3"
                strokeWidth="1.6"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {/* Top center seam — runs across the top face horizontally */}
              <path d="M 70 90 Q 140 110 210 90" fill="none" stroke="#7BA5F3" strokeWidth="1" strokeDasharray="4 3" opacity="0.55" />

              {/* Dimension labels with extension lines (positions tied to the
                  cube above: top-rhombus y=50–130, bottom-rhombus y=110–190) */}
              {/* Height — vertical, left side of cube */}
              <line x1="38" y1="90" x2="38" y2="150" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="38" y1="90"  x2="60" y2="90"  stroke="#9CA3AF" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
              <line x1="38" y1="150" x2="60" y2="150" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
              <text x="20" y="124" fill="#6B7280" fontSize="11" fontWeight="500">Height</text>

              {/* Width — bottom-left diagonal */}
              <line x1="48" y1="170" x2="135" y2="212" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="48" y1="170" x2="60" y2="150"  stroke="#9CA3AF" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
              <line x1="135" y1="212" x2="140" y2="190" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
              <text x="76" y="224" fill="#6B7280" fontSize="11" fontWeight="500">Width</text>

              {/* Length — bottom-right diagonal */}
              <line x1="232" y1="170" x2="145" y2="212" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="232" y1="170" x2="220" y2="150" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
              <text x="176" y="224" fill="#6B7280" fontSize="11" fontWeight="500">Length</text>
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
        {/* Section 3 — Spacing Settings */}
        <div className="rounded-2xl bg-gray-50/70 p-5">
          <div className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-700">
            <span className="text-blue-500">3.</span> SPACING SETTINGS{' '}
            <span className="text-gray-400">?</span>
          </div>
          <div className="space-y-4">
            {([
              { key: 'tiltLength', label: 'Tilt to Length', After: PillowTiltedLength },
              { key: 'tiltWidth', label: 'Tilt to Width', After: PillowTiltedWidth },
            ] as const).map((option) => {
              const checked = spacing[option.key as keyof typeof spacing];
              const After = option.After;
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
                    {/* Before — flat pillow with bounding cube */}
                    <PillowFlat size={84} active={checked} />
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
                    {/* After — pillow rotated for the chosen tilt axis */}
                    <After size={84} active={checked} />
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
              <StackedPillowsIcon variant="plain" />
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
              <StackedPillowsIcon variant="mass" />
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
              <StackedPillowsIcon variant="height" />
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

export default SackCargoForm;
