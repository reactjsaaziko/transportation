import { useMemo, useState } from 'react';
import { Calendar, X } from 'lucide-react';
import {
  useGetMyWorkAssignmentsQuery,
  useAcknowledgeWorkAssignmentMutation,
  useDeclineWorkAssignmentMutation,
  useStartWorkAssignmentMutation,
  useSubmitWorkAssignmentForReviewMutation,
} from '@/services/workAssignmentApi';

type InspectionTab = 'Yet to confirm' | 'Current' | 'Upcoming' | 'Completed';

const tabs: InspectionTab[] = ['Yet to confirm', 'Current', 'Upcoming', 'Completed'];

const TAB_STATUS_MAP: Record<InspectionTab, string> = {
  'Yet to confirm': 'pending',
  Current: 'in_progress',
  Upcoming: 'acknowledged',
  Completed: 'completed',
};

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

const InspectionOrders = () => {
  const [activeTab, setActiveTab] = useState<InspectionTab>('Yet to confirm');
  const [submitModal, setSubmitModal] = useState<{
    id: string;
    summary: string;
    error: string;
  } | null>(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const serviceProviderId = user?.serviceProviderId || user?.id || user?._id || '';

  const {
    data: assignmentsResponse,
    isFetching,
    refetch,
  } = useGetMyWorkAssignmentsQuery(
    {
      serviceProviderId,
      serviceType: 'Inspection',
      status: TAB_STATUS_MAP[activeTab],
    },
    { skip: !serviceProviderId },
  );

  // Completed tab also needs to show assignments that the provider has submitted
  // for review but the admin hasn't yet approved (status: pending_review).
  const {
    data: pendingReviewResponse,
    isFetching: isFetchingPendingReview,
    refetch: refetchPendingReview,
  } = useGetMyWorkAssignmentsQuery(
    {
      serviceProviderId,
      serviceType: 'Inspection',
      status: 'pending_review',
    },
    { skip: !serviceProviderId || activeTab !== 'Completed' },
  );

  const [acknowledgeWA, { isLoading: isAcknowledging }] =
    useAcknowledgeWorkAssignmentMutation();
  const [declineWA, { isLoading: isCancellingWA }] =
    useDeclineWorkAssignmentMutation();
  const [startWA, { isLoading: isStarting }] = useStartWorkAssignmentMutation();
  const [submitWA, { isLoading: isSubmitting }] =
    useSubmitWorkAssignmentForReviewMutation();

  const assignments: any[] = useMemo(() => {
    const raw = assignmentsResponse as any;
    const base = Array.isArray(raw?.data) ? raw.data : [];
    if (activeTab !== 'Completed') return base;
    const pr = pendingReviewResponse as any;
    const pending = Array.isArray(pr?.data) ? pr.data : [];
    return [...pending, ...base];
  }, [assignmentsResponse, pendingReviewResponse, activeTab]);

  const listLoading =
    isFetching || (activeTab === 'Completed' && isFetchingPendingReview);

  const refetchAll = () => {
    refetch();
    if (activeTab === 'Completed') refetchPendingReview();
  };

  const handleAccept = async (id: string) => {
    try {
      await acknowledgeWA(id).unwrap();
      refetchAll();
    } catch (err) {
      console.error('Failed to acknowledge assignment:', err);
    }
  };

  const handleDecline = async (id: string) => {
    try {
      await declineWA({ id, reason: 'Declined by service provider' }).unwrap();
      refetchAll();
    } catch (err) {
      console.error('Failed to cancel assignment:', err);
    }
  };

  const handleStart = async (id: string) => {
    try {
      await startWA(id).unwrap();
      refetchAll();
    } catch (err) {
      console.error('Failed to start assignment:', err);
    }
  };

  const openSubmitModal = (id: string) => {
    setSubmitModal({ id, summary: '', error: '' });
  };

  const closeSubmitModal = () => {
    setSubmitModal(null);
  };

  const handleConfirmSubmit = async () => {
    if (!submitModal) return;
    const summary = submitModal.summary.trim();
    if (!summary) {
      setSubmitModal({ ...submitModal, error: 'Completion summary is required' });
      return;
    }
    try {
      await submitWA({ id: submitModal.id, data: { summary } }).unwrap();
      setSubmitModal(null);
      refetchAll();
    } catch (err: any) {
      console.error('Failed to submit assignment:', err);
      setSubmitModal({
        ...submitModal,
        error:
          err?.data?.message ||
          err?.message ||
          'Failed to submit. Please try again.',
      });
    }
  };

  const InfoItem = ({
    label,
    value,
    helper,
  }: {
    label: string;
    value: string;
    helper?: string;
  }) => (
    <div className="min-w-[150px] space-y-1">
      <div className="font-medium text-gray-500">{label} :</div>
      <div className="text-gray-800 font-semibold">{value}</div>
      {helper && <div className="text-xs text-gray-400">{helper}</div>}
    </div>
  );

  const getCargoTypeLabel = (wa: any) => {
    const type = wa?.cargoType || wa?.assignmentType || 'LCL';
    return String(type).toUpperCase().slice(0, 5);
  };

  const getProduct = (wa: any) =>
    wa?.product || wa?.title || 'Inspection Job';

  const getInspectionType = (wa: any) =>
    wa?.inspectionType || wa?.assignmentType || 'Remote';

  const getGoodsType = (wa: any) => wa?.goodsType || wa?.priority || 'Normal';

  const getCargoWeight = (wa: any) => wa?.cargoWeight || '—';

  const getCargoVolume = (wa: any) => wa?.cargoVolume || '—';

  const getTotalPackages = (wa: any) =>
    wa?.totalPackages || (wa?.packages ? `${wa.packages} packages` : '—');

  const getPort = (wa: any) =>
    wa?.port ||
    [wa?.location?.city, wa?.location?.state].filter(Boolean).join(', ') ||
    '—';

  const getPrice = (wa: any) => {
    const amount = wa?.compensation?.amount;
    const currency = wa?.compensation?.currency || 'INR';
    return amount ? `${currency} ${amount}` : '—';
  };

  const getHsCode = (wa: any) => wa?.hsCode || '';

  const getAddress = (wa: any) =>
    wa?.address || wa?.location?.address || '';

  const getInvoiceStatus = (wa: any) =>
    wa?.invoiceStatus || wa?.compensation?.paymentStatus || '';

  return (
    <div className="pb-12">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
        <div className="flex flex-wrap gap-3 border-b border-gray-100 px-6 py-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-6 px-6 py-6">
          {listLoading && (
            <div className="py-10 text-center text-sm text-gray-500">Loading...</div>
          )}

          {!listLoading && assignments.length === 0 && (
            <div className="py-10 text-center text-sm text-gray-500">
              No inspection orders found.
            </div>
          )}

          {!listLoading &&
            assignments.map((wa) => (
              <div
                key={wa._id}
                className="rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm">
                      <div className="rounded-lg bg-green-100 px-3 py-1 text-xs font-semibold text-green-600">
                        {getCargoTypeLabel(wa)}
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 text-sm text-gray-600">
                      <div className="flex flex-wrap gap-6">
                        <InfoItem label="Product" value={getProduct(wa)} />
                        <InfoItem
                          label="Type of Inspection"
                          value={getInspectionType(wa)}
                        />
                      </div>

                      <div className="flex flex-wrap gap-6">
                        <InfoItem label="Goods Types" value={getGoodsType(wa)} />
                        <InfoItem label="Cargo Weight" value={getCargoWeight(wa)} />
                        <InfoItem label="Cargo Volume" value={getCargoVolume(wa)} />
                      </div>

                      <div className="flex flex-wrap gap-6">
                        <InfoItem label="Total" value={getTotalPackages(wa)} />
                        <InfoItem label="Port" value={getPort(wa)} />
                        <InfoItem label="Price" value={getPrice(wa)} />
                      </div>

                      {activeTab === 'Current' && (
                        <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                          <div className="flex flex-wrap gap-6">
                            {getHsCode(wa) && (
                              <InfoItem label="HS Code" value={getHsCode(wa)} />
                            )}
                          </div>
                          {getAddress(wa) && (
                            <div className="mt-3 space-y-1">
                              <div className="font-medium text-gray-500">Address :</div>
                              <div className="text-gray-800 font-semibold">
                                {getAddress(wa)}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {activeTab === 'Completed' && getInvoiceStatus(wa) && (
                        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                          <button className="rounded-full border border-gray-300 px-4 py-1 text-xs font-semibold text-gray-600">
                            Invoice
                          </button>
                          <span className="text-sm font-semibold text-gray-700">
                            {getInvoiceStatus(wa)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 lg:items-end">
                    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{formatDate(wa.dueDate || wa.assignedAt)}</span>
                    </div>
                    {wa.assignmentId && (
                      <div className="text-sm font-semibold text-gray-600">
                        Order Id : {wa.assignmentId}
                      </div>
                    )}

                    {activeTab === 'Yet to confirm' ? (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleAccept(wa._id)}
                          disabled={isAcknowledging}
                          className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 disabled:opacity-50"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleDecline(wa._id)}
                          disabled={isCancellingWA}
                          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Decline
                        </button>
                      </div>
                    ) : activeTab === 'Upcoming' ? (
                      <button
                        onClick={() => handleStart(wa._id)}
                        disabled={isStarting}
                        className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 disabled:opacity-50"
                      >
                        Start
                      </button>
                    ) : activeTab === 'Current' ? (
                      <button
                        onClick={() => openSubmitModal(wa._id)}
                        disabled={isSubmitting}
                        className="rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-600 disabled:opacity-50"
                      >
                        Submit for Review
                      </button>
                    ) : activeTab === 'Completed' ? (
                      <button className="rounded-lg bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                        Completed
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {submitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                Submit Work for Review
              </h3>
              <button
                onClick={closeSubmitModal}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Completion Summary <span className="text-red-500">*</span>
            </label>
            <textarea
              value={submitModal.summary}
              onChange={(e) =>
                setSubmitModal({ ...submitModal, summary: e.target.value, error: '' })
              }
              rows={5}
              placeholder="Describe the completed work, findings, and any notes..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />

            {submitModal.error && (
              <p className="mt-2 text-sm text-red-600">{submitModal.error}</p>
            )}

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={closeSubmitModal}
                disabled={isSubmitting}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSubmit}
                disabled={isSubmitting}
                className="rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-600 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InspectionOrders;
