import { useState } from 'react';
import { Plus, Save } from 'lucide-react';
import { useGetAvailablePortsQuery } from '../../services/chaServicePricingApi';
import { 
  useCreateFreightPricingMutation,
  useUpdateFreightPricingMutation,
  useGetFreightPricingsByServiceProviderQuery 
} from '../../services/freightApi';

const cargoTypes = ['Normal Container Cargo', 'Liquid Cargo', 'Bulk Cargo', 'Hazardous Materials', 'Refrigerated Cargo'];
const containerOptions = ['LCL', '20\' Standard', '40\' Standard', '40\' High Cube', '20\' Refrigerated', '40\' Refrigerated', '45\' High Cube', 'Air'];
const transitTimes = ['15 Days', '20 Days', '25 Days', '30 Days', '45 Days', '60 Days'];

const FreightServiceForm = () => {
  // Get service provider ID from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const serviceProviderId = user?.id || user?._id || '';

  // Form state
  const [formData, setFormData] = useState({
    originPort: '',
    destinationPort: '',
    cargoType: 'Normal Container Cargo',
    containerType: 'LCL',
    transitTime: '25 Days',
    freightRate: '',
    localRates: {
      handlingFees: '',
      sealCharges: '',
      mlo: '',
      blFees: '',
      awh: '',
      cancellation: '',
      other: ''
    }
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [portSearch, setPortSearch] = useState('');

  // Fetch ports
  const { data: portsResponse } = useGetAvailablePortsQuery({ search: '' }, {
    skip: false,
  });

  const ports = portsResponse?.data || [];
  const filteredPorts = ports.filter((port: any) =>
    port.name.toLowerCase().includes(portSearch.toLowerCase())
  );

  // Fetch existing pricing
  const { data: pricingsData, refetch } = useGetFreightPricingsByServiceProviderQuery(serviceProviderId, {
    skip: !serviceProviderId,
  });

  const pricings = pricingsData?.data || [];

  // Create and update pricing mutations
  const [createPricing, { isLoading: isSaving }] = useCreateFreightPricingMutation();
  const [updatePricing, { isLoading: isUpdating }] = useUpdateFreightPricingMutation();

  const handleEdit = (pricing: any) => {
    setFormData({
      originPort: pricing.originPort,
      destinationPort: pricing.destinationPort,
      cargoType: pricing.cargoType,
      containerType: pricing.containerType,
      transitTime: pricing.transitTime,
      freightRate: pricing.freightRate.toString(),
      localRates: {
        handlingFees: pricing.localRates?.handlingFees?.toString() || '',
        sealCharges: pricing.localRates?.sealCharges?.toString() || '',
        mlo: pricing.localRates?.mlo?.toString() || '',
        blFees: pricing.localRates?.blFees?.toString() || '',
        awh: pricing.localRates?.awh?.toString() || '',
        cancellation: pricing.localRates?.cancellation?.toString() || '',
        other: pricing.localRates?.other?.toString() || '',
      }
    });
    setEditingId(pricing._id);
    // Scroll to top of form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!serviceProviderId) {
      alert('Please login to save pricing');
      return;
    }

    if (!formData.originPort || !formData.destinationPort || !formData.freightRate) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const pricingData = {
        serviceProviderId,
        originPort: formData.originPort,
        destinationPort: formData.destinationPort,
        cargoType: formData.cargoType,
        containerType: formData.containerType,
        transitTime: formData.transitTime,
        freightRate: parseFloat(formData.freightRate),
        localRates: {
          handlingFees: parseFloat(formData.localRates.handlingFees) || 0,
          sealCharges: parseFloat(formData.localRates.sealCharges) || 0,
          mlo: parseFloat(formData.localRates.mlo) || 0,
          blFees: parseFloat(formData.localRates.blFees) || 0,
          awh: parseFloat(formData.localRates.awh) || 0,
          cancellation: parseFloat(formData.localRates.cancellation) || 0,
          other: parseFloat(formData.localRates.other) || 0,
        },
      };

      if (editingId) {
        // Update existing pricing
        await updatePricing({ id: editingId, ...pricingData }).unwrap();
        alert('Freight pricing updated successfully!');
        setEditingId(null);
      } else {
        // Create new pricing
        await createPricing(pricingData).unwrap();
        alert('Freight pricing saved successfully!');
      }
      
      // Reset form
      setFormData({
        originPort: '',
        destinationPort: '',
        cargoType: 'Normal Container Cargo',
        containerType: 'LCL',
        transitTime: '25 Days',
        freightRate: '',
        localRates: {
          handlingFees: '',
          sealCharges: '',
          mlo: '',
          blFees: '',
          awh: '',
          cancellation: '',
          other: ''
        }
      });

      refetch();
    } catch (error: any) {
      console.error('Error saving pricing:', error);
      alert(error?.data?.message || 'Error saving pricing');
    }
  };

  return (
    <div className="pb-12">
      <div className="space-y-8">
        <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
          <div className="mb-6 flex justify-end">
            <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50 px-6 py-4 text-center">
              <p className="text-sm font-semibold text-gray-700">Here You Can Upload Multiple Vehicle and manage all.</p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <button type="button" className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600">
                  Select File
                </button>
                <button type="button" className="rounded-xl border border-blue-400 px-4 py-2 text-sm font-semibold text-blue-500 hover:bg-blue-50">
                  Download template
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {/* Origin Port */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Origin Port</label>
              <select 
                value={formData.originPort}
                onChange={(e) => setFormData({ ...formData, originPort: e.target.value })}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
                required
              >
                <option value="">Select Port</option>
                {ports.map((port: any) => (
                  <option key={`${port.name}-${port.code}`} value={port.name}>{port.name}</option>
                ))}
              </select>
            </div>

            {/* Destination Port */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Destination Port</label>
              <select 
                value={formData.destinationPort}
                onChange={(e) => setFormData({ ...formData, destinationPort: e.target.value })}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
                required
              >
                <option value="">Select Port</option>
                {ports.map((port: any) => (
                  <option key={`${port.name}-${port.code}`} value={port.name}>{port.name}</option>
                ))}
              </select>
            </div>

            {/* Cargo */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Cargo</label>
              <select 
                value={formData.cargoType}
                onChange={(e) => setFormData({ ...formData, cargoType: e.target.value })}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
              >
                {cargoTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Container */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Container</label>
              <div className="rounded-xl border border-gray-300 bg-white p-3">
                <div className="grid gap-2 text-sm text-gray-600">
                  {containerOptions.map((option) => (
                    <label key={option} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded px-2 py-1">
                      <input 
                        type="radio" 
                        name="container" 
                        value={option}
                        checked={formData.containerType === option}
                        onChange={(e) => setFormData({ ...formData, containerType: e.target.value })}
                        className="h-4 w-4" 
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* T/T and Rates */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">T/T</label>
              <select 
                value={formData.transitTime}
                onChange={(e) => setFormData({ ...formData, transitTime: e.target.value })}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
              >
                {transitTimes.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>

              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Freight Rate</label>
              <input
                type="number"
                value={formData.freightRate}
                onChange={(e) => setFormData({ ...formData, freightRate: e.target.value })}
                placeholder="25,000 Rs."
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
                required
              />

              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Local Rate</label>
              <div className="rounded-xl border border-gray-300 bg-white p-3">
                <div className="space-y-2 text-sm text-gray-600">
                  {[
                    { key: 'handlingFees', label: 'Handling Fees' },
                    { key: 'sealCharges', label: 'Seal Charges' },
                    { key: 'mlo', label: 'MLO' },
                    { key: 'blFees', label: 'B/L Fees' },
                    { key: 'awh', label: 'Awh' },
                    { key: 'cancellation', label: 'Cancellation' },
                    { key: 'other', label: 'Other' },
                  ].map((rate) => (
                    <div key={rate.key} className="flex items-center justify-between gap-3">
                      <span className="text-xs">{rate.label}</span>
                      <input
                        type="number"
                        value={formData.localRates[rate.key as keyof typeof formData.localRates]}
                        onChange={(e) => setFormData({
                          ...formData,
                          localRates: { ...formData.localRates, [rate.key]: e.target.value }
                        })}
                        placeholder="15,000 Rs."
                        className="w-28 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    originPort: '',
                    destinationPort: '',
                    cargoType: 'Normal Container Cargo',
                    containerType: 'LCL',
                    transitTime: '25 Days',
                    freightRate: '',
                    localRates: {
                      handlingFees: '',
                      sealCharges: '',
                      mlo: '',
                      blFees: '',
                      awh: '',
                      cancellation: '',
                      other: ''
                    }
                  });
                }}
                className="flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
            <button
              type="submit"
              disabled={isSaving || isUpdating}
              className="flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-600 disabled:bg-gray-300"
            >
              <Save className="h-4 w-4" />
              {isSaving || isUpdating ? (editingId ? 'Updating...' : 'Saving...') : (editingId ? 'Update' : 'Save')}
            </button>
          </div>
        </form>

        {/* Pricing List Table */}
        {pricings.length > 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Origin Port</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Destination Port</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Cargo</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Container</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">T/T</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Freight Rate</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Local Rate</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pricings.map((pricing: any) => {
                    const totalLocalRate = (pricing.localRates?.handlingFees || 0) +
                      (pricing.localRates?.sealCharges || 0) +
                      (pricing.localRates?.mlo || 0) +
                      (pricing.localRates?.blFees || 0) +
                      (pricing.localRates?.awh || 0) +
                      (pricing.localRates?.cancellation || 0) +
                      (pricing.localRates?.other || 0);

                    return (
                      <tr key={pricing._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{pricing.originPort}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{pricing.destinationPort}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{pricing.cargoType}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{pricing.containerType}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{pricing.transitTime}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{pricing.freightRate.toLocaleString()} Rs.</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{totalLocalRate.toLocaleString()} Rs.</td>
                        <td className="px-4 py-3">
                          <button 
                            onClick={() => handleEdit(pricing)}
                            className="text-sm font-medium text-blue-500 hover:text-blue-600"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FreightServiceForm;
