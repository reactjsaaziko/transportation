import { useState } from 'react';
import { useNavigate } from 'react-router';

type CoverType = 'single' | 'annual';
type ShipmentType = 'inland' | 'export' | 'import';
type TransportMode = 'road' | 'air' | 'rail' | 'courier' | 'sea';

const InsuranceSelection = () => {
  const navigate = useNavigate();
  const [coverType, setCoverType] = useState<CoverType>('single');
  const [shipmentType, setShipmentType] = useState<ShipmentType>('inland');
  const [transportMode, setTransportMode] = useState<TransportMode>('road');
  const [invoiceValue, setInvoiceValue] = useState('');
  const [invoiceCurrency, setInvoiceCurrency] = useState('USD');
  const [invoiceFrom, setInvoiceFrom] = useState('');
  const [invoiceTo, setInvoiceTo] = useState('');

  const handleContinue = () => {
    navigate('/dashboard/quote-comparison');
  };

  return (
    <div className="pb-12">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl border border-gray-200 bg-white shadow-sm p-8">
          {/* Cover Type Selection */}
          <div className="mb-8">
            <h3 className="text-base font-medium text-gray-800 mb-4">
              What type of cover do you want?
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setCoverType('single')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  coverType === 'single'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base font-semibold text-gray-800">Single transit</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    coverType === 'single' ? 'border-blue-500' : 'border-gray-300'
                  }`}>
                    {coverType === 'single' && (
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Covers your single shipment from one location to another.
                </p>
              </button>

              <button
                onClick={() => setCoverType('annual')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  coverType === 'annual'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base font-semibold text-gray-800">Annual open</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    coverType === 'annual' ? 'border-blue-500' : 'border-gray-300'
                  }`}>
                    {coverType === 'annual' && (
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Covers your shipments throughout the year.
                </p>
              </button>
            </div>
          </div>

          {/* Shipment Type */}
          <div className="mb-8">
            <h3 className="text-base font-medium text-gray-800 mb-4">
              Where will your goods be shipped?
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => setShipmentType('inland')}
                className={`px-6 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                  shipmentType === 'inland'
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                Inland (Domestic)
              </button>
              <button
                onClick={() => setShipmentType('export')}
                className={`px-6 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                  shipmentType === 'export'
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                Export
              </button>
              <button
                onClick={() => setShipmentType('import')}
                className={`px-6 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                  shipmentType === 'import'
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                Import
              </button>
            </div>
          </div>

          {/* Transport Mode */}
          <div className="mb-8">
            <h3 className="text-base font-medium text-gray-800 mb-4">
              How will your goods be making their journey?
            </h3>
            <div className="grid grid-cols-5 gap-3">
              <button
                onClick={() => setTransportMode('road')}
                className={`p-3 rounded-xl border-2 text-center transition-all ${
                  transportMode === 'road'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl">🚚</span>
                  <span className="text-sm font-medium text-gray-700">Road</span>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    transportMode === 'road' ? 'border-blue-500' : 'border-gray-300'
                  }`}>
                    {transportMode === 'road' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    )}
                  </div>
                </div>
              </button>

              <button
                onClick={() => setTransportMode('air')}
                className={`p-3 rounded-xl border-2 text-center transition-all ${
                  transportMode === 'air'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl">✈️</span>
                  <span className="text-sm font-medium text-gray-700">Air</span>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    transportMode === 'air' ? 'border-blue-500' : 'border-gray-300'
                  }`}>
                    {transportMode === 'air' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    )}
                  </div>
                </div>
              </button>

              <button
                onClick={() => setTransportMode('rail')}
                className={`p-3 rounded-xl border-2 text-center transition-all ${
                  transportMode === 'rail'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl">🚂</span>
                  <span className="text-sm font-medium text-gray-700">Rail</span>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    transportMode === 'rail' ? 'border-blue-500' : 'border-gray-300'
                  }`}>
                    {transportMode === 'rail' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    )}
                  </div>
                </div>
              </button>

              <button
                onClick={() => setTransportMode('courier')}
                className={`p-3 rounded-xl border-2 text-center transition-all ${
                  transportMode === 'courier'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl">📦</span>
                  <span className="text-sm font-medium text-gray-700">Courier</span>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    transportMode === 'courier' ? 'border-blue-500' : 'border-gray-300'
                  }`}>
                    {transportMode === 'courier' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    )}
                  </div>
                </div>
              </button>

              <button
                onClick={() => setTransportMode('sea')}
                className={`p-3 rounded-xl border-2 text-center transition-all ${
                  transportMode === 'sea'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl">🚢</span>
                  <span className="text-sm font-medium text-gray-700">Sea</span>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    transportMode === 'sea' ? 'border-blue-500' : 'border-gray-300'
                  }`}>
                    {transportMode === 'sea' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    )}
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Invoice Value */}
          <div className="mb-8">
            <h3 className="text-base font-medium text-gray-800 mb-4">Invoice value</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <select
                    value={invoiceCurrency}
                    onChange={(e) => setInvoiceCurrency(e.target.value)}
                    className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
                  >
                    <option>USD</option>
                    <option>EUR</option>
                    <option>GBP</option>
                    <option>INR</option>
                  </select>
                  <input
                    type="text"
                    value={invoiceValue}
                    onChange={(e) => setInvoiceValue(e.target.value)}
                    placeholder="Invoice Value"
                    className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">1 USD =</span>
                <input
                  type="text"
                  placeholder="INR"
                  className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
                />
                <select className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none">
                  <option>FOB</option>
                  <option>CIF</option>
                  <option>CFR</option>
                </select>
              </div>
            </div>
          </div>

          {/* Invoice Value Range */}
          <div className="mb-8">
            <h3 className="text-base font-medium text-gray-800 mb-4">Invoice value</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={invoiceFrom}
                onChange={(e) => setInvoiceFrom(e.target.value)}
                placeholder="From"
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
              />
              <input
                type="text"
                value={invoiceTo}
                onChange={(e) => setInvoiceTo(e.target.value)}
                placeholder="To"
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Continue Button */}
          <div className="flex justify-center">
            <button
              onClick={handleContinue}
              className="rounded-lg bg-blue-500 px-8 py-2.5 text-sm font-semibold text-white hover:bg-blue-600"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceSelection;
