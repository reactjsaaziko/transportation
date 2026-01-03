import { useMemo } from 'react';
import { LayoutGrid, Truck } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { ContainerIllustration } from './ContainerIllustrations';
import { CONTAINER_DETAILS, CONTAINER_OPTIONS } from './containerData';

const ContainerDetailsPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();

  const fallbackId = CONTAINER_OPTIONS[0]?.id;
  if (!fallbackId) {
    return null;
  }

  const selectedId = useMemo(() => {
    const exists = CONTAINER_OPTIONS.some((option: { id: string }) => option.id === productId);
    return exists && productId ? productId : fallbackId;
  }, [productId, fallbackId]);

  const selectedContainer = CONTAINER_OPTIONS.find((option: { id: string }) => option.id === selectedId) ?? CONTAINER_OPTIONS[0];
  const detail = CONTAINER_DETAILS[selectedId] ?? CONTAINER_DETAILS[fallbackId];

  const stats = [
    { label: 'INSIDE LENGTH', value: detail.metrics.insideLength },
    { label: 'INSIDE WIDTH', value: detail.metrics.insideWidth },
    { label: 'INSIDE HEIGHT', value: detail.metrics.insideHeight },
    { label: 'DOOR WIDTH', value: detail.metrics.doorWidth },
    { label: 'DOOR HEIGHT', value: detail.metrics.doorHeight },
    { label: 'CAPACITY', value: detail.metrics.capacity },
    { label: 'TARE WEIGHT', value: detail.metrics.tareWeight },
    { label: 'MAX CARGO WEIGHT', value: detail.metrics.maxCargoWeight },
  ];

  const handleNavigate = (id: string) => {
    if (id === selectedId) return;
    navigate(`/dashboard/container-details/${id}`);
  };

  return (
    <div className="min-h-screen bg-[#eff2f8]">
      <div className="h-full w-full overflow-hidden border border-[#e2e8f3] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        {/* Tabs */}
        <div className="flex items-center gap-5 border-b border-[#edf0f7] px-6 sm:px-8">
          <button className="flex items-center gap-2 border-b-2 border-blue-500 px-2 pb-4 pt-5 text-sm font-semibold text-blue-600">
            <LayoutGrid className="h-4 w-4 text-blue-500" />
            Container
          </button>
          <button
            type="button"
            className="flex items-center gap-2 border-b-2 border-transparent px-2 pb-4 pt-5 text-sm font-semibold text-gray-400"
          >
            <Truck className="h-4 w-4" />
            Truck
          </button>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Sidebar */}
          <aside className="w-full border-b border-[#edf0f7] px-6 py-6 sm:px-8 lg:w-72 lg:border-b-0 lg:border-r">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">List of All Container Types</p>
            <div className="mt-4 space-y-2">
              {CONTAINER_OPTIONS.map((option: { id: string; name: string }) => {
                const isActive = option.id === selectedId;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleNavigate(option.id)}
                    className={`w-full rounded-2xl px-4 py-2 text-left text-sm font-semibold transition ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 shadow-sm shadow-blue-100'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {option.name}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Detail Content */}
          <section className="flex-1 px-6 py-6 sm:px-8">
            <div className="flex flex-col gap-8 lg:flex-row">
              <div className="flex w-full flex-col items-center rounded-[28px] border border-[#edf0f7] bg-[#f7f9fc] px-6 py-6 lg:max-w-sm">
                <p className="text-base font-semibold text-gray-800">{selectedContainer.name}</p>
                <div className="mt-5 h-44 w-full">
                  <ContainerIllustration variant={selectedContainer.variant} size={selectedContainer.size} />
                </div>
              </div>
              <div className="grid flex-1 grid-cols-2 gap-x-8 gap-y-4 text-sm text-gray-700 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">{stat.label}</p>
                    <p className="mt-1 text-base font-semibold text-gray-800">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 rounded-[28px] border border-[#edf0f7] bg-white p-6 shadow-sm">
              <h3 className="text-base font-semibold text-gray-800">Description</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{detail.description}</p>
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-gray-600">
                {detail.highlights.map((point: string) => (
                  <li key={point} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ContainerDetailsPage;