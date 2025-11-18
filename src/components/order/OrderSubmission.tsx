import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router';

type CargoType = 'hazardous' | 'perishable' | 'oversized' | 'liquid';

type Product = {
  id: string;
  name: string;
  length: string;
  lengthUnit: string;
  width: string;
  widthUnit: string;
  height: string;
  heightUnit: string;
  weight: string;
  weightUnit: string;
  quantity: string;
  color: string;
  stack: boolean;
};

type ServiceItem = {
  id: string;
  name: string;
  price: string;
  selected: boolean;
};

const OrderSubmission = () => {
  const navigate = useNavigate();
  const [selectedCargoType, setSelectedCargoType] = useState<CargoType | ''>('');
  const [usePallets, setUsePallets] = useState(false);
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Boxes 1',
      length: '1000',
      lengthUnit: 'MM',
      width: '2000',
      widthUnit: 'MM',
      height: '1000',
      heightUnit: 'MM',
      weight: '1000',
      weightUnit: 'KG',
      quantity: '50',
      color: '#FF9500',
      stack: false,
    },
    {
      id: '2',
      name: 'Boxes 1',
      length: '500',
      lengthUnit: 'MM',
      width: '900',
      widthUnit: 'MM',
      height: '1000',
      heightUnit: 'MM',
      weight: '1000',
      weightUnit: 'KG',
      quantity: '20',
      color: '#FF3B30',
      stack: false,
    },
    {
      id: '3',
      name: 'Boxes 1',
      length: '300',
      lengthUnit: 'MM',
      width: '500',
      widthUnit: 'MM',
      height: '500',
      heightUnit: 'MM',
      weight: '60',
      weightUnit: 'KG',
      quantity: '90',
      color: '#007AFF',
      stack: false,
    },
  ]);

  const [services, setServices] = useState<ServiceItem[]>([
    { id: '1', name: 'Origin domestic transportation', price: '$204', selected: false },
    { id: '2', name: 'Customs Clearance', price: '$204', selected: false },
    { id: '3', name: 'Freight', price: '$204', selected: false },
    { id: '4', name: 'Port Of Discharge', price: '$204', selected: false },
    { id: '5', name: 'Delivery', price: '$204', selected: false },
    { id: '6', name: 'Inspection', price: '$204', selected: false },
    { id: '7', name: 'Insurance', price: '$204', selected: false },
  ]);

  const cargoTypes = [
    { id: 'hazardous', label: 'Hazardous Cargo', icon: '☢️', color: 'bg-blue-500' },
    { id: 'perishable', label: 'Perishable Cargo', icon: '❄️', color: 'bg-blue-100' },
    { id: 'oversized', label: 'Oversized Cargo', icon: '📦', color: 'bg-blue-100' },
    { id: 'liquid', label: 'Liquid Cargo', icon: '💧', color: 'bg-blue-100' },
  ];

  const addProduct = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: '',
      length: '',
      lengthUnit: 'MM',
      width: '',
      widthUnit: 'MM',
      height: '',
      heightUnit: 'MM',
      weight: '',
      weightUnit: 'KG',
      quantity: '',
      color: '#' + Math.floor(Math.random()*16777215).toString(16),
      stack: false,
    };
    setProducts([...products, newProduct]);
  };

  const removeProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const updateProduct = (id: string, field: keyof Product, value: any) => {
    setProducts(products.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const toggleService = (id: string) => {
    setServices(services.map(s => s.id === id ? { ...s, selected: !s.selected } : s));
  };

  const handleContinue = () => {
    navigate('/dashboard/insurance-selection');
  };

  return (
    <div className="pb-12">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl border border-gray-200 bg-white shadow-sm">
          {/* Header */}
          <div className="border-b border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Goods Information :</h2>
              <button className="text-sm text-gray-600 hover:text-gray-800">
                Bulk Upload
              </button>
            </div>
          </div>

          {/* Goods Information Form */}
          <div className="border-b border-gray-100 p-6">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Goods Name</label>
                <input
                  type="text"
                  placeholder="Goods Name"
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Goods Type</label>
                <input
                  type="text"
                  placeholder="Goods Type"
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">HS Code</label>
                <input
                  type="text"
                  placeholder="HS Code"
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Cargo Volume (CBM)</label>
                <input
                  type="text"
                  placeholder="Cargo Volume"
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Cargo Weight</label>
                <input
                  type="text"
                  placeholder="Cargo Weight"
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Total Package</label>
                <input
                  type="text"
                  placeholder="Total Package"
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Cargo Type Selection */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {cargoTypes.map((cargo) => (
                <button
                  key={cargo.id}
                  onClick={() => setSelectedCargoType(cargo.id as CargoType)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedCargoType === cargo.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cargo.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{cargo.label}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">IMO Class</label>
                <select className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none">
                  <option>IMO Class</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">UN Number</label>
                <input
                  type="text"
                  placeholder="UN Number"
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="border-b border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Products :</h3>
              <button className="text-sm text-gray-600">Group #1 ⓘ</button>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-3 text-left font-semibold text-gray-700 w-8"></th>
                    <th className="pb-3 text-left font-semibold text-gray-700">Product Name</th>
                    <th className="pb-3 text-left font-semibold text-gray-700">Length</th>
                    <th className="pb-3 text-left font-semibold text-gray-700">Width/Radius</th>
                    <th className="pb-3 text-left font-semibold text-gray-700">Height</th>
                    <th className="pb-3 text-left font-semibold text-gray-700">Weight</th>
                    <th className="pb-3 text-left font-semibold text-gray-700">Quantity</th>
                    <th className="pb-3 text-left font-semibold text-gray-700">Color</th>
                    <th className="pb-3 text-left font-semibold text-gray-700">Stack</th>
                    <th className="pb-3 text-left font-semibold text-gray-700 w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-gray-100">
                      <td className="py-3">
                        <button className="text-gray-400 hover:text-gray-600">
                          <Plus className="h-4 w-4" />
                        </button>
                      </td>
                      <td className="py-3">
                        <input
                          type="text"
                          value={product.name}
                          onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                          className="w-full rounded border border-gray-200 px-2 py-1 text-sm"
                          placeholder="Product Name"
                        />
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={product.length}
                            onChange={(e) => updateProduct(product.id, 'length', e.target.value)}
                            className="w-16 rounded border border-gray-200 px-2 py-1 text-sm"
                          />
                          <select
                            value={product.lengthUnit}
                            onChange={(e) => updateProduct(product.id, 'lengthUnit', e.target.value)}
                            className="rounded border border-gray-200 px-1 py-1 text-xs"
                          >
                            <option>MM</option>
                            <option>CM</option>
                            <option>M</option>
                          </select>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={product.width}
                            onChange={(e) => updateProduct(product.id, 'width', e.target.value)}
                            className="w-16 rounded border border-gray-200 px-2 py-1 text-sm"
                          />
                          <select
                            value={product.widthUnit}
                            onChange={(e) => updateProduct(product.id, 'widthUnit', e.target.value)}
                            className="rounded border border-gray-200 px-1 py-1 text-xs"
                          >
                            <option>MM</option>
                            <option>CM</option>
                            <option>M</option>
                          </select>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={product.height}
                            onChange={(e) => updateProduct(product.id, 'height', e.target.value)}
                            className="w-16 rounded border border-gray-200 px-2 py-1 text-sm"
                          />
                          <select
                            value={product.heightUnit}
                            onChange={(e) => updateProduct(product.id, 'heightUnit', e.target.value)}
                            className="rounded border border-gray-200 px-1 py-1 text-xs"
                          >
                            <option>MM</option>
                            <option>CM</option>
                            <option>M</option>
                          </select>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={product.weight}
                            onChange={(e) => updateProduct(product.id, 'weight', e.target.value)}
                            className="w-16 rounded border border-gray-200 px-2 py-1 text-sm"
                          />
                          <select
                            value={product.weightUnit}
                            onChange={(e) => updateProduct(product.id, 'weightUnit', e.target.value)}
                            className="rounded border border-gray-200 px-1 py-1 text-xs"
                          >
                            <option>KG</option>
                            <option>G</option>
                            <option>TON</option>
                          </select>
                        </div>
                      </td>
                      <td className="py-3">
                        <input
                          type="text"
                          value={product.quantity}
                          onChange={(e) => updateProduct(product.id, 'quantity', e.target.value)}
                          className="w-16 rounded border border-gray-200 px-2 py-1 text-sm"
                        />
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded border border-gray-200"
                            style={{ backgroundColor: product.color }}
                          />
                          <button className="text-gray-400 hover:text-gray-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                      <td className="py-3">
                        <input
                          type="checkbox"
                          checked={product.stack}
                          onChange={(e) => updateProduct(product.id, 'stack', e.target.checked)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => removeProduct(product.id)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={addProduct}
                className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
              >
                <Plus className="h-4 w-4" />
                Add Product
              </button>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={usePallets}
                  onChange={(e) => setUsePallets(e.target.checked)}
                  className="rounded border-gray-300"
                />
                Use Pallets
              </label>
            </div>
          </div>

          {/* Services Section */}
          <div className="p-6">
            <div className="space-y-3">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={service.selected}
                      onChange={() => toggleService(service.id)}
                      className="rounded border-gray-300"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">
                        {service.name === 'Origin domestic transportation' && '🚚'}
                        {service.name === 'Customs Clearance' && '⚓'}
                        {service.name === 'Freight' && '✈️'}
                        {service.name === 'Port Of Discharge' && '⚓'}
                        {service.name === 'Delivery' && '🚚'}
                        {service.name === 'Inspection' && '📋'}
                        {service.name === 'Insurance' && '🛡️'}
                      </span>
                      <span className="text-sm font-medium text-gray-700">{service.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-800">{service.price}</span>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
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
    </div>
  );
};

export default OrderSubmission;
