import { useState } from 'react';

import {
  Download,
  Calendar,
  Phone,
  User,
  ChevronDown,
  MapPinned,
  Truck,
  UploadCloud,
  PhoneCall,
  Headset,
} from 'lucide-react';
import CHACargoSummary from './CHACargoSummary';

interface CHAOrderDetailsProps {
  order: {
    id: string;
    orderId?: string;
    fromLocation: string;
    toLocation: string;
    cargoArrivalDate: string;
    associatePersonName: string;
    contactNumber: string;
    hsCode: string;
    cargoVolume: string;
    cargoWeight: string;
    status: string;
  };
  onBack: () => void;
}

const CHAOrderDetails = ({ order, onBack }: CHAOrderDetailsProps) => {
  const [isTimelineOpen] = useState(true);

  const cargoSummaryCards = [
    {
      id: 'pickup-1',
      title: 'Tautliner ( Curainsider ) #Pick Up 1',
      product: 'Plastic Cup',
      cargoType: 'Normal Container Cargo',
      total: '210 packages',
      cargoVolume: '29.50 m3 (32% volume)',
      cargoWeight: '14500.00 kg (% of max weight)',
      image: '/images/1.png',
      chartSegments: [
        { value: 50, color: '#2F80ED' },
        { value: 30, color: '#8B5CF6' },
        { value: 20, color: '#F97316' },
      ],
      breakdown: [
        { name: 'Big bags', packages: '10', size: '10*50*60cm', weight: '9000.00 kg', color: '#2F80ED' },
        { name: 'Sacks', packages: '100', size: '50*10*90cm', weight: '4500.00 kg', color: '#8B5CF6' },
        { name: 'Boxes 1', packages: '100', size: '20*20*50cm', weight: '1000.00 kg', color: '#F97316' },
      ],
    },
    {
      id: 'pickup-2',
      title: 'Tautliner ( Curainsider ) #Pick Up 2',
      product: 'Tea',
      cargoType: 'Normal Container Cargo',
      total: '360 packages',
      cargoVolume: '42.25 m3 (52% volume)',
      cargoWeight: '1750.00 kg (% of max weight)',
      image: '/images/1.png',
      chartSegments: [
        { value: 45, color: '#2F80ED' },
        { value: 35, color: '#8B5CF6' },
        { value: 20, color: '#F97316' },
      ],
      breakdown: [
        { name: 'Big bags', packages: '10', size: '10*50*60cm', weight: '9000.00 kg', color: '#2F80ED' },
        { name: 'Sacks', packages: '150', size: '50*10*90cm', weight: '6750.00 kg', color: '#8B5CF6' },
        { name: 'Boxes 1', packages: '200', size: '20*20*50cm', weight: '2000.00 kg', color: '#F97316' },
      ],
    },
  ];

  const contactCards = [
    {
      id: 'from-info',
      title: 'Tautliner ( Curainsider ) # From',
      companyName: 'Aaziko',
      contactName: order.associatePersonName || 'Rajesh bhai',
      address: order.fromLocation,
      pickUpTime: '23:00',
      pickDate: order.cargoArrivalDate || '14 Jan 2023',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-8">
      {/* Main Content Card */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        {/* Top Section */}
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Vehicle Info */}
          <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5 lg:w-64 xl:w-72">
            <div className="text-sm font-medium text-gray-700">Tautliner ( Curainsider )</div>
            <div className="mt-5 flex items-center justify-center">
              <div className="h-28 w-36 rounded-xl bg-gray-100">
                <img
                  src="/images/1.png"
                  alt="Vehicle"
                  className="h-full w-full object-contain p-3"
                />
              </div>
            </div>
            <div className="mt-4 text-center text-xs font-medium text-gray-600">1 Unit</div>
            <div className="mt-4 space-y-2 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Cargo Volume :</span>
                <span className="font-semibold text-gray-800">{order.cargoVolume || '29.50 m3'}</span>
              </div>
              <div className="flex justify-between">
                <span>Cargo Weight :</span>
                <span className="font-semibold text-gray-800">{order.cargoWeight || '14500.00 kg'}</span>
              </div>
            </div>
          </div>

          {/* Info Cards */}
          <div className="flex-1">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {/* Associate Person Name */}
              <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.08)]">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E3F2FD] text-[#2F80ED]">
                  <User className="h-4 w-4" />
                </span>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Associate Person Name"
                    defaultValue={order.associatePersonName}
                    className="w-full border-0 bg-transparent p-0 text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0"
                  />
                </div>
              </div>

              {/* Contact Number */}
              <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.08)]">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E3F2FD] text-[#2F80ED]">
                  <Phone className="h-4 w-4" />
                </span>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Contact Number"
                    defaultValue={order.contactNumber}
                    className="w-full border-0 bg-transparent p-0 text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0"
                  />
                </div>
              </div>

              {/* HS Code */}
              <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.08)]">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E3F2FD] text-[#2F80ED]">
                  <Truck className="h-4 w-4" />
                </span>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="HS Code"
                    defaultValue={order.hsCode}
                    className="w-full border-0 bg-transparent p-0 text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0"
                  />
                </div>
              </div>
            </div>

            {/* Cargo Arrival Date */}
            <div className="mt-4">
              <div className="text-sm font-medium text-gray-700 mb-2">Cargo Arrival Date :</div>
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">
                <Calendar className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="25, Jan, 2023"
                  defaultValue={order.cargoArrivalDate}
                  className="flex-1 border-0 bg-transparent p-0 text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-gray-100" />

        {/* Detail Section */}
        <div>
          <h3 className="text-base font-semibold text-gray-900">Detail :</h3>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Location A */}
            <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2F80ED]/10 text-xs font-semibold text-[#2F80ED]">
                    A
                  </span>
                  <span className="text-sm font-medium text-gray-900">City, Stat , Country</span>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Location B */}
            <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2F80ED]/10 text-xs font-semibold text-[#2F80ED]">
                    B
                  </span>
                  <span className="text-sm font-medium text-gray-900">City, Stat , Country</span>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Booking Receipt */}
            <button className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
              <span>Booking Receipt</span>
              <Download className="h-4 w-4 text-gray-500" />
            </button>

            {/* Shipping Bill */}
            <button className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
              <span>Shipping Bill</span>
              <UploadCloud className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Timeline Section */}
        {isTimelineOpen && (
          <div className="mt-10">
            <div className="flex items-center gap-2 text-base font-semibold text-gray-900">
              <span>Timeline :</span>
              <ChevronDown className="h-4 w-4" />
            </div>

            <div className="mt-6 space-y-8">
              {/* Booking Receipt */}
              <div>
                <div className="text-sm font-semibold text-gray-900 mb-3">Booking Receipt</div>
                <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                  <span>Payment Receipt</span>
                  <Download className="h-4 w-4 text-gray-500" />
                </button>
              </div>

              {/* Invoice */}
              <div>
                <div className="text-sm font-semibold text-gray-900 mb-3">Invoice</div>
                <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                  <span>Invoice</span>
                  <Download className="h-4 w-4 text-gray-500" />
                </button>
              </div>

              {/* Packing List */}
              <div>
                <div className="text-sm font-semibold text-gray-900 mb-3">Packing List</div>
                <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                  <span>Packing List</span>
                  <Download className="h-4 w-4 text-gray-500" />
                </button>
              </div>

              {/* Shipping Bill Draft */}
              <div>
                <div className="text-sm font-semibold text-gray-900 mb-3">Shipping Bill Draft</div>
                <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                  <span>Shipping Bill Draft</span>
                  <UploadCloud className="h-4 w-4 text-gray-500" />
                </button>
              </div>

              {/* Shipping Bill */}
              <div>
                <div className="text-sm font-semibold text-gray-900 mb-3">Shipping Bill</div>
                <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                  <span>Shipping Bill</span>
                  <UploadCloud className="h-4 w-4 text-gray-500" />
                </button>
              </div>

              {/* Cargo Receive */}
              <div>
                <div className="text-sm font-semibold text-gray-900 mb-3">Cargo Receive</div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                  <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    14 Jan, 2023
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700">
                    22:00 PM
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700">
                    Handover By
                  </div>
                  <button className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                    Upload Image
                    <UploadCloud className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Gate In */}
              <div>
                <div className="text-sm font-semibold text-gray-900 mb-3">Gate In</div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                  <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    14 Jan, 2023
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700">
                    22:00 PM
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700">
                    Handover By
                  </div>
                  <button className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                    Upload Image
                    <UploadCloud className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Invoice */}
              <div>
                <div className="text-sm font-semibold text-gray-900 mb-3">Invoice</div>
                <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                  <span>Upload Invoice</span>
                  <UploadCloud className="h-4 w-4 text-gray-500" />
                </button>
              </div>

              {/* Payment Receipt */}
              <div>
                <div className="text-sm font-semibold text-gray-900 mb-3">Payment Receipt</div>
                <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                  <span>Payment Receipt</span>
                  <Download className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cargo Summary */}
        <CHACargoSummary cargoCards={cargoSummaryCards} contactCards={contactCards} />

        {/* Final Actions */}
        <div className="mt-10 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-end gap-3">
              <button className="flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50">
                <PhoneCall className="h-4 w-4 text-gray-500" />
                Call
              </button>
              <button className="flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50">
                <Headset className="h-4 w-4 text-gray-500" />
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 border-t border-dashed border-gray-200 pt-4">
              <button className="rounded-full border border-blue-100 bg-blue-50 px-6 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-100">
                Export to PDF
              </button>
              <button className="rounded-full bg-blue-500 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600">
                Copy request
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CHAOrderDetails;
