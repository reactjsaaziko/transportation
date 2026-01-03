import { apiService } from './apiService';

// Types for Warehouse APIs
export interface Warehouse {
  _id: string;
  name: string;
  serviceProviderId: string;
  facilityType: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  capacity: {
    totalArea: number; // sq meters
    availableArea: number;
    maxWeight: number; // kg
    currentWeight: number;
  };
  features: string[];
  operatingHours: {
    monday: { open: string; close: string };
    tuesday: { open: string; close: string };
    wednesday: { open: string; close: string };
    thursday: { open: string; close: string };
    friday: { open: string; close: string };
    saturday: { open: string; close: string };
    sunday: { open: string; close: string };
  };
  pricing: {
    perDay: number;
    perWeek: number;
    perMonth: number;
    currency: string;
  };
  status: 'active' | 'inactive' | 'maintenance';
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  images?: string[];
  certifications?: string[];
  rating?: number;
  totalTransactions?: number;
  createdAt: string;
  updatedAt: string;
}

export interface WarehouseTransaction {
  _id: string;
  transactionId: string;
  warehouseId: string;
  serviceProviderId: string;
  type: 'check_in' | 'check_out' | 'storage' | 'transfer';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  cargo: {
    description: string;
    quantity: number;
    weight: number;
    volume: number;
    cargoType: string;
    hsCode?: string;
  };
  customer: {
    name: string;
    companyName?: string;
    phone: string;
    email: string;
  };
  checkIn?: {
    scheduledDate: string;
    actualDate?: string;
    vehicleNumber?: string;
    driverName?: string;
  };
  checkOut?: {
    scheduledDate: string;
    actualDate?: string;
    vehicleNumber?: string;
    driverName?: string;
  };
  pricing: {
    storageCharges: number;
    handlingCharges: number;
    additionalCharges: number;
    discount: number;
    total: number;
    currency: string;
  };
  documents?: Array<{
    name: string;
    type: string;
    url: string;
    uploadedAt: string;
  }>;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WarehouseFilters {
  page?: number;
  limit?: number;
  status?: string;
  facilityType?: string;
  city?: string;
  minCapacity?: number;
  features?: string[];
}

export interface TransactionFilters {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  fromDate?: string;
  toDate?: string;
  warehouseId?: string;
}

/**
 * Warehouse API endpoints
 * Base path: /service-provider/warehouses
 */
export const warehouseApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    // ==================== WAREHOUSE CRUD ====================
    
    // Create warehouse
    createWarehouse: builder.mutation<{ success: boolean; data: Warehouse }, Partial<Warehouse>>({
      query: (data) => ({
        url: '/service-provider/warehouses',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Warehouses', 'WarehouseAnalytics'],
    }),

    // Get warehouses by service provider
    getWarehouses: builder.query<{ success: boolean; data: Warehouse[]; pagination?: any }, string>({
      query: (serviceProviderId) => ({
        url: `/service-provider/warehouses/provider/${serviceProviderId}`,
      }),
      providesTags: ['Warehouses'],
    }),

    // Get warehouse by ID
    getWarehouseById: builder.query<{ success: boolean; data: Warehouse }, string>({
      query: (id) => ({
        url: `/service-provider/warehouses/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: 'Warehouse', id }],
    }),

    // Update warehouse
    updateWarehouse: builder.mutation<{ success: boolean; data: Warehouse }, { id: string; data: Partial<Warehouse> }>({
      query: ({ id, data }) => ({
        url: `/service-provider/warehouses/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Warehouse', id },
        'Warehouses',
      ],
    }),

    // Delete warehouse
    deleteWarehouse: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/service-provider/warehouses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Warehouse', id },
        'Warehouses',
        'WarehouseAnalytics',
      ],
    }),

    // ==================== WAREHOUSE SEARCH & AVAILABILITY ====================
    
    // Get facility types (public)
    getFacilityTypes: builder.query<{ success: boolean; data: string[] }, void>({
      query: () => ({
        url: '/service-provider/warehouses/facility-types',
      }),
    }),

    // Search warehouses (public)
    searchWarehouses: builder.query<{ success: boolean; data: Warehouse[] }, WarehouseFilters>({
      query: (params) => ({
        url: '/service-provider/warehouses/search',
        params,
      }),
      providesTags: ['Warehouses'],
    }),

    // Check warehouse availability
    checkWarehouseAvailability: builder.mutation<{ success: boolean; data: { available: boolean; availableCapacity: any } }, { id: string; requirements: { area?: number; weight?: number; startDate: string; endDate: string } }>({
      query: ({ id, requirements }) => ({
        url: `/service-provider/warehouses/${id}/check-availability`,
        method: 'POST',
        body: requirements,
      }),
    }),

    // Get warehouse analytics
    getWarehouseAnalytics: builder.query<{ success: boolean; data: any }, string>({
      query: (serviceProviderId) => ({
        url: `/service-provider/warehouses/analytics/${serviceProviderId}`,
      }),
      providesTags: ['WarehouseAnalytics'],
    }),

    // ==================== TRANSACTIONS ====================
    
    // Create transaction (check-in)
    createTransaction: builder.mutation<{ success: boolean; data: WarehouseTransaction }, Partial<WarehouseTransaction>>({
      query: (data) => ({
        url: '/service-provider/warehouses/transactions',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['WarehouseTransactions', 'WarehouseAnalytics', 'Warehouses'],
    }),

    // Get transactions by service provider
    getTransactions: builder.query<{ success: boolean; data: WarehouseTransaction[]; pagination?: any }, { serviceProviderId: string } & TransactionFilters>({
      query: ({ serviceProviderId, ...params }) => ({
        url: `/service-provider/warehouses/transactions/provider/${serviceProviderId}`,
        params,
      }),
      providesTags: ['WarehouseTransactions'],
    }),

    // Get transaction by ID
    getTransactionById: builder.query<{ success: boolean; data: WarehouseTransaction }, string>({
      query: (id) => ({
        url: `/service-provider/warehouses/transactions/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: 'WarehouseTransaction', id }],
    }),

    // Get transactions by warehouse
    getTransactionsByWarehouse: builder.query<{ success: boolean; data: WarehouseTransaction[] }, string>({
      query: (warehouseId) => ({
        url: `/service-provider/warehouses/${warehouseId}/transactions`,
      }),
      providesTags: ['WarehouseTransactions'],
    }),

    // Update transaction
    updateTransaction: builder.mutation<{ success: boolean; data: WarehouseTransaction }, { id: string; data: Partial<WarehouseTransaction> }>({
      query: ({ id, data }) => ({
        url: `/service-provider/warehouses/transactions/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'WarehouseTransaction', id },
        'WarehouseTransactions',
      ],
    }),

    // Complete transaction (check-out)
    completeTransaction: builder.mutation<{ success: boolean; data: WarehouseTransaction }, string>({
      query: (id) => ({
        url: `/service-provider/warehouses/transactions/${id}/complete`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'WarehouseTransaction', id },
        'WarehouseTransactions',
        'WarehouseAnalytics',
        'Warehouses',
      ],
    }),

    // Update transaction status
    updateTransactionStatus: builder.mutation<{ success: boolean; data: WarehouseTransaction }, { id: string; status: WarehouseTransaction['status'] }>({
      query: ({ id, status }) => ({
        url: `/service-provider/warehouses/transactions/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'WarehouseTransaction', id },
        'WarehouseTransactions',
      ],
    }),

    // Get transaction analytics
    getTransactionAnalytics: builder.query<{ success: boolean; data: any }, string>({
      query: (serviceProviderId) => ({
        url: `/service-provider/warehouses/transactions/analytics/${serviceProviderId}`,
      }),
      providesTags: ['WarehouseAnalytics'],
    }),

    // Export transactions
    exportTransactions: builder.query<Blob, { serviceProviderId: string; format?: 'csv' | 'excel' }>({
      query: ({ serviceProviderId, format = 'csv' }) => ({
        url: `/service-provider/warehouses/transactions/export/${serviceProviderId}`,
        params: { format },
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

// Export hooks
export const {
  useCreateWarehouseMutation,
  useGetWarehousesQuery,
  useGetWarehouseByIdQuery,
  useUpdateWarehouseMutation,
  useDeleteWarehouseMutation,
  useGetFacilityTypesQuery,
  useSearchWarehousesQuery,
  useCheckWarehouseAvailabilityMutation,
  useGetWarehouseAnalyticsQuery,
  useCreateTransactionMutation,
  useGetTransactionsQuery,
  useGetTransactionByIdQuery,
  useGetTransactionsByWarehouseQuery,
  useUpdateTransactionMutation,
  useCompleteTransactionMutation,
  useUpdateTransactionStatusMutation,
  useGetTransactionAnalyticsQuery,
  useLazyExportTransactionsQuery,
} = warehouseApi;
