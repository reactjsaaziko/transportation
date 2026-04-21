import { useMemo, useState } from 'react';
import { Calendar } from 'lucide-react';
import TripDetails from './TripDetails';
import {
  useGetMyWorkAssignmentsQuery,
  useAcknowledgeWorkAssignmentMutation,
  useDeclineWorkAssignmentMutation,
  useStartWorkAssignmentMutation,
  useSubmitWorkAssignmentForReviewMutation,
} from '@/services/workAssignmentApi';

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

const formatLocation = (loc: any): string => {
  if (!loc) return '-';
  if (typeof loc === 'string') return loc;
  const parts = [loc.address, loc.city, loc.state, loc.country].filter(Boolean);
  return parts.join(', ') || '-';
};

type TripStatus = 'Yet to confirm' | 'Current' | 'Upcoming' | 'Completed';

// Map UI tab → backend status value
const TAB_STATUS: Record<TripStatus, string> = {
  'Yet to confirm': 'pending',
  Upcoming: 'acknowledged',
  Current: 'in_progress',
  Completed: 'pending_review',
};

interface Trip {
  id: string;
  orderId?: string;
  tripId?: string;
  fromLocation: string;
  toLocation: string;
  viaLocation: string;
  date: string;
  product: string;
  goodsType: string;
  total: string;
  coast: string;
  price?: string;
  tripKm: string;
  cargoWeight: string;
  cargoVolume: string;
  status: TripStatus;
  invoiceStatus?: 'Pending' | 'Payment Transfer';
}

const mapAssignmentToTrip = (a: any, tab: TripStatus): Trip => {
  return {
    id: a._id || a.id,
    orderId: a.assignmentId || a._id,
    tripId: a.assignmentId || a._id,
    fromLocation:
      formatLocation(a.pickup || a.pickupLocation || a.origin || a.location) || '-',
    toLocation:
      formatLocation(a.drop || a.dropLocation || a.destination) || '-',
    viaLocation: formatLocation(a.via || a.viaLocation) || '-',
    date: formatDate(a.dueDate || a.assignedAt),
    product: a.product || a.productName || a.cargoDescription || a.title || '-',
    goodsType: a.goodsType || a.cargoType || '-',
    total: a.total || (a.packageCount ? `${a.packageCount} packages` : '-'),
    coast: a.coast || a.tripCount || '-',
    tripKm: a.tripKm || (a.distance ? `${a.distance} km` : '-'),
    cargoWeight: a.cargoWeight || (a.weight ? `${a.weight} kg` : '-'),
    cargoVolume: a.cargoVolume || (a.volume ? `${a.volume} M3` : '-'),
    price: a.compensation?.amount ? `INR ${a.compensation.amount}` : undefined,
    status: tab,
  };
};

interface TripManagementProps {
  onViewDetails?: (trip: Trip) => void;
}

const TripManagement = ({ onViewDetails }: TripManagementProps = {}) => {
  const [activeTab, setActiveTab] = useState<TripStatus>('Yet to confirm');
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const handleViewDetails = (trip: Trip) => {
    if (onViewDetails) onViewDetails(trip);
    else setSelectedTrip(trip);
  };

  const handleBack = () => setSelectedTrip(null);

  if (selectedTrip) {
    return <TripDetails trip={selectedTrip} onBack={handleBack} />;
  }

  const tabs: TripStatus[] = ['Yet to confirm', 'Current', 'Upcoming', 'Completed'];

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const serviceProviderId = user?.serviceProviderId || user?.id || user?._id || '';

  const { data: response, refetch, isFetching } = useGetMyWorkAssignmentsQuery(
    {
      serviceProviderId,
      serviceType: 'Domestic Transportation',
      status: TAB_STATUS[activeTab],
    },
    { skip: !serviceProviderId },
  );

  const [acknowledgeWA, { isLoading: isAcknowledging }] =
    useAcknowledgeWorkAssignmentMutation();
  const [declineWA, { isLoading: isCancelling }] =
    useDeclineWorkAssignmentMutation();
  const [startWA, { isLoading: isStarting }] =
    useStartWorkAssignmentMutation();
  const [submitWA, { isLoading: isSubmitting }] =
    useSubmitWorkAssignmentForReviewMutation();

  const trips: Trip[] = useMemo(() => {
    const raw = response as any;
    const list: any[] = Array.isArray(raw?.data) ? raw.data : [];
    return list.map((a) => mapAssignmentToTrip(a, activeTab));
  }, [response, activeTab]);

  const handleAccept = async (id: string) => {
    try {
      await acknowledgeWA(id).unwrap();
      refetch();
    } catch (err) {
      console.error('Failed to accept assignment:', err);
    }
  };

  const handleDecline = async (id: string) => {
    try {
      await declineWA({ id, reason: 'Declined by service provider' }).unwrap();
      refetch();
    } catch (err) {
      console.error('Failed to decline assignment:', err);
    }
  };

  const handleStart = async (id: string) => {
    try {
      await startWA(id).unwrap();
      refetch();
    } catch (err) {
      console.error('Failed to start assignment:', err);
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await submitWA({ id, data: { summary: 'Trip completed' } }).unwrap();
      refetch();
    } catch (err) {
      console.error('Failed to complete assignment:', err);
    }
  };

  const renderActionButtons = (trip: Trip) => {
    switch (activeTab) {
      case 'Yet to confirm':
        return (
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleAccept(trip.id)}
              disabled={isAcknowledging}
              className="px-6 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors min-w-[100px]"
            >
              Accept
            </button>
            <button
              onClick={() => handleDecline(trip.id)}
              disabled={isCancelling}
              className="px-6 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors min-w-[100px]"
            >
              Decline
            </button>
          </div>
        );
      case 'Upcoming':
        return (
          <button
            onClick={() => handleStart(trip.id)}
            disabled={isStarting}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors min-w-[120px]"
          >
            Start Trip
          </button>
        );
      case 'Current':
        return (
          <button
            onClick={() => handleComplete(trip.id)}
            disabled={isSubmitting}
            className="px-6 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors min-w-[120px]"
          >
            Complete Trip
          </button>
        );
      case 'Completed':
        return (
          <span className="px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg">
            Completed
          </span>
        );
      default:
        return null;
    }
  };

  const idLabel = activeTab === 'Yet to confirm' || activeTab === 'Upcoming'
    ? 'Order'
    : 'Trip';
  const idValue = (trip: Trip) =>
    activeTab === 'Yet to confirm' || activeTab === 'Upcoming'
      ? trip.orderId
      : trip.tripId;

  return (
    <div className="min-h-screen">
      {/* Tabs */}
      <div className="flex items-center gap-3 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === tab
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Loading / empty state */}
      {isFetching && trips.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-sm text-gray-500">
          Loading...
        </div>
      )}
      {!isFetching && trips.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-sm text-gray-500">
          No trips in {activeTab}.
        </div>
      )}

      {/* Trip Cards - unified design for all tabs */}
      <div className="space-y-4">
        {trips.map((trip) => (
          <div
            key={trip.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-5"
          >
            <div className="flex items-start justify-between mb-4">
              {/* Left: Badge + Truck + Route */}
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-10 h-6 bg-green-600 rounded flex items-center justify-center">
                    <span className="text-xs font-semibold text-white">LCL</span>
                  </div>
                  <div className="w-12 h-10 bg-gray-100 rounded flex items-center justify-center p-1">
                    <img
                      src="/images/1.png"
                      alt="Vehicle"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-blue-500">A</span>
                    <span className="text-sm text-gray-600">{trip.fromLocation}</span>
                  </div>
                  <span className="text-gray-400 text-sm">+</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-blue-500">B</span>
                    <span className="text-sm text-gray-600">{trip.toLocation}</span>
                  </div>
                  <span className="text-gray-400 text-sm">+</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-blue-500">C</span>
                    <span className="text-sm text-gray-600">{trip.viaLocation}</span>
                  </div>
                  <div className="flex items-center gap-2 ml-4 px-3 py-1.5 bg-white border border-gray-200 rounded">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{trip.date}</span>
                  </div>
                </div>
              </div>

              {/* Right: Order/Trip Id + Action buttons */}
              <div className="flex flex-col items-end gap-2">
                <span className="text-sm text-gray-600 font-medium">
                  {idLabel} I'd : {idValue(trip)}
                </span>
                {renderActionButtons(trip)}
              </div>
            </div>

            {/* Details Table */}
            <div className="bg-gray-50/80 rounded-lg p-4 mb-3">
              <div className="grid grid-cols-2 gap-x-8 gap-y-2.5">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Product :</span>
                  <span className="text-gray-300">|</span>
                  <span className="text-sm text-gray-800">{trip.product}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Trip km</span>
                  <span className="text-gray-300">|</span>
                  <span className="text-sm text-gray-800">{trip.tripKm}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Goods Types :</span>
                  <span className="text-gray-300">|</span>
                  <span className="text-sm text-gray-800">{trip.goodsType}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Cargo Weight :</span>
                  <span className="text-gray-300">|</span>
                  <span className="text-sm text-gray-800">{trip.cargoWeight}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Total :</span>
                  <span className="text-gray-300">|</span>
                  <span className="text-sm text-gray-800">{trip.total}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Cargo Volume :</span>
                  <span className="text-gray-300">|</span>
                  <span className="text-sm text-gray-800">{trip.cargoVolume}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Coast :</span>
                  <span className="text-gray-300">|</span>
                  <span className="text-sm text-gray-800">{trip.coast}</span>
                </div>
                {trip.price && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">Price :</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-sm text-gray-800">{trip.price}</span>
                  </div>
                )}
              </div>
            </div>

            {/* View Details */}
            <div className="flex justify-end">
              <button
                onClick={() => handleViewDetails(trip)}
                className="text-sm text-gray-700 hover:text-blue-600 underline font-medium"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TripManagement;
