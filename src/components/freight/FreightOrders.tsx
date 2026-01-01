import { useMemo, useState } from 'react';
import { Calendar, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGetFreightOrdersQuery, useUpdateFreightOrderStatusMutation, type FreightOrder } from '@/services/freightApi';

// Map UI tabs to API status values
const statusMap: Record<string, string> = {
  'Yet to confirm': 'yet_to_confirm',
  'Current': 'current',
  'Upcoming': 'upcoming',
  'Completed': 'completed',
};

const tabs = ['Yet to confirm', 'Current', 'Upcoming', 'Completed'] as const;
type TabType = typeof tabs[number];

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
  const serviceProviderId = user?.id || user?._id || '';

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

  // Filter orders by status (API already filters, but we ensure consistency)
  const filteredOrders = useMemo(() => {
    if (!ordersResponse?.data) return [];
    return ordersResponse.data.filter(
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
              {filteredOrders.length === 0 && (
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
