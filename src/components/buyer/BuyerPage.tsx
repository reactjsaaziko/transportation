import { useMemo, useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router';

type BuyerPageProps = {
  title?: string;
};

type BuyerSection = {
  id: number;
  country: string;
  mode: string;
  truckCount: number;
};

const countryOptions = ['India', 'China', 'Vietnam', 'Bangladesh'];
const transportModes = ['Road', 'Rail', 'Air', 'Water'];

const truckOptions = [
  { type: 'TATA ACE', size: '7 L x 4.8 W x 4.8 H', maxWeight: 'Max Load 850 Kgs' },
  { type: 'ASHOK LEYLAND DOST', size: '7 L x 4.8 W x 4.8 H', maxWeight: 'Max Load 1 Ton' },
  { type: 'MAHINDRA BOLERO PICK UP', size: '8 L x 4.8 W x 4.8 H', maxWeight: 'Max Load 1.5 Ton' },
  { type: 'TATA 407', size: '9 L x 5.5 W x 5 H', maxWeight: 'Max Load 2.5 Ton' },
  { type: 'EICHER 14 FEET', size: '14 L x 6 W x 6.5 H', maxWeight: 'Max Load 4 Ton' },
  { type: 'EICHER 19 FEET', size: '17 L x 6 W x 7 H', maxWeight: 'Max Load 5 Ton' },
  { type: 'EICHER 17 FEET', size: '19 L x 7 W x 7 H', maxWeight: 'Max Load 7/8/9 Ton' },
  { type: 'TATA 22 FEET', size: '22 L x 7.5 W x 7 H', maxWeight: 'Max Load 10 Ton' },
  { type: 'TATA TRUCK (6 TYRE)', size: '17.5 L x 7 W x 7 H', maxWeight: 'Max Load 9 Ton' },
  { type: 'TAURUS 25 T (14 TYRE)', size: '24 L x 7.3 W x 7 H', maxWeight: 'Max Load 21 Ton' },
  { type: 'TAURUS 21 T (12 TYRE)', size: '28 L x 7.8 W x 7 H', maxWeight: 'Max Load 25 Ton' },
  { type: 'CONTAINER 20 FT', size: '20 L x 8 W x 8.6 H', maxWeight: 'Max Load 6.5 Ton' },
  { type: '20 FEET OPEN ALL SIDE (ODC)', size: '32 L x 8 W x 8 H', maxWeight: 'Max Load 18 Ton' },
  { type: '28-32 FEET OPEN-TRAILOR JCB ODC', size: '32 L x 8 W x 8 H', maxWeight: 'Max Load 20 Ton' },
  { type: '32 FEET OPEN-TRAILOR ODC', size: '32 L x 8 W x 10 H', maxWeight: 'Max Load 7/14 Ton' },
  { type: 'EICHER 17 FEET', size: '20 L x 8 W x 8 H', maxWeight: 'Max Load 7 Ton' },
  { type: '40 FEET OPEN-TRAILOR ODC', size: '32 L x 8 W x 12 H', maxWeight: 'Max Load 7 Ton' },
  { type: 'TAURUS 21 T (12 TYRE)', size: '40 L x 8 W x 8 H', maxWeight: 'Max Load 32 Ton' },
];

const formFields = [
  { id: 'companyName', label: 'Company Name', type: 'text', placeholder: 'Company Name' },
  { id: 'personalName', label: 'Personal Name', type: 'text', placeholder: 'Personal Name' },
  { id: 'email', label: 'E-mail', type: 'email', placeholder: 'E-mail' },
  { id: 'contactNumber', label: 'Contact Number', type: 'tel', placeholder: 'Contact Number' },
  { id: 'address', label: 'Address', type: 'text', placeholder: 'Address' },
];

const BuyerPage = ({ title }: BuyerPageProps) => {
  const navigate = useNavigate();
  const [sections, setSections] = useState<BuyerSection[]>([
    { id: Date.now(), country: countryOptions[0], mode: transportModes[0], truckCount: 1 },
  ]);

  const truckRows = useMemo(() => {
    const rows: Array<[typeof truckOptions[number], typeof truckOptions[number] | undefined]> = [];
    for (let index = 0; index < truckOptions.length; index += 2) {
      rows.push([truckOptions[index], truckOptions[index + 1]]);
    }
    return rows;
  }, []);

  const handleAddSection = () => {
    setSections((prev) => [
      ...prev,
      {
        id: Date.now() + Math.floor(Math.random() * 1000),
        country: countryOptions[0],
        mode: transportModes[0],
        truckCount: 1,
      },
    ]);
  };

  const handleSectionChange = (id: number, updater: (section: BuyerSection) => BuyerSection) => {
    setSections((prev) => prev.map((section) => (section.id === id ? updater(section) : section)));
  };

  const handleSubmit = () => {
    navigate('/dashboard/order-submission');
  };

  return (
    <div className="pb-12">
      <div className="mx-auto max-w-6xl space-y-6">
        {title && <h1 className="text-xl font-semibold text-gray-700">{title}</h1>}

        <div className="space-y-10">
          {sections.map((section, index) => (
            <div key={section.id} className="rounded-3xl border border-gray-200 bg-white shadow-sm">
              <div className="flex flex-col gap-4 border-b border-gray-100 p-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleAddSection}
                    className="rounded-xl bg-blue-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600"
                  >
                    + Add Truck
                  </button>

                  <select
                    value={section.country}
                    onChange={(event) =>
                      handleSectionChange(section.id, (current) => ({ ...current, country: event.target.value }))
                    }
                    className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none"
                  >
                    {countryOptions.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>

                  <div className="flex flex-wrap items-center gap-2">
                    {transportModes.map((mode) => (
                      <button
                        key={mode}
                        onClick={() =>
                          handleSectionChange(section.id, (current) => ({ ...current, mode }))
                        }
                        className={`rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
                          section.mode === mode
                            ? 'border-blue-500 bg-blue-50 text-blue-600'
                            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 shadow-sm">
                    <span className="mr-3 text-gray-700">No. of Truck</span>
                    <input
                      type="number"
                      min={1}
                      className="w-16 rounded-lg border border-gray-200 px-2 py-1 text-center text-sm focus:border-blue-500 focus:outline-none"
                      value={section.truckCount}
                      onChange={(event) =>
                        handleSectionChange(section.id, (current) => ({
                          ...current,
                          truckCount: Number(event.target.value) > 0 ? Number(event.target.value) : 1,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="border-b border-dashed border-gray-200 px-6">
                <div className="grid grid-cols-6 gap-4 py-5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <div className="border-r border-dashed border-gray-300 pr-2">Truck Type</div>
                  <div className="border-r border-dashed border-gray-300 pr-2">Size (FT)</div>
                  <div className="pr-2">Max Weight</div>
                  <div className="border-l border-dashed border-gray-300 pl-4">Truck Type</div>
                  <div>Size (FT)</div>
                  <div>Max Weight</div>
                </div>

                <div className="space-y-4 pb-6">
                  {truckRows.map(([left, right]) => (
                    <div key={`${section.id}-${left.type}`} className="grid grid-cols-6 gap-4 text-sm text-gray-700">
                      <div className="border-r border-dashed border-gray-200 pr-2 font-semibold">{left.type}</div>
                      <div className="border-r border-dashed border-gray-200 pr-2 text-gray-500">{left.size}</div>
                      <div className="text-gray-500">{left.maxWeight}</div>
                      <div className="border-l border-dashed border-gray-200 pl-4 font-semibold">{right?.type ?? '—'}</div>
                      <div className="text-gray-500">{right?.size ?? '—'}</div>
                      <div className="text-gray-500">{right?.maxWeight ?? '—'}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-12 px-6 py-8">
                <div className="space-y-6">
                  <div className="text-lg font-semibold text-gray-700">Pick Up: {index + 1}</div>
                  <div className="grid gap-5 lg:grid-cols-2">
                    {formFields.slice(0, 2).map((field) => (
                      <div key={`pickup-${field.id}-${section.id}`} className="space-y-2">
                        <label className="text-sm font-medium text-gray-600">{field.label}</label>
                        <input
                          type={field.type}
                          placeholder={field.placeholder}
                          className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    ))}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600">Date</label>
                      <div className="flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 shadow-sm">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>14, Jan 2023</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-5 lg:grid-cols-2">
                    {formFields.slice(2, 4).map((field) => (
                      <div key={`pickup-${field.id}-${section.id}`} className="space-y-2">
                        <label className="text-sm font-medium text-gray-600">{field.label}</label>
                        <input
                          type={field.type}
                          placeholder={field.placeholder}
                          className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    ))}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600">Time</label>
                      <div className="flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 shadow-sm">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>09 : 00 PM</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">{formFields[4].label}</label>
                    <textarea
                      rows={3}
                      placeholder={formFields[4].placeholder}
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="text-lg font-semibold text-gray-700">Drop :</div>
                  <div className="grid gap-5 lg:grid-cols-2">
                    {formFields.slice(0, 2).map((field) => (
                      <div key={`drop-${field.id}-${section.id}`} className="space-y-2">
                        <label className="text-sm font-medium text-gray-600">{field.label}</label>
                        <input
                          type={field.type}
                          placeholder={field.placeholder}
                          className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    ))}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600">Date</label>
                      <div className="flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 shadow-sm">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>14, Jan 2023</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-5 lg:grid-cols-2">
                    {formFields.slice(2, 4).map((field) => (
                      <div key={`drop-${field.id}-${section.id}`} className="space-y-2">
                        <label className="text-sm font-medium text-gray-600">{field.label}</label>
                        <input
                          type={field.type}
                          placeholder={field.placeholder}
                          className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    ))}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600">Time</label>
                      <div className="flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 shadow-sm">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>09 : 00 PM</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">{formFields[4].label}</label>
                    <textarea
                      rows={3}
                      placeholder={formFields[4].placeholder}
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-center">
                  <button 
                    onClick={handleSubmit}
                    className="rounded-2xl bg-blue-500 px-8 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuyerPage;
