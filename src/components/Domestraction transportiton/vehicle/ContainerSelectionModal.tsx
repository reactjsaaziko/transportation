import React, { useEffect, useMemo, useState } from 'react';
import { LayoutGrid, Truck, X } from 'lucide-react';

interface ContainerSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (containerType: string) => void;
}

type TabType = 'container' | 'truck';

type ContainerVariant =
  | 'standard'
  | 'high-cube'
  | 'open-top'
  | 'flatrack'
  | 'flatrack-collapsible'
  | 'platform'
  | 'refrigerated'
  | 'bulk'
  | 'tank'
  | 'custom';

type ContainerSize = 'short' | 'long' | 'xlong';

interface ContainerOption {
  id: string;
  name: string;
  variant: ContainerVariant;
  size: ContainerSize;
  comingSoon?: boolean;
}

type TruckVariant = 'tautliner' | 'refrigerated' | 'isotherm' | 'mega-trailer' | 'jumbo' | 'custom';

interface TruckOption {
  id: string;
  name: string;
  variant: TruckVariant;
  comingSoon?: boolean;
}

const CONTAINER_OPTIONS: ContainerOption[] = [
  { id: '20-standard', name: "20' STANDARD", variant: 'standard', size: 'short' },
  { id: '40-standard', name: "40' STANDARD", variant: 'standard', size: 'long' },
  { id: '40-high-cube', name: "40' HIGH CUBE", variant: 'high-cube', size: 'long' },
  { id: '45-high-cube', name: "45' HIGH CUBE", variant: 'high-cube', size: 'xlong' },
  { id: '20-open-top', name: "20' OPEN TOP", variant: 'open-top', size: 'short' },
  { id: '40-open-top', name: "40' OPEN TOP", variant: 'open-top', size: 'long' },
  { id: '20-flatrack', name: "20' FLATRACK", variant: 'flatrack', size: 'short' },
  { id: '40-flatrack', name: "40' FLATRACK", variant: 'flatrack', size: 'long' },
  {
    id: '20-flatrack-collapsible',
    name: "20' FLATRACK COLLAPSIBLE",
    variant: 'flatrack-collapsible',
    size: 'short',
  },
  {
    id: '45-flatrack-collapsible',
    name: "45' FLATRACK COLLAPSIBLE",
    variant: 'flatrack-collapsible',
    size: 'xlong',
  },
  { id: '20-platform', name: "20' PLATFORM", variant: 'platform', size: 'short' },
  { id: '40-platform', name: "40' PLATFORM", variant: 'platform', size: 'long' },
  { id: '20-refrigerated', name: "20' REFRIGERATED", variant: 'refrigerated', size: 'short' },
  { id: '40-refrigerated', name: "40' REFRIGERATED", variant: 'refrigerated', size: 'long' },
  { id: '20-bulk', name: "20' BULK", variant: 'bulk', size: 'short', comingSoon: true },
  { id: '20-tank', name: "20' TANK", variant: 'tank', size: 'short' },
  { id: 'custom-container', name: 'CUSTOM CONTAINER', variant: 'custom', size: 'long', comingSoon: true },
];

const TRUCK_OPTIONS: TruckOption[] = [
  { id: 'tautliner-curtainsider', name: 'Tautliner (Curtainsider)', variant: 'tautliner' },
  { id: 'refrigerated-truck', name: 'Refrigerated Truck', variant: 'refrigerated' },
  { id: 'isotherm-truck', name: 'Isotherm Truck', variant: 'isotherm' },
  { id: 'mega-trailer', name: 'Mega-trailer', variant: 'mega-trailer' },
  { id: 'jumbo', name: 'Jumbo', variant: 'jumbo' },
  { id: 'custom-truck', name: 'Custom truck', variant: 'custom' },
];

const ContainerSelectionModal: React.FC<ContainerSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('container');
  const [comingSoon, setComingSoon] = useState(true);
  const [selectedContainerId, setSelectedContainerId] = useState<string | null>(
    CONTAINER_OPTIONS[0]?.id ?? null,
  );
  const [selectedTruckId, setSelectedTruckId] = useState<string | null>(TRUCK_OPTIONS[0]?.id ?? null);

  const availableContainers = useMemo(
    () => CONTAINER_OPTIONS.filter((option) => comingSoon || !option.comingSoon),
    [comingSoon],
  );

  const availableTrucks = useMemo(
    () => TRUCK_OPTIONS.filter((option) => comingSoon || !option.comingSoon),
    [comingSoon],
  );

  useEffect(() => {
    if (!availableContainers.length) {
      setSelectedContainerId(null);
      return;
    }

    if (!selectedContainerId || !availableContainers.some((option) => option.id === selectedContainerId)) {
      setSelectedContainerId(availableContainers[0].id);
    }
  }, [availableContainers, selectedContainerId]);

  useEffect(() => {
    if (!availableTrucks.length) {
      setSelectedTruckId(null);
      return;
    }

    if (!selectedTruckId || !availableTrucks.some((option) => option.id === selectedTruckId)) {
      setSelectedTruckId(availableTrucks[0].id);
    }
  }, [availableTrucks, selectedTruckId]);

  if (!isOpen) return null;

  const handleNext = () => {
    const nextId = activeTab === 'container' ? selectedContainerId : selectedTruckId;
    if (!nextId) return;

    onSelect(nextId);
    onClose();
  };

  const isNextDisabled = activeTab === 'container' ? !selectedContainerId : !selectedTruckId;

  const tabs: Array<{
    key: TabType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { key: 'container', label: 'Container', icon: LayoutGrid },
    { key: 'truck', label: 'Truck', icon: Truck },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">Container & Truck Type</h2>
          <button
            type="button"
            className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-gray-200 px-6">
          {tabs.map(({ key, label, icon: Icon }) => {
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={`relative flex items-center gap-2 border-b-2 px-2 pb-3 pt-4 text-sm font-semibold transition-colors ${
                  isActive ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
                {label}
              </button>
            );
          })}

          {/* Coming Soon Checkbox */}
          <label className="ml-auto flex cursor-pointer items-center gap-3 text-sm font-medium text-gray-600">
            <input
              type="checkbox"
              id="coming-soon"
              checked={comingSoon}
              onChange={(e) => setComingSoon(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-500"
            />
            Coming Soon
          </label>
        </div>

        {/* Content */}
        <div className="max-h-[600px] overflow-y-auto p-6">
          {activeTab === 'container' && (
            <>
              {availableContainers.length === 0 ? (
                <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50">
                  <p className="text-sm text-gray-500">No container templates available.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {availableContainers.map((container) => {
                    const isSelected = selectedContainerId === container.id;
                    return (
                      <button
                        key={container.id}
                        type="button"
                        onClick={() => setSelectedContainerId(container.id)}
                        className={`group relative flex h-full flex-col rounded-2xl border px-4 pb-4 pt-5 text-left transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50/50 shadow-lg shadow-blue-100'
                            : 'border-gray-200 hover:border-blue-500 hover:shadow-md'
                        }`}
                      >
                        {container.comingSoon && (
                          <span className="absolute right-3 top-3 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-600">
                            Coming soon
                          </span>
                        )}
                        <p className="min-h-[36px] text-center text-xs font-semibold text-gray-700">
                          {container.name}
                        </p>
                        <div className="mt-4 flex h-28 items-center justify-center rounded-2xl bg-slate-50 p-2">
                          <ContainerIllustration variant={container.variant} size={container.size} />
                        </div>
                        <p className="mt-4 text-center text-[11px] font-semibold text-blue-500/70 transition-colors group-hover:text-blue-600">
                          LEARN MORE
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {activeTab === 'truck' && (
            <>
              {availableTrucks.length === 0 ? (
                <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50">
                  <p className="text-sm text-gray-500">No truck templates available.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {availableTrucks.map((truckOption) => {
                    const isSelected = selectedTruckId === truckOption.id;
                    return (
                      <button
                        key={truckOption.id}
                        type="button"
                        onClick={() => setSelectedTruckId(truckOption.id)}
                        className={`group relative flex h-full flex-col rounded-2xl border px-4 pb-4 pt-5 text-left transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50/50 shadow-lg shadow-blue-100'
                            : 'border-gray-200 hover:border-blue-500 hover:shadow-md'
                        }`}
                      >
                        {truckOption.comingSoon && (
                          <span className="absolute right-3 top-3 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-600">
                            Coming soon
                          </span>
                        )}
                        <p className="min-h-[36px] text-center text-xs font-semibold text-gray-700">
                          {truckOption.name}
                        </p>
                        <div className="mt-4 flex h-28 items-center justify-center rounded-2xl bg-slate-50 p-2">
                          <TruckIllustration variant={truckOption.variant} />
                        </div>
                        <p className="mt-4 text-center text-[11px] font-semibold text-blue-500/70 transition-colors group-hover:text-blue-600">
                          LEARN MORE
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between border-t border-gray-200 bg-gray-50 px-6 py-4">
          <button
            type="button"
            className="rounded-lg px-6 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-200"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`rounded-lg px-8 py-2 text-sm font-semibold text-white shadow-sm transition ${
              isNextDisabled ? 'cursor-not-allowed bg-blue-200' : 'bg-blue-500 hover:bg-blue-600'
            }`}
            disabled={isNextDisabled}
            onClick={handleNext}
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContainerSelectionModal;

interface ContainerIllustrationProps {
  variant: ContainerVariant;
  size: ContainerSize;
}

const ContainerIllustration: React.FC<ContainerIllustrationProps> = ({ variant, size }) => {
  const widthMap: Record<ContainerSize, number> = {
    short: 56,
    long: 68,
    xlong: 78,
  };
  const width = widthMap[size];
  const x = 24;
  const y = 24;
  const depth = 14;
  const baseHeight = variant === 'high-cube' ? 34 : 28;
  const right = x + width;
  const gradientId = `container-gradient-${variant}-${size}`;

  const renderBox = ({
    openTop,
    refrigerated,
    bulk,
    custom,
  }: {
    openTop?: boolean;
    refrigerated?: boolean;
    bulk?: boolean;
    custom?: boolean;
  }) => (
    <svg viewBox="0 0 150 90" className="h-full w-full">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#dbeafe" />
          <stop offset="100%" stopColor="#bfdbfe" />
        </linearGradient>
      </defs>
      <rect
        x={x}
        y={y}
        width={width}
        height={baseHeight}
        rx={custom ? 6 : 2}
        fill={custom ? '#f8fafc' : `url(#${gradientId})`}
        stroke="#60a5fa"
        strokeWidth="1.8"
        strokeDasharray={custom ? '6 4' : undefined}
      />
      {!openTop && (
        <path
          d={`M ${x} ${y} L ${right} ${y} L ${right + depth} ${y - depth} L ${x + depth} ${y - depth} Z`}
          fill={custom ? '#f1f5f9' : '#e0f2fe'}
          stroke="#60a5fa"
          strokeWidth="1.5"
          strokeDasharray={custom ? '6 4' : undefined}
        />
      )}
      <path
        d={`M ${right} ${y} L ${right + depth} ${y - depth} L ${right + depth} ${y - depth + baseHeight} L ${right} ${y + baseHeight} Z`}
        fill={custom ? '#f8fafc' : '#bfdbfe'}
        stroke="#60a5fa"
        strokeWidth="1.5"
        strokeDasharray={custom ? '6 4' : undefined}
      />
      {Array.from({ length: 6 }).map((_, index) => {
        const offset = x + 8 + index * ((width - 16) / 6);
        return (
          <line
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            x1={offset}
            y1={y + 3}
            x2={offset}
            y2={y + baseHeight - 3}
            stroke="#3b82f6"
            strokeOpacity="0.35"
            strokeWidth="1"
          />
        );
      })}
      {openTop && (
        <>
          {Array.from({ length: 3 }).map((_, index) => {
            const start = x + 12 + index * ((width - 24) / 2);
            return (
              <line
                // eslint-disable-next-line react/no-array-index-key
                key={`bar-${index}`}
                x1={start}
                y1={y - 4}
                x2={start}
                y2={y + baseHeight}
                stroke="#60a5fa"
                strokeDasharray="4 3"
                strokeWidth="1.5"
              />
            );
          })}
        </>
      )}
      {refrigerated && (
        <g>
          <rect
            x={right - 20}
            y={y + 6}
            width="16"
            height={baseHeight - 12}
            rx="2"
            fill="#e0f2fe"
            stroke="#3b82f6"
            strokeWidth="1.4"
          />
          <line
            x1={right - 12}
            y1={y + 6}
            x2={right - 12}
            y2={y + baseHeight - 6}
            stroke="#3b82f6"
            strokeWidth="1"
          />
          <circle cx={right - 8} cy={y + baseHeight / 2 - 4} r="1.5" fill="#1d4ed8" />
          <circle cx={right - 8} cy={y + baseHeight / 2 + 4} r="1.5" fill="#1d4ed8" />
        </g>
      )}
      {bulk && (
        <g>
          {Array.from({ length: 3 }).map((_, index) => {
            const hatchWidth = width / 5;
            const startX = x + 8 + index * (hatchWidth + 6);
            return (
              <rect
                // eslint-disable-next-line react/no-array-index-key
                key={`hatch-${index}`}
                x={startX}
                y={y - depth + 2}
                width={hatchWidth}
                height="6"
                rx="1"
                fill="#bfdbfe"
                stroke="#3b82f6"
                strokeWidth="1"
              />
            );
          })}
        </g>
      )}
    </svg>
  );

  if (variant === 'flatrack' || variant === 'flatrack-collapsible') {
    const collapsible = variant === 'flatrack-collapsible';
    return (
      <svg viewBox="0 0 150 90" className="h-full w-full">
        <rect
          x={x}
          y={y + 20}
          width={width}
          height="12"
          rx="3"
          fill="#dbeafe"
          stroke="#3b82f6"
          strokeWidth="1.8"
        />
        <rect
          x={x + width - 6}
          y={y}
          width="6"
          height="32"
          rx="2"
          fill="#bfdbfe"
          stroke="#3b82f6"
          strokeWidth="1.5"
        />
        <rect
          x={x}
          y={y}
          width="6"
          height="32"
          rx="2"
          fill="#bfdbfe"
          stroke="#3b82f6"
          strokeWidth="1.5"
        />
        <path
          d={`M ${x + 6} ${y + 2} L ${x + width - 6} ${collapsible ? y + 14 : y + 2}`}
          stroke="#60a5fa"
          strokeDasharray={collapsible ? '5 4' : '0'}
          strokeWidth="2"
        />
      </svg>
    );
  }

  if (variant === 'platform') {
    return (
      <svg viewBox="0 0 150 90" className="h-full w-full">
        <rect
          x={x}
          y={y + 30}
          width={width}
          height="10"
          rx="3"
          fill="#dbeafe"
          stroke="#3b82f6"
          strokeWidth="1.8"
        />
        {Array.from({ length: 4 }).map((_, index) => {
          const start = x + 10 + index * ((width - 20) / 3);
          return (
            <line
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              x1={start}
              y1={y + 30}
              x2={start}
              y2={y + 40}
              stroke="#3b82f6"
              strokeWidth="1.2"
            />
          );
        })}
      </svg>
    );
  }

  if (variant === 'tank') {
    return (
      <svg viewBox="0 0 150 90" className="h-full w-full">
        <ellipse
          cx={x + width / 2}
          cy={y + 35}
          rx={width / 2}
          ry="16"
          fill="#e0f2fe"
          stroke="#3b82f6"
          strokeWidth="1.8"
        />
        <ellipse
          cx={x + width / 2}
          cy={y + 35}
          rx={width / 2}
          ry="12"
          fill="#bfdbfe"
          stroke="#3b82f6"
          strokeWidth="1.5"
        />
        <line
          x1={x + 20}
          y1={y + 35}
          x2={x + width - 20}
          y2={y + 35}
          stroke="#1d4ed8"
          strokeWidth="1.2"
          strokeDasharray="4 3"
        />
      </svg>
    );
  }

  return renderBox({
    openTop: variant === 'open-top',
    refrigerated: variant === 'refrigerated',
    bulk: variant === 'bulk',
    custom: variant === 'custom',
  });
};


const TruckIllustration: React.FC<{ variant: TruckVariant }> = ({ variant }) => {
  const palette = {
    cab: '#9fb1ca',
    cabDeep: '#7d8ca6',
    trailer: '#e7edf6',
    trailerBorder: '#c3d0e4',
    trailerShadow: '#d6deee',
    window: '#6b7b97',
    windowHighlight: '#f5f7fb',
    accent: '#7fb2ff',
    detail: '#9fb4d8',
    wheel: '#4b5566',
    wheelInner: '#232a35',
    wheelHub: '#a6b3c7',
    ground: '#edf2fa',
    customFill: '#f8fafc',
  };

  const wheelY = 104;
  type WheelPosition = { cx: number; cy?: number; radius?: number };

  const renderGround = () => <rect x="24" y={wheelY + 8} width="192" height="6" rx="3" fill={palette.ground} />;

  const renderWheels = (positions: WheelPosition[]) => (
    <g>
      {positions.map((pos, index) => {
        const radius = pos.radius ?? 9;
        const cy = pos.cy ?? wheelY;

        return (
          <g key={`wheel-${index}`}>
            <circle cx={pos.cx} cy={cy} r={radius} fill={palette.wheel} stroke={palette.cabDeep} strokeWidth="1.2" />
            <circle cx={pos.cx} cy={cy} r={radius - 3} fill={palette.wheelInner} opacity="0.8" />
            <circle cx={pos.cx} cy={cy} r={Math.max(1.5, radius - 5)} fill={palette.wheelHub} />
          </g>
        );
      })}
    </g>
  );

  const renderBase = (body: React.ReactNode, wheels: WheelPosition[]) => (
    <svg viewBox="0 0 240 140" className="h-full w-full" aria-hidden="true" focusable="false">
      {renderGround()}
      {body}
      {renderWheels(wheels)}
    </svg>
  );

  const renderLongHaulCab = ({
    x = 28,
    y = 46,
    dashed = false,
  }: {
    x?: number;
    y?: number;
    dashed?: boolean;
  } = {}) => {
    const width = 56;
    const height = 42;
    const stroke = dashed ? palette.accent : palette.cabDeep;
    const fill = dashed ? palette.customFill : palette.cab;
    const dash = dashed ? '6 4' : undefined;
    const base = y + height;

    return (
      <g>
        <path
          d={`
            M ${x} ${base}
            L ${x} ${y + 16}
            Q ${x} ${y} ${x + 12} ${y}
            L ${x + width - 14} ${y}
            Q ${x + width} ${y} ${x + width + 6} ${y + 18}
            L ${x + width + 4} ${base}
            Z
          `}
          fill={fill}
          stroke={stroke}
          strokeWidth="2"
          strokeDasharray={dash}
        />
        <rect
          x={x + 6}
          y={y + 6}
          width={width - 20}
          height="18"
          rx="6"
          fill={dashed ? palette.customFill : palette.window}
          stroke={stroke}
          strokeWidth="1.4"
          strokeDasharray={dash}
        />
        {!dashed && (
          <path
            d={`M ${x + 10} ${y + 8} L ${x + 26} ${y + 2} L ${x + 34} ${y + 2} L ${x + 20} ${y + 18} Z`}
            fill={palette.windowHighlight}
            opacity="0.35"
          />
        )}
        <line
          x1={x + width / 2}
          y1={y + 10}
          x2={x + width / 2}
          y2={base}
          stroke={stroke}
          strokeWidth="1.2"
          strokeDasharray={dash}
          opacity="0.8"
        />
        <rect
          x={x + width / 2 + 4}
          y={base - 10}
          width="10"
          height="4"
          rx="2"
          fill={stroke}
          opacity={dashed ? 0.4 : 0.85}
        />
        <rect x={x - 2} y={y + 18} width="4" height="12" rx="1" fill={stroke} opacity="0.45" />
        <rect x={x + width - 6} y={base - 6} width="15" height="4" rx="2" fill={stroke} opacity="0.35" />
      </g>
    );
  };

  const renderCompactCab = ({
    x = 40,
    y = 56,
  }: {
    x?: number;
    y?: number;
  } = {}) => {
    const width = 44;
    const height = 34;
    const base = y + height;

    return (
      <g>
        <path
          d={`
            M ${x} ${base}
            L ${x} ${y + 10}
            Q ${x} ${y} ${x + 10} ${y}
            L ${x + width - 10} ${y}
            Q ${x + width} ${y} ${x + width} ${y + 12}
            L ${x + width + 4} ${base}
            Z
          `}
          fill={palette.cab}
          stroke={palette.cabDeep}
          strokeWidth="2"
        />
        <rect
          x={x + 6}
          y={y + 6}
          width={width - 14}
          height="14"
          rx="5"
          fill={palette.window}
          stroke={palette.cabDeep}
          strokeWidth="1.2"
        />
        <path
          d={`M ${x + 12} ${y + 8} L ${x + 24} ${y + 4} L ${x + 28} ${y + 4} L ${x + 18} ${y + 16} Z`}
          fill={palette.windowHighlight}
          opacity="0.35"
        />
        <line x1={x + width / 2} y1={y + 8} x2={x + width / 2} y2={base} stroke={palette.cabDeep} strokeWidth="1.2" opacity="0.6" />
        <rect x={x + width / 2 + 2} y={base - 8} width="8" height="3" rx="1.5" fill={palette.cabDeep} opacity="0.8" />
        <rect x={x - 2} y={y + 12} width="3" height="8" rx="1" fill={palette.cabDeep} opacity="0.45" />
      </g>
    );
  };

  const renderTautliner = () =>
    renderBase(
      <>
        <g>
          <rect
            x="96"
            y="38"
            width="122"
            height="42"
            rx="8"
            fill={palette.trailer}
            stroke={palette.trailerBorder}
            strokeWidth="2"
          />
          <rect x="96" y="68" width="122" height="12" fill={palette.trailerShadow} opacity="0.55" />
          {Array.from({ length: 5 }).map((_, index) => (
            <line
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              x1={108 + index * 22}
              y1="42"
              x2={108 + index * 22}
              y2="72"
              stroke={palette.trailerBorder}
              strokeWidth="1.2"
              opacity="0.6"
            />
          ))}
          <line x1="96" y1="52" x2="218" y2="52" stroke={palette.detail} strokeWidth="1.2" opacity="0.55" />
        </g>
        {renderLongHaulCab()}
      </>,
      [
        { cx: 74 },
        { cx: 132 },
        { cx: 190 },
      ],
    );

  const renderRefrigerated = () =>
    renderBase(
      <>
        <g>
          <rect
            x="92"
            y="50"
            width="118"
            height="34"
            rx="8"
            fill={palette.trailer}
            stroke={palette.trailerBorder}
            strokeWidth="2"
          />
          <rect
            x="94"
            y="52"
            width="20"
            height="30"
            rx="4"
            fill={palette.trailerShadow}
            stroke={palette.cabDeep}
            strokeWidth="1.1"
          />
          <line x1="100" y1="56" x2="100" y2="78" stroke={palette.cabDeep} strokeWidth="1" opacity="0.5" />
          <line x1="107" y1="56" x2="107" y2="78" stroke={palette.cabDeep} strokeWidth="1" opacity="0.5" />
          <g transform="translate(152 66)">
            <circle cx="0" cy="0" r="8" fill={palette.accent} opacity="0.9" />
            <line x1="0" y1="-5" x2="0" y2="5" stroke="white" strokeWidth="1.2" />
            <line x1="-5" y1="0" x2="5" y2="0" stroke="white" strokeWidth="1.2" />
            <line x1="-3.5" y1="-3.5" x2="3.5" y2="3.5" stroke="white" strokeWidth="1" />
            <line x1="-3.5" y1="3.5" x2="3.5" y2="-3.5" stroke="white" strokeWidth="1" />
          </g>
        </g>
        {renderCompactCab({ x: 44 })}
      </>,
      [
        { cx: 70 },
        { cx: 122 },
        { cx: 178 },
      ],
    );

  const renderIsotherm = () =>
    renderBase(
      <>
        <g>
          <rect
            x="94"
            y="48"
            width="120"
            height="36"
            rx="9"
            fill={palette.trailer}
            stroke={palette.trailerBorder}
            strokeWidth="2"
          />
          <rect
            x="98"
            y="52"
            width="112"
            height="28"
            rx="7"
            fill="none"
            stroke={palette.accent}
            strokeWidth="1.4"
            strokeDasharray="6 4"
          />
          <line x1="98" y1="58" x2="210" y2="58" stroke={palette.detail} strokeWidth="1" opacity="0.5" />
          <line x1="98" y1="66" x2="210" y2="66" stroke={palette.detail} strokeWidth="1" opacity="0.5" />
          <g>
            <line x1="204" y1="54" x2="204" y2="72" stroke={palette.accent} strokeWidth="2" strokeLinecap="round" />
            <circle cx="204" cy="76" r="4" fill={palette.accent} />
            <line x1="204" y1="54" x2="210" y2="54" stroke={palette.accent} strokeWidth="1.6" strokeLinecap="round" />
          </g>
        </g>
        {renderCompactCab()}
      </>,
      [
        { cx: 72 },
        { cx: 120 },
        { cx: 174 },
      ],
    );

  const renderMegaTrailer = () =>
    renderBase(
      <>
        <g>
          <path
            d="M 96 84 L 96 40 Q 140 24 192 32 L 216 36 L 216 84 Z"
            fill={palette.trailer}
            stroke={palette.trailerBorder}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <rect x="96" y="72" width="120" height="10" fill={palette.trailerShadow} opacity="0.55" />
          <path d="M 96 58 Q 140 42 188 46 L 216 50" stroke={palette.detail} strokeWidth="1.6" opacity="0.6" />
        </g>
        {renderLongHaulCab()}
      </>,
      [
        { cx: 74 },
        { cx: 128 },
        { cx: 172 },
        { cx: 210 },
      ],
    );

  const renderJumbo = () =>
    renderBase(
      <>
        <g>
          <rect
            x="98"
            y="48"
            width="78"
            height="36"
            rx="8"
            fill={palette.trailer}
            stroke={palette.trailerBorder}
            strokeWidth="2"
          />
          <rect
            x="180"
            y="54"
            width="46"
            height="30"
            rx="6"
            fill={palette.trailer}
            stroke={palette.trailerBorder}
            strokeWidth="2"
          />
          <rect x="170" y="72" width="14" height="6" rx="3" fill={palette.trailerBorder} opacity="0.6" />
          <line x1="114" y1="52" x2="114" y2="80" stroke={palette.detail} strokeWidth="1" opacity="0.5" />
          <line x1="138" y1="52" x2="138" y2="80" stroke={palette.detail} strokeWidth="1" opacity="0.5" />
          <line x1="200" y1="58" x2="200" y2="80" stroke={palette.detail} strokeWidth="1" opacity="0.5" />
        </g>
        {renderLongHaulCab()}
      </>,
      [
        { cx: 72 },
        { cx: 120 },
        { cx: 164 },
        { cx: 206 },
      ],
    );

  const renderCustom = () =>
    renderBase(
      <>
        <rect
          x="98"
          y="38"
          width="120"
          height="42"
          rx="10"
          fill={palette.customFill}
          stroke={palette.accent}
          strokeWidth="2"
          strokeDasharray="6 4"
        />
        {renderLongHaulCab({ dashed: true })}
        <g>
          <circle cx="176" cy="60" r="10" fill="white" stroke={palette.accent} strokeWidth="1.4" />
          <line x1="176" y1="54" x2="176" y2="66" stroke={palette.accent} strokeWidth="2" strokeLinecap="round" />
          <line x1="170" y1="60" x2="182" y2="60" stroke={palette.accent} strokeWidth="2" strokeLinecap="round" />
        </g>
      </>,
      [
        { cx: 74 },
        { cx: 132 },
        { cx: 190 },
      ],
    );

  switch (variant) {
    case 'refrigerated':
      return renderRefrigerated();
    case 'isotherm':
      return renderIsotherm();
    case 'mega-trailer':
      return renderMegaTrailer();
    case 'jumbo':
      return renderJumbo();
    case 'custom':
      return renderCustom();
    case 'tautliner':
    default:
      return renderTautliner();
  }
};
