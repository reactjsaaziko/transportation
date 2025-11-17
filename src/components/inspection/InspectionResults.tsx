import { useState } from 'react';
import { Search, Plus, Save, Edit2, Trash2 } from 'lucide-react';

const products = [
  {
    product: 'Freight All Kinds',
    city: 'Alibag',
    inspectionType: 'Onsite Inspection',
    price: '20,000 Rs.',
    note: 'Product Videotshoot',
  },
  {
    product: 'Personal',
    city: 'Achra',
    inspectionType: 'Remote Inspection',
    price: '30,000 Rs.',
    note: 'Total Products Count',
  },
  {
    product: 'Animal & Products',
    city: 'Agra',
    inspectionType: 'Products Testing',
    price: '50,000 Rs.',
    note: '',
  },
];

const productOptions = ['Freight All Kinds', 'Personal', 'Animal & Products', 'Vegetable Products'];
const cityOptions = ['Alibag', 'Achra', 'Agra', 'Aizawl'];
const inspectionOptions = ['Onsite Inspection', 'Remote Inspection', 'Products Testing', 'Quality Assurance'];

const InspectionResults = () => {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedInspection, setSelectedInspection] = useState('');

  return (
    <div className="pb-12">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Product</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <select
                  value={selectedProduct}
                  onChange={(event) => setSelectedProduct(event.target.value)}
                  className="w-full appearance-none rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 pl-9 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="" disabled>
                    Product Name
                  </option>
                  {productOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">City</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <select
                  value={selectedCity}
                  onChange={(event) => setSelectedCity(event.target.value)}
                  className="w-full appearance-none rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 pl-9 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="" disabled>
                    City Name
                  </option>
                  {cityOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Type of Inspection</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <select
                  value={selectedInspection}
                  onChange={(event) => setSelectedInspection(event.target.value)}
                  className="w-full appearance-none rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 pl-9 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="" disabled>
                    Type of Inspection
                  </option>
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
                  type="text"
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="Price"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Note</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="Note"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button className="flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <Plus className="h-4 w-4" />
              Add
            </button>
            <button className="flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600">
              <Save className="h-4 w-4" />
              Save
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-sm font-semibold text-gray-600">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">City</th>
                <th className="px-6 py-4">Type of Inspection</th>
                <th className="px-6 py-4">Price/SB</th>
                <th className="px-6 py-4">Note</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item.product} className="border-b border-gray-100 text-sm text-gray-700 last:border-b-0">
                  <td className="px-6 py-4">{item.product}</td>
                  <td className="px-6 py-4">{item.city}</td>
                  <td className="px-6 py-4">{item.inspectionType}</td>
                  <td className="px-6 py-4">{item.price}</td>
                  <td className="px-6 py-4">{item.note || '—'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">Save</button>
                      <button className="rounded-lg border border-gray-200 p-1 text-gray-500 hover:bg-gray-50">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button className="rounded-lg border border-gray-200 p-1 text-red-500 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="border-b border-dashed border-gray-200 text-sm text-gray-400 last:border-b-0">
                  <td className="px-6 py-6">&nbsp;</td>
                  <td className="px-6 py-6">&nbsp;</td>
                  <td className="px-6 py-6">&nbsp;</td>
                  <td className="px-6 py-6">&nbsp;</td>
                  <td className="px-6 py-6">&nbsp;</td>
                  <td className="px-6 py-6">&nbsp;</td>
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
