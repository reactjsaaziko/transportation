import React from 'react';
import { FileText, Copy } from 'lucide-react';

interface CargoItem {
  name: string;
  packages: number;
  volume: number;
  weight: number;
  color: string;
  icon: string;
}

const SAMPLE_CONTAINER = {
  containerType: "20' Standard",
  containerName: "20' Standard #1",
  totalPackages: 190,
  cargoVolume: 28.3,
  volumePercentage: 85,
  cargoWeight: 14300,
  weightPercentage: 50,
  maxWeight: 14300,
  totalVolume: 28.3,
};

const SAMPLE_CARGO_ITEMS: CargoItem[] = [
  {
    name: 'Big bags',
    packages: 80,
    volume: 10,
    weight: 9000,
    color: '#7c3aed',
    icon: '📦',
  },
  {
    name: 'Sacks',
    packages: 10,
    volume: 13.5,
    weight: 4500,
    color: '#22c55e',
    icon: '🎒',
  },
  {
    name: 'Boxes 1',
    packages: 100,
    volume: 4.8,
    weight: 800,
    color: '#0ea5e9',
    icon: '🧱',
  },
];

const getChartSegments = (cargoItems: CargoItem[]) => {
  if (cargoItems.length === 0) return [];
  const total = cargoItems.reduce((sum, item) => sum + item.packages, 0);
  if (total === 0) return [];

  let currentAngle = 0;

  return cargoItems.map((item) => {
    const percentage = (item.packages / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;

    return {
      ...item,
      percentage,
      startAngle,
      endAngle: currentAngle,
    };
  });
};

const StuffingResultDetailExample: React.FC = () => {
  const {
    containerType,
    containerName,
    totalPackages,
    cargoVolume,
    volumePercentage,
    cargoWeight,
    weightPercentage,
    maxWeight,
    totalVolume,
  } = SAMPLE_CONTAINER;

  const cargoItems = SAMPLE_CARGO_ITEMS;
  const hasCargoItems = cargoItems.length > 0;
  const chartSegments = getChartSegments(cargoItems);

  const handleExportPDF = () => {
    console.log('Exporting to PDF...');
  };

  const handleCopyRequest = () => {
    console.log('Copying request...');
  };

  const handleBack = () => {
    console.log('Back clicked');
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10">
      <div className="mx-auto max-w-6xl px-4 lg:px-0">
        <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-2xl">
          <section className="grid divide-y divide-slate-100 lg:grid-cols-[320px_minmax(0,1fr)] lg:divide-y-0 lg:divide-x">
            <div className="p-8 lg:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Container</p>
              <h3 className="mt-2 text-3xl font-semibold text-slate-900">{containerType}</h3>
              <div className="mt-8 flex flex-col items-center lg:items-start">
                <svg viewBox="0 0 260 130" className="w-full max-w-xs">
                  <defs>
                    <linearGradient id="wireframeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#cbd5f5" />
                      <stop offset="100%" stopColor="#93c5fd" />
                    </linearGradient>
                  </defs>
                  <rect x="25" y="35" width="210" height="70" rx="8" fill="#f8fafc" stroke="#dbeafe" strokeWidth="4" />
                  {Array.from({ length: 16 }).map((_, index) => (
                    <line
                      key={index}
                      x1={36 + index * 12}
                      y1="35"
                      x2={36 + index * 12}
                      y2="105"
                      stroke="url(#wireframeGradient)"
                      strokeWidth="2"
                      opacity="0.6"
                    />
                  ))}
                  <line x1="130" y1="35" x2="130" y2="105" stroke="#60a5fa" strokeWidth="3" />
                </svg>
                <div className="mt-6 w-full max-w-[220px]">
                  <div className="text-center text-sm font-semibold text-blue-600">1 Unit</div>
                  <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200">
                    <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 text-xs uppercase tracking-wide text-slate-500">
                      <span>Weight</span>
                      <span className="text-base font-semibold text-slate-900">{maxWeight.toFixed(2)} kg</span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-3 text-xs uppercase tracking-wide text-slate-500">
                      <span>Volume</span>
                      <span className="text-base font-semibold text-slate-900">{totalVolume.toFixed(2)} m³</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative min-h-[260px] bg-gradient-to-br from-white via-slate-50 to-blue-50 p-8 lg:p-10">
              <div className="max-w-xl">
                <p className="text-sm text-slate-500">Load Calculator</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{containerName}</p>
                <p className="mt-3 text-base text-slate-500">
                  Compare the planned stuffing with live container capacity information before exporting the request.
                </p>
              </div>
              <div className="absolute bottom-8 right-8 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/60 bg-white shadow-lg">
                <svg viewBox="0 0 100 100" className="h-12 w-12">
                  <circle cx="50" cy="32" r="18" fill="#fbbf24" opacity="0.9" />
                  <circle cx="68" cy="60" r="18" fill="#0ea5e9" opacity="0.9" />
                  <circle cx="32" cy="60" r="18" fill="#22c55e" opacity="0.9" />
                </svg>
              </div>
            </div>
          </section>

          <section className="bg-slate-50 px-6 py-10 lg:px-10">
            <div className="rounded-[24px] border border-slate-200 bg-white shadow-sm">
              <div className="grid gap-8 border-b border-slate-100 p-6 lg:grid-cols-[340px_minmax(0,1fr)] lg:p-10">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Stuffing</p>
                  <h4 className="mt-2 text-2xl font-semibold text-slate-900">{containerName}</h4>
                  <div className="mt-6 overflow-hidden rounded-3xl border border-slate-100">
                    <div className="flex h-[240px] items-center justify-center bg-gradient-to-br from-fuchsia-50 via-blue-50 to-cyan-50">
                      <svg viewBox="0 0 260 150" className="w-full max-w-md">
                        <defs>
                          <linearGradient id="containerTop" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f472b6" />
                            <stop offset="100%" stopColor="#c026d3" />
                          </linearGradient>
                          <linearGradient id="containerSide" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#22c55e" />
                            <stop offset="100%" stopColor="#15803d" />
                          </linearGradient>
                        </defs>
                        <polygon points="60,40 200,40 230,60 90,60" fill="url(#containerTop)" opacity="0.9" />
                        <polygon points="60,40 90,60 90,120 60,100" fill="#fb923c" />
                        <polygon points="90,60 230,60 230,120 90,120" fill="url(#containerSide)" />
                        <polygon points="60,100 90,120 230,120 200,100" fill="#047857" opacity="0.6" />
                      </svg>
                    </div>
                    <div className="flex items-center justify-between bg-white px-5 py-3 text-sm font-semibold text-blue-600">
                      <span>1 Unit</span>
                      <button className="rounded-full border border-blue-100 px-4 py-1 text-blue-600 transition-colors hover:bg-blue-50">
                        3D View
                      </button>
                    </div>
                  </div>
                </div>
                <div className="rounded-3xl bg-slate-50 p-6">
                  <div className="grid gap-6 sm:grid-cols-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Total</p>
                      <p className="mt-2 text-2xl font-semibold text-slate-900">{totalPackages} packages</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Cargo Volume</p>
                      <p className="mt-2 text-xl font-semibold text-slate-900">{cargoVolume.toFixed(2)} m³</p>
                      <p className="text-sm text-slate-500">{volumePercentage}% of volume</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Cargo Weight</p>
                      <p className="mt-2 text-xl font-semibold text-slate-900">{cargoWeight.toFixed(2)} kg</p>
                      <p className="text-sm text-slate-500">{weightPercentage}% of max weight</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-8 p-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:p-10">
                <div className="flex flex-col items-center gap-6">
                  {hasCargoItems ? (
                    <svg viewBox="0 0 220 220" className="h-56 w-56">
                      <defs>
                        {chartSegments.map((segment, index) => (
                          <linearGradient key={index} id={`segment-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={segment.color} />
                            <stop offset="100%" stopColor={segment.color} stopOpacity="0.7" />
                          </linearGradient>
                        ))}
                      </defs>
                      <circle cx="110" cy="110" r="80" fill="none" stroke="#eef2ff" strokeWidth="35" />
                      {chartSegments.map((segment, index) => {
                        const startAngle = (segment.startAngle - 90) * (Math.PI / 180);
                        const endAngle = (segment.endAngle - 90) * (Math.PI / 180);
                        const radius = 80;
                        const innerRadius = 55;

                        const x1Outer = 110 + radius * Math.cos(startAngle);
                        const y1Outer = 110 + radius * Math.sin(startAngle);
                        const x2Outer = 110 + radius * Math.cos(endAngle);
                        const y2Outer = 110 + radius * Math.sin(endAngle);

                        const x1Inner = 110 + innerRadius * Math.cos(endAngle);
                        const y1Inner = 110 + innerRadius * Math.sin(endAngle);
                        const x2Inner = 110 + innerRadius * Math.cos(startAngle);
                        const y2Inner = 110 + innerRadius * Math.sin(startAngle);

                        const largeArcFlag = segment.endAngle - segment.startAngle > 180 ? 1 : 0;

                        return (
                          <path
                            key={index}
                            d={`
                              M ${x1Outer} ${y1Outer}
                              A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2Outer} ${y2Outer}
                              L ${x1Inner} ${y1Inner}
                              A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x2Inner} ${y2Inner}
                              Z
                            `}
                            fill={`url(#segment-${index})`}
                            stroke="white"
                            strokeWidth="2"
                          />
                        );
                      })}
                      <circle cx="110" cy="110" r="55" fill="white" />
                    </svg>
                  ) : (
                    <div className="flex h-56 w-56 items-center justify-center rounded-full border border-dashed border-slate-300 text-sm text-slate-400">
                      No cargo data
                    </div>
                  )}
                  <div className="w-full space-y-3">
                    {cargoItems.map((item) => (
                      <div key={item.name} className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-2 text-sm text-slate-600">
                        <div className="flex items-center gap-3">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="font-medium text-slate-900">{item.name}</span>
                        </div>
                        <span className="font-semibold text-slate-900">{item.packages} pkgs</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[480px] text-left">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        <th className="py-3">Name</th>
                        <th className="py-3 text-center">Packages</th>
                        <th className="py-3 text-right">Volume</th>
                        <th className="py-3 text-right">Weight</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {cargoItems.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-sm text-slate-500">
                            Add cargo to see the detailed breakdown.
                          </td>
                        </tr>
                      ) : (
                        cargoItems.map((item, index) => (
                          <tr key={`${item.name}-${index}`} className="text-sm text-slate-600">
                            <td className="py-4">
                              <div className="flex items-center gap-4">
                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-lg">{item.icon}</span>
                                <div>
                                  <p className="text-base font-semibold text-slate-900">{item.name}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 text-center text-base font-semibold text-slate-900">{item.packages}</td>
                            <td className="py-4 text-right text-base font-semibold text-slate-900">{item.volume.toFixed(2)} m³</td>
                            <td className="py-4 text-right text-base font-semibold text-slate-900">{item.weight.toFixed(2)} kg</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={handleBack}
                className="rounded-xl border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
              >
                Back
              </button>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleExportPDF}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700"
                >
                  <FileText className="h-4 w-4" />
                  Export To PDF
                </button>
                <button
                  onClick={handleCopyRequest}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-100 px-6 py-2.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-200"
                >
                  <Copy className="h-4 w-4" />
                  Copy Request
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default StuffingResultDetailExample;
