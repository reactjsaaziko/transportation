import { useMemo, useState } from 'react';
import { AlertCircle, AlertTriangle, Calendar, FileText, Loader2, Plane, RefreshCw, Search, Ship, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  useGetCHAOrdersQuery,
  useUpdateCHAOrderStatusMutation,
  type CHAOrder,
} from '@/services/chaApi';
import {
  useGetMyWorkAssignmentsQuery,
  useAcknowledgeWorkAssignmentMutation,
  useCancelWorkAssignmentMutation,
  useStartWorkAssignmentMutation,
  useSubmitWorkAssignmentForReviewMutation,
} from '@/services/workAssignmentApi';
import CHAOrderDetails from './CHAOrderDetails';

type TabId = 'yet-to-confirm' | 'current' | 'upcoming' | 'completed';

const tabConfig: { id: TabId; label: string }[] = [
  { id: 'yet-to-confirm', label: 'Yet to confirm' },
  { id: 'current', label: 'Current' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' },
];

const statusMap: Record<TabId, CHAOrder['status']> = {
  'yet-to-confirm': 'yet_to_confirm',
  current: 'current',
  upcoming: 'upcoming',
  completed: 'completed',
};

// Admin work-assignment status for each UI tab
const waStatusByTab: Record<TabId, string> = {
  'yet-to-confirm': 'pending',
  upcoming: 'acknowledged',
  current: 'in_progress',
  completed: 'completed',
};

const transportConfig = {
  sea: {
    icon: Ship,
    accent: 'text-blue-600',
    iconBg: 'bg-blue-100',
  },
  air: {
    icon: Plane,
    accent: 'text-sky-500',
    iconBg: 'bg-sky-100',
  },
  road: {
    icon: Truck,
    accent: 'text-orange-500',
    iconBg: 'bg-orange-100',
  },
  rail: {
    icon: Truck,
    accent: 'text-orange-500',
    iconBg: 'bg-orange-100',
  },
} as const;

const formatDate = (iso?: string) => {
  if (!iso) return '-';
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
};

const CHAOrders = () => {
  const [activeTab, setActiveTab] = useState<TabId>('yet-to-confirm');
  const [selectedOrder, setSelectedOrder] = useState<CHAOrder | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const serviceProviderId = user?.serviceProviderId || user?.id || user?._id || '';

  const {
    data: ordersResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetCHAOrdersQuery(
    {
      serviceProviderId,
      status: statusMap[activeTab],
    },
    {
      skip: !serviceProviderId,
      refetchOnMountOrArgChange: true,
    },
  );

  const [updateStatus, { isLoading: isUpdating }] = useUpdateCHAOrderStatusMutation();

  const {
    data: adminAssignedResponse,
    refetch: refetchAdminAssigned,
  } = useGetMyWorkAssignmentsQuery(
    { serviceProviderId, serviceType: 'CHA', status: waStatusByTab[activeTab] },
    { skip: !serviceProviderId },
  );

  // Completed tab also needs jobs submitted for review (status: pending_review)
  const {
    data: pendingReviewResponse,
    refetch: refetchPendingReview,
  } = useGetMyWorkAssignmentsQuery(
    { serviceProviderId, serviceType: 'CHA', status: 'pending_review' },
    { skip: !serviceProviderId || activeTab !== 'completed' },
  );

  const [acknowledgeWA, { isLoading: isAcknowledging }] =
    useAcknowledgeWorkAssignmentMutation();
  const [cancelWA, { isLoading: isCancellingWA }] =
    useCancelWorkAssignmentMutation();
  const [startWA, { isLoading: isStarting }] =
    useStartWorkAssignmentMutation();
  const [submitWA, { isLoading: isSubmittingWA }] =
    useSubmitWorkAssignmentForReviewMutation();

  const adminAssignedJobs: any[] = useMemo(() => {
    const raw = adminAssignedResponse as any;
    const base = Array.isArray(raw?.data) ? raw.data : [];
    let combined = base;
    if (activeTab === 'completed') {
      const pr = pendingReviewResponse as any;
      const pending = Array.isArray(pr?.data) ? pr.data : [];
      combined = [...pending, ...base];
    }
    if (!searchQuery.trim()) return combined;
    const q = searchQuery.toLowerCase();
    return combined.filter((wa: any) =>
      [wa.title, wa.description, wa._id]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [adminAssignedResponse, pendingReviewResponse, activeTab, searchQuery]);

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
      await cancelWA({ id, reason: 'Declined by service provider' }).unwrap();
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

  const filteredOrders = useMemo(() => {
    const raw = ordersResponse?.data as any;
    const list: CHAOrder[] = Array.isArray(raw?.orders)
      ? raw.orders
      : Array.isArray(raw)
      ? raw
      : [];
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter((o) =>
      [o.orderId, o.cargo?.product, o.origin?.city, o.destination?.city, o.cargo?.hsCode]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [ordersResponse?.data, searchQuery]);

  const handleAccept = async (orderId: string) => {
    try {
      await updateStatus({ orderId, status: 'current' }).unwrap();
      refetch();
    } catch (err) {
      console.error('Failed to accept CHA order:', err);
    }
  };

  const handleDecline = async (orderId: string) => {
    try {
      await updateStatus({ orderId, status: 'cancelled', reason: 'Declined by service provider' }).unwrap();
      refetch();
    } catch (err) {
      console.error('Failed to decline CHA order:', err);
    }
  };

  if (!serviceProviderId) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
        <p className="text-gray-600 text-lg mb-4">Please log in to view your CHA orders</p>
        <button
          onClick={() => navigate('/login')}
          className="rounded-lg bg-blue-500 px-6 py-2 text-white font-medium hover:bg-blue-600"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (selectedOrder) {
    return (
      <CHAOrderDetails
        order={{
          id: selectedOrder._id,
          orderId: selectedOrder.orderId,
          fromLocation: `${selectedOrder.origin?.city ?? ''}${selectedOrder.origin?.country ? ', ' + selectedOrder.origin.country : ''}`,
          toLocation: `${selectedOrder.destination?.city ?? ''}${selectedOrder.destination?.country ? ', ' + selectedOrder.destination.country : ''}`,
          cargoArrivalDate: formatDate(selectedOrder.schedule?.cargoReadyDate),
          associatePersonName: selectedOrder.customer?.name || '',
          contactNumber: selectedOrder.customer?.phone || '',
          hsCode: selectedOrder.cargo?.hsCode || '',
          cargoVolume: selectedOrder.cargo?.volume ? `${selectedOrder.cargo.volume} m3` : '',
          cargoWeight: selectedOrder.cargo?.weight ? `${selectedOrder.cargo.weight} kg` : '',
          status: selectedOrder.status,
        }}
        onBack={() => setSelectedOrder(null)}
      />
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-3">
          {tabConfig.map((tab) => (
            <button
              key={tab.id}
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

        <div className="flex items-center gap-3 w-full max-w-md">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search orders, locations or ID"
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-14 pr-4 text-sm text-gray-700 shadow-sm outline-none transition focus:border-blue-500 focus:shadow"
            />
          </div>
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-6">
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
                        {wa.title || 'Untitled CHA assignment'}
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

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-3 text-gray-600">Loading CHA orders...</span>
          </div>
        )}

        {isError && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <p className="text-gray-600 mb-4">Failed to load CHA orders</p>
            <p className="text-sm text-gray-400 mb-4">
              {(error as any)?.data?.message || 'Please try again later'}
            </p>
            <button
              onClick={() => refetch()}
              className="rounded-lg bg-blue-500 px-4 py-2 text-white font-medium hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        )}

        {!isLoading &&
          !isError &&
          filteredOrders.length === 0 &&
          adminAssignedJobs.length === 0 && (
            <div className="rounded-2xl border border-dashed border-blue-200 py-20 text-center text-gray-500">
              No orders in this category
            </div>
          )}

        {!isLoading &&
          !isError &&
          filteredOrders.map((order) => {
            const mode = (order.shipment?.mode as keyof typeof transportConfig) || 'sea';
            const transport = transportConfig[mode] ?? transportConfig.sea;
            const TransportIcon = transport.icon;
            const tags = [
              order.shipment?.containerType,
              order.shipment?.cargoType,
              order.shipment?.type,
            ].filter(Boolean) as string[];

            const detailRows: { title: string; value: string }[] = [
              { title: 'Product', value: order.cargo?.product || '-' },
              { title: 'HS Code', value: order.cargo?.hsCode || '-' },
              { title: 'Goods Types', value: order.shipment?.cargoType || '-' },
              { title: 'Cargo Weight', value: order.cargo?.weight ? `${order.cargo.weight} kg` : '-' },
              { title: 'Total', value: order.cargo?.packages ? `${order.cargo.packages} packages` : '-' },
              { title: 'Cargo Volume', value: order.cargo?.volume ? `${order.cargo.volume} m3` : '-' },
              { title: 'Port', value: order.origin?.port || '-' },
              {
                title: 'Cargo Value',
                value: order.cargo?.value
                  ? `${order.cargo.currency || ''} ${order.cargo.value}`.trim()
                  : '-',
              },
            ];

            const originLabel = `${order.origin?.city ?? ''}${order.origin?.country ? ', ' + order.origin.country : ''}` || '-';
            const destLabel = `${order.destination?.city ?? ''}${order.destination?.country ? ', ' + order.destination.country : ''}` || '-';
            const dateLabel = formatDate(order.schedule?.cargoReadyDate);

            // Yet to confirm layout
            if (activeTab === 'yet-to-confirm') {
              return (
                <div
                  key={order._id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex flex-1 flex-col gap-6 md:flex-row md:items-start">
                      <div className="flex w-full max-w-[6rem] flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
                          <AlertTriangle className="h-7 w-7 text-orange-500" />
                        </div>
                        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${transport.iconBg}`}>
                          <TransportIcon className={`h-6 w-6 ${transport.accent}`} />
                        </div>
                        <div className="flex flex-col items-center gap-1 text-[11px] font-medium text-gray-600">
                          {tags.map((tag) => (
                            <span
                              key={tag}
                              className="w-full rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-center"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col gap-4">
                        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-300 bg-blue-50 text-sm font-semibold text-blue-600">
                              A
                            </div>
                            <div className="min-w-[10rem] text-sm font-medium text-gray-700">{originLabel}</div>
                          </div>
                          <div className="flex items-center gap-2 text-gray-400">
                            <span className="block h-px w-10 bg-gray-300" />
                            <span className="text-xs font-semibold uppercase tracking-wide">to</span>
                            <span className="block h-px w-10 bg-gray-300" />
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-purple-300 bg-purple-50 text-sm font-semibold text-purple-600">
                              B
                            </div>
                            <div className="min-w-[10rem] text-sm font-medium text-gray-700">{destLabel}</div>
                          </div>
                          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm">
                            <Calendar className="h-4 w-4 text-blue-500" />
                            {dateLabel}
                          </div>
                        </div>

                        <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2">
                          {detailRows.map((row) => (
                            <div
                              key={row.title}
                              className="flex items-center justify-between gap-3 border-b border-dashed border-slate-200 pb-3 text-sm text-gray-600 last:border-b-0 last:pb-0"
                            >
                              <span className="font-medium text-gray-500">{row.title} :</span>
                              <span className="font-semibold text-gray-800">{row.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex w-full max-w-[12rem] flex-col items-end gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-right shadow-sm">
                      <span className="text-sm font-semibold text-gray-600">
                        Trip Id : <span className="font-bold text-gray-900">{order.orderId}</span>
                      </span>
                      <button
                        onClick={() => handleAccept(order._id)}
                        disabled={isUpdating}
                        className="w-full rounded-xl border border-blue-200 bg-white px-5 py-2 text-sm font-semibold text-blue-500 shadow-sm transition hover:bg-blue-500 hover:text-white disabled:opacity-50"
                      >
                        {isUpdating ? 'Processing...' : 'Accept'}
                      </button>
                      <button
                        onClick={() => handleDecline(order._id)}
                        disabled={isUpdating}
                        className="w-full rounded-xl border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-gray-600 shadow-sm transition hover:bg-gray-100 disabled:opacity-50"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-sm font-medium text-blue-500 underline-offset-4 transition hover:underline"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            // Current and Upcoming layout
            if (activeTab === 'current' || activeTab === 'upcoming') {
              return (
                <div
                  key={order._id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex flex-1 flex-col gap-6 md:flex-row md:items-start">
                      <div className="flex w-full max-w-[6rem] flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
                          <AlertTriangle className="h-7 w-7 text-orange-500" />
                        </div>
                        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${transport.iconBg}`}>
                          <TransportIcon className={`h-6 w-6 ${transport.accent}`} />
                        </div>
                        <div className="flex flex-col items-center gap-1 text-[11px] font-medium text-gray-600">
                          {tags.map((tag) => (
                            <span
                              key={tag}
                              className="w-full rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-center"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col gap-4">
                        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-300 bg-blue-50 text-sm font-semibold text-blue-600">
                              A
                            </div>
                            <div className="min-w-[10rem] text-sm font-medium text-gray-700">{originLabel}</div>
                          </div>
                          <div className="flex items-center gap-2 text-gray-400">
                            <span className="block h-px w-10 bg-gray-300" />
                            <span className="text-xs font-semibold uppercase tracking-wide">to</span>
                            <span className="block h-px w-10 bg-gray-300" />
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-purple-300 bg-purple-50 text-sm font-semibold text-purple-600">
                              B
                            </div>
                            <div className="min-w-[10rem] text-sm font-medium text-gray-700">{destLabel}</div>
                          </div>
                          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm">
                            <Calendar className="h-4 w-4 text-blue-500" />
                            {dateLabel}
                          </div>
                        </div>

                        <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2">
                          {detailRows.slice(0, 7).map((row) => (
                            <div
                              key={row.title}
                              className="flex items-center justify-between gap-3 border-b border-dashed border-slate-200 pb-3 text-sm text-gray-600 last:border-b-0 last:pb-0"
                            >
                              <span className="font-medium text-gray-500">{row.title} :</span>
                              <span className="font-semibold text-gray-800">{row.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex w-full max-w-[12rem] flex-col items-end gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-right shadow-sm">
                      <span className="text-sm font-semibold text-gray-600">
                        Trip Id : <span className="font-bold text-gray-900">{order.orderId}</span>
                      </span>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-sm font-medium text-blue-500 underline-offset-4 transition hover:underline"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            // Completed layout
            return (
              <div
                key={order._id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex flex-1 flex-col gap-6 md:flex-row md:items-start">
                    <div className="flex w-full max-w-[6rem] flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
                        <AlertTriangle className="h-7 w-7 text-orange-500" />
                      </div>
                      <div className={`flex h-12 w-12 items-center justify-center rounded-full ${transport.iconBg}`}>
                        <TransportIcon className={`h-6 w-6 ${transport.accent}`} />
                      </div>
                      <div className="flex flex-col items-center gap-1 text-[11px] font-medium text-gray-600">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="w-full rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-center"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col gap-4">
                      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2">
                        <div className="flex items-center justify-between gap-3 border-b border-dashed border-slate-200 pb-3 text-sm text-gray-600 last:border-b-0 last:pb-0">
                          <span className="font-medium text-gray-500">Associate Person Name :</span>
                          <span className="font-semibold text-gray-800">{order.customer?.name || '-'}</span>
                        </div>
                        <div className="flex items-center justify-between gap-3 border-b border-dashed border-slate-200 pb-3 text-sm text-gray-600 last:border-b-0 last:pb-0">
                          <span className="font-medium text-gray-500">Contact Number :</span>
                          <span className="font-semibold text-gray-800">{order.customer?.phone || '-'}</span>
                        </div>
                        <div className="flex items-center justify-between gap-3 border-b border-dashed border-slate-200 pb-3 text-sm text-gray-600 last:border-b-0 last:pb-0">
                          <span className="font-medium text-gray-500">Product :</span>
                          <span className="font-semibold text-gray-800">{order.cargo?.product || '-'}</span>
                        </div>
                        <div className="flex items-center justify-between gap-3 border-b border-dashed border-slate-200 pb-3 text-sm text-gray-600 last:border-b-0 last:pb-0">
                          <span className="font-medium text-gray-500">Goods Types :</span>
                          <span className="font-semibold text-gray-800">{order.shipment?.cargoType || '-'}</span>
                        </div>
                        <div className="flex items-center justify-between gap-3 border-b border-dashed border-slate-200 pb-3 text-sm text-gray-600 last:border-b-0 last:pb-0">
                          <span className="font-medium text-gray-500">Total :</span>
                          <span className="font-semibold text-gray-800">
                            {order.cargo?.packages ? `${order.cargo.packages} packages` : '-'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-3 border-b border-dashed border-slate-200 pb-3 text-sm text-gray-600 last:border-b-0 last:pb-0">
                          <span className="font-medium text-gray-500">Cargo Volume :</span>
                          <span className="font-semibold text-gray-800">
                            {order.cargo?.volume ? `${order.cargo.volume} m3` : '-'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-3 text-sm text-gray-600">
                          <span className="font-medium text-gray-500">Cargo Weight :</span>
                          <span className="font-semibold text-gray-800">
                            {order.cargo?.weight ? `${order.cargo.weight} kg` : '-'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex w-full max-w-[12rem] flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      {dateLabel}
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-gray-600">Invoice</span>
                        <FileText className="h-4 w-4 text-gray-500" />
                      </div>
                      <span className="text-xs font-semibold text-gray-700 capitalize">
                        {order.invoice?.status || 'Pending'}
                      </span>
                    </div>
                    <button className="w-full rounded-xl bg-blue-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600">
                      Completed
                    </button>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-sm font-medium text-blue-500 underline-offset-4 transition hover:underline"
                    >
                      View Details
                    </button>
                    <span className="text-right text-sm font-semibold text-gray-600">
                      Trip Id : <span className="font-bold text-gray-900">{order.orderId}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CHAOrders;
