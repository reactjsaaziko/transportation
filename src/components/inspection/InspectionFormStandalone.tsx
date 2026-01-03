import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import DomesticTransportationForm from '../profile/DomesticTransportationForm';
import CHAProfileForm from '../profile/CHAProfileForm';
import WarehouseProfileForm from '../profile/WarehouseProfileForm';
import FreightForwardingForm from '../profile/FreightForwardingForm';
import InspectionForm from '../profile/InspectionForm';

const serviceTabs = [
  'Domestic Transportation',
  'CHA',
  'Warehouse',
  'Freight Forwarding',
  'Inspection',
  'Insurance',
];

const InspectionFormStandalone = () => {
  const [activeTab, setActiveTab] = useState<string>('Domestic Transportation');
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Domestic Transportation':
        return <DomesticTransportationForm />;
      case 'CHA':
        return <CHAProfileForm />;
      case 'Warehouse':
        return <WarehouseProfileForm />;
      case 'Freight Forwarding':
        return <FreightForwardingForm />;
      case 'Inspection':
        return <InspectionForm />;
      case 'Insurance':
        return (
          <div className="bg-white rounded-xl border border-gray-200 p-12 flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Coming Soon</h2>
            <p className="text-gray-500 text-center max-w-md">
              We're working hard to bring you the Insurance service interest form. Stay tuned for updates!
            </p>
          </div>
        );
      default:
        return (
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-500">
            Select a service to show interest
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="w-full px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <img src="/images/logo.png" alt="Aaziko Logo" className="h-8 w-auto" />
          </div>
          <h1 className="text-lg font-semibold text-gray-800">Show Interest Form</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2 flex-wrap">
          {serviceTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100 bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="w-full py-6 px-6 bg-white">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{activeTab} Service Interest</h2>
          <p className="text-gray-500 mt-1">Fill out the form below to express your interest in {activeTab} services</p>
        </div>

        {renderContent()}

        {/* Copyright */}
        <p className="text-center text-gray-400 text-sm mt-8">© 2026 Aaziko. All rights reserved.</p>
      </div>
    </div>
  );
};

export default InspectionFormStandalone;
