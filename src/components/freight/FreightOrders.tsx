import { useMemo, useState } from 'react';
import { Calendar, Loader2, RefreshCw, AlertCircle, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGetFreightOrdersQuery, useUpdateFreightOrderStatusMutation, type FreightOrder } from '@/services/freightApi';
import {
  useGetMyWorkAssignmentsQuery,
  useAcknowledgeWorkAssignmentMutation,
  useDeclineWorkAssignmentMutation,
  useStartWorkAssignmentMutation,
  useSubmitWorkAssignmentForReviewMutation,
} from '@/services/workAssignmentApi';

// Map UI tabs to API status values
const statusMap: Record<string, string> = {
  'Yet to confirm': 'yet_to_confirm',
  'Current': 'current',
  'Upcoming': 'upcoming',
  'Completed': 'completed',
};

const tabs = ['Yet to confirm', 'Current', 'Upcoming', 'Completed'] as const;
type TabType = typeof tabs[number];

// Admin work-assignment status for each UI tab
const waStatusByTab: Record<TabType, string> = {
  'Yet to confirm': 'pending',
  Upcoming: 'acknowledged',
  Current: 'in_progress',
  Completed: 'completed',
};

const RouteChip = ({ label }: { label: string }) => (
  <span className="rounded-full border border-dashed border-blue-200 bg-blue-50 px-4 py-1 text-xs font-semibold text-blue-600">
    {label}
  </span>
);

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="space-y-1">
    <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</div>
    <div className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm">
      {value || '-'}
    </div>
  </div>
);

const FreightOrders = () => {
  const [activeTab, setActiveTab] = useState<TabType>('Yet to confirm');
  const navigate = useNavigate();

  // Get service provider ID from localStorage (set after login)
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const serviceProviderId = user?.serviceProviderId || user?.id || user?._id || '';

  // Fetch freight orders from API
  const { 
    data: ordersResponse, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useGetFreightOrdersQuery(
    { 
      serviceProviderId,
      status: statusMap[activeTab],
    },
    { 
      skip: !serviceProviderId,
      refetchOnMountOrArgChange: true,
    }
  );

  // Mutation for updating order status
  const [updateStatus, { isLoading: isUpdating }] = useUpdateFreightOrderStatusMutation();

  const { data: adminAssignedResponse, refetch: refetchAdminAssigned } =
    useGetMyWorkAssignmentsQuery(
      {
        serviceProviderId,
        serviceType: 'Freight Forwarding',
        status: waStatusByTab[activeTab],
      },
      { skip: !serviceProviderId },
    );

  // Completed tab also needs to show jobs the provider has submitted for review
  // but admin hasn't approved yet (status: pending_review).
  const { data: pendingReviewResponse, refetch: refetchPendingReview } =
    useGetMyWorkAssignmentsQuery(
      {
        serviceProviderId,
        serviceType: 'Freight Forwarding',
        status: 'pending_review',
      },
      { skip: !serviceProviderId || activeTab !== 'Completed' },
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
    if (activeTab !== 'Completed') return base;
    const pr = pendingReviewResponse as any;
    const pending = Array.isArray(pr?.data) ? pr.data : [];
    return [...pending, ...base];
  }, [adminAssignedResponse, pendingReviewResponse, activeTab]);

  const refetchAdminAll = () => {
    refetchAdminAssigned();
    if (activeTab === 'Completed') refetchPendingReview();
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

  // Filter orders by status (API already filters, but we ensure consistency)
  const filteredOrders = useMemo(() => {
    const raw = ordersResponse?.data as any;
    const list: FreightOrder[] = Array.isArray(raw?.orders)
      ? raw.orders
      : Array.isArray(raw)
      ? raw
      : [];
    return list.filter(
      (order: FreightOrder) => order.status === statusMap[activeTab]
    );
  }, [ordersResponse?.data, activeTab]);

  // Handle accept/decline actions
  const handleAccept = async (orderId: string) => {
    try {
      await updateStatus({ orderId, status: 'current' }).unwrap();
      refetch();
    } catch (err) {
      console.error('Failed to accept order:', err);
    }
  };

  const handleDecline = async (orderId: string) => {
    try {
      await updateStatus({ orderId, status: 'cancelled', reason: 'Declined by service provider' }).unwrap();
      refetch();
    } catch (err) {
      console.error('Failed to decline order:', err);
    }
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Format currency
  const formatPrice = (amount?: number, currency = 'USD') => {
    if (amount === undefined) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  // Show login prompt if no service provider ID
  if (!serviceProviderId) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
        <p className="text-gray-600 text-lg mb-4">Please log in to view your freight orders</p>
        <button
          onClick={() => navigate('/login')}
          className="rounded-lg bg-blue-500 px-6 py-2 text-white font-medium hover:bg-blue-600"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="pb-12">
      <div className="space-y-8">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          {/* Header with tabs and refresh button */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-6 py-4">
            <div className="flex flex-wrap gap-3">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
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

          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <span className="ml-3 text-gray-600">Loading orders...</span>
            </div>
          )}

          {/* Error state */}
          {isError && (
            <div className="flex flex-col items-center justify-center py-20">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <p className="text-gray-600 mb-4">Failed to load freight orders</p>
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

          {/* Orders list */}
          {!isLoading && !isError && (
            <div className="space-y-6 px-6 py-6">
              {adminAssignedJobs.length > 0 && (
                <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-blue-900">
                      {activeTab === 'Yet to confirm'
                        ? 'New jobs assigned by Admin'
                        : `Admin assigned jobs — ${activeTab}`}
                    </h3>
                    <span className="rounded-full bg-blue-500 px-3 py-1 text-xs font-medium text-white">
                      {adminAssignedJobs.length} {activeTab === 'Yet to confirm' ? 'pending' : activeTab.toLowerCase()}
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
                              {wa.title || 'Untitled freight assignment'}
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
                          {activeTab === 'Yet to confirm' && (
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
                          {activeTab === 'Upcoming' && (
                            <button
                              onClick={() => handleStartAdminJob(wa._id)}
                              disabled={isStarting}
                              className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50"
                            >
                              Start
                            </button>
                          )}
                          {activeTab === 'Current' && (
                            <button
                              onClick={() => handleSubmitAdminJob(wa._id)}
                              disabled={isSubmittingWA}
                              className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 disabled:opacity-50"
                            >
                              Submit for Review
                            </button>
                          )}
                          {activeTab === 'Completed' && (
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

              {filteredOrders.map((order: FreightOrder) => (
                <div key={order._id} className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                  <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex flex-col gap-5 text-sm text-gray-600">
                      {/* Route chips */}
                      <div className="flex flex-wrap items-center gap-3">
                        <RouteChip label={`${order.origin?.port || order.origin?.city || 'Origin'}`} />
                        {order.stopover && <RouteChip label={`${order.stopover.port || order.stopover.city}`} />}
                        <RouteChip label={`${order.destination?.port || order.destination?.city || 'Destination'}`} />
                      </div>

                      {/* Order details card */}
                      <div className="rounded-2xl border border-gray-200 bg-blue-50/40 p-5">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                          <InfoRow label="Product" value={order.cargo?.product || '-'} />
                          <InfoRow label="TT" value={order.schedule?.transitTime || '-'} />
                          <InfoRow label="Cargo Ready Date" value={formatDate(order.schedule?.cargoReadyDate)} />
                        </div>

                        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                          <InfoRow label="Goods Types" value={order.cargo?.cargoType || '-'} />
                          <InfoRow label="Cargo Weight" value={order.cargo?.weight ? `${order.cargo.weight} kg` : '-'} />
                          <InfoRow label="Cargo Volume" value={order.cargo?.volume ? `${order.cargo.volume} m³` : '-'} />
                        </div>

                        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                          <InfoRow label="Total Packages" value={order.cargo?.packages?.toString() || '-'} />
                          <InfoRow label="Vessel Name" value={order.transport?.vesselName || '-'} />
                          <InfoRow label="Shipping Line" value={order.transport?.shippingLine || '-'} />
                        </div>
                      </div>

                      {/* Invoice status for completed orders */}
                      {activeTab === 'Completed' && order.invoice && (
                        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
                          <button className="rounded-full border border-gray-300 px-4 py-1 text-xs font-semibold text-gray-600">
                            Invoice
                          </button>
                          <span className={`text-sm font-semibold ${
                            order.invoice.status === 'paid' ? 'text-green-600' : 
                            order.invoice.status === 'overdue' ? 'text-red-600' : 'text-yellow-600'
                          }`}>
                            {order.invoice.status.charAt(0).toUpperCase() + order.invoice.status.slice(1)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Right side - Order info and actions */}
                    <div className="flex flex-col gap-4 lg:items-end">
                      <div className="text-sm font-semibold text-gray-600">
                        Order Id : {order.orderId || order._id}
                      </div>
                      {order.cargo?.hsCode && (
                        <div className="text-sm font-medium text-gray-500">
                          HS Code : <span className="font-semibold text-gray-700">{order.cargo.hsCode}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{formatDate(order.schedule?.cargoReadyDate)}</span>
                      </div>
                      <div className="text-sm font-semibold text-gray-600">
                        Price : <span className="font-semibold text-gray-800">
                          {formatPrice(order.pricing?.total, order.pricing?.currency)}
                        </span>
                      </div>

                      {/* Action buttons based on status */}
                      {activeTab === 'Yet to confirm' ? (
                        <div className="flex gap-3">
                          <button 
                            onClick={() => handleAccept(order._id)}
                            disabled={isUpdating}
                            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 disabled:opacity-50"
                          >
                            {isUpdating ? 'Processing...' : 'Accept'}
                          </button>
                          <button 
                            onClick={() => handleDecline(order._id)}
                            disabled={isUpdating}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                          >
                            Decline
                          </button>
                        </div>
                      ) : activeTab === 'Completed' ? (
                        <button className="rounded-lg bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                          Completed
                        </button>
                      ) : activeTab === 'Current' ? (
                        <button className="rounded-lg bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                          In Progress
                        </button>
                      ) : null}

                      <button
                        onClick={() => navigate(`/dashboard/freight-order/${order._id}`)}
                        className="text-sm font-medium text-blue-600 underline-offset-4 hover:underline"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Empty state */}
              {filteredOrders.length === 0 && adminAssignedJobs.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="text-gray-400 text-lg mb-2">No {activeTab.toLowerCase()} freight orders</div>
                  <div className="text-sm text-gray-300">Orders will appear here when available</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreightOrders;
