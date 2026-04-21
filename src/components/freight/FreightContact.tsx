import { Mail, MessageCircle, Phone, Loader2, AlertCircle } from 'lucide-react';
import { useGetContactInfoQuery } from '@/services/serviceProviderApi';

const FreightContact = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const serviceProviderId = user?.id || user?._id || '';

  const { data, isLoading, isError } = useGetContactInfoQuery(serviceProviderId, {
    skip: !serviceProviderId,
  });

  const contact = data?.data;
  const name = contact?.companyName || user?.username || '-';
  const email = contact?.email || user?.email || '-';
  const phone = contact?.phone || '-';
  const employeeId = serviceProviderId || '-';

  return (
    <div className="pb-12">
      <div className="mx-auto w-full space-y-6 px-6">
        <h2 className="text-lg font-semibold text-gray-700">Contact US</h2>

        <div className="rounded-3xl border border-gray-200 bg-white shadow-sm p-6 md:p-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <span className="ml-3 text-gray-600">Loading contact info...</span>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-16">
              <AlertCircle className="h-10 w-10 text-red-500 mb-3" />
              <p className="text-gray-600">Failed to load contact info</p>
            </div>
          ) : (
            <div className="grid gap-10 lg:grid-cols-[180px,1fr]">
              <div className="flex flex-col items-center gap-6">
                <img
                  src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=320&q=80"
                  alt="Freight contact"
                  className="h-36 w-36 rounded-3xl object-cover shadow"
                />

                <div className="flex gap-3">
                  <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-green-50 text-green-500 shadow-sm">
                    <MessageCircle className="h-5 w-5" />
                  </button>
                  <a
                    href={phone && phone !== '-' ? `tel:${phone}` : undefined}
                    className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-blue-50 text-blue-500 shadow-sm"
                  >
                    <Phone className="h-5 w-5" />
                  </a>
                  <a
                    href={email && email !== '-' ? `mailto:${email}` : undefined}
                    className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-red-50 text-red-500 shadow-sm"
                  >
                    <Mail className="h-5 w-5" />
                  </a>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Name</label>
                    <input
                      value={name}
                      readOnly
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Employee Id Number</label>
                    <input
                      value={employeeId}
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
                        value={phone}
                        readOnly
                        className="flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 shadow-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <input
                      value={email}
                      readOnly
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 shadow-sm"
                    />
                  </div>
                </div>

                {contact?.address && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Address</label>
                    <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                      {[contact.address, contact.city, contact.state, contact.country, contact.postalCode]
                        .filter(Boolean)
                        .join(', ')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreightContact;
