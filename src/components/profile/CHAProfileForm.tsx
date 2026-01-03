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
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
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
          ${isActive ? '-top-2.5 text-xs text-blue-500' : 'top-3 text-sm text-gray-500'}`}
      >
        {label}
        {required && <span className="text-red-500">*</span>}
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
      <input ref={inputRef} type="file" accept={accept} onChange={handleFileChange} className="hidden" />
      {fileName ? (
        <div className="flex items-center gap-2 rounded-lg border border-green-300 bg-green-50 px-4 py-3">
          <FileText className="w-4 h-4 text-green-600" />
          <span className="text-sm text-green-700 flex-1 truncate">{fileName}</span>
          <button type="button" onClick={onRemove} className="p-1 hover:bg-green-100 rounded-full transition-colors">
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

const CHAProfileForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    contactNo: '',
    email: '',
    companyName: '',
    gstNo: '',
    address: '',
    chaLicenseNumber: '',
    licenseIssueDate: '',
    licenseValidity: '',
    primaryPort: '',
    secondaryPorts: '',
    coverageAreaDetails: '',
    specialEquipment: '',
    yearsOfExperience: '',
    teamSize: '',
    specializations: '',
  });

  const [clientReferences, setClientReferences] = useState([
    { clientName: '', contactPerson: '', phoneNumber: '' },
    { clientName: '', contactPerson: '', phoneNumber: '' },
    { clientName: '', contactPerson: '', phoneNumber: '' },
  ]);

  const [documents, setDocuments] = useState<{
    licenseDocument: File | null;
  }>({
    licenseDocument: null,
  });

  const [importServices, setImportServices] = useState({
    customClearance: false,
    billOfEntryFiling: false,
    dutyAssessment: false,
    examinationHandling: false,
    fssaiClearance: false,
    plantQuarantine: false,
  });

  const [exportServices, setExportServices] = useState({
    shippingBillFiling: false,
    exportDocumentation: false,
    rcmcHandling: false,
    gstRefundProcessing: false,
    meisSeisClaims: false,
    preShipmentInspection: false,
  });

  const [cargoTypes, setCargoTypes] = useState({
    hazardousGoods: false,
    perishableItems: false,
    liveAnimals: false,
    examinationHandling: false,
  });

  const [specialPermits, setSpecialPermits] = useState({
    dgftLicense: false,
    drugLicense: false,
    fssaiRegistration: false,
    bisCertification: false,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDocumentChange = (field: keyof typeof documents, file: File | null) => {
    setDocuments((prev) => ({ ...prev, [field]: file }));
  };

  const handleClientReferenceChange = (index: number, field: string, value: string) => {
    setClientReferences((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
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

      {/* CHA License Information */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">CHA License Information</h2>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <FloatingInput
            label="CHA License Number"
            value={formData.chaLicenseNumber}
            onChange={(value) => handleInputChange('chaLicenseNumber', value)}
            required
          />
          <FloatingInput
            label="License Issue Date"
            type="date"
            value={formData.licenseIssueDate}
            onChange={(value) => handleInputChange('licenseIssueDate', value)}
            required
          />
          <FloatingInput
            label="License Validity"
            type="date"
            value={formData.licenseValidity}
            onChange={(value) => handleInputChange('licenseValidity', value)}
            required
          />
        </div>

        <div className="max-w-xs">
          <FileUploadButton
            label="License Document*"
            buttonText="Upload Lacense Copy"
            onChange={(file) => handleDocumentChange('licenseDocument', file)}
            fileName={documents.licenseDocument?.name}
            onRemove={() => handleDocumentChange('licenseDocument', null)}
          />
        </div>
      </div>

      {/* Port/Airport Coverage */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Port/Airport Coverage</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <FloatingSelect
            label="Primary Port/Airport"
            value={formData.primaryPort}
            onChange={(value) => handleInputChange('primaryPort', value)}
            required
            options={[
              { value: 'mumbai', label: 'Mumbai Port' },
              { value: 'chennai', label: 'Chennai Port' },
              { value: 'kolkata', label: 'Kolkata Port' },
              { value: 'delhi-airport', label: 'Delhi Airport' },
              { value: 'mumbai-airport', label: 'Mumbai Airport' },
              { value: 'nhava-sheva', label: 'Nhava Sheva' },
              { value: 'mundra', label: 'Mundra Port' },
            ]}
          />
          <FloatingSelect
            label="Secondary Ports/Airports"
            value={formData.secondaryPorts}
            onChange={(value) => handleInputChange('secondaryPorts', value)}
            options={[
              { value: 'mumbai', label: 'Mumbai Port' },
              { value: 'chennai', label: 'Chennai Port' },
              { value: 'kolkata', label: 'Kolkata Port' },
              { value: 'delhi-airport', label: 'Delhi Airport' },
              { value: 'mumbai-airport', label: 'Mumbai Airport' },
              { value: 'nhava-sheva', label: 'Nhava Sheva' },
              { value: 'mundra', label: 'Mundra Port' },
            ]}
          />
        </div>

        <FloatingTextarea
          label="Coverage Area Details"
          value={formData.coverageAreaDetails}
          onChange={(value) => handleInputChange('coverageAreaDetails', value)}
          rows={4}
        />
      </div>

      {/* Services Offered */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Services Offered</h2>

        <div className="grid grid-cols-2 gap-8">
          {/* Import Services */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Import Services</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={importServices.customClearance}
                  onChange={(e) => setImportServices((prev) => ({ ...prev, customClearance: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Custom Clearance
              </label>
              <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={importServices.billOfEntryFiling}
                  onChange={(e) => setImportServices((prev) => ({ ...prev, billOfEntryFiling: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Bill of Entry Filing
              </label>
              <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={importServices.dutyAssessment}
                  onChange={(e) => setImportServices((prev) => ({ ...prev, dutyAssessment: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Duty Assessment
              </label>
              <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={importServices.examinationHandling}
                  onChange={(e) => setImportServices((prev) => ({ ...prev, examinationHandling: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Examination Handling
              </label>
              <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={importServices.fssaiClearance}
                  onChange={(e) => setImportServices((prev) => ({ ...prev, fssaiClearance: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                FSSAI Clearance
              </label>
              <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={importServices.plantQuarantine}
                  onChange={(e) => setImportServices((prev) => ({ ...prev, plantQuarantine: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Plant Quarantine
              </label>
            </div>
          </div>

          {/* Export Services */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Export Services</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exportServices.shippingBillFiling}
                  onChange={(e) => setExportServices((prev) => ({ ...prev, shippingBillFiling: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Shipping Bill Filing
              </label>
              <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exportServices.exportDocumentation}
                  onChange={(e) => setExportServices((prev) => ({ ...prev, exportDocumentation: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Export Documentation
              </label>
              <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exportServices.rcmcHandling}
                  onChange={(e) => setExportServices((prev) => ({ ...prev, rcmcHandling: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                RCMC Handling
              </label>
              <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exportServices.gstRefundProcessing}
                  onChange={(e) => setExportServices((prev) => ({ ...prev, gstRefundProcessing: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                GST Refund Processing
              </label>
              <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exportServices.meisSeisClaims}
                  onChange={(e) => setExportServices((prev) => ({ ...prev, meisSeisClaims: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                MEIS/SEIS Claims
              </label>
              <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exportServices.preShipmentInspection}
                  onChange={(e) => setExportServices((prev) => ({ ...prev, preShipmentInspection: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Pre-shipment Inspection
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Special Cargo Handling */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Special Cargo Handling</h2>

        <div className="grid grid-cols-3 gap-8">
          {/* Cargo Types */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Cargo Types</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cargoTypes.hazardousGoods}
                  onChange={(e) => setCargoTypes((prev) => ({ ...prev, hazardousGoods: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Hazardous Goods
              </label>
              <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cargoTypes.perishableItems}
                  onChange={(e) => setCargoTypes((prev) => ({ ...prev, perishableItems: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Perishable Items
              </label>
              <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cargoTypes.liveAnimals}
                  onChange={(e) => setCargoTypes((prev) => ({ ...prev, liveAnimals: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Live Animals
              </label>
              <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cargoTypes.examinationHandling}
                  onChange={(e) => setCargoTypes((prev) => ({ ...prev, examinationHandling: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Examination Handling
              </label>
            </div>
          </div>

          {/* Special Permits */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Special Permits</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={specialPermits.dgftLicense}
                  onChange={(e) => setSpecialPermits((prev) => ({ ...prev, dgftLicense: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                DGFT License
              </label>
              <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={specialPermits.drugLicense}
                  onChange={(e) => setSpecialPermits((prev) => ({ ...prev, drugLicense: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Drug License
              </label>
              <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={specialPermits.fssaiRegistration}
                  onChange={(e) => setSpecialPermits((prev) => ({ ...prev, fssaiRegistration: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                FSSAI Registration
              </label>
              <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={specialPermits.bisCertification}
                  onChange={(e) => setSpecialPermits((prev) => ({ ...prev, bisCertification: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                BIS Certification
              </label>
            </div>
          </div>

          {/* Special Equipment */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Special Equipment</h3>
            <FloatingTextarea
              label="List any special equipment of facilities"
              value={formData.specialEquipment}
              onChange={(value) => handleInputChange('specialEquipment', value)}
              rows={5}
            />
          </div>
        </div>
      </div>

      {/* Client References */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Client References</h2>

        <div className="space-y-4">
          {clientReferences.map((ref, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-3 gap-4">
                <FloatingInput
                  label="Client Name"
                  value={ref.clientName}
                  onChange={(value) => handleClientReferenceChange(index, 'clientName', value)}
                  required
                />
                <FloatingInput
                  label="Contact Person"
                  value={ref.contactPerson}
                  onChange={(value) => handleClientReferenceChange(index, 'contactPerson', value)}
                  required
                />
                <FloatingInput
                  label="Phone Number"
                  type="tel"
                  value={ref.phoneNumber}
                  onChange={(value) => handleClientReferenceChange(index, 'phoneNumber', value)}
                  required
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Additional Information</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <FloatingSelect
            label="Years of Experience"
            value={formData.yearsOfExperience}
            onChange={(value) => handleInputChange('yearsOfExperience', value)}
            required
            options={[
              { value: '0-1', label: '0-1 Years' },
              { value: '1-3', label: '1-3 Years' },
              { value: '3-5', label: '3-5 Years' },
              { value: '5-10', label: '5-10 Years' },
              { value: '10+', label: '10+ Years' },
            ]}
          />
          <FloatingSelect
            label="Team Size"
            value={formData.teamSize}
            onChange={(value) => handleInputChange('teamSize', value)}
            required
            options={[
              { value: '1-5', label: '1-5 Members' },
              { value: '5-10', label: '5-10 Members' },
              { value: '10-25', label: '10-25 Members' },
              { value: '25-50', label: '25-50 Members' },
              { value: '50+', label: '50+ Members' },
            ]}
          />
        </div>

        <FloatingTextarea
          label="Specializations & Certifications"
          value={formData.specializations}
          onChange={(value) => handleInputChange('specializations', value)}
          required
          rows={4}
        />
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

export default CHAProfileForm;
