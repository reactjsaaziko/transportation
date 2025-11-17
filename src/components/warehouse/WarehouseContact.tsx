import { Mail, MessageCircle, Phone } from 'lucide-react';

const WarehouseContact = () => {
  return (
    <div className="pb-12">
      <div className="mx-auto max-w-5xl space-y-6">
        <h2 className="text-lg font-semibold text-gray-700">Contact US</h2>

        <div className="rounded-3xl border border-gray-200 bg-white shadow-sm p-6 md:p-8">
          <div className="grid gap-10 lg:grid-cols-[180px,1fr]">
            <div className="flex flex-col items-center gap-6">
              <img
                src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=320&q=80"
                alt="Warehouse contact"
                className="h-36 w-36 rounded-3xl object-cover shadow"
              />

              <div className="flex gap-3">
                <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-green-50 text-green-500 shadow-sm">
                  <MessageCircle className="h-5 w-5" />
                </button>
                <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-blue-50 text-blue-500 shadow-sm">
                  <Phone className="h-5 w-5" />
                </button>
                <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-red-50 text-red-500 shadow-sm">
                  <Mail className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Name</label>
                  <input
                    value="Ankit Warehouse"
                    readOnly
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Employee Id Number</label>
                  <input
                    value="WH-5856594"
                    readOnly
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 shadow-sm"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Phone Number</label>
                  <div className="flex items-center gap-3">
                    <select
                      value="+91"
                      disabled
                      className="rounded-2xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-700 shadow-sm disabled:cursor-not-allowed"
                    >
                      <option value="+91">+91</option>
                    </select>
                    <input
                      value="9898765432"
                      readOnly
                      className="flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 shadow-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <input
                    value="warehouse@aaziko.com"
                    readOnly
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 shadow-sm"
                  />
                </div>
              </div>

              <div className="hidden h-24 rounded-2xl border border-dashed border-gray-200 bg-gray-50 md:block" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarehouseContact;
