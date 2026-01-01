import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const expertiseOptions = ['Inspection', 'Testing', 'Audit/Certification', 'Other'];
const inspectionTypes = [
  'Visual Inspection',
  'Physical Inspection',
  'Remote Inspection',
  '100 % inspection',
  'Random inspection',
  'Pre-shipment inspection',
  'During production inspection',
  'Initial production verification',
  'Container loading supervision',
  'Sample drawing',
  'Other',
  'Initial production Check',
  'Final Random inspection',
  'All',
];
const domainOptions = [
  'Food/industrial',
  'FMCG',
  'Pharmaceutical',
  'Transport',
  'Information Technology',
  'Arts',
  'Engineering',
  'Oil and gas',
  'Real Estate',
  'Education',
  'Other',
];
const productTags = ['Footwear', 'Gifts & Premiums', 'Categories of products'];
const languageTags = ['English', 'Hindi'];

const InspectionFormStandalone = () => {
  const [showOtherZone, setShowOtherZone] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Show success and redirect to login
    alert('Thank you for showing interest! We will contact you soon.');
    navigate('/login');
  };

  const handleBack = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Simple Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="w-full px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <img src="/images/logo.png" alt="Aaziko Logo" className="h-8 w-auto" />
          </div>
          <h1 className="text-lg font-semibold text-gray-800">Show Interest Form</h1>
        </div>
      </div>

      {/* Form Content - Full Width */}
      <div className="w-full py-8 px-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Inspection Service Interest</h2>
          <p className="text-gray-500 mt-1">Fill out the form below to express your interest</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-2xl shadow-sm px-8 py-10 space-y-8"
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                First name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="Enter first name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Last name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="Enter last name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Mobile number</label>
              <div className="flex gap-2">
                <select className="w-32 rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100">
                  <option value="in">+91</option>
                  <option value="us">+1</option>
                  <option value="uk">+44</option>
                </select>
                <input
                  type="tel"
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="Enter mobile number"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Email address<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="name@email.com"
              />
            </div>
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700">
                What is your field of expertise?<span className="text-red-500">*</span>
              </p>
              <div className="flex flex-wrap gap-3">
                {expertiseOptions.map((option) => (
                  <label key={option} className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-medium text-gray-700">
              What are your zone(s) of inspection?<span className="text-red-500">*</span>
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Country
                </label>
                <select className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100">
                  <option>India</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Select State (Province)
                </label>
                <div className="flex flex-wrap gap-2 rounded-lg border border-gray-300 px-3 py-2.5">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                    Gujrat
                  </span>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                    Maharashtra
                  </span>
                </div>
              </div>
              <div className="space-y-2 sm:col-span-2 lg:col-span-2">
                <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Select City
                </label>
                <div className="flex flex-wrap gap-2 rounded-lg border border-gray-300 px-3 py-2.5">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                    Ahmedabad
                  </span>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                    Surat
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowOtherZone(true)}
              className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              + Add Another Zone Of Inspection
            </button>

            {showOtherZone && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Country
                  </label>
                  <select className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100">
                    <option>India</option>
                    <option>United States</option>
                    <option>United Kingdom</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Select State (Province)
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    placeholder="Enter state"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2 lg:col-span-2">
                  <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Select City
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    placeholder="Enter city"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700">
                What type of inspections are you familiar with?<span className="text-red-500">*</span>
              </p>
              <div className="flex flex-wrap gap-3">
                {['Standard', 'Regulatory/ Mandatory', 'Customized'].map((option) => (
                  <label key={option} className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700">
                Select Your Standard Inspection Type<span className="text-red-500">*</span>
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {inspectionTypes.map((type) => (
                  <label key={type} className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">
              Which categories of products are you familiar with?
            </p>
            <div className="flex flex-wrap gap-2 rounded-lg border border-gray-300 px-3 py-2.5">
              {productTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600"
                >
                  {tag}
                </span>
              ))}
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Other
            </label>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              If other, please specify<span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="This field is required"
            />
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">
              In which domains do you feel you have expertise, or have qualifications?
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {domainOptions.map((domain) => (
                <label key={domain} className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  {domain}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">
              It's probably a good idea to upload your CV, and all copies of your degrees and
              training certificate here!<span className="text-red-500">*</span>
            </p>
            <div className="rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/40 px-6 py-10 text-center">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700">Drag or upload files</p>
                <p className="text-xs text-gray-500">
                  CV/Qualifications, accreditations, certifications, diplomas, degree... (.jpeg,
                  .pdf, .doc, .xls only)
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">
              Which language(s) are you really comfortable with?
            </p>
            <div className="flex flex-wrap gap-2 rounded-lg border border-gray-300 px-3 py-2.5">
              {languageTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600"
                >
                  {tag}
                </span>
              ))}
            </div>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="Type the initials of the language until the tag appears"
            />
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleBack}
              className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-orange-600 hover:to-orange-700"
            >
              Submit Interest
            </button>
          </div>
        </form>

        {/* Copyright */}
        <p className="text-center text-gray-400 text-sm mt-8">© 2026 Aaziko. All rights reserved.</p>
      </div>
    </div>
  );
};

export default InspectionFormStandalone;
