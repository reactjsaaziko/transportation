import React from 'react';
import { X } from 'lucide-react';

interface CargoItem {
  name: string;
  packages: number;
  volume: number;
  weight: number;
  color: string;
  icon: string;
}

interface StuffingResultDetailProps {
  isOpen: boolean;
  onClose: () => void;
  containerType: string;
  containerName: string;
  totalPackages: number;
  cargoVolume: number;
  volumePercentage: number;
  cargoWeight: number;
  weightPercentage: number;
  maxWeight: number;
  totalVolume: number;
  cargoItems: CargoItem[];
}

const StuffingResultDetail: React.FC<StuffingResultDetailProps> = ({
  isOpen,
  onClose,
  containerType = "20' Standard",
  containerName = "20' Standard #1",
  totalPackages = 190,
  cargoVolume = 28.30,
  volumePercentage = 88,
  cargoWeight = 14300.00,
  weightPercentage = 50,
  maxWeight = 14300.00,
  totalVolume = 28.30,
  cargoItems = [],
}) => {
  if (!isOpen) return null;

  // Calculate chart segments for pie chart
  const getChartSegments = () => {
    const total = cargoItems.reduce((sum, item) => sum + item.packages, 0);
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

  const chartSegments = getChartSegments();

  const handleExportPDF = () => {
    // Implement PDF export logic
    console.log('Exporting to PDF...');
  };

  const handleCopyRequest = () => {
    // Implement copy request logic
    console.log('Copying request...');
  };

  const handleBack = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Container Loading Summary</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Container Visualization and Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Container Image */}
            <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center justify-center">
              <h3 className="text-lg font-medium text-gray-700 mb-4">{containerType}</h3>
              
              {/* Container SVG Illustration */}
              <div className="w-48 h-24 mb-4">
                <svg viewBox="0 0 200 100" className="w-full h-full">
                  {/* Container body */}
                  <rect x="20" y="20" width="160" height="60" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" />
                  
                  {/* Vertical lines for container texture */}
                  {Array.from({ length: 16 }).map((_, i) => (
                    <line
                      key={i}
                      x1={30 + i * 10}
                      y1="20"
                      x2={30 + i * 10}
                      y2="80"
                      stroke="#9ca3af"
                      strokeWidth="1"
                    />
                  ))}
                  
                  {/* Container door lines */}
                  <line x1="100" y1="20" x2="100" y2="80" stroke="#6b7280" strokeWidth="2" />
                  <rect x="95" y="45" width="10" height="10" fill="#6b7280" />
                </svg>
              </div>
              
              <div className="text-center space-y-1">
                <p className="text-sm font-medium text-blue-600">1 Unit</p>
                <p className="text-xs text-gray-600">weight: {maxWeight.toFixed(2)} kg</p>
                <p className="text-xs text-gray-600">volume: {totalVolume.toFixed(2)} m3</p>
              </div>
            </div>

            {/* Right: Container Details with Chart */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-800">{containerName}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <p className="text-sm font-medium text-blue-600">1 Unit</p>
                    <button className="text-xs text-blue-600 hover:text-blue-700 underline">
                      3D View
                    </button>
                  </div>
                </div>
                <div className="w-16 h-16 relative">
                  {/* Color indicator icon */}
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="35" r="15" fill="#ef4444" />
                    <circle cx="65" cy="55" r="15" fill="#3b82f6" />
                    <circle cx="35" cy="55" r="15" fill="#22c55e" />
                  </svg>
                </div>
              </div>

              {/* Donut Chart */}
              <div className="flex items-center justify-center">
                <svg viewBox="0 0 200 200" className="w-48 h-48">
                  <defs>
                    {chartSegments.map((segment, index) => (
                      <linearGradient key={index} id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={segment.color} stopOpacity="1" />
                        <stop offset="100%" stopColor={segment.color} stopOpacity="0.8" />
                      </linearGradient>
                    ))}
                  </defs>
                  
                  {/* Background circle */}
                  <circle cx="100" cy="100" r="70" fill="none" stroke="#f3f4f6" strokeWidth="40" />
                  
                  {/* Chart segments */}
                  {chartSegments.map((segment, index) => {
                    const startAngle = (segment.startAngle - 90) * (Math.PI / 180);
                    const endAngle = (segment.endAngle - 90) * (Math.PI / 180);
                    const radius = 70;
                    const innerRadius = 50;
                    
                    const x1 = 100 + radius * Math.cos(startAngle);
                    const y1 = 100 + radius * Math.sin(startAngle);
                    const x2 = 100 + radius * Math.cos(endAngle);
                    const y2 = 100 + radius * Math.sin(endAngle);
                    
                    const largeArcFlag = segment.endAngle - segment.startAngle > 180 ? 1 : 0;
                    
                    return (
                      <path
                        key={index}
                        d={`M 100 100 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                        fill={`url(#gradient-${index})`}
                        stroke="white"
                        strokeWidth="2"
                      />
                    );
                  })}
                  
                  {/* Center white circle */}
                  <circle cx="100" cy="100" r="50" fill="white" />
                </svg>
              </div>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Packages */}
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total</p>
                <p className="text-2xl font-semibold text-gray-900">{totalPackages} packages</p>
              </div>

              {/* Cargo Volume */}
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Cargo Volume</p>
                <p className="text-2xl font-semibold text-gray-900">{cargoVolume.toFixed(2)} m3</p>
                <p className="text-xs text-gray-500">({volumePercentage}% of volume)</p>
              </div>

              {/* Cargo Weight */}
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Cargo Weight</p>
                <p className="text-2xl font-semibold text-gray-900">{cargoWeight.toFixed(2)} kg</p>
                <p className="text-xs text-gray-500">({weightPercentage}% of max weight)</p>
              </div>
            </div>
          </div>

          {/* Cargo Breakdown Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Packages
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Volume
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Weight
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cargoItems.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-3"
                          style={{ backgroundColor: item.color }}
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{item.icon}</span>
                          <span className="text-sm font-medium text-gray-900">{item.name}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-sm text-gray-900">{item.packages}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.volume.toFixed(2)} m3
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.weight.toFixed(2)} kg
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              onClick={handleBack}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <div className="flex gap-3">
              <button
                onClick={handleExportPDF}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                Export To PDF
              </button>
              <button
                onClick={handleCopyRequest}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
              >
                Copy Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StuffingResultDetail;
