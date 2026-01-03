import { X } from 'lucide-react';

interface WarehouseDetailsModalProps {
  warehouse: any;
  onClose: () => void;
}

const WarehouseDetailsModal = ({ warehouse, onClose }: WarehouseDetailsModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6 border-b border-gray-200 pb-6">
          <h2 className="text-2xl font-bold text-gray-900">{warehouse.name}</h2>
          <p className="mt-2 text-sm text-gray-500">Warehouse Details</p>
        </div>

        {/* Basic Information */}
        <div className="mb-8">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Basic Information</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-medium text-gray-500">Address</p>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {warehouse.address?.street || 'N/A'}
              </p>
              <p className="text-xs text-gray-600">
                {[
                  warehouse.address?.area,
                  warehouse.address?.city,
                  warehouse.address?.state,
                  warehouse.address?.country,
                  warehouse.address?.pincode,
                ]
                  .filter(Boolean)
                  .join(', ')}
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-medium text-gray-500">Total Area</p>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {warehouse.totalArea?.value || 0} {warehouse.totalArea?.unit || 'Sq meter'}
              </p>
            </div>
          </div>
        </div>

        {/* Facilities */}
        {warehouse.facilities && warehouse.facilities.length > 0 && (
          <div className="mb-8">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Facilities ({warehouse.facilities.length})
            </h3>
            <div className="space-y-4">
              {warehouse.facilities.map((facility: any, index: number) => (
                <div key={index} className="rounded-2xl border border-gray-200 bg-white p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="text-base font-semibold text-gray-900">{facility.type}</h4>
                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Price:</span>{' '}
                        <span className="font-semibold text-gray-900">
                          ₹{facility.pricing?.price || 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Day:</span>{' '}
                        <span className="font-semibold text-gray-900">
                          {facility.pricing?.day || 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Min:</span>{' '}
                        <span className="font-semibold text-gray-900">
                          {facility.pricing?.minAmount?.value || 0}{' '}
                          {facility.pricing?.minAmount?.unit || 'KG'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  {facility.features && facility.features.length > 0 && (
                    <div className="mb-4">
                      <p className="mb-2 text-xs font-medium text-gray-500">Features/Facilities</p>
                      <div className="flex flex-wrap gap-2">
                        {facility.features.map((feature: any, fIndex: number) => (
                          <span
                            key={fIndex}
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                              feature.available
                                ? 'bg-green-50 text-green-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {feature.available && '✓ '}
                            {feature.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Goods Stored */}
                  {facility.goodsStored && facility.goodsStored.length > 0 && (
                    <div>
                      <p className="mb-2 text-xs font-medium text-gray-500">Goods Stored</p>
                      <div className="flex flex-wrap gap-2">
                        {facility.goodsStored.map((goods: any, gIndex: number) => (
                          <span
                            key={gIndex}
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                              goods.canStore
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {goods.canStore && '✓ '}
                            {goods.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Close Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-blue-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarehouseDetailsModal;
