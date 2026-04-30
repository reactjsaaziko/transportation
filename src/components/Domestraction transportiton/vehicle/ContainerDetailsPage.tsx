import { useMemo } from 'react';
import { LayoutGrid, Truck, X } from 'lucide-react';
import { ContainerIllustration } from './ContainerIllustrations';
import { CONTAINER_DETAILS, CONTAINER_OPTIONS } from './containerData';

interface ContainerDetailsPageProps {
  containerId: string | null;
  onBack?: () => void;
}

const ContainerDetailsPage = ({ containerId, onBack }: ContainerDetailsPageProps) => {
  const productId = containerId;
  const fallbackId = CONTAINER_OPTIONS[0]?.id;

  const selectedId = useMemo(() => {
    if (!fallbackId) {
      return null;
    }
    const exists = CONTAINER_OPTIONS.some((option: { id: string }) => option.id === productId);
    return exists && productId ? productId : fallbackId;
  }, [productId, fallbackId]);

  if (!fallbackId || !selectedId) {
    return null;
  }

  const selectedContainer = CONTAINER_OPTIONS.find((option: { id: string }) => option.id === selectedId) ?? CONTAINER_OPTIONS[0];
  const detail = CONTAINER_DETAILS[selectedId] ?? CONTAINER_DETAILS[fallbackId];

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="relative w-full bg-white shadow-sm">
        {/* Close Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="absolute right-8 top-5 z-50 flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        
        {/* Header */}
        <div className="border-b border-gray-200 px-8 py-5">
          <h2 className="text-lg font-semibold text-gray-900">Container & Truck Type</h2>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-white px-8">
          <button className="flex items-center gap-2 border-b-2 border-blue-500 px-5 py-4 text-base font-medium text-blue-600">
            <LayoutGrid className="h-5 w-5" />
            Container
          </button>
          <button
            type="button"
            className="flex items-center gap-2 border-b-2 border-transparent px-5 py-4 text-base font-medium text-gray-500 hover:text-gray-700"
          >
            <Truck className="h-5 w-5" />
            Truck
          </button>
        </div>

        {/* Content Area */}
        <div className="flex min-h-[calc(100vh-160px)]">
          {/* Left Sidebar - Container List */}
          <aside className="w-64 flex-shrink-0 overflow-y-auto border-r border-gray-200 bg-gray-50 p-5">
            <p className="mb-4 text-sm font-semibold text-gray-600">List of All Container Types</p>
            <div className="space-y-1.5">
              {CONTAINER_OPTIONS.map((option: { id: string; name: string }) => {
                const isActive = option.id === selectedId;
                return (
                  <button
                    key={option.id}
                    type="button"
                    className={`w-full rounded-lg px-4 py-3 text-left text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {option.name}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Right Content Area */}
          <div className="flex-1 overflow-y-auto p-5 ">
            {/* Container Title */}
            <h3 className="mb-8 text-3xl font-bold text-gray-900">{selectedContainer.name}</h3>

            <div className="flex flex-col gap-10 lg:flex-row">
              {/* Container Image */}
              <div className="flex-shrink-0">
                <div className="flex h-72 w-full items-center justify-center lg:w-96">
                  <ContainerIllustration variant={selectedContainer.variant} size={selectedContainer.size} />
                </div>
              </div>

              {/* Container Specifications */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <span className="text-base font-semibold text-gray-700">INSIDE LENGTH :</span>
                  <span className="text-base text-gray-600">{detail.metrics.insideLength}</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <span className="text-base font-semibold text-gray-700">INSIDE WIDWTH :</span>
                  <span className="text-base text-gray-600">{detail.metrics.insideWidth}</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <span className="text-base font-semibold text-gray-700">INSIDE HEIGHT :</span>
                  <span className="text-base text-gray-600">{detail.metrics.insideHeight}</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <span className="text-base font-semibold text-gray-700">DOOR WIGHT :</span>
                  <span className="text-base text-gray-600">{detail.metrics.doorWidth}</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <span className="text-base font-semibold text-gray-700">DOOR HEIGHT :</span>
                  <span className="text-base text-gray-600">{detail.metrics.doorHeight}</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <span className="text-base font-semibold text-gray-700">CAPICITY :</span>
                  <span className="text-base text-gray-600">{detail.metrics.capacity}</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <span className="text-base font-semibold text-gray-700">TARE WEIGHT :</span>
                  <span className="text-base text-gray-600">{detail.metrics.tareWeight}</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <span className="text-base font-semibold text-gray-700">MAX CARGO WEIGHT :</span>
                  <span className="text-base text-gray-600">{detail.metrics.maxCargoWeight}</span>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="mt-10">
              <h4 className="mb-5 text-xl font-bold text-gray-900">Description</h4>
              <div className="mb-5 text-base leading-relaxed text-gray-600 whitespace-pre-line">
                {detail.description}
              </div>
              
              <ul className="space-y-2 text-base text-gray-600 mb-5">
                {detail.highlights.map((point: string, index: number) => (
                  <li key={index} className="flex gap-3">
                    <span className="mt-1.5 text-blue-500">•</span>
                    <span className="leading-relaxed">
                      {index === 1 ? (
                        <>
                          <a href="#" className="text-blue-600 hover:underline">Standard containers</a>
                          {point.replace('Standard containers', '')}
                        </>
                      ) : (
                        point
                      )}
                    </span>
                  </li>
                ))}
              </ul>

              {detail.additionalInfo && (
                <div className="text-base leading-relaxed text-gray-600 whitespace-pre-line">
                  {detail.additionalInfo}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContainerDetailsPage;