import { useState } from 'react';
import { Search, Save, Edit2, Trash2 } from 'lucide-react';
import {
  useCreateInspectionPricingMutation,
  useGetInspectionPricingsByServiceProviderQuery,
  useUpdateInspectionPricingMutation,
  useDeleteInspectionPricingMutation,
} from '../../services/inspectionApi';

const inspectionOptions = [
  'Onsite Inspection',
  'Remote Inspection',
  'Products Testing',
  'Quality Assurance',
  'Visual Inspection',
  'Physical Inspection',
  '100% Inspection',
  'Random Inspection',
  'Pre-shipment Inspection',
  'During Production Inspection',
  'Initial Production Verification',
  'Container Loading Supervision',
  'Sample Drawing',
  'Other',
];

const InspectionResults = () => {
  // Get service provider ID from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const serviceProviderId = user?.id || user?._id || '';

  // Form state
  const [formData, setFormData] = useState({
    product: '',
    city: '',
    inspectionType: '',
    price: '',
    note: '',
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch existing pricing
  const { data: pricingsData, refetch } = useGetInspectionPricingsByServiceProviderQuery(serviceProviderId, {
    skip: !serviceProviderId,
  });

  const pricings = pricingsData?.data || [];

  // Mutations
  const [createPricing, { isLoading: isCreating }] = useCreateInspectionPricingMutation();
  const [updatePricing, { isLoading: isUpdating }] = useUpdateInspectionPricingMutation();
  const [deletePricing] = useDeleteInspectionPricingMutation();

  const handleEdit = (pricing: any) => {
    setFormData({
      product: pricing.product,
      city: pricing.city,
      inspectionType: pricing.inspectionType,
      price: pricing.price.toString(),
      note: pricing.note || '',
    });
    setEditingId(pricing._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this pricing?')) return;

    try {
      await deletePricing(id).unwrap();
      alert('Pricing deleted successfully!');
      refetch();
    } catch (error: any) {
      console.error('Error deleting pricing:', error);
      alert(error?.data?.message || 'Error deleting pricing');
    }
  };

  const handleSubmit = async () => {
    if (!serviceProviderId) {
      alert('Please login to save pricing');
      return;
    }

    if (!formData.product || !formData.city || !formData.inspectionType || !formData.price) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const pricingData = {
        serviceProviderId,
        product: formData.product,
        city: formData.city,
        inspectionType: formData.inspectionType,
        price: parseFloat(formData.price),
        note: formData.note,
      };

      if (editingId) {
        await updatePricing({ id: editingId, ...pricingData }).unwrap();
        alert('Pricing updated successfully!');
        setEditingId(null);
      } else {
        await createPricing(pricingData).unwrap();
        alert('Pricing saved successfully!');
      }

      // Reset form
      setFormData({
        product: '',
        city: '',
        inspectionType: '',
        price: '',
        note: '',
      });

      refetch();
    } catch (error: any) {
      console.error('Error saving pricing:', error);
      alert(error?.data?.message || 'Error saving pricing');
    }
  };

  const handleCancel = () => {
    setFormData({
      product: '',
      city: '',
      inspectionType: '',
      price: '',
      note: '',
    });
    setEditingId(null);
  };

  return (
    <div className="pb-12">
      <div className="mx-auto w-full space-y-6 px-6">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Product</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  className="w-full appearance-none rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 pl-9 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="Product Name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">City</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full appearance-none rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 pl-9 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="City Name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Type of Inspection</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <select
                  value={formData.inspectionType}
                  onChange={(e) => setFormData({ ...formData, inspectionType: e.target.value })}
                  className="w-full appearance-none rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 pl-9 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Type of Inspection</option>
                  {inspectionOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Price</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="Price"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Note</label>
                <input
                  type="text"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="Note"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isCreating || isUpdating}
              className="flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 disabled:bg-gray-300"
            >
              <Save className="h-4 w-4" />
              {isCreating || isUpdating ? (editingId ? 'Updating...' : 'Saving...') : (editingId ? 'Update' : 'Save')}
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-sm font-semibold text-gray-600">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">City</th>
                <th className="px-6 py-4">Inspection Type</th>
                <th className="px-6 py-4">Price/SB</th>
                <th className="px-6 py-4">Note</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pricings.map((item: any) => (
                <tr key={item._id} className="border-b border-gray-100 text-sm text-gray-700 last:border-b-0">
                  <td className="px-6 py-4">{item.product}</td>
                  <td className="px-6 py-4">{item.city}</td>
                  <td className="px-6 py-4">{item.inspectionType}</td>
                  <td className="px-6 py-4">{item.price.toLocaleString()} Rs.</td>
                  <td className="px-6 py-4">{item.note || '—'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="rounded-lg border border-gray-200 p-1 text-gray-500 hover:bg-gray-50"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="rounded-lg border border-gray-200 p-1 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InspectionResults;
