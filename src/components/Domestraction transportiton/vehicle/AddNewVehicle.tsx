import { useState } from 'react';
import { Truck, Ship, Plane, Droplet, Plus, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCreateVehicleMutation, useGetVehicleTypesQuery, useGetVehicleModelsQuery } from '@/services/vehicleApi';
import VehicleDetailsForm from './VehicleDetailsForm';
import RailWagonSelection from './RailWagonSelection';
import RailWagonDetailsForm from './RailWagonDetailsForm';
import AirCargoSelection from './AirCargoSelection';
import AirCargoDetailsForm from './AirCargoDetailsForm';
import WaterShipSelection from './WaterShipSelection';
import WaterShipDetailsForm from './WaterShipDetailsForm';

const AddNewVehicle = () => {
  // Get user ID from localStorage (set after login)
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const serviceProviderId = user?.id || user?._id || '';

  // API hooks
  const [createVehicle, { isLoading: isCreating, isSuccess, isError, error }] = useCreateVehicleMutation();

  const [selectedCountry, setSelectedCountry] = useState('India');
  const [selectedTransportMode, setSelectedTransportMode] = useState('Road');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedVehicleModel, setSelectedVehicleModel] = useState('');
  const [showVehicleTypes, setShowVehicleTypes] = useState(true);
  const [showVehicleModels, setShowVehicleModels] = useState(false);
  const [isVehicleTypeConfirmed, setIsVehicleTypeConfirmed] = useState(false);
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [showRailWagonSelection, setShowRailWagonSelection] = useState(false);
  const [selectedRailWagon, setSelectedRailWagon] = useState('');
  const [showRailWagonDetailsForm, setShowRailWagonDetailsForm] = useState(false);
  const [showAirCargoSelection, setShowAirCargoSelection] = useState(false);
  const [selectedAirCargo, setSelectedAirCargo] = useState('');
  const [selectedAirCargoData, setSelectedAirCargoData] = useState<{ id: string; name: string; image: string } | null>(null);
  const [showAirCargoDetailsForm, setShowAirCargoDetailsForm] = useState(false);
  const [showWaterShipSelection, setShowWaterShipSelection] = useState(false);
  const [selectedWaterShip, setSelectedWaterShip] = useState('');
  const [selectedWaterShipData, setSelectedWaterShipData] = useState<{ id: string; name: string; image: string } | null>(null);
  const [showWaterShipDetailsForm, setShowWaterShipDetailsForm] = useState(false);
  const [selectedVehicleData, setSelectedVehicleData] = useState<{ id: string; name: string; image: string } | null>(null);
  const [selectedVehicleModelData, setSelectedVehicleModelData] = useState<{ id: string; name: string; image: string } | null>(null);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const transportModes = [
    { id: 'road', label: 'Road', icon: Truck },
    { id: 'rail', label: 'Rail', icon: Truck },
    { id: 'air', label: 'Air', icon: Plane },
    { id: 'water', label: 'Water', icon: Ship },
  ];

  const vehicleTypes = [
    { id: 'tautliner', name: 'Tautliner ( Curtainsider )', image: '/images/1.png' },
    { id: 'refrigerated', name: 'Refrigerated Truck', image: '/images/2.png' },
    { id: 'isotherm', name: 'Isotherm Truck', image: '/images/3.png' },
    { id: 'mega-trailer', name: 'Mega-trailer', image: '/images/4.png' },
    { id: 'jumbo', name: 'Jumbo', image: '/images/5.png' },
    { id: 'custom', name: 'Custom Truck', image: '/images/6.png' },
  ];

  const vehicleModels = [
    { id: 'tata-ace', name: 'TATA ACE', image: '/svg/t1.svg' },
    { id: 'ashok-leyland', name: 'ASHOK LEYLAND DOST', image: '/svg/t2.svg' },
    { id: 'mahindra-bolero', name: 'MAHINDRA BOLERO PICKUP', image: '/svg/t3.svg' },
    { id: 'tata-407', name: 'TATA 407', image: '/svg/t4.svg' },
    { id: 'eicher-14', name: 'EICHER 14 FEET', image: '/svg/t5.svg' },
    { id: 'eicher-19', name: 'EICHER 19 FEET', image: '/svg/t6.svg' },
    { id: 'eicher-17', name: 'EICHER 17 FEET', image: '/svg/t7.svg' },
    { id: 'tata-22', name: 'TATA 22 FEET', image: '/svg/t8.svg' },
    { id: 'tata-truck', name: 'TATA TRUCK (6 TYRE)', image: '/svg/t9.svg' },
    { id: 'taurus-25t', name: 'TAURUS 25T (14 TYRES)', image: '/svg/t10.svg' },
    { id: 'container-20', name: 'CONTAINER 20 FT', image: '/svg/t11.svg' },
    { id: 'container-32', name: 'CONTAINER 32 FT SXL', image: '/svg/t7.svg' },
    { id: '20-feet-open', name: '20 FEET OPEN ALL SIDE(ODC)', image: '/svg/t12.svg' },
    { id: '2832-feet', name: '2832 FEET OPEN TRAILOR ODC', image: '/svg/t13.svg' },
    { id: '32-feet-open', name: '32 FEET OPEN TRAILOR ODC', image: '/svg/t15.svg' },
    { id: 'taurus-21t', name: 'TAURUS 21 T (12 TYRE )', image: '/svg/t16.svg' },
  ];

  const handleSelectVehicle = () => {
    if (selectedVehicle && !isVehicleTypeConfirmed) {
      console.log('Selected vehicle:', selectedVehicle);
      setIsVehicleTypeConfirmed(true);
      setShowVehicleTypes(false);
      setShowVehicleModels(true);
    } else if (selectedVehicleModel && isVehicleTypeConfirmed) {
      // Show the details form when vehicle model is selected
      setShowDetailsForm(true);
    }
  };

  const handleCancel = () => {
    setSelectedVehicle('');
    setSelectedVehicleModel('');
    setIsVehicleTypeConfirmed(false);
    setShowVehicleTypes(true);
    setShowVehicleModels(false);
    setShowDetailsForm(false);
    setShowRailWagonSelection(false);
    setSelectedRailWagon('');
    setShowRailWagonDetailsForm(false);
    setShowAirCargoSelection(false);
    setSelectedAirCargo('');
    setShowAirCargoDetailsForm(false);
    setShowWaterShipSelection(false);
    setSelectedWaterShip('');
    setShowWaterShipDetailsForm(false);
  };

  const handleDetailsFormCancel = () => {
    setShowDetailsForm(false);
  };

  const handleDetailsFormSubmit = async (data: any) => {
    console.log('Vehicle details submitted:', data);
    
    if (!serviceProviderId) {
      setSubmitMessage({ type: 'error', text: 'Please login to add vehicles' });
      return;
    }

    try {
      // Backend expects capitalized transportation modes: 'Road', 'Rail', 'Air', 'Water'
      const transportModeMap: Record<string, 'Road' | 'Rail' | 'Air' | 'Water'> = {
        'Road': 'Road',
        'Rail': 'Rail',
        'Air': 'Air',
        'Water': 'Water',
      };

      // Parse dimensions from form data
      const length = parseFloat(data.dimensions?.length) || 13600;
      const width = parseFloat(data.dimensions?.width) || 2500;
      const height = parseFloat(data.dimensions?.height) || 2650;
      const maxWeight = parseFloat(data.dimensions?.maxWeight) || 2650;

      // Parse pricing data from form
      const loadingTime = parseFloat(data.loadingTime?.time) || 30;
      const afterFreeTimePrice = parseFloat(data.afterFreeTime?.price) || 100;
      const minDistance = parseFloat(data.minDistance) || 0;
      const perDayAverage = parseFloat(data.perDayAverage) || 80;

      // Prepare vehicle data matching backend schema
      const vehicleData = {
        serviceProviderId,
        transportationMode: transportModeMap[selectedTransportMode] || 'Road',
        vehicleType: selectedVehicleData?.name || data.vehicleType || 'Custom Truck',
        vehicleModel: selectedVehicleModelData?.name || data.vehicleModel || 'Custom Model',
        
        // Specifications with value/unit structure
        specifications: {
          length: {
            value: length,
            unit: 'Ft'
          },
          width: {
            value: width,
            unit: 'Ft'
          },
          height: {
            value: height,
            unit: 'Ft'
          },
          maxWeight: {
            value: maxWeight,
            unit: 'Ft'
          }
        },
        
        // Vehicle identification
        vehicleImage: data.vehicleImage || selectedVehicleModelData?.image || selectedVehicleData?.image || '/svg/t1.svg',
        vehicleNumber: data.vehicleNumber,
        
        // Pricing with all required fields
        pricing: {
          loadingUnloadingFreeTime: {
            time: loadingTime,
            unit: 'Hour'
          },
          afterFreeTime: {
            price: afterFreeTimePrice,
            unit: 'Hour'
          },
          minimumDistance: {
            value: minDistance || 10,
            unit: 'Km'  // Backend enum: ['Km', 'Mile'] - must be capitalized
          },
          rateType: 'Per Km',
          baseRate: perDayAverage || 50
        },
        
        // Status
        availability: 'Available' as const,
        status: 'pending' as const
      };

      console.log('Sending vehicle data to API:', vehicleData);

      const result = await createVehicle(vehicleData).unwrap();
      
      console.log('✅ Vehicle created successfully:', result);
      setSubmitMessage({ type: 'success', text: 'Vehicle added successfully!' });
      
      // Reset form after 2 seconds
      setTimeout(() => {
        handleCancel();
        setSubmitMessage(null);
      }, 2000);
      
    } catch (err: any) {
      console.error('❌ Failed to create vehicle:', err);
      setSubmitMessage({ 
        type: 'error', 
        text: err?.data?.message || err?.data?.error || 'Failed to add vehicle. Please try again.' 
      });
      
      // Auto-hide error after 5 seconds
      setTimeout(() => {
        setSubmitMessage(null);
      }, 5000);
    }
  };

  const handleRailWagonCancel = () => {
    setShowRailWagonSelection(false);
    setSelectedRailWagon('');
  };

  const handleRailWagonSelect = (wagonType: string) => {
    setSelectedRailWagon(wagonType);
    console.log('Selected rail wagon:', wagonType);
    // Show the rail wagon details form
    setShowRailWagonSelection(false);
    setShowRailWagonDetailsForm(true);
  };

  const handleRailWagonDetailsCancel = () => {
    setShowRailWagonDetailsForm(false);
    setShowRailWagonSelection(true);
  };

  const handleRailWagonDetailsSubmit = (data: any) => {
    console.log('Rail wagon details submitted:', data);
    // Handle form submission here
    // You can add API call or other logic
  };

  const handleAirCargoCancel = () => {
    setShowAirCargoSelection(false);
    setSelectedAirCargo('');
  };

  const handleAirCargoSelect = (cargoType: string, cargoData: { id: string; name: string; image: string }) => {
    setSelectedAirCargo(cargoType);
    setSelectedAirCargoData(cargoData);
    console.log('Selected air cargo:', cargoType, cargoData);
    // Show the air cargo details form
    setShowAirCargoSelection(false);
    setShowAirCargoDetailsForm(true);
  };

  const handleAirCargoDetailsCancel = () => {
    setShowAirCargoDetailsForm(false);
    setShowAirCargoSelection(true);
  };

  const handleAirCargoDetailsSubmit = (data: any) => {
    console.log('Air cargo details submitted:', data);
    // Handle form submission here
    // You can add API call or other logic
  };

  const handleWaterShipCancel = () => {
    setShowWaterShipSelection(false);
    setSelectedWaterShip('');
  };

  const handleWaterShipSelect = (shipType: string, shipData: { id: string; name: string; image: string }) => {
    setSelectedWaterShip(shipType);
    setSelectedWaterShipData(shipData);
    console.log('Selected water ship:', shipType, shipData);
    // Show the water ship details form
    setShowWaterShipSelection(false);
    setShowWaterShipDetailsForm(true);
  };

  const handleWaterShipDetailsCancel = () => {
    setShowWaterShipDetailsForm(false);
    setShowWaterShipSelection(true);
  };

  const handleWaterShipDetailsSubmit = (data: any) => {
    console.log('Water ship details submitted:', data);
    // Handle form submission here
    // You can add API call or other logic
  };

  const handleTransportModeChange = (mode: string) => {
    setSelectedTransportMode(mode);
    // Reset all selections when changing transport mode
    setSelectedVehicle('');
    setSelectedVehicleModel('');
    setIsVehicleTypeConfirmed(false);
    setShowDetailsForm(false);
    setSelectedRailWagon('');
    setShowRailWagonDetailsForm(false);
    setSelectedAirCargo('');
    setShowAirCargoDetailsForm(false);
    setSelectedWaterShip('');
    setShowWaterShipDetailsForm(false);
    
    // Show appropriate selection based on transport mode
    if (mode === 'Rail') {
      setShowRailWagonSelection(true);
      setShowAirCargoSelection(false);
      setShowWaterShipSelection(false);
      setShowVehicleTypes(false);
      setShowVehicleModels(false);
    } else if (mode === 'Air') {
      setShowAirCargoSelection(true);
      setShowRailWagonSelection(false);
      setShowWaterShipSelection(false);
      setShowVehicleTypes(false);
      setShowVehicleModels(false);
    } else if (mode === 'Water') {
      setShowWaterShipSelection(true);
      setShowRailWagonSelection(false);
      setShowAirCargoSelection(false);
      setShowVehicleTypes(false);
      setShowVehicleModels(false);
    } else {
      setShowRailWagonSelection(false);
      setShowAirCargoSelection(false);
      setShowWaterShipSelection(false);
      setShowVehicleTypes(true);
      setShowVehicleModels(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6">
      {/* Success/Error Message */}
      {submitMessage && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
          submitMessage.type === 'success' 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          {submitMessage.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600" />
          )}
          <span className={`text-sm font-medium ${
            submitMessage.type === 'success' ? 'text-green-700' : 'text-red-700'
          }`}>
            {submitMessage.text}
          </span>
        </div>
      )}

      {/* Country Selector */}
      <div className="mb-6">
        <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg w-fit cursor-pointer hover:bg-gray-50">
          <span className="text-2xl">🇮🇳</span>
          <span className="text-sm font-medium text-gray-700">{selectedCountry}</span>
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Transport Mode Tabs */}
      <div className="flex gap-3 mb-6">
        {transportModes.map((mode) => {
          const Icon = mode.icon;
          return (
            <button
              key={mode.id}
              onClick={() => handleTransportModeChange(mode.label)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                selectedTransportMode === mode.label
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{mode.label}</span>
            </button>
          );
        })}
      </div>

      {/* Vehicle Type Grid */}
      {showVehicleTypes && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {vehicleTypes.map((vehicle) => (
            <button
              key={vehicle.id}
              onClick={() => {
                setSelectedVehicle(vehicle.id);
                setSelectedVehicleData(vehicle);
              }}
              className={`p-4 border-2 rounded-lg transition-all hover:shadow-md ${
                selectedVehicle === vehicle.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                {/* Vehicle Image */}
                <div className={`w-full h-24 rounded-lg flex items-center justify-center p-2 ${
                  selectedVehicle === vehicle.id ? 'bg-blue-50' : 'bg-white'
                }`}>
                  <img 
                    src={vehicle.image} 
                    alt={vehicle.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 text-center">
                  {vehicle.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Vehicle Models Grid or Details Form */}
      {showVehicleModels && !showDetailsForm && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {vehicleModels.map((model) => (
            <button
              key={model.id}
              onClick={() => {
                setSelectedVehicleModel(model.id);
                setSelectedVehicleModelData(model);
              }}
              className={`p-3 border rounded-lg transition-all hover:shadow-md flex items-center gap-3 ${
                selectedVehicleModel === model.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="w-12 h-12 flex-shrink-0">
                <img 
                  src={model.image} 
                  alt={model.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xs font-medium text-gray-700 text-left">
                {model.name}
              </span>
            </button>
          ))}
          {/* Custom Vehicle Model Button */}
          <button
            className="p-3 border border-gray-200 rounded-lg hover:shadow-md flex items-center justify-center gap-2 bg-white hover:border-blue-300"
          >
            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-medium text-gray-700">CUSTOM VEHICLE MODEL</span>
          </button>
        </div>
      )}

      {/* Rail Wagon Selection */}
      {showRailWagonSelection && (
        <RailWagonSelection
          onCancel={handleRailWagonCancel}
          onSelect={handleRailWagonSelect}
        />
      )}

      {/* Rail Wagon Details Form */}
      {showRailWagonDetailsForm && (
        <RailWagonDetailsForm
          wagonType={selectedRailWagon}
          onCancel={handleRailWagonDetailsCancel}
          onSubmit={handleRailWagonDetailsSubmit}
        />
      )}

      {/* Air Cargo Selection */}
      {showAirCargoSelection && (
        <AirCargoSelection
          onCancel={handleAirCargoCancel}
          onSelect={handleAirCargoSelect}
        />
      )}

      {/* Air Cargo Details Form */}
      {showAirCargoDetailsForm && (
        <AirCargoDetailsForm
          cargoType={selectedAirCargo}
          cargoImage={selectedAirCargoData?.image}
          cargoName={selectedAirCargoData?.name}
          onCancel={handleAirCargoDetailsCancel}
          onSubmit={handleAirCargoDetailsSubmit}
        />
      )}

      {/* Water Ship Selection */}
      {showWaterShipSelection && (
        <WaterShipSelection
          onCancel={handleWaterShipCancel}
          onSelect={handleWaterShipSelect}
        />
      )}

      {/* Water Ship Details Form */}
      {showWaterShipDetailsForm && (
        <WaterShipDetailsForm
          shipType={selectedWaterShip}
          shipImage={selectedWaterShipData?.image}
          shipName={selectedWaterShipData?.name}
          onCancel={handleWaterShipDetailsCancel}
          onSubmit={handleWaterShipDetailsSubmit}
        />
      )}

      {/* Vehicle Details Form */}
      {showDetailsForm && (
        <VehicleDetailsForm
          vehicleType={selectedVehicle}
          vehicleModel={selectedVehicleModel}
          vehicleImage={selectedVehicleModelData?.image || selectedVehicleData?.image}
          vehicleName={selectedVehicleModelData?.name || selectedVehicleData?.name}
          onCancel={handleDetailsFormCancel}
          onSubmit={handleDetailsFormSubmit}
          isLoading={isCreating}
        />
      )}

      {/* Action Buttons - Only show when not in details form and not showing any special selection */}
      {!showDetailsForm && !showRailWagonSelection && !showRailWagonDetailsForm && !showAirCargoSelection && !showAirCargoDetailsForm && !showWaterShipSelection && !showWaterShipDetailsForm && (
        <div className="flex justify-center gap-3">
          <button 
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSelectVehicle}
            disabled={!selectedVehicle && !selectedVehicleModel}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
              (!selectedVehicle && !selectedVehicleModel)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Select
          </button>
        </div>
      )}
    </div>
  );
};

export default AddNewVehicle;
