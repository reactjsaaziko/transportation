import { useEffect, useRef, useState } from 'react';
import { Calendar, ChevronDown, Info, Search, Upload } from 'lucide-react';

const inspectionTypes = ['Standard', 'Regulatory/ Mandatory', 'Customized'];
const sampleOptions = ['Yes', 'No'];
const inspectionOptions = [
  'Visual Inspection',
  'Physical Inspection',
  'Remote Inspection',
  'Container Loading Supervision',
  '100% Inspection',
  'Random Inspection',
  'Pre- Shipment Inspection',
  'Initial Production Check',
  'During Production Inspection',
  'Initial Production Verification',
  'Final Random Inspection',
  'Sample Drawing',
  'Other',
];
const countries = ['India', 'UK', 'Japan', 'Germany'];
const states = ['Gujarat', 'Karnataka', 'Maharashtra', 'Sikkim'];
const cities = ['Surat', 'Rajkot', 'Junagadh', 'Bharuch'];
const samplingLevels = ['Level 1', 'Level 2', 'Level 3'];
const aqlOptions = ['Select AQL', '2.5', '4.0', '6.5'];
const majorOptions = ['Select Major', 'A', 'B', 'C'];
const minorOptions = ['Select Minor', '1', '2', '3'];

type LocationDropdownProps = {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

const LocationDropdown = ({ label, options, value, onChange }: LocationDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter((option) => option.toLowerCase().includes(query.toLowerCase()));
  const displayOptions = filteredOptions.length > 0 ? filteredOptions : options;

  return (
    <div ref={containerRef} className="relative rounded-2xl border border-slate-200 p-5">
      <p className="text-sm font-semibold text-slate-900">{label}</p>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="mt-3 flex w-full items-center justify-between gap-3 rounded-[18px] border border-slate-200 px-4 py-3 text-left text-sm text-slate-700 transition hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-3">
          <Search className="h-4 w-4 text-slate-400" />
          {value || `Select ${label}`}
        </span>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-5 right-5 top-[calc(100%+0.75rem)] z-20 rounded-2xl border border-slate-200 bg-white">
          <div className="relative px-4 pt-4 pb-2">
            <Search className="pointer-events-none absolute left-7 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Search ${label.toLowerCase()}`}
              className="w-full rounded-xl border border-slate-200 px-9 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div className="max-h-48 overflow-y-auto px-2 pb-3">
            {displayOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                  setQuery('');
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition ${
                  option === value ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{option}</span>
                <span
                  className={`h-2.5 w-2.5 rounded-full border ${
                    option === value ? 'border-blue-500 bg-blue-500' : 'border-slate-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const InspectionBuyer = () => {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [selectedState, setSelectedState] = useState(states[0]);
  const [selectedCity, setSelectedCity] = useState(cities[0]);

  return (
    <div className="pb-12">
      <div className="mx-auto w-full px-6">
        <form className="space-y-12 rounded-[32px] bg-white px-10 py-12">
          <section className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900">Personal Name</label>
              <input
                type="text"
                placeholder="Personal Name"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900">Company Name</label>
              <input
                type="text"
                placeholder="Company Name"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900">Inspection Date</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="14, Jan 2023"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                <Calendar className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
            <div className="space-y-2 lg:col-span-2">
              <label className="text-sm font-medium text-slate-900">E-mail</label>
              <input
                type="email"
                placeholder="E-mail"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900">Contact Number</label>
              <input
                type="tel"
                placeholder="Contact Number"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div className="space-y-2 lg:col-span-3">
              <label className="text-sm font-medium text-slate-900">Address</label>
              <textarea
                rows={2}
                placeholder="Address"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </section>

          <section className="space-y-10">
            <div className="grid gap-6 lg:grid-cols-3">
              <LocationDropdown
                label="Country"
                options={countries}
                value={selectedCountry}
                onChange={setSelectedCountry}
              />
              <LocationDropdown label="State" options={states} value={selectedState} onChange={setSelectedState} />
              <LocationDropdown label="Cities" options={cities} value={selectedCity} onChange={setSelectedCity} />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-900">Type of Inspection</p>
                <div className="flex flex-wrap gap-6">
                  {inspectionTypes.map((type) => (
                    <label key={type} className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="radio"
                        name="inspection-type"
                        defaultChecked={type === 'Standard'}
                        className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-900">Sample :</p>
                <div className="flex gap-6">
                  {sampleOptions.map((option) => (
                    <label key={option} className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="radio"
                        name="sample"
                        defaultChecked={option === 'Yes'}
                        className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                All inspections may include the following options (which you may select or de-select)*
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {inspectionOptions.map((option) => (
                  <label key={option} className="flex items-center gap-3 text-sm text-slate-700">
                    <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">Default standard (for consumer goods)</h2>
                <span className="text-xs font-medium text-slate-500">ANSI/ASQ Z1.4-2008</span>
              </div>
              <p className="text-sm text-slate-600">
                This is just an example of one of the inspection standards used by inspection companies for consumer goods. If it
                doesn&apos;t apply to your request, you can disregard it of course.
              </p>

              <div className="mt-5 border-t border-dashed border-slate-200 pt-5">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Sampling level</label>
                    <select className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100">
                      {samplingLevels.map((level) => (
                        <option key={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">AQL</label>
                    <select className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100">
                      {aqlOptions.map((aql) => (
                        <option key={aql}>{aql}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Major</label>
                    <select className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100">
                      {majorOptions.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Minor</label>
                    <select className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100">
                      {minorOptions.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-5 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  <Info className="mt-0.5 h-5 w-5 text-blue-500" />
                  <p>
                    This inspection standard will be used by default for consumer goods inspections if you don&apos;t specify your own. You
                    may still modify your own sampling level and acceptable quality levels (AQL) in the drop-down menus.
                  </p>
                </div>

                <label className="mt-5 inline-flex cursor-pointer items-center gap-3 text-sm font-medium text-slate-700">
                  <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <span className="flex items-center gap-2">
                    Upload my own reporting format
                    <Upload className="h-4 w-4 text-slate-400" />
                  </span>
                </label>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-sm font-semibold text-slate-900">Write special note from your side</h2>
              <textarea
                rows={12}
                placeholder="Write special note from your side"
                className="mt-4 h-full w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </section>

          <div className="flex justify-center">
            <button
              type="submit"
              className="rounded-full bg-blue-500 px-14 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              Get Quote
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InspectionBuyer;
