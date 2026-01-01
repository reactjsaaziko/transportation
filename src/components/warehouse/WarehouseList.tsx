import { useState } from 'react';
import { Plus, MapPin, Package, ChevronRight } from 'lucide-react';
import { useGetWarehousesQuery } from '../../services/warehouseApi';
import WarehouseFacilities from './WarehouseFacilities';
import WarehouseDetailsModal from './WarehouseDetailsModal';

const WarehouseList = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<any>(null);
  
  // Get service provider ID from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const serviceProviderId = user?.id || user?._id || '';

  // Fetch warehouses
  const { data: warehousesData, isLoading, refetch } = useGetWarehousesQuery(serviceProviderId, {
    skip: !serviceProviderId,
  });

  // Handle different response structures
  const warehouses = Array.isArray((warehousesData?.data as any)?.warehouses) 
    ? (warehousesData?.data as any).warehouses 
    : Array.isArray(warehousesData?.data) 
    ? warehousesData.data 
    : [];

  const handleWarehouseAdded = () => {
    setShowAddForm(false);
    refetch();
  };

  if (showAddForm) {
    return <WarehouseFacilities onCancel={() => setShowAddForm(false)} onSuccess={handleWarehouseAdded} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-8">
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
              <Package className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Manage Warehouse</h1>
              <p className="text-sm text-gray-500">{warehouses.length} warehouses</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
          >
            <Plus className="h-4 w-4" />
            Add Warehouse
          </button>
        </div>

        {/* Warehouse List */}
        <div className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
                <p className="mt-2 text-sm text-gray-500">Loading warehouses...</p>
              </div>
            </div>
          ) : warehouses.length === 0 ? (
            <div className="py-12 text-center">
              <Package className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">No warehouses yet</h3>
              <p className="mt-2 text-sm text-gray-500">Get started by adding your first warehouse</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-600"
              >
                <Plus className="h-4 w-4" />
                Add Your First Warehouse
              </button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {warehouses.map((warehouse: any) => (
                <div
                  key={warehouse._id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-900">{warehouse.name}</h3>
                      <div className="mt-2 flex items-start gap-2 text-sm text-gray-500">
                        <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                        <span className="line-clamp-2">{warehouse.address?.street}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div>
                        <span className="font-semibold text-gray-900">
                          {warehouse.totalArea?.value || 0}
                        </span>{' '}
                        {warehouse.totalArea?.unit || 'Sq meter'}
                      </div>
                      <div className="h-4 w-px bg-gray-200"></div>
                      <div>
                        <span className="font-semibold text-gray-900">
                          {warehouse.facilities?.length || 0}
                        </span>{' '}
                        Facilities
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedWarehouse(warehouse)}
                      className="flex items-center gap-1 text-xs font-medium text-blue-500 hover:text-blue-600"
                    >
                      View
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>

                  {warehouse.facilities && warehouse.facilities.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {warehouse.facilities.slice(0, 3).map((facility: any, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600"
                        >
                          {facility.type}
                        </span>
                      ))}
                      {warehouse.facilities.length > 3 && (
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                          +{warehouse.facilities.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Warehouse Details Modal */}
        {selectedWarehouse && (
          <WarehouseDetailsModal
            warehouse={selectedWarehouse}
            onClose={() => setSelectedWarehouse(null)}
          />
        )}
      </div>
    </div>
  );
};

export default WarehouseList;
