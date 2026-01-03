import { useState, useRef } from 'react';
import { MapPin, Upload, ZoomIn, ZoomOut, Download, Eye, Clock, CheckCircle } from 'lucide-react';

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

const WarehouseProfileForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    contactNo: '',
    email: '',
    companyName: '',
    gstNo: '',
    address: '',
    warehouseName: '',
    totalArea: '',
    storageCapacity: '',
    warehouseType: '',
    facilityGrade: '',
    operatingHours: '',
    warehouseAddress: '',
    numberOfForklifts: '',
    dockDoors: '',
    rackingSystemType: '',
    rackingCapacity: '',
    warehouseManagementSystem: '',
    securitySystems: '',
    warehouseLicenseNo: '',
    licenseExpiryDate: '',
    isoCertification: '',
    fireSafetyLicense: '',
    pollutionClearance: '',
    fssaiLicense: '',
  });

  const [availableServices, setAvailableServices] = useState({
    pickAndPack: false,
    crossDocking: false,
    inventoryManagement: false,
    qualityInspection: false,
    labelingPackaging: false,
    kittingAssembly: false,
    returnsProcessing: false,
    valueAddedServices: false,
  });

  const [certifications, setCertifications] = useState({
    haccpCertified: false,
    drugLicense: false,
    customsBonded: false,
    temperatureControlled: false,
    hazmatCertified: false,
    pharmaGrade: false,
  });

  const [serviceCoverage, setServiceCoverage] = useState({
    primaryCoverageState: '',
    coverageCities: '',
  });

  const [agreementDetails, setAgreementDetails] = useState({
    agreementNumber: '',
    agreementDate: '',
  });

  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    ifscCode: '',
    paymentTerm: '',
    companyName: '',
    gstNo: '',
    transactionalCurrency: '',
    operationalCurrency: '',
  });

  const agreementFileRef = useRef<HTMLInputElement>(null);
  const coverageFileRef = useRef<HTMLInputElement>(null);
  const [agreementFile, setAgreementFile] = useState<File | null>(null);
  const [coverageFile, setCoverageFile] = useState<File | null>(null);

  const handleInputChange = (field: string, value: string) => {
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

      {/* Warehouse Facility Details */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Warehouse Facility Details</h2>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <FloatingInput
            label="Warehouse Name"
            value={formData.warehouseName}
            onChange={(value) => handleInputChange('warehouseName', value)}
            required
          />
          <FloatingInput
            label="Total Area (sq ft)"
            value={formData.totalArea}
            onChange={(value) => handleInputChange('totalArea', value)}
            required
          />
          <FloatingInput
            label="Storage Capacity (MT)"
            value={formData.storageCapacity}
            onChange={(value) => handleInputChange('storageCapacity', value)}
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <FloatingSelect
            label="Warehouse Type"
            value={formData.warehouseType}
            onChange={(value) => handleInputChange('warehouseType', value)}
            required
            options={[
              { value: 'general', label: 'General Warehouse' },
              { value: 'cold-storage', label: 'Cold Storage' },
              { value: 'bonded', label: 'Bonded Warehouse' },
              { value: 'hazmat', label: 'Hazmat Warehouse' },
              { value: 'distribution', label: 'Distribution Center' },
              { value: 'fulfillment', label: 'Fulfillment Center' },
            ]}
          />
          <FloatingSelect
            label="Facility Grade"
            value={formData.facilityGrade}
            onChange={(value) => handleInputChange('facilityGrade', value)}
            required
            options={[
              { value: 'grade-a', label: 'Grade A' },
              { value: 'grade-b', label: 'Grade B' },
              { value: 'grade-c', label: 'Grade C' },
            ]}
          />
          <FloatingInput
            label="Operating Hours"
            value={formData.operatingHours}
            onChange={(value) => handleInputChange('operatingHours', value)}
            required
          />
        </div>

        <FloatingInput
          label="Warehouse Address"
          value={formData.warehouseAddress}
          onChange={(value) => handleInputChange('warehouseAddress', value)}
          required
          icon={<MapPin className="w-4 h-4" />}
        />
      </div>


      {/* Equipment & Infrastructure */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Equipment & Infrastructure</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <FloatingInput
            label="Number of Forklifts"
            value={formData.numberOfForklifts}
            onChange={(value) => handleInputChange('numberOfForklifts', value)}
            required
          />
          <FloatingInput
            label="Loading/Unloading Dock Doors"
            value={formData.dockDoors}
            onChange={(value) => handleInputChange('dockDoors', value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <FloatingSelect
            label="Racking System Type"
            value={formData.rackingSystemType}
            onChange={(value) => handleInputChange('rackingSystemType', value)}
            required
            options={[
              { value: 'selective', label: 'Selective Racking' },
              { value: 'drive-in', label: 'Drive-In Racking' },
              { value: 'push-back', label: 'Push Back Racking' },
              { value: 'pallet-flow', label: 'Pallet Flow Racking' },
              { value: 'cantilever', label: 'Cantilever Racking' },
              { value: 'mobile', label: 'Mobile Racking' },
            ]}
          />
          <FloatingSelect
            label="Racking Capacity (pallets)"
            value={formData.rackingCapacity}
            onChange={(value) => handleInputChange('rackingCapacity', value)}
            required
            options={[
              { value: '0-500', label: '0-500 Pallets' },
              { value: '500-1000', label: '500-1000 Pallets' },
              { value: '1000-5000', label: '1000-5000 Pallets' },
              { value: '5000-10000', label: '5000-10000 Pallets' },
              { value: '10000+', label: '10000+ Pallets' },
            ]}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <FloatingSelect
            label="Warehouse Management System"
            value={formData.warehouseManagementSystem}
            onChange={(value) => handleInputChange('warehouseManagementSystem', value)}
            required
            options={[
              { value: 'sap', label: 'SAP WMS' },
              { value: 'oracle', label: 'Oracle WMS' },
              { value: 'manhattan', label: 'Manhattan WMS' },
              { value: 'blue-yonder', label: 'Blue Yonder' },
              { value: 'infor', label: 'Infor WMS' },
              { value: 'custom', label: 'Custom WMS' },
              { value: 'none', label: 'No WMS' },
            ]}
          />
          <FloatingSelect
            label="Security Systems"
            value={formData.securitySystems}
            onChange={(value) => handleInputChange('securitySystems', value)}
            required
            options={[
              { value: 'cctv', label: 'CCTV Only' },
              { value: 'cctv-access', label: 'CCTV + Access Control' },
              { value: 'full', label: 'CCTV + Access Control + Guards' },
              { value: 'advanced', label: 'Advanced Security System' },
            ]}
          />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Available Services*</h3>
          <div className="grid grid-cols-4 gap-4">
            <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={availableServices.pickAndPack}
                onChange={(e) => setAvailableServices((prev) => ({ ...prev, pickAndPack: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Pick & Pack
            </label>
            <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={availableServices.crossDocking}
                onChange={(e) => setAvailableServices((prev) => ({ ...prev, crossDocking: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Cross Docking
            </label>
            <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={availableServices.inventoryManagement}
                onChange={(e) => setAvailableServices((prev) => ({ ...prev, inventoryManagement: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Inventory Management
            </label>
            <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={availableServices.qualityInspection}
                onChange={(e) => setAvailableServices((prev) => ({ ...prev, qualityInspection: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Quality Inspection
            </label>
            <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={availableServices.labelingPackaging}
                onChange={(e) => setAvailableServices((prev) => ({ ...prev, labelingPackaging: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Labeling & Packaging
            </label>
            <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={availableServices.kittingAssembly}
                onChange={(e) => setAvailableServices((prev) => ({ ...prev, kittingAssembly: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Kitting & Assembly
            </label>
            <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={availableServices.returnsProcessing}
                onChange={(e) => setAvailableServices((prev) => ({ ...prev, returnsProcessing: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Returns Processing
            </label>
            <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={availableServices.valueAddedServices}
                onChange={(e) => setAvailableServices((prev) => ({ ...prev, valueAddedServices: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Value Added Services
            </label>
          </div>
        </div>
      </div>

      {/* Licenses & Certifications */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Licenses & Certifications</h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <FloatingInput
            label="Warehouse License No"
            value={formData.warehouseLicenseNo}
            onChange={(value) => handleInputChange('warehouseLicenseNo', value)}
            required
          />
          <FloatingInput
            label="License Expiry Date"
            type="date"
            value={formData.licenseExpiryDate}
            onChange={(value) => handleInputChange('licenseExpiryDate', value)}
            required
          />
          <FloatingInput
            label="ISO Certification"
            value={formData.isoCertification}
            onChange={(value) => handleInputChange('isoCertification', value)}
          />
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <FloatingInput
            label="Fire Safety License"
            value={formData.fireSafetyLicense}
            onChange={(value) => handleInputChange('fireSafetyLicense', value)}
            required
          />
          <FloatingInput
            label="Pollution Clearance"
            value={formData.pollutionClearance}
            onChange={(value) => handleInputChange('pollutionClearance', value)}
            required
          />
          <FloatingInput
            label="FSSAI License (if applicable)"
            value={formData.fssaiLicense}
            onChange={(value) => handleInputChange('fssaiLicense', value)}
          />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Certifications*</h3>
          <div className="grid grid-cols-3 gap-4">
            <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={certifications.haccpCertified}
                onChange={(e) => setCertifications((prev) => ({ ...prev, haccpCertified: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              HACCP Certified
            </label>
            <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={certifications.drugLicense}
                onChange={(e) => setCertifications((prev) => ({ ...prev, drugLicense: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Drug License
            </label>
            <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={certifications.customsBonded}
                onChange={(e) => setCertifications((prev) => ({ ...prev, customsBonded: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Customs Bonded
            </label>
            <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={certifications.temperatureControlled}
                onChange={(e) => setCertifications((prev) => ({ ...prev, temperatureControlled: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Temperature Controlled
            </label>
            <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={certifications.hazmatCertified}
                onChange={(e) => setCertifications((prev) => ({ ...prev, hazmatCertified: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Hazmat Certified
            </label>
            <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={certifications.pharmaGrade}
                onChange={(e) => setCertifications((prev) => ({ ...prev, pharmaGrade: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Pharma Grade
            </label>
          </div>
        </div>
      </div>

      {/* Service Coverage Areas */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Service Coverage Areas</h2>

        <div className="grid grid-cols-3 gap-4 items-start">
          <FloatingSelect
            label="Primary Coverage State"
            value={serviceCoverage.primaryCoverageState}
            onChange={(value) => setServiceCoverage((prev) => ({ ...prev, primaryCoverageState: value }))}
            required
            options={[
              { value: 'maharashtra', label: 'Maharashtra' },
              { value: 'gujarat', label: 'Gujarat' },
              { value: 'karnataka', label: 'Karnataka' },
              { value: 'tamil-nadu', label: 'Tamil Nadu' },
              { value: 'delhi', label: 'Delhi' },
              { value: 'west-bengal', label: 'West Bengal' },
              { value: 'rajasthan', label: 'Rajasthan' },
              { value: 'uttar-pradesh', label: 'Uttar Pradesh' },
            ]}
          />
          <FloatingInput
            label="Coverage Cities"
            value={serviceCoverage.coverageCities}
            onChange={(value) => setServiceCoverage((prev) => ({ ...prev, coverageCities: value }))}
          />
          <div className="relative">
            <input
              ref={coverageFileRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setCoverageFile(e.target.files?.[0] || null)}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => coverageFileRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-500 hover:bg-gray-50 hover:border-blue-500 transition-colors"
            >
              <Upload className="w-4 h-4" />
              {coverageFile ? coverageFile.name : 'Upload Agreement'}
            </button>
            <label className="absolute -top-2.5 left-3 text-xs text-blue-500 bg-white px-1">
              Agreement File<span className="text-red-500">*</span>
            </label>
          </div>
        </div>
      </div>

      {/* Agreement Details */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Agreement Details</h2>

        <div className="grid grid-cols-3 gap-4 items-start mb-4">
          <FloatingInput
            label="Agreement Number"
            value={agreementDetails.agreementNumber}
            onChange={(value) => setAgreementDetails((prev) => ({ ...prev, agreementNumber: value }))}
            required
          />
          <FloatingInput
            label="Agreement Date"
            type="date"
            value={agreementDetails.agreementDate}
            onChange={(value) => setAgreementDetails((prev) => ({ ...prev, agreementDate: value }))}
            required
          />
          <div className="relative">
            <input
              ref={agreementFileRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setAgreementFile(e.target.files?.[0] || null)}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => agreementFileRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-500 hover:bg-gray-50 hover:border-blue-500 transition-colors"
            >
              <Upload className="w-4 h-4" />
              {agreementFile ? agreementFile.name : 'Upload Agreement'}
            </button>
            <label className="absolute -top-2.5 left-3 text-xs text-blue-500 bg-white px-1">
              Agreement File<span className="text-red-500">*</span>
            </label>
          </div>
        </div>

        <button className="text-blue-500 text-sm hover:underline">I need changes ?</button>
      </div>

      {/* Document Preview */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="bg-gray-800 rounded-t-lg px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4 text-white text-sm">
            <span>Doc.com/pdf</span>
            <span>1 / 1</span>
            <span>100%</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1 text-white hover:bg-gray-700 rounded">
              <ZoomOut className="w-4 h-4" />
            </button>
            <button className="p-1 text-white hover:bg-gray-700 rounded">
              <ZoomIn className="w-4 h-4" />
            </button>
            <button className="p-1 text-white hover:bg-gray-700 rounded">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="border border-t-0 border-gray-200 rounded-b-lg p-8 bg-gray-50 min-h-[200px]">
          <div className="text-center mb-6">
            <h3 className="text-sm font-semibold text-gray-800">FREIGHT FORWARDING AGREEMENT</h3>
            <p className="text-xs text-gray-500">Service Agreement Document</p>
          </div>
          <div className="text-xs text-gray-600 space-y-2">
            <p>This agreement is entered into between Aaziko Logistics Private Limited and the Client for freight forwarding services...</p>
            <p className="font-medium">Terms and Conditions:</p>
            <p>1. Service Scope: Complete logistics and freight forwarding solutions</p>
            <p>2. Liability: As per industry standards and applicable regulations</p>
            <p>3. Payment Terms: As agreed in the commercial proposal</p>
          </div>
        </div>

        <div className="flex justify-center mt-4">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <Eye className="w-4 h-4" />
            View Full Document
          </button>
        </div>
      </div>

      {/* Changes Requested by Buyer */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Changes Requested by Buyer</h2>

        <div className="flex flex-col gap-2 mb-4">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white text-sm rounded-full w-fit">
            <Clock className="w-4 h-4" />
            Admin working...
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-sm rounded-full w-fit">
            <CheckCircle className="w-4 h-4" />
            Done
          </span>
        </div>

        <p className="text-sm text-gray-700">
          <span className="font-medium">Notes :</span> Warehouse facility inspection completed. Storage capacity verified.
        </p>
      </div>

      {/* Bank Details */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Bank Details</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <FloatingInput
            label="Account Number"
            value={bankDetails.accountNumber}
            onChange={(value) => setBankDetails((prev) => ({ ...prev, accountNumber: value }))}
            required
          />
          <FloatingInput
            label="IFSC Code"
            value={bankDetails.ifscCode}
            onChange={(value) => setBankDetails((prev) => ({ ...prev, ifscCode: value }))}
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <FloatingSelect
            label="Payment Term"
            value={bankDetails.paymentTerm}
            onChange={(value) => setBankDetails((prev) => ({ ...prev, paymentTerm: value }))}
            required
            options={[
              { value: 'on-site', label: 'On Site' },
              { value: 'advance', label: 'Advance' },
              { value: 'credit-30', label: '30 Days Credit' },
              { value: 'credit-60', label: '60 Days Credit' },
            ]}
          />
          <FloatingSelect
            label="Company Name"
            value={bankDetails.companyName}
            onChange={(value) => setBankDetails((prev) => ({ ...prev, companyName: value }))}
            required
            options={[
              { value: 'current', label: 'Current' },
              { value: 'savings', label: 'Savings' },
            ]}
          />
          <FloatingSelect
            label="GST No"
            value={bankDetails.gstNo}
            onChange={(value) => setBankDetails((prev) => ({ ...prev, gstNo: value }))}
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
            value={bankDetails.transactionalCurrency}
            onChange={(value) => setBankDetails((prev) => ({ ...prev, transactionalCurrency: value }))}
            options={[
              { value: 'inr', label: 'INR' },
              { value: 'usd', label: 'USD' },
              { value: 'eur', label: 'EUR' },
              { value: 'gbp', label: 'GBP' },
            ]}
          />
          <FloatingSelect
            label="Operational Currency"
            value={bankDetails.operationalCurrency}
            onChange={(value) => setBankDetails((prev) => ({ ...prev, operationalCurrency: value }))}
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

export default WarehouseProfileForm;
