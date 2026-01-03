import { useState } from 'react';
import { X, User, Mail, Phone, Building2, MapPin, FileText, Calendar, CreditCard } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal = ({ isOpen, onClose }: ProfileModalProps) => {
  const [activeTab, setActiveTab] = useState<'account' | 'password'>('account');
  const [formData, setFormData] = useState({
    userName: '',
    companyName: '',
    gstNumber: '',
    email: '',
    address: '',
    contactNumber: '',
    country: 'India',
    state: 'Maharashtra',
    city: 'Mumbai',
    agreementNumber: '',
    chaNumber: '',
    agreementDate: '08/Oct/2023',
    accountNumber: '',
    ifscCode: '',
    paymentType: 'On Site',
    accountType: 'Currant',
    bankName: 'RTS Bank',
    apiAvailable: 'yes',
    transactionalCurrency: '',
    operationalCurrency: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-gray-100 rounded-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto mx-4 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-200 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Tabs */}
        <div className="flex gap-2 p-4 bg-white border-b">
          <button
            onClick={() => setActiveTab('account')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'account'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            My Account
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'password'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Password
          </button>
        </div>

        {activeTab === 'account' ? (
          <div className="p-6">
            {/* Personal Information Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-1">Personal Information</h2>
              <div className="border-b border-dashed border-gray-300 mb-6" />

              {/* Basic Details */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-4">Basic Details :</p>
                <div className="flex gap-6">
                  {/* Profile Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                      <User className="w-12 h-12 text-gray-400" />
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    {/* User Name */}
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <User className="w-4 h-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="User Name"
                        value={formData.userName}
                        onChange={(e) => handleInputChange('userName', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* Company Name */}
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Company Name"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* GST Number */}
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <FileText className="w-4 h-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="GST Number"
                        value={formData.gstNumber}
                        onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* Email Address */}
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <Mail className="w-4 h-4 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* Address */}
                    <div className="relative col-span-2">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* Contact Number */}
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <Phone className="w-4 h-4 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        placeholder="Contact Number"
                        value={formData.contactNumber}
                        onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Operation Area */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <p className="text-sm font-medium text-gray-700">Opration Area:</p>
                  <button className="text-xs text-blue-500 hover:underline">EDIT</button>
                </div>
                <div className="flex items-center gap-6">
                  {/* Country */}
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🇮🇳</span>
                    <select
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    >
                      <option value="India">India</option>
                      <option value="USA">USA</option>
                      <option value="UK">UK</option>
                    </select>
                    <input type="radio" checked readOnly className="w-4 h-4 text-blue-500" />
                  </div>

                  {/* State */}
                  <div className="flex items-center gap-2">
                    <select
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    >
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Delhi">Delhi</option>
                    </select>
                    <input type="radio" className="w-4 h-4 text-blue-500" />
                  </div>

                  {/* City */}
                  <div className="flex items-center gap-2">
                    <select
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    >
                      <option value="Mumbai">Mumbai</option>
                      <option value="Pune">Pune</option>
                      <option value="Nagpur">Nagpur</option>
                    </select>
                    <input type="radio" className="w-4 h-4 text-blue-500" />
                  </div>
                </div>
              </div>

              {/* Agreement Details */}
              <div className="mb-6">
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Agreement Details:</p>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <User className="w-4 h-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Agreement Number"
                        value={formData.agreementNumber}
                        onChange={(e) => handleInputChange('agreementNumber', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">CHA License Number:</p>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <User className="w-4 h-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="CHA Number"
                        value={formData.chaNumber}
                        onChange={(e) => handleInputChange('chaNumber', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Agreement Date:</p>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="08/Oct/2023"
                        value={formData.agreementDate}
                        onChange={(e) => handleInputChange('agreementDate', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Agreement File:</p>
                    <button className="w-full py-3 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                      View
                    </button>
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <p className="text-sm font-medium text-gray-700">Bank Details:</p>
                  <button className="text-xs text-blue-500 hover:underline">EDIT</button>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <User className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Account Number"
                      value={formData.accountNumber}
                      onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Payment Term:</p>
                    <div className="flex gap-2">
                      <select
                        value={formData.paymentType}
                        onChange={(e) => handleInputChange('paymentType', e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                      >
                        <option value="On Site">On Site</option>
                        <option value="Online">Online</option>
                      </select>
                      <select
                        value={formData.accountType}
                        onChange={(e) => handleInputChange('accountType', e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                      >
                        <option value="Currant">Currant</option>
                        <option value="Savings">Savings</option>
                      </select>
                      <select
                        value={formData.bankName}
                        onChange={(e) => handleInputChange('bankName', e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                      >
                        <option value="RTS Bank">RTS Bank</option>
                        <option value="SBI">SBI</option>
                        <option value="HDFC">HDFC</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">API Availble:</p>
                    <div className="flex items-center gap-4 py-2">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name="apiAvailable"
                          value="yes"
                          checked={formData.apiAvailable === 'yes'}
                          onChange={(e) => handleInputChange('apiAvailable', e.target.value)}
                          className="w-4 h-4 text-blue-500"
                        />
                        Yes
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name="apiAvailable"
                          value="no"
                          checked={formData.apiAvailable === 'no'}
                          onChange={(e) => handleInputChange('apiAvailable', e.target.value)}
                          className="w-4 h-4 text-blue-500"
                        />
                        No
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <User className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Ifsc Code"
                      value={formData.ifscCode}
                      onChange={(e) => handleInputChange('ifscCode', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <select
                    value={formData.transactionalCurrency}
                    onChange={(e) => handleInputChange('transactionalCurrency', e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-3 text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Transactional Currency</option>
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>

                  <select
                    value={formData.operationalCurrency}
                    onChange={(e) => handleInputChange('operationalCurrency', e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-3 text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Operational Cuurency</option>
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>

                  <button className="text-blue-500 text-sm hover:underline text-left">
                    Currency Exchange Rate
                  </button>
                </div>
              </div>

              {/* Create Button */}
              <div className="flex items-center gap-4">
                <button className="px-6 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">
                  Create
                </button>
                <p className="text-xs text-gray-500">
                  Transactional Currency is which you will get the payment,<br />
                  Operational currency is your national currency that you put the price for your service
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6">
            {/* Password Tab Content */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Change Password</h2>
              
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Current Password</label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button className="px-6 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                  Update Password
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileModal;
