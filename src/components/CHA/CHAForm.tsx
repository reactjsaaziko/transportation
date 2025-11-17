import { useState } from 'react';
import { Search, Plus, Trash2, Copy } from 'lucide-react';

interface CHAEntry {
  id: string;
  port: string;
  cargo: string;
  container: string;
  price: string;
}

const CHAForm = () => {
  const [formData, setFormData] = useState({
    port: '',
    cargo: 'Normal Container Cargo',
    container: 'LCL',
    price: '',
  });
  const [selectedPorts, setSelectedPorts] = useState<string[]>([]);
  const [entries, setEntries] = useState<CHAEntry[]>([
    { id: '1', port: 'ALIBAG', cargo: 'Normal Container Cargo', container: 'LCL', price: '2000' },
    { id: '2', port: 'ACHDA', cargo: 'Liquid Bulk', container: '20\' Standard', price: '3000' },
    { id: '3', port: 'AGRA', cargo: 'Paracable Cargo', container: '40\' Standard', price: '5000' },
  ]);
  const [portSearch, setPortSearch] = useState('');
  const [showPortDropdown, setShowPortDropdown] = useState(false);

  const ports = ['ALIBAG', 'ACHDA', 'AGRA', 'AIZAWL'];
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
    port.toLowerCase().includes(portSearch.toLowerCase())
  );

  const handleAddEntry = () => {
    if (formData.port && formData.price) {
      const newEntry: CHAEntry = {
        id: Date.now().toString(),
        ...formData,
      };
      setEntries([...entries, newEntry]);
      setFormData({
        port: '',
        cargo: 'Normal Container Cargo',
        container: 'LCL',
        price: '',
      });
      setSelectedPorts([]);
    }
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Form Section */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        {/* Port Dropdown */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">Port</label>
          <div className="relative">
            <button
              className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setShowPortDropdown(!showPortDropdown)}
            >
              {formData.port || 'Select Port'}
            </button>
            {showPortDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                <div className="p-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="City, Port, Country"
                      value={portSearch}
                      onChange={(e) => setPortSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {filteredPorts.map((port) => (
                    <button
                      key={port}
                      onClick={() => {
                        setFormData({ ...formData, port });
                        setShowPortDropdown(false);
                        setPortSearch('');
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm text-gray-700"
                    >
                      {port}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cargo Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cargo</label>
          <div className="relative">
            <select
              value={formData.cargo}
              onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              {cargoTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Container Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Container</label>
          <div className="relative">
            <select
              value={formData.container}
              onChange={(e) => setFormData({ ...formData, container: e.target.value })}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              {containerTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Price/SB Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Price/SB</label>
          <input
            type="text"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="Enter price"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Add Button */}
        <div className="flex items-end">
          <button
            onClick={handleAddEntry}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
          >
            <Plus className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mb-6">
        <button className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Save
        </button>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
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
            {entries.map((entry) => (
              <tr key={entry.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-700">{entry.port}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{entry.cargo}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{entry.container}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{entry.price}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="p-1 text-gray-700 hover:bg-gray-100 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-700 hover:bg-gray-100 rounded">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CHAForm;
