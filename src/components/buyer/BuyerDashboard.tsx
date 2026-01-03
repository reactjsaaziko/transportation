import { useState } from 'react';
import { ShoppingCart, Truck, Train, Plane, Ship, X, ChevronRight, Check } from 'lucide-react';
import { useBuyer } from '../../context/BuyerContext';
import BuyerPage from './BuyerPage';
import RailBuyerPage from './RailBuyerPage';
import AirBuyerPage from './AirBuyerPage';
import WaterBuyerPage from './WaterBuyerPage';

type TransportMode = 'road' | 'rail' | 'air' | 'water' | null;

const transportOptions = [
  { 
    id: 'road' as TransportMode, 
    label: 'Road Transport', 
    icon: Truck,
    description: 'Trucks, trailers, and ground transportation',
    color: 'bg-blue-500'
  },
  { 
    id: 'rail' as TransportMode, 
    label: 'Rail Transport', 
    icon: Train,
    description: 'Railway wagons and freight trains',
    color: 'bg-green-500'
  },
  { 
    id: 'air' as TransportMode, 
    label: 'Air Transport', 
    icon: Plane,
    description: 'Air cargo and freight services',
    color: 'bg-purple-500'
  },
  { 
    id: 'water' as TransportMode, 
    label: 'Water Transport', 
    icon: Ship,
    description: 'Ships, containers, and sea freight',
    color: 'bg-cyan-500'
  },
];

const steps = [
  { id: 1, label: 'Select Transport Mode' },
  { id: 2, label: 'Fill Details' },
  { id: 3, label: 'Review & Submit' },
];

const BuyerDashboard = () => {
  const { setIsBuyerMode } = useBuyer();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedMode, setSelectedMode] = useState<TransportMode>(null);

  const handleExitBuyerMode = () => {
    setIsBuyerMode(false);
  };

  const handleSelectMode = (mode: TransportMode) => {
    setSelectedMode(mode);
  };

  const handleNextStep = () => {
    if (currentStep === 1 && selectedMode) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleBackToSelection = () => {
    setCurrentStep(1);
    setSelectedMode(null);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
            currentStep === step.id 
              ? 'bg-blue-500 text-white' 
              : currentStep > step.id 
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-500'
          }`}>
            {currentStep > step.id ? (
              <Check className="w-4 h-4" />
            ) : (
              <span className="w-5 h-5 flex items-center justify-center text-sm font-medium">
                {step.id}
              </span>
            )}
            <span className="text-sm font-medium">{step.label}</span>
          </div>
          {index < steps.length - 1 && (
            <ChevronRight className="w-5 h-5 text-gray-400 mx-2" />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Select Your Transportation Mode
        </h2>
        <p className="text-gray-500">
          Choose how you want to transport your goods
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {transportOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedMode === option.id;
          return (
            <button
              key={option.id}
              onClick={() => handleSelectMode(option.id)}
              className={`p-6 rounded-2xl border-2 transition-all text-left ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${isSelected ? option.color : 'bg-gray-100'}`}>
                  <Icon className={`w-8 h-8 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold mb-1 ${isSelected ? 'text-blue-600' : 'text-gray-800'}`}>
                    {option.label}
                  </h3>
                  <p className="text-sm text-gray-500">{option.description}</p>
                </div>
                {isSelected && (
                  <div className="p-1 bg-blue-500 rounded-full">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleNextStep}
          disabled={!selectedMode}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold transition-all ${
            selectedMode
              ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-md'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => {
    const selectedOption = transportOptions.find(o => o.id === selectedMode);
    const Icon = selectedOption?.icon || Truck;

    return (
      <div>
        {/* Selected Mode Header */}
        <div className="flex items-center justify-between mb-6 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${selectedOption?.color || 'bg-blue-500'}`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-sm text-gray-500">Selected Mode:</span>
              <h3 className="font-semibold text-gray-800">{selectedOption?.label}</h3>
            </div>
          </div>
          <button
            onClick={handleBackToSelection}
            className="text-sm text-blue-500 hover:text-blue-600 font-medium"
          >
            Change Selection
          </button>
        </div>

        {/* Render the appropriate buyer form */}
        {selectedMode === 'road' && <BuyerPage title="Road Transportation - Buyer" />}
        {selectedMode === 'rail' && <RailBuyerPage />}
        {selectedMode === 'air' && <AirBuyerPage />}
        {selectedMode === 'water' && <WaterBuyerPage />}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Buyer Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-800">Buyer Portal</h1>
                <p className="text-sm text-gray-500">Book your transportation service</p>
              </div>
            </div>
            <button
              onClick={handleExitBuyerMode}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              <span className="text-sm font-medium">Exit Buyer Mode</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Step Content */}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
      </div>
    </div>
  );
};

export default BuyerDashboard;
