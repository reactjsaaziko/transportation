import { useMemo, useState } from 'react';
import { Calendar, Truck, AlertTriangle, FileText, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

import WarehouseOrderDetails, { WarehouseOrderDetail } from './WarehouseOrderDetails';
import WarehouseCurrentOrderDetails from './WarehouseCurrentOrderDetails';
import { useGetTransactionsQuery, type WarehouseTransaction } from '@/services/warehouseApi';
import {
  useGetMyWorkAssignmentsQuery,
  useAcknowledgeWorkAssignmentMutation,
  useDeclineWorkAssignmentMutation,
  useStartWorkAssignmentMutation,
  useSubmitWorkAssignmentForReviewMutation,
} from '@/services/workAssignmentApi';

type OrderStatus = 'yet-to-confirm' | 'current' | 'upcoming' | 'completed';

interface Order {
  id: string;
  orderId: string;
  status: OrderStatus;
  product: string;
  goodsTypes: string;
  total: string;
  days: string;
  cargoVolume: string;
  cargoWeight: string;
  eta: string;
  price: string;
  badges?: string[];
  valueOfGoods?: string;
  invoiceStatus?: string;
  paymentStatus?: string;
  statusLabel?: string;
  raw: WarehouseTransaction;
}

const tabConfig: { id: OrderStatus; label: string }[] = [
  { id: 'yet-to-confirm', label: 'Yet to confirm' },
  { id: 'current', label: 'Current' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' },
];

const apiStatusByTab: Record<OrderStatus, WarehouseTransaction['status']> = {
  'yet-to-confirm': 'pending',
  current: 'in_progress',
  upcoming: 'pending',
  completed: 'completed',
};

// Admin work-assignment status for each UI tab
const waStatusByTab: Record<OrderStatus, string> = {
  'yet-to-confirm': 'pending',
  upcoming: 'acknowledged',
  current: 'in_progress',
  completed: 'completed',
};

const formatDate = (iso?: string) => {
  if (!iso) return '-';
  try {
    return new Date(iso).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
};

const computeDays = (start?: string, end?: string) => {
  if (!start || !end) return 0;
  const ms = new Date(end).getTime() - new Date(start).getTime();
  if (Number.isNaN(ms) || ms <= 0) return 0;
  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
};

const mapTransactionToOrder = (t: WarehouseTransaction, tab: OrderStatus): Order => {
  const checkInDate = t.checkIn?.actualDate || t.checkIn?.scheduledDate;
  const checkOutDate = t.checkOut?.actualDate || t.checkOut?.scheduledDate;
  const days = computeDays(checkInDate, checkOutDate);
  const currency = t.pricing?.currency || '';
  const totalPrice = t.pricing?.total ? `${currency} ${t.pricing.total}`.trim() : '-';
  const cargoTypeLabel = t.cargo?.cargoType || 'Normal';

  return {
    id: t._id,
    orderId: t.transactionId || t._id,
    status: tab,
    product: t.cargo?.description || '-',
    goodsTypes: cargoTypeLabel,
    total: t.cargo?.quantity ? `${t.cargo.quantity} packages` : '-',
    days: days ? `${days} Days` : '-',
    cargoVolume: t.cargo?.volume ? `${t.cargo.volume} m3` : '-',
    cargoWeight: t.cargo?.weight ? `${t.cargo.weight} kg` : '-',
    eta: formatDate(checkInDate),
    price: t.pricing?.storageCharges ? `${currency} ${t.pricing.storageCharges}/Day`.trim() : totalPrice,
    badges: ['FCL', '20 FT', cargoTypeLabel],
    valueOfGoods: tab === 'completed' ? totalPrice : undefined,
    invoiceStatus: tab === 'completed' ? 'Invoice' : undefined,
    paymentStatus: tab === 'completed' ? (t.status === 'completed' ? 'Paid' : 'Pending') : undefined,
    statusLabel: tab === 'completed' ? 'Completed' : undefined,
    raw: t,
  };
};

const buildDetail = (t: WarehouseTransaction): WarehouseOrderDetail => ({
  id: t._id,
  orderReference: t.transactionId || t._id,
  warehouseName: t.warehouseId || 'Warehouse',
  associatePersonName: t.customer?.name || '-',
  contactNumber: t.customer?.phone || '-',
  cargoArrivalDate: formatDate(t.checkIn?.scheduledDate || t.checkIn?.actualDate),
  transporter: {
    driverName: t.checkIn?.driverName || '-',
    contactNumber: t.customer?.phone || '-',
    vehicleNumber: t.checkIn?.vehicleNumber || '-',
  },
  cargoSummary: {
    weight: t.cargo?.weight ? `${t.cargo.weight} kg` : '-',
    volume: t.cargo?.volume ? `${t.cargo.volume} m3` : '-',
  },
  shipments: [
    {
      id: `${t._id}-cargo`,
      title: t.cargo?.description || 'Cargo',
      product: t.cargo?.description || '-',
      cargoType: t.cargo?.cargoType || '-',
      total: t.cargo?.quantity ? `${t.cargo.quantity} packages` : '-',
      cargoVolume: t.cargo?.volume ? `${t.cargo.volume} m3` : '-',
      cargoWeight: t.cargo?.weight ? `${t.cargo.weight} kg` : '-',
      image: '/images/1.png',
      chartSegments: [{ value: 100, color: '#2F80ED' }],
      breakdown: [
        {
          name: t.cargo?.cargoType || 'Cargo',
          packages: String(t.cargo?.quantity ?? '-'),
          size: '-',
          weight: t.cargo?.weight ? `${t.cargo.weight} kg` : '-',
          color: '#2F80ED',
        },
      ],
    },
  ],
  receivedFrom: {
    title: 'Received From',
    companyName: t.customer?.companyName || '-',
    contactPersonName: t.customer?.name || '-',
    address: '-',
    contactNumber: t.customer?.phone || '-',
  },
});

const buildCurrentDetail = (t: WarehouseTransaction) => ({
  id: t._id,
  orderReference: t.transactionId || t._id,
  warehouseName: t.warehouseId || 'Warehouse',
  weight: t.cargo?.weight ? `${t.cargo.weight} kg` : '-',
  volume: t.cargo?.volume ? `${t.cargo.volume} m3` : '-',
  associatePersonName: t.customer?.name || '-',
  contactNumber: t.customer?.phone || '-',
  cargoArrivalDate: formatDate(t.checkIn?.scheduledDate || t.checkIn?.actualDate),
  transporter: {
    driverName: t.checkIn?.driverName || '-',
    contactNumber: t.customer?.phone || '-',
    vehicleNumber: t.checkIn?.vehicleNumber || '-',
    inDate: formatDate(t.checkIn?.actualDate || t.checkIn?.scheduledDate),
    inTime: '-',
    receiverBy: '-',
  },
  despatchTransporter: {
    driverName: t.checkOut?.driverName || '-',
    contactNumber: t.customer?.phone || '-',
    vehicleNumber: t.checkOut?.vehicleNumber || '-',
    outDate: formatDate(t.checkOut?.actualDate || t.checkOut?.scheduledDate),
    outTime: '-',
    despatchBy: '-',
  },
  cargoPickups: [
    {
      id: `${t._id}-cargo`,
      title: t.cargo?.description || 'Cargo',
      product: t.cargo?.description || '-',
      cargoType: t.cargo?.cargoType || '-',
      total: t.cargo?.quantity ? `${t.cargo.quantity} packages` : '-',
      cargoVolume: t.cargo?.volume ? `${t.cargo.volume} m3` : '-',
      cargoWeight: t.cargo?.weight ? `${t.cargo.weight} kg` : '-',
      image: '/images/1.png',
      chartSegments: [{ value: 100, color: '#2F80ED' }],
      breakdown: [
        {
          name: t.cargo?.cargoType || 'Cargo',
          packages: String(t.cargo?.quantity ?? '-'),
          size: '-',
          weight: t.cargo?.weight ? `${t.cargo.weight} kg` : '-',
          color: '#2F80ED',
        },
      ],
    },
  ],
  receivedFrom: {
    title: 'Received From',
    companyName: t.customer?.companyName || '-',
    contactPersonName: t.customer?.name || '-',
    address: '-',
    contactNumber: t.customer?.phone || '-',
  },
});

const WarehouseOrders = () => {
  const [activeTab, setActiveTab] = useState<OrderStatus>('yet-to-confirm');
  const [selectedDetail, setSelectedDetail] = useState<WarehouseOrderDetail | null>(null);
  const [selectedCurrentDetail, setSelectedCurrentDetail] = useState<any>(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const serviceProviderId = user?.serviceProviderId || user?.id || user?._id || '';

  const { data: txnResponse, isLoading, isError, refetch } = useGetTransactionsQuery(
    { serviceProviderId, status: apiStatusByTab[activeTab] },
    { skip: !serviceProviderId, refetchOnMountOrArgChange: true },
  );

  const { data: adminAssignedResponse, refetch: refetchAdminAssigned } =
    useGetMyWorkAssignmentsQuery(
      {
        serviceProviderId,
        serviceType: 'Warehouse',
        status: waStatusByTab[activeTab],
      },
      { skip: !serviceProviderId },
    );

  // Completed tab also needs jobs submitted for review (status: pending_review)
  const { data: pendingReviewResponse, refetch: refetchPendingReview } =
    useGetMyWorkAssignmentsQuery(
      { serviceProviderId, serviceType: 'Warehouse', status: 'pending_review' },
      { skip: !serviceProviderId || activeTab !== 'completed' },
    );

  const [acknowledgeWA, { isLoading: isAcknowledging }] =
    useAcknowledgeWorkAssignmentMutation();
  const [declineWA, { isLoading: isCancellingWA }] =
    useDeclineWorkAssignmentMutation();
  const [startWA, { isLoading: isStarting }] =
    useStartWorkAssignmentMutation();
  const [submitWA, { isLoading: isSubmittingWA }] =
    useSubmitWorkAssignmentForReviewMutation();

  const adminAssignedJobs: any[] = useMemo(() => {
    const raw = adminAssignedResponse as any;
    const base = Array.isArray(raw?.data) ? raw.data : [];
    if (activeTab !== 'completed') return base;
    const pr = pendingReviewResponse as any;
    const pending = Array.isArray(pr?.data) ? pr.data : [];
    return [...pending, ...base];
  }, [adminAssignedResponse, pendingReviewResponse, activeTab]);

  const refetchAdminAll = () => {
    refetchAdminAssigned();
    if (activeTab === 'completed') refetchPendingReview();
  };

  const handleAcceptAdminJob = async (id: string) => {
    try {
      await acknowledgeWA(id).unwrap();
      refetchAdminAll();
    } catch (err) {
      console.error('Failed to acknowledge admin assignment:', err);
    }
  };

  const handleDeclineAdminJob = async (id: string) => {
    try {
      await declineWA({ id, reason: 'Declined by service provider' }).unwrap();
      refetchAdminAll();
    } catch (err) {
      console.error('Failed to cancel admin assignment:', err);
    }
  };

  const handleStartAdminJob = async (id: string) => {
    try {
      await startWA(id).unwrap();
      refetchAdminAll();
    } catch (err) {
      console.error('Failed to start admin assignment:', err);
    }
  };

  const handleSubmitAdminJob = async (id: string) => {
    try {
      await submitWA({ id, data: { summary: 'Work submitted for review' } }).unwrap();
      refetchAdminAll();
    } catch (err) {
      console.error('Failed to submit admin assignment:', err);
    }
  };

  const filteredOrders = useMemo<Order[]>(() => {
    const raw = txnResponse?.data as any;
    const list: WarehouseTransaction[] = Array.isArray(raw?.transactions)
      ? raw.transactions
      : Array.isArray(raw)
      ? raw
      : [];
    const now = Date.now();
    return list
      .filter((t) => {
        if (activeTab !== 'yet-to-confirm' && activeTab !== 'upcoming') return true;
        const scheduled = t.checkIn?.scheduledDate ? new Date(t.checkIn.scheduledDate).getTime() : null;
        if (activeTab === 'upcoming') return scheduled !== null && scheduled > now;
        return scheduled === null || scheduled <= now;
      })
      .map((t) => mapTransactionToOrder(t, activeTab));
  }, [txnResponse, activeTab]);

  const handleViewDetails = (order: Order) => {
    if (order.status === 'current') {
      setSelectedCurrentDetail(buildCurrentDetail(order.raw));
    } else {
      setSelectedDetail(buildDetail(order.raw));
    }
  };

  const renderOrderCard = (order: Order) => {
    const detailRows = [
      { label: 'Product', value: order.product },
      { label: 'Goods Types', value: order.goodsTypes },
      { label: 'Total', value: order.total },
      { label: 'No. Of Days', value: order.days },
      { label: 'Cargo Volume', value: order.cargoVolume },
      { label: 'Cargo Weight', value: order.cargoWeight },
    ];

    const badges = order.badges ?? ['FCL', '20 FT', 'Normal'];
    const useUnifiedLayout = activeTab === 'current' || activeTab === 'yet-to-confirm' || activeTab === 'upcoming';

    if (activeTab === 'completed') {
      return (
        <div key={order.id} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
            <div className="flex shrink-0 flex-col items-center gap-3 self-stretch rounded-3xl border border-slate-200 bg-white p-4 text-center shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
                <AlertTriangle className="h-6 w-6 text-orange-500" />
              </div>
              <div className="w-full space-y-1.5 text-[10px] font-semibold text-slate-600">
                {badges.map((badge) => (
                  <div key={badge} className="rounded-md bg-slate-50 py-1 uppercase tracking-wide">
                    {badge}
                  </div>
                ))}
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
                <Truck className="h-6 w-6 text-orange-500" />
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="rounded-3xl border border-blue-100 p-5">
                <dl className="space-y-3 text-sm text-slate-600">
                  {detailRows.map((row, index) => (
                    <div
                      key={row.label}
                      className={`grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-6 gap-y-1 pb-3 font-medium ${
                        index !== detailRows.length - 1 ? 'border-b border-dashed border-blue-200' : 'pb-0'
                      }`}
                    >
                      <dt className="text-slate-500">{row.label} :</dt>
                      <dd className="font-semibold text-slate-900">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {order.valueOfGoods ? (
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600">
                  <span className="text-slate-500">Value Of Goods :</span>
                  <span className="text-slate-900">{order.valueOfGoods}</span>
                </div>
              ) : null}
            </div>

            <div className="flex shrink-0 flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:max-w-[17rem]">
              <div className="text-right text-sm font-semibold text-slate-500">
                Order Id : <span className="font-bold text-slate-900">{order.orderId}</span>
              </div>

              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">ETA</div>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-gray-50 px-3 py-2.5 text-sm font-semibold text-slate-800">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  {order.eta}
                </div>
              </div>

              <div className="space-y-2">
                {order.invoiceStatus ? (
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-gray-50 px-3 py-2.5 text-sm font-semibold text-slate-700"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-slate-400" />
                      {order.invoiceStatus}
                    </span>
                  </button>
                ) : null}
                {order.paymentStatus ? (
                  <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-500">
                    {order.paymentStatus}
                  </div>
                ) : null}
              </div>

              <div className="mt-auto flex flex-col items-end gap-3">
                <button
                  type="button"
                  className="rounded-full bg-blue-500 px-6 py-2 text-sm font-semibold text-white shadow-sm"
                >
                  {order.statusLabel ?? 'Completed'}
                </button>
                <button
                  type="button"
                  onClick={() => handleViewDetails(order)}
                  className="text-sm font-semibold text-blue-500 underline-offset-4 transition hover:underline"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (!useUnifiedLayout) {
      return null;
    }

    return (
      <div key={order.id} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
          <div className="flex shrink-0 flex-col items-center gap-3 self-stretch rounded-3xl border border-slate-200 bg-white p-4 text-center shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
              <AlertTriangle className="h-6 w-6 text-orange-500" />
            </div>
            <div className="w-full space-y-1.5 text-[10px] font-semibold text-slate-600">
              {badges.map((badge) => (
                <div key={badge} className="rounded-md bg-slate-50 py-1 uppercase tracking-wide">
                  {badge}
                </div>
              ))}
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
              <Truck className="h-6 w-6 text-orange-500" />
            </div>
          </div>

          <div className="flex-1 rounded-3xl border border-slate-200 bg-white/80 p-5">
            <dl className="space-y-3 text-sm text-slate-600">
              {detailRows.map((row, index) => (
                <div
                  key={row.label}
                  className={`grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-6 gap-y-1 pb-3 font-medium ${
                    index !== detailRows.length - 1 ? 'border-b border-dashed border-slate-200' : 'pb-0'
                  }`}
                >
                  <dt className="text-slate-500">{row.label} :</dt>
                  <dd className="font-semibold text-slate-900">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="flex shrink-0 flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:max-w-[17rem]">
            <div className="text-right text-sm font-semibold text-slate-500">
              Order Id : <span className="font-bold text-slate-900">{order.orderId}</span>
            </div>
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">ETA</div>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-gray-50 px-3 py-2.5 text-sm font-semibold text-slate-800">
                <Calendar className="h-4 w-4 text-slate-400" />
                {order.eta}
              </div>
            </div>
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Price</div>
              <div className="rounded-xl border border-slate-200 bg-gray-50 px-3 py-2.5 text-center text-sm font-semibold text-slate-800">
                {order.price}
              </div>
            </div>

            {activeTab === 'yet-to-confirm' ? (
              <div className="flex flex-col gap-2.5">
                <button
                  type="button"
                  className="w-full rounded-xl border border-blue-200 bg-white px-5 py-2.5 text-sm font-semibold text-blue-500 transition hover:bg-blue-50"
                >
                  Accept
                </button>
                <button
                  type="button"
                  className="w-full rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                >
                  Decline
                </button>
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => handleViewDetails(order)}
              className={`self-end text-sm font-semibold text-blue-500 underline-offset-4 transition hover:underline ${
                activeTab === 'yet-to-confirm' ? '' : 'mt-auto'
              }`}
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (selectedCurrentDetail) {
    return <WarehouseCurrentOrderDetails data={selectedCurrentDetail} onBack={() => setSelectedCurrentDetail(null)} />;
  }

  if (selectedDetail) {
    return <WarehouseOrderDetails detail={selectedDetail} onBack={() => setSelectedDetail(null)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-3">
            {tabConfig.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full px-6 py-2 text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-md shadow-blue-200/60'
                    : 'border border-transparent bg-blue-50/80 text-gray-600 hover:border-blue-200 hover:bg-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        <div className="mt-6 space-y-6">
          {!serviceProviderId ? (
            <div className="rounded-2xl border border-dashed border-amber-200 bg-amber-50 py-12 text-center text-amber-700">
              Sign in as a service provider to view warehouse orders.
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <span className="ml-3 text-gray-600">Loading orders...</span>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-16">
              <AlertCircle className="h-10 w-10 text-red-500 mb-3" />
              <p className="text-gray-600 mb-3">Failed to load warehouse orders</p>
              <button
                onClick={() => refetch()}
                className="rounded-lg bg-blue-500 px-4 py-2 text-white text-sm font-medium hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {adminAssignedJobs.length > 0 && (
                <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-blue-900">
                      {activeTab === 'yet-to-confirm'
                        ? 'New jobs assigned by Admin'
                        : `Admin assigned jobs — ${tabConfig.find((t) => t.id === activeTab)?.label}`}
                    </h3>
                    <span className="rounded-full bg-blue-500 px-3 py-1 text-xs font-medium text-white">
                      {adminAssignedJobs.length}{' '}
                      {activeTab === 'yet-to-confirm'
                        ? 'pending'
                        : tabConfig.find((t) => t.id === activeTab)?.label.toLowerCase()}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {adminAssignedJobs.map((wa) => (
                      <div
                        key={wa._id}
                        className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-blue-500" />
                            <p className="text-sm font-semibold text-gray-800">
                              {wa.title || 'Untitled warehouse assignment'}
                            </p>
                            <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-orange-600">
                              From admin
                            </span>
                          </div>
                          {wa.description && (
                            <p className="mt-1 text-xs text-gray-500">{wa.description}</p>
                          )}
                          <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
                            {wa.dueDate && (
                              <span className="inline-flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                Due {formatDate(wa.dueDate)}
                              </span>
                            )}
                            {wa.priority && (
                              <span className="rounded-full bg-slate-100 px-2 py-0.5 capitalize">
                                {wa.priority}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {activeTab === 'yet-to-confirm' && (
                            <>
                              <button
                                onClick={() => handleAcceptAdminJob(wa._id)}
                                disabled={isAcknowledging}
                                className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 disabled:opacity-50"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleDeclineAdminJob(wa._id)}
                                disabled={isCancellingWA}
                                className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                              >
                                Decline
                              </button>
                            </>
                          )}
                          {activeTab === 'upcoming' && (
                            <button
                              onClick={() => handleStartAdminJob(wa._id)}
                              disabled={isStarting}
                              className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50"
                            >
                              Start
                            </button>
                          )}
                          {activeTab === 'current' && (
                            <button
                              onClick={() => handleSubmitAdminJob(wa._id)}
                              disabled={isSubmittingWA}
                              className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 disabled:opacity-50"
                            >
                              Submit for Review
                            </button>
                          )}
                          {activeTab === 'completed' && (
                            <span className="rounded-lg bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                              {wa.status === 'pending_review' ? 'Pending Review' : 'Completed'}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredOrders.length === 0 && adminAssignedJobs.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-blue-200 py-20 text-center text-gray-500">
                  No orders in this category
                </div>
              ) : (
                filteredOrders.map((order) => renderOrderCard(order))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WarehouseOrders;
