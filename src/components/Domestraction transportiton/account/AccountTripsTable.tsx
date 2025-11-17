import { Download, Filter } from 'lucide-react';

interface AccountTripsTableProps {
  onBack?: () => void;
}

const tripRecords = [
  {
    id: '1212125055',
    date: '14, Jan, 2023',
    from: 'Aaziko ,Surat ,Gujarat',
    to: 'Lawasa , Mumbai',
    contact: '9898989898',
    driver: '1. Rameshbhai Patel',
    amount: '10,500 Rs./',
    invoice: '250250',
  },
  {
    id: '1212125055',
    date: '14, Jan, 2023',
    from: 'Aaziko ,Surat ,Gujarat',
    to: 'Lawasa , Mumbai',
    contact: '9898989898',
    driver: '1. Rameshbhai Patel',
    amount: '10,500 Rs./',
    invoice: '250250',
  },
  {
    id: '1212125055',
    date: '14, Jan, 2023',
    from: 'Aaziko ,Surat ,Gujarat',
    to: 'Lawasa , Mumbai',
    contact: '9898989898',
    driver: '1. Rameshbhai Patel',
    amount: '10,500 Rs./',
    invoice: '250250',
  },
];

const AccountTripsTable = ({ onBack }: AccountTripsTableProps) => {
  return (
    <div className="space-y-10">
      <div className="rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-700">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    Trip I'd
                    <Filter className="h-4 w-4 text-gray-400" />
                  </div>
                </th>
                <th className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    Trip Date
                    <Filter className="h-4 w-4 text-gray-400" />
                  </div>
                </th>
                <th className="px-6 py-4">From</th>
                <th className="px-6 py-4">To</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Driver Name</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    Invoice
                    <Filter className="h-4 w-4 text-gray-400" />
                  </div>
                </th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody>
              {tripRecords.map((trip, index) => (
                <tr
                  key={`${trip.id}-${index}`}
                  className={index !== tripRecords.length - 1 ? 'border-t border-gray-200' : 'border-t border-gray-200'}
                >
                  <td className="px-6 py-4 text-blue-600">
                    <button className="hover:underline">{trip.id}</button>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{trip.date}</td>
                  <td className="px-6 py-4 text-gray-600">{trip.from}</td>
                  <td className="px-6 py-4 text-gray-600">{trip.to}</td>
                  <td className="px-6 py-4 text-gray-600">{trip.contact}</td>
                  <td className="px-6 py-4 text-gray-600">{trip.driver}</td>
                  <td className="px-6 py-4 font-semibold text-gray-800">{trip.amount}</td>
                  <td className="px-6 py-4 text-gray-600">{trip.invoice}</td>
                  <td className="px-6 py-4">
                    <button className="rounded-full border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-50">
                      <Download className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={onBack}
          className="rounded-md border border-gray-300 px-6 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Back
        </button>
        <button className="rounded-md bg-blue-500 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600">
          Export to PDF
        </button>
      </div>
    </div>
  );
};

export default AccountTripsTable;
