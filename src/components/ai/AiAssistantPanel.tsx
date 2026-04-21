import { useMemo, useState } from 'react';
import { Pencil, Trash, Loader2, AlertCircle } from 'lucide-react';
import {
  useGetAIAssistantHistoryQuery,
  useGetAIPermissionsQuery,
  useUpdateAIPermissionsMutation,
  type AIPermissions,
} from '@/services/serviceProviderApi';

type PermissionId =
  | 'manage-tasks'
  | 'answer-questions'
  | 'cargo-arrival'
  | 'manage-trip'
  | 'task-suggestion'
  | 'manage-cargo'
  | 'best-prices';

const permissionFieldMap: Record<PermissionId, keyof AIPermissions> = {
  'manage-tasks': 'manageAllTasks',
  'answer-questions': 'giveAnswerForQuestions',
  'cargo-arrival': 'manageCargoArrivalDate',
  'manage-trip': 'manageAllTrips',
  'task-suggestion': 'taskSuggestions',
  'manage-cargo': 'manageYourCargo',
  'best-prices': 'suggestedBestPrices',
};

const permissionLabels: { id: PermissionId; label: string }[] = [
  { id: 'manage-tasks', label: 'Manage All Task ?' },
  { id: 'answer-questions', label: 'Give answer for any question? (Message Center)' },
  { id: 'cargo-arrival', label: 'Manage Cargo arrival date?' },
  { id: 'manage-trip', label: 'Manage All Trip ?' },
  { id: 'task-suggestion', label: 'Task Suggestion ?' },
  { id: 'manage-cargo', label: 'Manage Your cargo?' },
  { id: 'best-prices', label: 'Suggested Best Prices?' },
];

interface HistoryItem {
  id: string;
  question: string;
  createdAt?: string;
}

const extractHistoryItems = (raw: any): HistoryItem[] => {
  const candidates = [raw?.data?.history, raw?.data?.items, raw?.data?.conversations, raw?.data];
  const list = candidates.find((c) => Array.isArray(c)) as any[] | undefined;
  if (!list) return [];
  return list.map((item, idx) => ({
    id: item._id || item.id || `history-${idx}`,
    question: item.question || item.title || item.message || item.firstMessage || 'Untitled',
    createdAt: item.createdAt || item.updatedAt || item.timestamp,
  }));
};

const groupHistory = (items: HistoryItem[]) => {
  const today: HistoryItem[] = [];
  const last7: HistoryItem[] = [];
  const last30: HistoryItem[] = [];
  const older: HistoryItem[] = [];
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  items.forEach((item) => {
    const ts = item.createdAt ? new Date(item.createdAt).getTime() : 0;
    const diff = now - ts;
    if (!ts || diff < day) today.push(item);
    else if (diff < 7 * day) last7.push(item);
    else if (diff < 30 * day) last30.push(item);
    else older.push(item);
  });

  return [
    { title: 'Today', items: today },
    { title: 'Previous 7 Days', items: last7 },
    { title: 'Previous 30 Days', items: last30 },
    { title: 'Older', items: older },
  ].filter((s) => s.items.length > 0);
};

const AiAssistantPanel = () => {
  const [activeTab, setActiveTab] = useState<'history' | 'permission'>('history');
  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const serviceProviderId = user?.id || user?._id || '';

  const {
    data: historyRaw,
    isLoading: historyLoading,
    isError: historyError,
  } = useGetAIAssistantHistoryQuery(
    { serviceProviderId },
    { skip: !serviceProviderId },
  );

  const {
    data: permissionsResponse,
    isLoading: permissionsLoading,
    isError: permissionsError,
  } = useGetAIPermissionsQuery(serviceProviderId, { skip: !serviceProviderId });

  const [updatePermissions, { isLoading: isUpdatingPermissions }] = useUpdateAIPermissionsMutation();

  const historySections = useMemo(() => groupHistory(extractHistoryItems(historyRaw)), [historyRaw]);

  const permissions = permissionsResponse?.data;

  const handleTogglePermission = async (id: PermissionId) => {
    if (!serviceProviderId || !permissions) return;
    const field = permissionFieldMap[id];
    try {
      await updatePermissions({
        serviceProviderId,
        permissions: { [field]: !permissions[field] } as Partial<AIPermissions>,
      }).unwrap();
    } catch (err) {
      console.error('Failed to update permission', err);
    }
  };

  return (
    <div className="min-h-[70vh] rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-1">
        {[
          { id: 'history' as const, label: 'History' },
          { id: 'permission' as const, label: 'Permission' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-xl px-6 py-2 text-sm font-semibold transition ${
                isActive ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-600 hover:bg-white'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {!serviceProviderId ? (
        <div className="mt-6 rounded-2xl border border-dashed border-amber-200 bg-amber-50 p-6 text-center text-amber-700">
          Sign in as a service provider to view your AI assistant.
        </div>
      ) : activeTab === 'history' ? (
        <div className="mt-6 space-y-6">
          {historyLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <span className="ml-3 text-gray-600">Loading history...</span>
            </div>
          ) : historyError ? (
            <div className="flex flex-col items-center justify-center py-16">
              <AlertCircle className="h-10 w-10 text-red-500 mb-3" />
              <p className="text-gray-600">Failed to load history</p>
            </div>
          ) : historySections.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-blue-200 py-16 text-center text-gray-500">
              No conversations yet. Start a chat with your AI assistant.
            </div>
          ) : (
            historySections.map((section) => (
              <div key={section.title} className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  {section.title}
                </h3>
                <div className="space-y-3">
                  {section.items.map((item) => {
                    const isActive = activeItemId === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setActiveItemId(item.id)}
                        className={`flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 px-5 py-3 text-sm shadow-sm transition ${
                          isActive ? 'bg-blue-500 text-white border-blue-500' : 'bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                              isActive
                                ? 'border-white bg-blue-400/40 text-white'
                                : 'border-blue-200 bg-blue-50 text-blue-500'
                            }`}
                          >
                            <Pencil className="h-4 w-4" />
                          </span>
                          <span className="text-sm font-medium">{item.question}</span>
                        </div>
                        <button
                          type="button"
                          className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                            isActive
                              ? 'bg-white/20 text-white hover:bg-white/30'
                              : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                          }`}
                          title="Delete"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
          {permissionsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <span className="ml-3 text-gray-600">Loading permissions...</span>
            </div>
          ) : permissionsError || !permissions ? (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-10 w-10 text-red-500 mb-3" />
              <p className="text-gray-600">Failed to load permissions</p>
            </div>
          ) : (
            <div className="space-y-4">
              {permissionLabels.map((permission) => {
                const field = permissionFieldMap[permission.id];
                const checked = !!permissions[field];
                return (
                  <label
                    key={permission.id}
                    className="flex cursor-pointer items-center gap-4 rounded-xl bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:shadow"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={isUpdatingPermissions}
                      onChange={() => handleTogglePermission(permission.id)}
                      className="h-5 w-5 rounded border-blue-300 text-blue-500 focus:ring-blue-500"
                    />
                    <span>{permission.label}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AiAssistantPanel;
