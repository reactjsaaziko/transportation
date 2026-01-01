import { useState } from 'react';
import { Pencil, Trash } from 'lucide-react';

const historySections = [
  {
    title: 'Today',
    items: [
      {
        id: 'today-1',
        question: 'How i can manage my Trip?',
        isActive: true,
      },
    ],
  },
  {
    title: 'Previous 7 Days',
    items: [
      {
        id: 'prev7-1',
        question: 'Suggest Me to Customs Rules?',
        isActive: false,
      },
      {
        id: 'prev7-2',
        question: 'How Many Types of Container?',
        isActive: false,
      },
    ],
  },
  {
    title: 'Previous 30 Days',
    items: [
      {
        id: 'prev30-1',
        question: 'What is My Next Trip?',
        isActive: false,
      },
    ],
  },
];

const permissionOptions = [
  {
    id: 'manage-tasks',
    label: 'Manage All Task ?',
    checked: true,
  },
  {
    id: 'answer-questions',
    label: 'Give answer for any question? (Message Center)',
    checked: false,
  },
  {
    id: 'cargo-arrival',
    label: 'Manage Cargo arrival date?',
    checked: true,
  },
  {
    id: 'manage-trip',
    label: 'Manage All Trip ?',
    checked: true,
  },
  {
    id: 'task-suggestion',
    label: 'Task Suggestion ?',
    checked: false,
  },
  {
    id: 'manage-cargo',
    label: 'Manage Your cargo?',
    checked: false,
  },
  {
    id: 'best-prices',
    label: 'Suggested Best Prices?',
    checked: false,
  },
];

const AiAssistantPanel = () => {
  const [activeTab, setActiveTab] = useState<'history' | 'permission'>('history');
  const [permissions, setPermissions] = useState(permissionOptions);

  const handleTogglePermission = (id: string) => {
    setPermissions((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              checked: !item.checked,
            }
          : item,
      ),
    );
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
                isActive
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-white'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'history' ? (
        <div className="mt-6 space-y-6">
          {historySections.map((section) => (
            <div key={section.title} className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                {section.title}
              </h3>
              <div className="space-y-3">
                {section.items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between rounded-xl border border-gray-200 px-5 py-3 text-sm shadow-sm transition ${
                      item.isActive ? 'bg-blue-500 text-white border-blue-500' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                          item.isActive
                            ? 'border-white bg-blue-400/40 text-white'
                            : 'border-blue-200 bg-blue-50 text-blue-500'
                        }`}
                      >
                        <Pencil className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-medium">
                        {item.question}
                      </span>
                    </div>
                    <button
                      type="button"
                      className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                        item.isActive
                          ? 'bg-white/20 text-white hover:bg-white/30'
                          : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                      }`}
                      title="Delete"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
          <div className="space-y-4">
            {permissions.map((permission) => (
              <label
                key={permission.id}
                className="flex cursor-pointer items-center gap-4 rounded-xl bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:shadow"
              >
                <input
                  type="checkbox"
                  checked={permission.checked}
                  onChange={() => handleTogglePermission(permission.id)}
                  className="h-5 w-5 rounded border-blue-300 text-blue-500 focus:ring-blue-500"
                />
                <span>{permission.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AiAssistantPanel;
