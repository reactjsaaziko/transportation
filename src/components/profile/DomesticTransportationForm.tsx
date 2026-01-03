import { useState, useRef } from 'react';
import { MapPin, Upload, X, FileText } from 'lucide-react';

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

// File Upload Component
const FileUploadButton = ({
  label,
  buttonText,
  accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx',
  onChange,
  fileName,
  onRemove,
}: {
  label: string;
  buttonText: string;
  accept?: string;
  onChange: (file: File | null) => void;
  fileName?: string;
  onRemove: () => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      {fileName ? (
        <div className="flex items-center gap-2 rounded-lg border border-green-300 bg-green-50 px-4 py-3">
          <FileText className="w-4 h-4 text-green-600" />
          <span className="text-sm text-green-700 flex-1 truncate">{fileName}</span>
          <button
            type="button"
            onClick={onRemove}
            className="p-1 hover:bg-green-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-green-600" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          className="w-full flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-500 hover:bg-gray-50 hover:border-blue-500 transition-colors"
        >
          <Upload className="w-4 h-4" />
          {buttonText}
        </button>
      )}
    </div>
  );
};

const DomesticTransportationForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    contactNo: '',
    email: '',
    companyName: '',
    gstNo: '',
    address: '',
    serviceType: '',
    vehicleTypes: '',
    fleetSize: '',
    coverageArea: '',
    yearsOfExperience: '',
    primaryOperatingStates: '',
    majorCitiesCovered: '',
    specializedRoutes: '',
    pricingModel: '',
    baseRate: '',
    paymentTerms: '',
    additionalServices: {
      loadingUnloading: false,
      packaging: false,
      insuranceCoverage: false,
      realTimeTracking: false,
      warehousing: false,
      doorToDoor: false,
      expressDelivery: false,
      fragileHandling: false,
    },
  });

  const [documents, setDocuments] = useState<{
    transportLicense: File | null;
    panCard: File | null;
    vehicleRC: File | null;
    pollutionCert: File | null;
    insuranceCert: File | null;
    driverLicense: File | null;
  }>({
    transportLicense: null,
    panCard: null,
    vehicleRC: null,
    pollutionCert: null,
    insuranceCert: null,
    driverLicense: null,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleServiceChange = (service: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      additionalServices: {
        ...prev.additionalServices,
        [service]: checked,
      },
    }));
  };

  const handleDocumentChange = (field: keyof typeof documents, file: File | null) => {
    setDocuments((prev) => ({ ...prev, [field]: file }));
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

      {/* Transport Service Details */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Transport Service Details</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <FloatingSelect
            label="Service Type"
            value={formData.serviceType}
            onChange={(value) => handleInputChange('serviceType', value)}
            required
            options={[
              { value: 'full-truck', label: 'Full Truck Load' },
              { value: 'part-truck', label: 'Part Truck Load' },
              { value: 'express', label: 'Express Delivery' },
              { value: 'container', label: 'Container Service' },
            ]}
          />
          <FloatingSelect
            label="Vehicle Types Available"
            value={formData.vehicleTypes}
            onChange={(value) => handleInputChange('vehicleTypes', value)}
            required
            options={[
              { value: 'truck', label: 'Truck' },
              { value: 'mini-truck', label: 'Mini Truck' },
              { value: 'container', label: 'Container' },
              { value: 'trailer', label: 'Trailer' },
            ]}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FloatingInput
            label="Fleet Size"
            type="number"
            value={formData.fleetSize}
            onChange={(value) => handleInputChange('fleetSize', value)}
            required
          />
          <FloatingSelect
            label="Coverage Area"
            value={formData.coverageArea}
            onChange={(value) => handleInputChange('coverageArea', value)}
            required
            options={[
              { value: 'India', label: 'India' },
              { value: 'North India', label: 'North India' },
              { value: 'South India', label: 'South India' },
              { value: 'East India', label: 'East India' },
              { value: 'West India', label: 'West India' },
            ]}
          />
          <FloatingInput
            label="Years of Experience"
            type="number"
            value={formData.yearsOfExperience}
            onChange={(value) => handleInputChange('yearsOfExperience', value)}
            required
          />
        </div>
      </div>

      {/* Operating Zones & Routes */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Operating Zones & Routes</h2>

        <div className="mb-4">
          <FloatingSelect
            label="Primary Operating States"
            value={formData.primaryOperatingStates}
            onChange={(value) => handleInputChange('primaryOperatingStates', value)}
            required
            options={[
              { value: 'maharashtra', label: 'Maharashtra' },
              { value: 'gujarat', label: 'Gujarat' },
              { value: 'rajasthan', label: 'Rajasthan' },
              { value: 'delhi', label: 'Delhi' },
              { value: 'karnataka', label: 'Karnataka' },
            ]}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FloatingTextarea
            label="Major Cities Covered"
            value={formData.majorCitiesCovered}
            onChange={(value) => handleInputChange('majorCitiesCovered', value)}
            required
          />
          <FloatingTextarea
            label="Specialized Routes (if any)"
            value={formData.specializedRoutes}
            onChange={(value) => handleInputChange('specializedRoutes', value)}
          />
        </div>
      </div>

      {/* Pricing & Terms */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Pricing & Terms</h2>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <FloatingSelect
            label="Pricing Model"
            value={formData.pricingModel}
            onChange={(value) => handleInputChange('pricingModel', value)}
            required
            options={[
              { value: 'per-km', label: 'Per Kilometer' },
              { value: 'per-trip', label: 'Per Trip' },
              { value: 'per-ton', label: 'Per Ton' },
              { value: 'fixed', label: 'Fixed Rate' },
            ]}
          />
          <FloatingInput
            label="Base Rate (₹)"
            value={formData.baseRate}
            onChange={(value) => handleInputChange('baseRate', value)}
            required
          />
          <FloatingSelect
            label="Payment Terms"
            value={formData.paymentTerms}
            onChange={(value) => handleInputChange('paymentTerms', value)}
            required
            options={[
              { value: 'advance', label: '100% Advance' },
              { value: 'cod', label: 'Cash on Delivery' },
              { value: 'credit-15', label: '15 Days Credit' },
              { value: 'credit-30', label: '30 Days Credit' },
            ]}
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Additional Services*</label>
          <div className="grid grid-cols-4 gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.additionalServices.loadingUnloading}
                onChange={(e) => handleServiceChange('loadingUnloading', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Loading/Unloading
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.additionalServices.packaging}
                onChange={(e) => handleServiceChange('packaging', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Packaging
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.additionalServices.insuranceCoverage}
                onChange={(e) => handleServiceChange('insuranceCoverage', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Insurance Coverage
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.additionalServices.realTimeTracking}
                onChange={(e) => handleServiceChange('realTimeTracking', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Real-time Tracking
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.additionalServices.warehousing}
                onChange={(e) => handleServiceChange('warehousing', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Warehousing
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.additionalServices.doorToDoor}
                onChange={(e) => handleServiceChange('doorToDoor', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Door-to-Door
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.additionalServices.expressDelivery}
                onChange={(e) => handleServiceChange('expressDelivery', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Express Delivery
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.additionalServices.fragileHandling}
                onChange={(e) => handleServiceChange('fragileHandling', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Fragile Handling
            </label>
          </div>
        </div>
      </div>

      {/* Documents & Certifications */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Documents & Certifications</h2>

        <div className="grid grid-cols-2 gap-6">
          <FileUploadButton
            label="Transport License*"
            buttonText="Upload Transport Licence"
            onChange={(file) => handleDocumentChange('transportLicense', file)}
            fileName={documents.transportLicense?.name}
            onRemove={() => handleDocumentChange('transportLicense', null)}
          />
          <FileUploadButton
            label="PAN Card*"
            buttonText="Upload Pan Card"
            onChange={(file) => handleDocumentChange('panCard', file)}
            fileName={documents.panCard?.name}
            onRemove={() => handleDocumentChange('panCard', null)}
          />
          <FileUploadButton
            label="Vehicle Registration Certificates*"
            buttonText="Upload RC Documents"
            onChange={(file) => handleDocumentChange('vehicleRC', file)}
            fileName={documents.vehicleRC?.name}
            onRemove={() => handleDocumentChange('vehicleRC', null)}
          />
          <FileUploadButton
            label="Pollution Certificate*"
            buttonText="Upload PUC Certificate"
            onChange={(file) => handleDocumentChange('pollutionCert', file)}
            fileName={documents.pollutionCert?.name}
            onRemove={() => handleDocumentChange('pollutionCert', null)}
          />
          <FileUploadButton
            label="Insurance Certificates*"
            buttonText="Upload Insurance Docs"
            onChange={(file) => handleDocumentChange('insuranceCert', file)}
            fileName={documents.insuranceCert?.name}
            onRemove={() => handleDocumentChange('insuranceCert', null)}
          />
          <FileUploadButton
            label="Driver License Copies*"
            buttonText="Upload Driver Licenses"
            onChange={(file) => handleDocumentChange('driverLicense', file)}
            fileName={documents.driverLicense?.name}
            onRemove={() => handleDocumentChange('driverLicense', null)}
          />
        </div>
      </div>

      {/* Application Status */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Application Status</h2>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full">
            Under Review
          </span>
          <span className="text-sm text-gray-600">
            Your application is being reviewed by our transport team
          </span>
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

export default DomesticTransportationForm;
