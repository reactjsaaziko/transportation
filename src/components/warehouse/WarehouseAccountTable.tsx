import { Download, Filter, Loader2, AlertCircle } from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router';

import { useGetTransactionsQuery, useGetWarehousesQuery, type WarehouseTransaction } from '@/services/warehouseApi';

const columns = [
  { key: 'orderId', label: "Order I'd" },
  { key: 'warehouseName', label: 'Warehouse Name' },
  { key: 'warehouseAddress', label: 'Warehouse Address' },
  { key: 'gateIn', label: 'Gate in Date/Time' },
  { key: 'gateOut', label: 'Gate out Date/Time' },
  { key: 'days', label: 'No. of Days' },
  { key: 'amount', label: 'Amount/Payment' },
  { key: 'invoiceNumber', label: 'Invoice Number' },
] as const;

const formatDateTime = (iso?: string) => {
  if (!iso) return '-';
  try {
    const d = new Date(iso);
    const date = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).replace(' ', '');
    return `${date} / ${time}`;
  } catch {
    return iso;
  }
};

const computeDays = (start?: string, end?: string) => {
  if (!start || !end) return '-';
  const ms = new Date(end).getTime() - new Date(start).getTime();
  if (Number.isNaN(ms) || ms <= 0) return '-';
  const days = Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
  return String(days).padStart(2, '0');
};

interface Row {
  orderId: string;
  warehouseName: string;
  warehouseAddress: string;
  gateIn: string;
  gateOut: string;
  days: string;
  amount: string;
  invoiceNumber: string;
}

const WarehouseAccountTable = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const serviceProviderId = user?.id || user?._id || '';

  const { data: txnResponse, isLoading, isError, refetch } = useGetTransactionsQuery(
    { serviceProviderId },
    { skip: !serviceProviderId, refetchOnMountOrArgChange: true },
  );

  const { data: warehouseResponse } = useGetWarehousesQuery(serviceProviderId, {
    skip: !serviceProviderId,
  });

  const warehouseLookup = useMemo(() => {
    const map = new Map<string, { name: string; address: string }>();
    const raw = warehouseResponse?.data as any;
    const list: any[] = Array.isArray(raw?.warehouses)
      ? raw.warehouses
      : Array.isArray(raw)
      ? raw
      : [];
    list.forEach((w) => {
      const a = w.address;
      const addr = a
        ? [a.street, a.city, a.state, a.country, a.postalCode].filter(Boolean).join(', ')
        : '-';
      map.set(w._id, { name: w.name || '-', address: addr });
    });
    return map;
  }, [warehouseResponse]);

  const rows = useMemo<Row[]>(() => {
    const raw = txnResponse?.data as any;
    const list: WarehouseTransaction[] = Array.isArray(raw?.transactions)
      ? raw.transactions
      : Array.isArray(raw)
      ? raw
      : [];
    return list.map((t) => {
      const wh = warehouseLookup.get(t.warehouseId);
      const gateIn = t.checkIn?.actualDate || t.checkIn?.scheduledDate;
      const gateOut = t.checkOut?.actualDate || t.checkOut?.scheduledDate;
      const currency = t.pricing?.currency || '';
      const totalAmount = t.pricing?.total ? `${t.pricing.total} ${currency}`.trim() : '-';
      const invoiceDoc = t.documents?.find((d) => d.type?.toLowerCase().includes('invoice'));
      return {
        orderId: t.transactionId || t._id,
        warehouseName: wh?.name || t.warehouseId || '-',
        warehouseAddress: wh?.address || '-',
        gateIn: formatDateTime(gateIn),
        gateOut: formatDateTime(gateOut),
        days: computeDays(gateIn, gateOut),
        amount: totalAmount,
        invoiceNumber: invoiceDoc?.name || '-',
      };
    });
  }, [txnResponse, warehouseLookup]);

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
              {!serviceProviderId ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-12 text-center text-amber-700">
                    Sign in as a service provider to view transactions.
                  </td>
                </tr>
              ) : isLoading ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-12">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                      <span className="ml-3 text-gray-600">Loading transactions...</span>
                    </div>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-12">
                    <div className="flex flex-col items-center justify-center">
                      <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
                      <p className="text-gray-600 mb-3">Failed to load transactions</p>
                      <button
                        onClick={() => refetch()}
                        className="rounded-lg bg-blue-500 px-4 py-2 text-white text-sm font-medium hover:bg-blue-600"
                      >
                        Retry
                      </button>
                    </div>
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-12 text-center text-gray-500">
                    No transactions yet.
                  </td>
                </tr>
              ) : (
                rows.map((row, rowIndex) => (
                  <tr key={`${row.orderId}-${rowIndex}`} className="hover:bg-gray-50">
                    {columns.map((column) => (
                      <td key={`${column.key}-${rowIndex}`} className="px-4 py-3 align-top text-sm text-gray-700">
                        <div className="max-w-[220px] whitespace-pre-line leading-relaxed">{row[column.key]}</div>
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
                ))
              )}
              {rows.length > 0 &&
                Array.from({ length: Math.max(0, 5 - rows.length) }).map((_, fillerIndex) => (
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
