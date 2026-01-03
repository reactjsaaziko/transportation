import { FormEvent, useState, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, MapPin, Phone } from 'lucide-react';

// Floating Label Input Component
const FloatingInput = ({
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  icon,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  icon?: React.ReactNode;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const isActive = isFocused || value;

  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full rounded-lg border bg-white px-4 py-3 text-sm transition-all duration-200 peer
          ${icon ? 'pl-10' : 'pl-4'}
          ${isFocused ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-300'}
          focus:outline-none`}
      />
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <label
        className={`absolute transition-all duration-200 pointer-events-none bg-white px-1
          ${icon ? 'left-9' : 'left-3'}
          ${isActive 
            ? '-top-2.5 text-xs text-blue-500' 
            : 'top-1/2 -translate-y-1/2 text-sm text-gray-500'
          }`}
      >
        {label}{required && <span className="text-red-500">*</span>}
      </label>
    </div>
  );
};

// Floating Label Select Component
const FloatingSelect = ({
  label,
  value,
  onChange,
  options,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const isActive = isFocused || value;

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full rounded-lg border bg-white px-4 py-3 text-sm transition-all duration-200 appearance-none
          ${isFocused ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-300'}
          focus:outline-none`}
      >
        <option value=""></option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <label
        className={`absolute left-3 transition-all duration-200 pointer-events-none bg-white px-1
          ${isActive 
            ? '-top-2.5 text-xs text-blue-500' 
            : 'top-1/2 -translate-y-1/2 text-sm text-gray-500'
          }`}
      >
        {label}{required && <span className="text-red-500">*</span>}
      </label>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

// Floating Label Textarea Component
const FloatingTextarea = ({
  label,
  value,
  onChange,
  required = false,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  rows?: number;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const isActive = isFocused || value;

  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        rows={rows}
        className={`w-full rounded-lg border bg-white px-4 py-3 text-sm transition-all duration-200 resize-none
          ${isFocused ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-300'}
          focus:outline-none`}
      />
      <label
        className={`absolute left-3 transition-all duration-200 pointer-events-none bg-white px-1
          ${isActive 
            ? '-top-2.5 text-xs text-blue-500' 
            : 'top-3 text-sm text-gray-500'
          }`}
      >
        {label}{required && <span className="text-red-500">*</span>}
      </label>
    </div>
  );
};

// Tag Input Component with Floating Label
const FloatingTagInput = ({
  label,
  tags,
  onAddTag,
  onRemoveTag,
  inputValue,
  onInputChange,
  onKeyDown,
  required = false,
}: {
  label: string;
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  inputValue: string;
  onInputChange: (value: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  required?: boolean;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const isActive = isFocused || tags.length > 0 || inputValue;

  return (
    <div className="relative">
      <div
        className={`flex flex-wrap gap-2 rounded-lg border bg-white px-4 py-3 min-h-[48px] transition-all duration-200
          ${isFocused ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-300'}`}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600"
          >
            {tag}
            <button type="button" onClick={() => onRemoveTag(tag)} className="hover:text-blue-800">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 min-w-[100px] text-sm focus:outline-none bg-transparent"
          placeholder=""
        />
      </div>
      <label
        className={`absolute left-3 transition-all duration-200 pointer-events-none bg-white px-1
          ${isActive 
            ? '-top-2.5 text-xs text-blue-500' 
            : 'top-1/2 -translate-y-1/2 text-sm text-gray-500'
          }`}
      >
        {label}{required && <span className="text-red-500">*</span>}
      </label>
    </div>
  );
};

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

const InspectionForm = () => {
  const [showOtherZone, setShowOtherZone] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    contactNo: '',
    email: '',
    companyName: '',
    gstNo: '',
    address: '',
    country: '',
    otherCountry: '',
    otherSpecify: '',
    languageInput: '',
  });

  const [stateTags, setStateTags] = useState<string[]>([]);
  const [cityTags, setCityTags] = useState<string[]>([]);
  const [stateInput, setStateInput] = useState('');
  const [cityInput, setCityInput] = useState('');
  const [productTags, setProductTags] = useState<string[]>(['Footwear', 'Gifts & Premiums']);
  const [productInput, setProductInput] = useState('');
  const [languageTags, setLanguageTags] = useState<string[]>(['English', 'Hindi']);
  const [languageInput, setLanguageInput] = useState('');

  const [expertise, setExpertise] = useState<Record<string, boolean>>({});
  const [inspectionFamiliarity, setInspectionFamiliarity] = useState<Record<string, boolean>>({});
  const [standardInspectionTypes, setStandardInspectionTypes] = useState<Record<string, boolean>>({});
  const [domains, setDomains] = useState<Record<string, boolean>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate('/dashboard/inspection-service');
  };

  const handleStateKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === ' ' || e.key === 'Enter') && stateInput.trim()) {
      e.preventDefault();
      if (!stateTags.includes(stateInput.trim())) {
        setStateTags([...stateTags, stateInput.trim()]);
      }
      setStateInput('');
    } else if (e.key === 'Backspace' && !stateInput && stateTags.length > 0) {
      setStateTags(stateTags.slice(0, -1));
    }
  };

  const handleCityKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === ' ' || e.key === 'Enter') && cityInput.trim()) {
      e.preventDefault();
      if (!cityTags.includes(cityInput.trim())) {
        setCityTags([...cityTags, cityInput.trim()]);
      }
      setCityInput('');
    } else if (e.key === 'Backspace' && !cityInput && cityTags.length > 0) {
      setCityTags(cityTags.slice(0, -1));
    }
  };

  const handleProductKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === ' ' || e.key === 'Enter') && productInput.trim()) {
      e.preventDefault();
      if (!productTags.includes(productInput.trim())) {
        setProductTags([...productTags, productInput.trim()]);
      }
      setProductInput('');
    } else if (e.key === 'Backspace' && !productInput && productTags.length > 0) {
      setProductTags(productTags.slice(0, -1));
    }
  };

  const handleLanguageKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === ' ' || e.key === 'Enter') && languageInput.trim()) {
      e.preventDefault();
      if (!languageTags.includes(languageInput.trim())) {
        setLanguageTags([...languageTags, languageInput.trim()]);
      }
      setLanguageInput('');
    } else if (e.key === 'Backspace' && !languageInput && languageTags.length > 0) {
      setLanguageTags(languageTags.slice(0, -1));
    }
  };

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Personal Information</h2>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <FloatingInput
            label="First name"
            value={formData.firstName}
            onChange={(value) => handleInputChange('firstName', value)}
            required
          />
          <FloatingInput
            label="Last name"
            value={formData.lastName}
            onChange={(value) => handleInputChange('lastName', value)}
            required
          />
          <FloatingInput
            label="Contact No"
            type="tel"
            value={formData.contactNo}
            onChange={(value) => handleInputChange('contactNo', value)}
            required
            icon={<Phone className="w-4 h-4" />}
          />
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <FloatingInput
            label="Email address"
            type="email"
            value={formData.email}
            onChange={(value) => handleInputChange('email', value)}
            required
          />
          <FloatingInput
            label="Company Name"
            value={formData.companyName}
            onChange={(value) => handleInputChange('companyName', value)}
            required
          />
          <FloatingInput
            label="GST No"
            value={formData.gstNo}
            onChange={(value) => handleInputChange('gstNo', value)}
            required
          />
        </div>

        <FloatingInput
          label="Address"
          value={formData.address}
          onChange={(value) => handleInputChange('address', value)}
          required
          icon={<MapPin className="w-4 h-4" />}
        />
      </div>

      {/* Field of Expertise */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          What is your field of expertise?<span className="text-red-500">*</span>
        </h2>
        <div className="flex flex-wrap gap-4">
          {expertiseOptions.map((option) => (
            <label key={option} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={expertise[option] || false}
                onChange={(e) => setExpertise((prev) => ({ ...prev, [option]: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      {/* Zone of Inspection */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          What are your zone(s) of inspection?<span className="text-red-500">*</span>
        </h2>

        <div className="grid grid-cols-4 gap-4 mb-4">
          <FloatingSelect
            label="Country"
            value={formData.country}
            onChange={(value) => handleInputChange('country', value)}
            required
            options={[
              { value: 'india', label: 'India' },
              { value: 'usa', label: 'United States' },
              { value: 'uk', label: 'United Kingdom' },
              { value: 'uae', label: 'UAE' },
              { value: 'singapore', label: 'Singapore' },
            ]}
          />
          <FloatingTagInput
            label="Select State (Province)"
            tags={stateTags}
            onAddTag={(tag) => setStateTags([...stateTags, tag])}
            onRemoveTag={(tag) => setStateTags(stateTags.filter((t) => t !== tag))}
            inputValue={stateInput}
            onInputChange={setStateInput}
            onKeyDown={handleStateKeyDown}
            required
          />
          <div className="col-span-2">
            <FloatingTagInput
              label="Select City"
              tags={cityTags}
              onAddTag={(tag) => setCityTags([...cityTags, tag])}
              onRemoveTag={(tag) => setCityTags(cityTags.filter((t) => t !== tag))}
              inputValue={cityInput}
              onInputChange={setCityInput}
              onKeyDown={handleCityKeyDown}
              required
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowOtherZone(!showOtherZone)}
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          + Add Another Zone Of Inspection
        </button>

        {showOtherZone && (
          <div className="grid grid-cols-4 gap-4 mt-4">
            <FloatingSelect
              label="Country"
              value={formData.otherCountry}
              onChange={(value) => handleInputChange('otherCountry', value)}
              options={[
                { value: 'india', label: 'India' },
                { value: 'usa', label: 'United States' },
                { value: 'uk', label: 'United Kingdom' },
                { value: 'uae', label: 'UAE' },
                { value: 'singapore', label: 'Singapore' },
              ]}
            />
            <FloatingInput
              label="State (Province)"
              value=""
              onChange={() => {}}
            />
            <div className="col-span-2">
              <FloatingInput
                label="City"
                value=""
                onChange={() => {}}
              />
            </div>
          </div>
        )}
      </div>

      {/* Inspection Familiarity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          What type of inspections are you familiar with?<span className="text-red-500">*</span>
        </h2>
        <div className="flex flex-wrap gap-4">
          {['Standard', 'Regulatory/ Mandatory', 'Customized'].map((option) => (
            <label key={option} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={inspectionFamiliarity[option] || false}
                onChange={(e) => setInspectionFamiliarity((prev) => ({ ...prev, [option]: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      {/* Standard Inspection Types */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Select Your Standard Inspection Type<span className="text-red-500">*</span>
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {inspectionTypes.map((type) => (
            <label key={type} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={standardInspectionTypes[type] || false}
                onChange={(e) => setStandardInspectionTypes((prev) => ({ ...prev, [type]: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      {/* Product Categories */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Which categories of products are you familiar with?
        </h2>
        <FloatingTagInput
          label="Product Categories"
          tags={productTags}
          onAddTag={(tag) => setProductTags([...productTags, tag])}
          onRemoveTag={(tag) => setProductTags(productTags.filter((t) => t !== tag))}
          inputValue={productInput}
          onInputChange={setProductInput}
          onKeyDown={handleProductKeyDown}
        />
      </div>

      {/* Other Specify */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          If other, please specify<span className="text-red-500">*</span>
        </h2>
        <FloatingTextarea
          label="Please specify"
          value={formData.otherSpecify}
          onChange={(value) => handleInputChange('otherSpecify', value)}
          required
          rows={3}
        />
      </div>

      {/* Domain Expertise */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          In which domains do you feel you have expertise, or have qualifications?
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {domainOptions.map((domain) => (
            <label key={domain} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={domains[domain] || false}
                onChange={(e) => setDomains((prev) => ({ ...prev, [domain]: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              {domain}
            </label>
          ))}
        </div>
      </div>

      {/* CV/Documents Upload */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          It's probably a good idea to upload your CV, and all copies of your degrees and training certificate here!<span className="text-red-500">*</span>
        </h2>
        <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white px-6 py-10 text-center hover:border-blue-400 transition-colors cursor-pointer">
          <p className="text-sm text-gray-600">
            Drag or <span className="text-blue-500 hover:underline">upload</span> files
          </p>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          CV,qualifications, accrediatations, certifications, diploma, degree,...( .jpeg, .pdf, .doc, .xls only)
        </p>
      </div>

      {/* Languages */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Which language(s) are you really comfortable with?
        </h2>
        <FloatingTagInput
          label="Languages"
          tags={languageTags}
          onAddTag={(tag) => setLanguageTags([...languageTags, tag])}
          onRemoveTag={(tag) => setLanguageTags(languageTags.filter((t) => t !== tag))}
          inputValue={languageInput}
          onInputChange={setLanguageInput}
          onKeyDown={handleLanguageKeyDown}
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            navigate('/dashboard/inspection-service');
          }}
          className="rounded-lg bg-blue-500 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default InspectionForm;
