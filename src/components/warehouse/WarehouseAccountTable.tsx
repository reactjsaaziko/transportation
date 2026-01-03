import { Download, Filter } from 'lucide-react';
import { useNavigate } from 'react-router';

const columns = [
  { key: 'orderId', label: "Order I'd" },
  { key: 'warehouseName', label: 'Warehouse Name' },
  { key: 'warehouseAddress', label: 'Warehouse Address' },
  { key: 'gateIn', label: 'Gate in Date/Time' },
  { key: 'gateOut', label: 'Gate out Date/Time' },
  { key: 'days', label: 'No. of Days' },
  { key: 'amount', label: 'Amount/Payment' },
  { key: 'invoiceNumber', label: 'Invoice Number' },
];

const rows = [
  {
    orderId: '1212125055',
    warehouseName: 'Ventuos',
    warehouseAddress: 'Gurukul road, bridge, near ved variya, Surat, Gujarat 395004',
    gateIn: '15 Sep 2023 / AM07:30',
    gateOut: '20 Sep 2023 / AM07:30',
    days: '05',
    amount: '10,500 Rs./',
    invoiceNumber: '250250',
  },
  {
    orderId: '1212125055',
    warehouseName: 'Maruti Warehouse',
    warehouseAddress: 'Hazira sayan road, Ring road, Bhensan, Surat, Gujarat 395005',
    gateIn: '23 Sep 2023 / PM06:00',
    gateOut: '28 Sep 2023 / PM06:00',
    days: '05',
    amount: '10,500 Rs./',
    invoiceNumber: '250250',
  },
  {
    orderId: '1212125055',
    warehouseName: 'NearCity Warehouse',
    warehouseAddress: '8QC5+JF6, Surat, Gujarat 395440',
    gateIn: '25 Sep 2023 / PM03:59',
    gateOut: '30 Sep 2023 / PM03:59',
    days: '05',
    amount: '10,500 Rs./',
    invoiceNumber: '250250',
  },
];

const WarehouseAccountTable = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-8">
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <h2 className="text-lg font-semibold text-gray-900">All Transections</h2>

        <div className="mt-6 overflow-hidden rounded-3xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600"
                  >
                    <span className="flex items-center gap-2">
                      {column.label}
                      <Filter className="h-3.5 w-3.5 text-gray-400" />
                    </span>
                  </th>
                ))}
                <th className="px-4 py-3" aria-label="invoice actions" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white text-sm text-gray-700">
              {rows.map((row, rowIndex) => (
                <tr key={`${row.orderId}-${rowIndex}`} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td key={`${column.key}-${rowIndex}`} className="px-4 py-3 align-top text-sm text-gray-700">
                      <div className="max-w-[220px] whitespace-pre-line leading-relaxed">{row[column.key as keyof typeof row]}</div>
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      className="rounded-full border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-100"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {Array.from({ length: 5 }).map((_, fillerIndex) => (
                <tr key={`filler-${fillerIndex}`} className="h-12 border-t border-dashed border-gray-200">
                  <td colSpan={columns.length + 1} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard/manage-warehouse')}
            className="min-w-[120px] rounded-full border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            Back
          </button>
          <button
            type="button"
            className="min-w-[140px] rounded-full border border-blue-300 bg-blue-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600"
          >
            Export to PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarehouseAccountTable;
