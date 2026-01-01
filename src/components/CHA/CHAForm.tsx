import { useState } from 'react';
import { Search, Plus, Trash2, Copy, Loader2, AlertCircle, RefreshCw, CheckCircle, ChevronDown } from 'lucide-react';
import {
  useGetCHAServicePricingsByServiceProviderQuery,
  useCreateCHAServicePricingMutation,
  useDeleteCHAServicePricingMutation,
  useGetAvailablePortsQuery,
  type CHAServicePricing,
} from '@/services/chaServicePricingApi';

const CHAForm = () => {
  // Get user ID from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const serviceProviderId = user?.id || user?._id || '';

  const [formData, setFormData] = useState({
    port: '',
    cargo: 'Normal Container Cargo',
    container: 'LCL',
    price: '',
  });
  const [portSearch, setPortSearch] = useState('');
  const [showPortDropdown, setShowPortDropdown] = useState(false);
  const [showCargoDropdown, setShowCargoDropdown] = useState(false);
  const [showContainerDropdown, setShowContainerDropdown] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Local entries to be saved (not yet in database)
  const [pendingEntries, setPendingEntries] = useState<Array<{
    id: string;
    port: string;
    cargo: string;
    container: string;
    price: string;
  }>>([]);

  // Fetch pricing data from API
  const { data: pricingsResponse, isLoading, isError, error, refetch } = useGetCHAServicePricingsByServiceProviderQuery(
    serviceProviderId,
    {
      skip: !serviceProviderId,
      refetchOnMountOrArgChange: true,
    }
  );

  // Create and delete mutations
  const [createPricing, { isLoading: isCreating }] = useCreateCHAServicePricingMutation();
  const [deletePricing] = useDeleteCHAServicePricingMutation();

  // Fetch ALL ports from API once (no search param - load all 4399 ports)
  const { data: portsResponse, isLoading: isLoadingPorts } = useGetAvailablePortsQuery({});
  
  const entries = pricingsResponse?.data || [];

  // Use API ports if available, fallback to default list
  const ports = portsResponse?.data && portsResponse.data.length > 0 
    ? portsResponse.data 
    : [{ name: 'ALIBAG', country: 'India', code: 'IN' }, { name: 'MUMBAI', country: 'India', code: 'IN' }];
  const cargoTypes = [
    'Normal Container Cargo',
    'Liquid Bulk',
    'Paracable Cargo',
    'Hazardous Materials',
    'Other',
  ];
  const containerTypes = [
    'LCL',
    '20\' Standard',
    '40\' Standard',
    '40\' High Cube',
    '20\' Refrigerated',
    '40\' Refrigerated',
    '45\' High Cube',
    'Air Cargo',
    'Cross Border Road',
    'Cross Border Rail',
  ];

  const filteredPorts = ports.filter((port) =>
    port.name.toLowerCase().includes(portSearch.toLowerCase())
  );

  // Add entry to pending list (not saved yet)
  const handleAddEntry = () => {
    if (!formData.port || !formData.price) {
      setSubmitMessage({ type: 'error', text: 'Please fill in port and price' });
      setTimeout(() => setSubmitMessage(null), 3000);
      return;
    }

    // Check for duplicate in pending entries
    const duplicate = pendingEntries.find(
      entry => entry.port === formData.port && 
               entry.cargo === formData.cargo && 
               entry.container === formData.container
    );

    if (duplicate) {
      setSubmitMessage({ type: 'error', text: 'This combination already exists in the list' });
      setTimeout(() => setSubmitMessage(null), 3000);
      return;
    }

    // Add to pending list
    const newEntry = {
      id: Date.now().toString(),
      port: formData.port,
      cargo: formData.cargo,
      container: formData.container,
      price: formData.price,
    };

    setPendingEntries([...pendingEntries, newEntry]);
    
    // Reset form
    setFormData({
      port: '',
      cargo: 'Normal Container Cargo',
      container: 'LCL',
      price: '',
    });
    setPortSearch('');
  };

  // Remove entry from pending list
  const handleRemovePendingEntry = (id: string) => {
    setPendingEntries(pendingEntries.filter(entry => entry.id !== id));
  };

  // Save current form data or all pending entries to database
  const handleSaveAll = async () => {
    if (!serviceProviderId) {
      setSubmitMessage({ type: 'error', text: 'Please login to save pricing' });
      return;
    }

    // If pending entries exist, save them
    if (pendingEntries.length > 0) {
      let successCount = 0;
      let errorCount = 0;

      for (const entry of pendingEntries) {
        try {
          await createPricing({
            serviceProviderId,
            port: entry.port,
            cargoType: entry.cargo,
            containerType: entry.container,
            price: parseFloat(entry.price),
            currency: 'INR',
          }).unwrap();
          successCount++;
        } catch (err: any) {
          console.error('Failed to create pricing:', err);
          errorCount++;
        }
      }

      if (successCount > 0) {
        setSubmitMessage({ 
          type: 'success', 
          text: `${successCount} pricing entr${successCount > 1 ? 'ies' : 'y'} saved successfully!` 
        });
        setPendingEntries([]); // Clear pending list
        
        // Also clear form
        setFormData({
          port: '',
          cargo: 'Normal Container Cargo',
          container: 'LCL',
          price: '',
        });
        
        setTimeout(() => setSubmitMessage(null), 3000);
      }

      if (errorCount > 0) {
        setSubmitMessage({ 
          type: 'error', 
          text: `Failed to save ${errorCount} entr${errorCount > 1 ? 'ies' : 'y'}` 
        });
        setTimeout(() => setSubmitMessage(null), 5000);
      }
    } 
    // Otherwise save current form
    else if (isFormComplete) {
      try {
        await createPricing({
          serviceProviderId,
          port: formData.port,
          cargoType: formData.cargo,
          containerType: formData.container,
          price: parseFloat(formData.price),
          currency: 'INR',
        }).unwrap();

        setSubmitMessage({ type: 'success', text: 'Pricing saved successfully!' });
        
        // Clear form
        setFormData({
          port: '',
          cargo: 'Normal Container Cargo',
          container: 'LCL',
          price: '',
        });
        setPortSearch('');

        setTimeout(() => setSubmitMessage(null), 3000);
      } catch (err: any) {
        console.error('Failed to create pricing:', err);
        setSubmitMessage({
          type: 'error',
          text: err?.data?.message || 'Failed to save pricing'
        });
        setTimeout(() => setSubmitMessage(null), 5000);
      }
    }
  };

  const handleDeleteEntry = async (id: string) => {
    if (confirm('Are you sure you want to delete this pricing entry?')) {
      try {
        await deletePricing(id).unwrap();
        setSubmitMessage({ type: 'success', text: 'Pricing deleted successfully!' });
        setTimeout(() => setSubmitMessage(null), 3000);
      } catch (err: any) {
        setSubmitMessage({ type: 'error', text: 'Failed to delete pricing' });
        setTimeout(() => setSubmitMessage(null), 3000);
      }
    }
  };

  // Check if form is complete for enabling Save button
  const isFormComplete = formData.port && formData.cargo && formData.container && formData.price;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Form Section with Dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Port Dropdown */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">Port</label>
          <button
            type="button"
            onClick={() => {
              setShowPortDropdown(!showPortDropdown);
              setShowCargoDropdown(false);
              setShowContainerDropdown(false);
            }}
            className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
          >
            <span className={formData.port ? 'text-gray-900' : 'text-gray-400'}>
              {formData.port || 'Select Port'}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
          {showPortDropdown && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
              <div className="p-2 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="City, Port, Country"
                    value={portSearch}
                    onChange={(e) => setPortSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {isLoadingPorts ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                    <span className="ml-2 text-sm text-gray-500">Loading ports...</span>
                  </div>
                ) : filteredPorts.length === 0 ? (
                  <div className="py-8 text-center text-sm text-gray-400">
                    No ports found
                  </div>
                ) : (
                  filteredPorts.map((port: { name: string; country: string; code: string }) => (
                    <label
                      key={`${port.name}-${port.code}`}
                      className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="port"
                        value={port.name}
                        checked={formData.port === port.name}
                        onChange={(e) => {
                          setFormData({ ...formData, port: e.target.value });
                          setShowPortDropdown(false);
                          setPortSearch('');
                        }}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{port.name}</span>
                      <span className="ml-auto text-xs text-gray-400">{port.country}</span>
                    </label>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Cargo Dropdown */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">Cargo</label>
          <button
            type="button"
            onClick={() => {
              setShowCargoDropdown(!showCargoDropdown);
              setShowPortDropdown(false);
              setShowContainerDropdown(false);
            }}
            className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
          >
            <span className={formData.cargo ? 'text-gray-900' : 'text-gray-400'}>
              {formData.cargo || 'Select Cargo'}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
          {showCargoDropdown && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
              {cargoTypes.map((type) => (
                <label
                  key={type}
                  className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="cargo"
                    value={type}
                    checked={formData.cargo === type}
                    onChange={(e) => {
                      setFormData({ ...formData, cargo: e.target.value });
                      setShowCargoDropdown(false);
                    }}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{type}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Container Dropdown */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">Container</label>
          <button
            type="button"
            onClick={() => {
              setShowContainerDropdown(!showContainerDropdown);
              setShowPortDropdown(false);
              setShowCargoDropdown(false);
            }}
            className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
          >
            <span className={formData.container ? 'text-gray-900' : 'text-gray-400'}>
              {formData.container || 'Select Container'}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
          {showContainerDropdown && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
              {containerTypes.map((type) => (
                <label
                  key={type}
                  className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="container"
                    value={type}
                    checked={formData.container === type}
                    onChange={(e) => {
                      setFormData({ ...formData, container: e.target.value });
                      setShowContainerDropdown(false);
                    }}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{type}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price and Actions */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-gray-700 mb-2">Price/SB</label>
          <div className="flex gap-2 flex-1 items-end">
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="Enter price"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddEntry}
              disabled={!isFormComplete}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              title="Add to list"
            >
              <Plus className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={handleSaveAll}
              disabled={isCreating || !isFormComplete}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              {isCreating ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      {/* Success/Error Message */}
      {submitMessage && (
        <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
          submitMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {submitMessage.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span>{submitMessage.text}</span>
        </div>
      )}

      {/* Pending Entries Section */}
      {pendingEntries.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">
              Pending Entries ({pendingEntries.length}) - Click "Save" button above to save all
            </h3>
          </div>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Port</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cargo</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Container</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700">{entry.port}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{entry.cargo}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{entry.container}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">₹{entry.price}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleRemovePendingEntry(entry.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-3 text-gray-600">Loading pricing data...</span>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="flex flex-col items-center justify-center py-20">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <p className="text-gray-600 mb-4">Failed to load pricing data</p>
          <button
            onClick={() => refetch()}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white font-medium hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Saved Entries Table Section */}
      {!isLoading && !isError && (
        <div className="overflow-x-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700">
              Saved Entries ({entries.length})
            </h3>
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>

          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Port</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Cargo</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Container</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Price/SB</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-gray-400">
                    <div className="flex flex-col items-center">
                      <p className="text-lg mb-2">No pricing entries found</p>
                      <p className="text-sm">Add a pricing entry to get started</p>
                    </div>
                  </td>
                </tr>
              ) : (
                entries.map((entry: CHAServicePricing) => (
                  <tr key={entry._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700">{entry.port}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{entry.cargoType}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{entry.containerType}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">₹{entry.price}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded">
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEntry(entry._id)}
                          className="p-1 text-gray-700 hover:bg-gray-100 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CHAForm;
