import React, { useState } from "react";
import { X } from "lucide-react";

interface ContainerSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (containerType: string) => void;
}

interface ContainerOption {
  id: string;
  name: string;
  size: "20ft" | "40ft";
  dimensions: string;
  capacity: string;
  maxWeight: string;
}

const CONTAINER_OPTIONS: ContainerOption[] = [
  {
    id: "20-standard",
    name: "20' Standard",
    size: "20ft",
    dimensions: "5.9m × 2.35m × 2.39m",
    capacity: "33.2 m³",
    maxWeight: "28,200 kg",
  },
  {
    id: "40-standard",
    name: "40' Standard",
    size: "40ft",
    dimensions: "12.03m × 2.35m × 2.39m",
    capacity: "67.7 m³",
    maxWeight: "28,800 kg",
  },
];

const ContainerSelectionModal: React.FC<ContainerSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const [selectedContainerId, setSelectedContainerId] = useState<string>(
    CONTAINER_OPTIONS[0].id,
  );

  if (!isOpen) return null;

  const handleSelect = () => {
    onSelect(selectedContainerId);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Select Container Type
          </h2>
          <button
            type="button"
            className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {CONTAINER_OPTIONS.map((container) => {
              const isSelected = selectedContainerId === container.id;
              return (
                <button
                  key={container.id}
                  type="button"
                  onClick={() => setSelectedContainerId(container.id)}
                  className={`group relative flex flex-col rounded-2xl border-2 p-5 text-left transition-all ${
                    isSelected
                      ? "border-blue-500 bg-blue-50/40 shadow-lg shadow-blue-100"
                      : "border-gray-200 hover:border-blue-400 hover:shadow-md"
                  }`}
                >
                  {/* Selection indicator */}
                  <div
                    className={`absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full border-2 transition ${
                      isSelected
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {isSelected && (
                      <svg
                        className="h-3.5 w-3.5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>

                  <p className="text-base font-bold text-gray-800">
                    {container.name}
                  </p>

                  {/* 3D Container Illustration */}
                  <div className="mt-4 flex h-44 items-center justify-center rounded-xl bg-gradient-to-b from-slate-50 to-slate-100 p-3">
                    <Container3D size={container.size} />
                  </div>

                  {/* Specs */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Dimensions</span>
                      <span className="font-medium text-gray-700">
                        {container.dimensions}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Capacity</span>
                      <span className="font-medium text-gray-700">
                        {container.capacity}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Max Weight</span>
                      <span className="font-medium text-gray-700">
                        {container.maxWeight}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4">
          <div className="text-sm text-gray-500">
            <span className="font-medium">Selected: </span>
            <span className="font-semibold text-gray-700">
              {CONTAINER_OPTIONS.find((c) => c.id === selectedContainerId)
                ?.name ?? "—"}
            </span>
          </div>
          <button
            type="button"
            className="rounded-lg bg-blue-500 px-8 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600"
            onClick={handleSelect}
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContainerSelectionModal;

// Container spec data for LoadCalculator integration
export interface ContainerSpecOption {
  id: string;
  name: string;
  size: "20ft" | "40ft";
  dimensions: string;
  capacity: string;
  maxWeight: string;
}

// eslint-disable-next-line react-refresh/only-export-components
export const CONTAINER_SPEC_OPTIONS: ContainerSpecOption[] = [
  {
    id: "20-standard",
    name: "20' Standard",
    size: "20ft",
    dimensions: "5.9m × 2.35m × 2.39m",
    capacity: "33.2 m³",
    maxWeight: "28,200 kg",
  },
  {
    id: "40-standard",
    name: "40' Standard",
    size: "40ft",
    dimensions: "12.03m × 2.35m × 2.39m",
    capacity: "67.7 m³",
    maxWeight: "28,800 kg",
  },
  {
    id: "40-high-cube",
    name: "40' High Cube",
    size: "40ft",
    dimensions: "12.03m × 2.35m × 2.69m",
    capacity: "76.3 m³",
    maxWeight: "28,560 kg",
  },
  {
    id: "45-high-cube",
    name: "45' High Cube",
    size: "40ft",
    dimensions: "13.56m × 2.35m × 2.69m",
    capacity: "86.0 m³",
    maxWeight: "27,600 kg",
  },
  {
    id: "20-open-top",
    name: "20' Open Top",
    size: "20ft",
    dimensions: "5.9m × 2.35m × 2.35m",
    capacity: "32.6 m³",
    maxWeight: "28,130 kg",
  },
  {
    id: "40-open-top",
    name: "40' Open Top",
    size: "40ft",
    dimensions: "12.03m × 2.35m × 2.35m",
    capacity: "66.5 m³",
    maxWeight: "28,600 kg",
  },
  {
    id: "20-flatrack",
    name: "20' Flatrack",
    size: "20ft",
    dimensions: "5.62m × 2.23m × 2.14m",
    capacity: "26.8 m³",
    maxWeight: "27,400 kg",
  },
  {
    id: "40-flatrack",
    name: "40' Flatrack",
    size: "40ft",
    dimensions: "12.08m × 2.40m × 2.10m",
    capacity: "60.9 m³",
    maxWeight: "39,200 kg",
  },
  {
    id: "20-flatrack-collapsible",
    name: "20' Flatrack Collapsible",
    size: "20ft",
    dimensions: "5.62m × 2.23m × 2.14m",
    capacity: "26.8 m³",
    maxWeight: "27,400 kg",
  },
  {
    id: "45-flatrack-collapsible",
    name: "45' Flatrack Collapsible",
    size: "40ft",
    dimensions: "13.56m × 2.40m × 2.10m",
    capacity: "68.4 m³",
    maxWeight: "39,000 kg",
  },
  {
    id: "20-platform",
    name: "20' Platform",
    size: "20ft",
    dimensions: "6.06m × 2.44m × 0.23m",
    capacity: "3.4 m³",
    maxWeight: "28,200 kg",
  },
  {
    id: "40-platform",
    name: "40' Platform",
    size: "40ft",
    dimensions: "12.19m × 2.44m × 0.23m",
    capacity: "6.8 m³",
    maxWeight: "39,200 kg",
  },
  {
    id: "20-refrigerated",
    name: "20' Refrigerated",
    size: "20ft",
    dimensions: "5.44m × 2.29m × 2.27m",
    capacity: "28.3 m³",
    maxWeight: "27,400 kg",
  },
  {
    id: "40-refrigerated",
    name: "40' Refrigerated",
    size: "40ft",
    dimensions: "11.56m × 2.29m × 2.55m",
    capacity: "67.5 m³",
    maxWeight: "27,700 kg",
  },
  {
    id: "20-bulk",
    name: "20' Bulk",
    size: "20ft",
    dimensions: "5.9m × 2.35m × 2.39m",
    capacity: "33.2 m³",
    maxWeight: "28,200 kg",
  },
  {
    id: "20-tank",
    name: "20' Tank",
    size: "20ft",
    dimensions: "6.06m × 2.44m × 2.59m",
    capacity: "24.0 m³",
    maxWeight: "30,480 kg",
  },
  {
    id: "custom-container",
    name: "Custom Container",
    size: "20ft",
    dimensions: "Custom",
    capacity: "Custom",
    maxWeight: "Custom",
  },
];

export { CONTAINER_OPTIONS };

/* ─── 3D Container Illustration (optimized) ─── */

// Pre-compute static values outside the component
const DEPTH = 50;
const HEIGHT = 100;
const MARGIN = 20;
const D_SCALE = 0.5;
const DX_PER_D = D_SCALE * Math.cos(Math.PI / 4);
const DY_PER_D = D_SCALE * Math.sin(Math.PI / 4);
const DX = DEPTH * DX_PER_D;
const DY = DEPTH * DY_PER_D;

type Pt = { x: number; y: number };
const p = (pt: Pt) => `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
const lerp = (a: Pt, b: Pt, t: number): Pt => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
});

// Build a single <path> "d" string from many line segments
const buildLines = (count: number, from1: Pt, to1: Pt, from2: Pt, to2: Pt) => {
  let d = "";
  for (let i = 0; i < count; i++) {
    const t = (i + 1) / (count + 1);
    const a = lerp(from1, to1, t);
    const b = lerp(from2, to2, t);
    d += `M${a.x.toFixed(1)},${a.y.toFixed(1)}L${b.x.toFixed(1)},${b.y.toFixed(1)}`;
  }
  return d;
};

// Pre-compute SVG data for both sizes to avoid recalculation on every render
const buildContainerSvg = (W: number, fcCount: number) => {
  const ox = MARGIN;
  const oy = MARGIN + HEIGHT + 10;

  const fbl: Pt = { x: ox, y: oy };
  const fbr: Pt = { x: ox + W, y: oy };
  const ftl: Pt = { x: ox, y: oy - HEIGHT };
  const ftr: Pt = { x: ox + W, y: oy - HEIGHT };
  const bbr: Pt = { x: fbr.x + DX, y: fbr.y - DY };
  const btl: Pt = { x: ftl.x + DX, y: ftl.y - DY };
  const btr: Pt = { x: ftr.x + DX, y: ftr.y - DY };

  const front = `M${p(fbl)} L${p(fbr)} L${p(ftr)} L${p(ftl)}Z`;
  const top = `M${p(ftl)} L${p(ftr)} L${p(btr)} L${p(btl)}Z`;
  const right = `M${p(fbr)} L${p(bbr)} L${p(btr)} L${p(ftr)}Z`;

  const frontCorr = buildLines(fcCount, fbl, fbr, ftl, ftr);
  const rightCorr = buildLines(5, fbr, bbr, ftr, btr);
  const topCorr = buildLines(3, ftl, btl, ftr, btr);

  // Frame rails
  const fhrTop = lerp(ftl, fbl, 0.03);
  const fhrTopR = lerp(ftr, fbr, 0.03);
  const fhrBot = lerp(ftl, fbl, 0.97);
  const fhrBotR = lerp(ftr, fbr, 0.97);
  const rhrTop = lerp(ftr, fbr, 0.03);
  const rhrTopR = lerp(btr, bbr, 0.03);
  const rhrBot = lerp(ftr, fbr, 0.97);
  const rhrBotR = lerp(btr, bbr, 0.97);
  const doorMidBot = lerp(fbr, bbr, 0.5);
  const doorMidTop = lerp(ftr, btr, 0.5);

  const vbW = Math.round(W + DX + MARGIN * 2 + 10);
  const vbH = Math.round(HEIGHT + DY + MARGIN * 2 + 10);

  return {
    viewBox: `0 0 ${vbW} ${vbH}`,
    front,
    top,
    right,
    frontCorr,
    rightCorr,
    topCorr,
    fbl,
    fbr,
    ftl,
    ftr,
    bbr,
    btr,
    fhrTop,
    fhrTopR,
    fhrBot,
    fhrBotR,
    rhrTop,
    rhrTopR,
    rhrBot,
    rhrBotR,
    doorMidBot,
    doorMidTop,
  };
};

const SVG_20FT = buildContainerSvg(150, 16);
const SVG_40FT = buildContainerSvg(240, 28);

export const Container3D: React.FC<{ size: "20ft" | "40ft" }> = React.memo(
  ({ size }) => {
    const s = size === "40ft" ? SVG_40FT : SVG_20FT;

    return (
      <svg viewBox={s.viewBox} className="h-full w-full">
        {/* Front face */}
        <path
          d={s.front}
          fill="#eceff3"
          stroke="#8b909a"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d={s.frontCorr} fill="none" stroke="#bcc3ce" strokeWidth="1.2" />
        {/* Front frame rails */}
        <line
          x1={s.fhrTop.x}
          y1={s.fhrTop.y}
          x2={s.fhrTopR.x}
          y2={s.fhrTopR.y}
          stroke="#6b7280"
          strokeWidth="1.6"
        />
        <line
          x1={s.fhrBot.x}
          y1={s.fhrBot.y}
          x2={s.fhrBotR.x}
          y2={s.fhrBotR.y}
          stroke="#6b7280"
          strokeWidth="1.6"
        />
        {/* Front corner posts */}
        <line
          x1={s.fbl.x}
          y1={s.fbl.y}
          x2={s.ftl.x}
          y2={s.ftl.y}
          stroke="#6b7280"
          strokeWidth="2.8"
        />
        <line
          x1={s.fbr.x}
          y1={s.fbr.y}
          x2={s.ftr.x}
          y2={s.ftr.y}
          stroke="#6b7280"
          strokeWidth="2.8"
        />
        {/* Top face */}
        <path
          d={s.top}
          fill="#f5f6f8"
          stroke="#8b909a"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d={s.topCorr}
          fill="none"
          stroke="#bcc3ce"
          strokeWidth="0.7"
          opacity="0.6"
        />
        {/* Right face */}
        <path
          d={s.right}
          fill="#dde0e6"
          stroke="#8b909a"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d={s.rightCorr} fill="none" stroke="#bcc3ce" strokeWidth="1" />
        {/* Right frame rails */}
        <line
          x1={s.rhrTop.x}
          y1={s.rhrTop.y}
          x2={s.rhrTopR.x}
          y2={s.rhrTopR.y}
          stroke="#6b7280"
          strokeWidth="1.2"
        />
        <line
          x1={s.rhrBot.x}
          y1={s.rhrBot.y}
          x2={s.rhrBotR.x}
          y2={s.rhrBotR.y}
          stroke="#6b7280"
          strokeWidth="1.2"
        />
        {/* Right corner posts */}
        <line
          x1={s.fbr.x}
          y1={s.fbr.y}
          x2={s.ftr.x}
          y2={s.ftr.y}
          stroke="#6b7280"
          strokeWidth="2.8"
        />
        <line
          x1={s.bbr.x}
          y1={s.bbr.y}
          x2={s.btr.x}
          y2={s.btr.y}
          stroke="#6b7280"
          strokeWidth="2.2"
        />
        {/* Door center split */}
        <line
          x1={s.doorMidBot.x}
          y1={s.doorMidBot.y}
          x2={s.doorMidTop.x}
          y2={s.doorMidTop.y}
          stroke="#6b7280"
          strokeWidth="1.3"
        />
      </svg>
    );
  },
);

Container3D.displayName = "Container3D";
