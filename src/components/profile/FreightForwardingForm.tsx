import { useState } from 'react';
import { MapPin, Phone } from 'lucide-react';

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
          ${isActive ? '-top-2.5 text-xs text-blue-500' : 'top-1/2 -translate-y-1/2 text-sm text-gray-500'}`}
      >
        {label}
        {required && <span className="text-red-500">*</span>}
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
          ${isActive ? '-top-2.5 text-xs text-blue-500' : 'top-1/2 -translate-y-1/2 text-sm text-gray-500'}`}
      >
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

const FreightForwardingForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    contactNo: '',
    email: '',
    companyName: '',
    gstNo: '',
    address: '',
    country: '',
    lclFcl: '',
    cargo: '',
    enableApi: false,
    contactPerson: '',
    contactNumber: '',
    accountNumber: '',
    ifscCode: '',
    paymentTerm: '',
    bankCompanyName: '',
    bankGstNo: '',
    transactionalCurrency: '',
    operationalCurrency: '',
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

      {/* What are your zone(s) of inspection? */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          What are your zone(s) of inspection? <span className="text-red-500">*</span>
        </h2>

        <div className="grid grid-cols-4 gap-4 items-start">
          <FloatingSelect
            label="Country"
            value={formData.country}
            onChange={(value) => handleInputChange('country', value)}
            required
            options={[
              { value: 'india', label: 'India' },
              { value: 'usa', label: 'USA' },
              { value: 'uk', label: 'UK' },
              { value: 'uae', label: 'UAE' },
              { value: 'singapore', label: 'Singapore' },
            ]}
          />
          <FloatingSelect
            label="Select LCL/FCL"
            value={formData.lclFcl}
            onChange={(value) => handleInputChange('lclFcl', value)}
            required
            options={[
              { value: 'lcl', label: 'LCL' },
              { value: 'fcl', label: 'FCL' },
              { value: 'both', label: 'Both' },
            ]}
          />
          <FloatingSelect
            label="Select Cargo"
            value={formData.cargo}
            onChange={(value) => handleInputChange('cargo', value)}
            required
            options={[
              { value: 'all', label: 'All' },
              { value: 'general', label: 'General Cargo' },
              { value: 'hazardous', label: 'Hazardous' },
              { value: 'perishable', label: 'Perishable' },
              { value: 'oversized', label: 'Oversized' },
            ]}
          />
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              API<span className="text-red-500">*</span>
            </label>
            <label className="flex items-center gap-2 py-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.enableApi}
                onChange={(e) => handleInputChange('enableApi', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Enable API</span>
            </label>
          </div>
        </div>
      </div>

      {/* API Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          API<span className="text-red-500">*</span>
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <FloatingInput
            label="Contact Person"
            value={formData.contactPerson}
            onChange={(value) => handleInputChange('contactPerson', value)}
            required
            icon={<Phone className="w-4 h-4" />}
          />
          <FloatingInput
            label="Contact Number"
            type="tel"
            value={formData.contactNumber}
            onChange={(value) => handleInputChange('contactNumber', value)}
            required
            icon={<Phone className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Bank Details */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Bank Details</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <FloatingInput
            label="Account Number"
            value={formData.accountNumber}
            onChange={(value) => handleInputChange('accountNumber', value)}
            required
          />
          <FloatingInput
            label="IFSC Code"
            value={formData.ifscCode}
            onChange={(value) => handleInputChange('ifscCode', value)}
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <FloatingSelect
            label="Payment Term"
            value={formData.paymentTerm}
            onChange={(value) => handleInputChange('paymentTerm', value)}
            required
            options={[
              { value: 'on-site', label: 'On Site' },
              { value: 'advance', label: 'Advance' },
              { value: 'credit-15', label: '15 Days Credit' },
              { value: 'credit-30', label: '30 Days Credit' },
            ]}
          />
          <FloatingSelect
            label="Company Name"
            value={formData.bankCompanyName}
            onChange={(value) => handleInputChange('bankCompanyName', value)}
            required
            options={[
              { value: 'current', label: 'Current' },
              { value: 'savings', label: 'Savings' },
            ]}
          />
          <FloatingSelect
            label="GST No"
            value={formData.bankGstNo}
            onChange={(value) => handleInputChange('bankGstNo', value)}
            required
            options={[
              { value: 'rts-bank', label: 'RTS Bank' },
              { value: 'sbi', label: 'SBI' },
              { value: 'hdfc', label: 'HDFC' },
              { value: 'icici', label: 'ICICI' },
            ]}
          />
        </div>

        <div className="grid grid-cols-3 gap-4 items-center">
          <FloatingSelect
            label="Transactional Currency"
            value={formData.transactionalCurrency}
            onChange={(value) => handleInputChange('transactionalCurrency', value)}
            options={[
              { value: 'inr', label: 'INR' },
              { value: 'usd', label: 'USD' },
              { value: 'eur', label: 'EUR' },
              { value: 'gbp', label: 'GBP' },
            ]}
          />
          <FloatingSelect
            label="Operational Currency"
            value={formData.operationalCurrency}
            onChange={(value) => handleInputChange('operationalCurrency', value)}
            options={[
              { value: 'inr', label: 'INR' },
              { value: 'usd', label: 'USD' },
              { value: 'eur', label: 'EUR' },
              { value: 'gbp', label: 'GBP' },
            ]}
          />
          <button className="text-blue-500 text-sm hover:underline text-left">
            Currency Exchange Rate
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button className="rounded-lg bg-blue-500 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600">
          Submit
        </button>
      </div>
    </div>
  );
};

export default FreightForwardingForm;
