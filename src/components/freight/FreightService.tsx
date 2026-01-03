import { Plus, Save } from 'lucide-react';

const originPorts = ['ALIBAG', 'ACHRA', 'AGRA', 'AIZAWL'];
const destinationPorts = ['ALIBAG', 'ACHRA', 'AGRA', 'AIZAWL'];
const cargoTypes = ['Normal Container Cargo', 'Liquid Cargo', 'Bulk Cargo'];
const containerOptions = ['LCL', '20′ Standard', '40′ Standard', '40′ High Cube', '20′ Refrigerated', '40′ Refrigerated', '45′ High Cube', 'Air'];
const freightTimes = ['25 Days', '30 Days', '45 Days'];
const localRates = ['Handling Fees', 'Seal Charges', 'MLO', 'B/L Fees', 'Awh', 'Cancellation', 'Other'];

const freightEntries = Array.from({ length: 15 }).map((_, index) => ({
  id: index,
  origin: 'ALIBAG',
  destination: 'ALIBAG',
  cargo: 'Normal Container Cargo',
  container: 'LCL',
  transitTime: '25 Days',
  freightRate: '25,000 Rs.',
  localRate: '15,000 Rs.',
}));

const FreightService = () => {
  return (
    <div className="pb-12">
      <div className="space-y-8">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
          <div className="mb-6 flex justify-end">
            <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50 px-6 py-4 text-center">
              <p className="text-sm font-semibold text-gray-700">Here You Can Upload Multiple Vehicle and manage all.</p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <button className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600">
                  Select File
                </button>
                <button className="rounded-xl border border-blue-400 px-4 py-2 text-sm font-semibold text-blue-500 hover:bg-blue-50">
                  Download template
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Origin Port</label>
              <select className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none">
                {originPorts.map((port) => (
                  <option key={port}>{port}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Destination Port</label>
              <select className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none">
                {destinationPorts.map((port) => (
                  <option key={port}>{port}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Cargo</label>
              <select className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none">
                {cargoTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Container</label>
              <div className="rounded-xl border border-gray-300 bg-white p-3">
                <div className="grid gap-2 text-sm text-gray-600">
                  {containerOptions.map((option) => (
                    <label key={option} className="flex items-center gap-2">
                      <input type="radio" name="container" defaultChecked={option === 'LCL'} className="h-4 w-4" />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">T/T</label>
              <select className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none">
                {freightTimes.map((time) => (
                  <option key={time}>{time}</option>
                ))}
              </select>

              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Freight Rate</label>
              <input
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
                defaultValue="25,000 Rs."
              />

              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Local Rate</label>
              <div className="rounded-xl border border-gray-300 bg-white p-3">
                <div className="space-y-2 text-sm text-gray-600">
                  {localRates.map((rate) => (
                    <div key={rate} className="flex items-center justify-between gap-3">
                      <span>{rate}</span>
                      <input
                        className="w-28 rounded-lg border border-gray-300 bg-gray-50 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                        defaultValue={rate === 'Other' ? '' : '15,000 Rs.'}
                        placeholder="Enter"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <Plus className="h-4 w-4" />
                  Add
                </button>
                <button className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600">
                  <Save className="h-4 w-4" />
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <th className="px-6 py-4">Origin Port</th>
                  <th className="px-6 py-4">Destination Port</th>
                  <th className="px-6 py-4">Cargo</th>
                  <th className="px-6 py-4">Container</th>
                  <th className="px-6 py-4">T/T</th>
                  <th className="px-6 py-4">Freight Rate</th>
                  <th className="px-6 py-4">Local Rate</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {freightEntries.map((entry) => (
                  <tr key={entry.id} className="border-t border-dashed border-gray-200">
                    <td className="px-6 py-4">{entry.origin}</td>
                    <td className="px-6 py-4">{entry.destination}</td>
                    <td className="px-6 py-4">{entry.cargo}</td>
                    <td className="px-6 py-4">{entry.container}</td>
                    <td className="px-6 py-4">{entry.transitTime}</td>
                    <td className="px-6 py-4">{entry.freightRate}</td>
                    <td className="px-6 py-4">{entry.localRate}</td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-sm font-medium text-blue-600 hover:underline">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreightService;
