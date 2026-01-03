import { Mail, Phone, MessageCircle } from 'lucide-react';

const ContactUsCard = () => {
  return (
    <div className="min-h-[70vh] rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800">Contact US</h2>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row">
        <div className="flex w-full max-w-[180px] flex-col items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
            alt="Contact profile"
            className="h-32 w-32 rounded-2xl object-cover shadow"
          />
        </div>

        <div className="flex-1 rounded-2xl border border-gray-200 bg-gray-50 p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-gray-600">Name</span>
              <input
                type="text"
                value="Rakeshbhai Rathod"
                readOnly
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 shadow-sm focus:outline-none"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-gray-600">Employee I'd Number</span>
              <input
                type="text"
                value="85856594"
                readOnly
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 shadow-sm focus:outline-none"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-gray-600">Phone Number</span>
              <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm">
                <span className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-xl">🇮🇳</span>
                  <span className="text-sm text-gray-600">+91</span>
                </span>
                <span className="h-6 w-px bg-gray-200" />
                <span className="text-sm text-gray-700">9898787885</span>
              </div>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-gray-600">Email</span>
              <input
                type="email"
                value="Aaziko@gmail.com"
                readOnly
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 shadow-sm focus:outline-none"
              />
            </label>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-6">
            {[{
              id: 'whatsapp',
              label: 'WhatsApp',
              icon: MessageCircle,
              badgeClass: 'bg-green-100 text-green-600'
            }, {
              id: 'phone',
              label: 'Phone',
              icon: Phone,
              badgeClass: 'bg-blue-100 text-blue-600'
            }, {
              id: 'email',
              label: 'Email',
              icon: Mail,
              badgeClass: 'bg-red-100 text-red-500'
            }].map(({ id, label, icon: Icon, badgeClass }) => (
              <div key={id} className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  className={`flex h-12 w-12 items-center justify-center rounded-xl shadow-sm ${badgeClass}`}
                  title={label}
                >
                  <Icon className="h-5 w-5" />
                </button>
                <span className="text-xs font-semibold text-gray-600">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsCard;
