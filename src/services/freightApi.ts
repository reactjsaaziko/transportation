import { apiService } from './apiService';

// Types for Freight APIs
export interface FreightOrder {
  _id: string;
  orderId: string;
  serviceProviderId: string;
  status: 'yet_to_confirm' | 'current' | 'upcoming' | 'completed' | 'cancelled';
  mode: 'sea' | 'air' | 'rail' | 'road' | 'multimodal';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Route Information
  origin: {
    port: string;
    city: string;
    country: string;
    address?: string;
  };
  destination: {
    port: string;
    city: string;
    country: string;
    address?: string;
  };
  stopover?: {
    port: string;
    city: string;
    country: string;
  };

  // Cargo Information
  cargo: {
    product: string;
    description?: string;
    hsCode?: string;
    cargoType: string; // Normal, Hazardous, Perishable, etc.
    weight: number;
    volume: number;
    packages: number;
    containerType?: string; // LCL, FCL 20ft, FCL 40ft, etc.
  };

  // Schedule
  schedule: {
    cargoReadyDate: string;
    estimatedDeparture?: string;
    estimatedArrival?: string;
    actualDeparture?: string;
    actualArrival?: string;
    transitTime: string;
  };

  // Vessel/Transport Details
  transport: {
    vesselName?: string;
    shippingLine?: string;
    flightNumber?: string;
    airline?: string;
    trainNumber?: string;
    truckNumber?: string;
    bookingNumber?: string;
  };

  // Customer Information
  customer: {
    name: string;
    companyName?: string;
    phone: string;
    email: string;
    address?: string;
  };

  // Pricing
  pricing: {
    freightCharges: number;
    handlingCharges: number;
    customsDuty: number;
    insurance: number;
    additionalCharges: number;
    discount: number;
    total: number;
    currency: string;
  };

  // Documents
  documents?: Array<{
    name: string;
    type: string; // BL, Invoice, Packing List, etc.
    url: string;
    uploadedAt: string;
  }>;

  // Communications
  communications?: Array<{
    type: 'note' | 'email' | 'call' | 'message';
    content: string;
    sender: string;
    timestamp: string;
  }>;

  // Feedback
  feedback?: {
    rating: number;
    comment: string;
    submittedAt: string;
  };

  // Invoice
  invoice?: {
    invoiceNumber: string;
    status: 'pending' | 'paid' | 'overdue';
    generatedAt: string;
    dueDate: string;
    paidAt?: string;
  };

  tags?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FreightOrderFilters {
  page?: number;
  limit?: number;
  status?: string;
  mode?: string;
  priority?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FreightStatistics {
  totalOrders: number;
  ordersByStatus: {
    yet_to_confirm: number;
    current: number;
    upcoming: number;
    completed: number;
    cancelled: number;
  };
  ordersByMode: {
    sea: number;
    air: number;
    rail: number;
    road: number;
    multimodal: number;
  };
  totalRevenue: number;
  averageTransitTime: number;
  onTimeDeliveryRate: number;
  averageRating: number;
  ordersPerDay: Array<{ date: string; count: number }>;
  revenuePerMonth: Array<{ month: string; amount: number }>;
}

/**
 * Freight API endpoints
 * Base path: /service-provider/freight
 */
export const freightApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    // ==================== FREIGHT ORDER CRUD ====================
    
    // Create freight order
    createFreightOrder: builder.mutation<{ success: boolean; data: FreightOrder }, Partial<FreightOrder>>({
      query: (data) => ({
        url: '/service-provider/freight/orders',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['FreightOrders', 'FreightStatistics'],
    }),

    // Get freight order by ID
    getFreightOrderById: builder.query<{ success: boolean; data: FreightOrder }, string>({
      query: (orderId) => ({
        url: `/service-provider/freight/orders/${orderId}`,
      }),
      providesTags: (result, error, orderId) => [{ type: 'FreightOrder', id: orderId }],
    }),

    // Get freight orders by service provider
    getFreightOrders: builder.query<{ success: boolean; data: FreightOrder[]; pagination?: any }, { serviceProviderId: string } & FreightOrderFilters>({
      query: ({ serviceProviderId, ...params }) => ({
        url: `/service-provider/freight/orders/service-provider/${serviceProviderId}`,
        params,
      }),
      providesTags: ['FreightOrders'],
    }),

    // Get active freight orders (for dashboard)
    getActiveFreightOrders: builder.query<{ success: boolean; data: FreightOrder[] }, string>({
      query: (serviceProviderId) => ({
        url: `/service-provider/freight/orders/service-provider/${serviceProviderId}/active`,
      }),
      providesTags: ['FreightOrders'],
    }),

    // Search freight orders
    searchFreightOrders: builder.query<{ success: boolean; data: FreightOrder[] }, { serviceProviderId: string; query: string; page?: number; limit?: number }>({
      query: ({ serviceProviderId, ...params }) => ({
        url: `/service-provider/freight/orders/service-provider/${serviceProviderId}/search`,
        params,
      }),
      providesTags: ['FreightOrders'],
    }),

    // Update freight order
    updateFreightOrder: builder.mutation<{ success: boolean; data: FreightOrder }, { orderId: string; data: Partial<FreightOrder> }>({
      query: ({ orderId, data }) => ({
        url: `/service-provider/freight/orders/${orderId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'FreightOrder', id: orderId },
        'FreightOrders',
      ],
    }),

    // Delete freight order
    deleteFreightOrder: builder.mutation<{ success: boolean; message: string }, string>({
      query: (orderId) => ({
        url: `/service-provider/freight/orders/${orderId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, orderId) => [
        { type: 'FreightOrder', id: orderId },
        'FreightOrders',
        'FreightStatistics',
      ],
    }),

    // ==================== STATUS MANAGEMENT ====================
    
    // Update freight order status
    updateFreightOrderStatus: builder.mutation<{ success: boolean; data: FreightOrder }, { orderId: string; status: FreightOrder['status']; reason?: string }>({
      query: ({ orderId, ...data }) => ({
        url: `/service-provider/freight/orders/${orderId}/status`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'FreightOrder', id: orderId },
        'FreightOrders',
        'FreightStatistics',
      ],
    }),

    // ==================== PRICING ====================
    
    // Update freight order pricing
    updateFreightOrderPricing: builder.mutation<{ success: boolean; data: FreightOrder }, { orderId: string; pricing: Partial<FreightOrder['pricing']> }>({
      query: ({ orderId, pricing }) => ({
        url: `/service-provider/freight/orders/${orderId}/pricing`,
        method: 'PUT',
        body: pricing,
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'FreightOrder', id: orderId },
      ],
    }),

    // ==================== DOCUMENTS ====================
    
    // Add document to freight order
    addFreightDocument: builder.mutation<{ success: boolean; data: FreightOrder }, { orderId: string; document: { name: string; type: string; url: string } }>({
      query: ({ orderId, document }) => ({
        url: `/service-provider/freight/orders/${orderId}/documents`,
        method: 'POST',
        body: document,
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'FreightOrder', id: orderId },
      ],
    }),

    // ==================== COMMUNICATIONS ====================
    
    // Add communication to freight order
    addFreightCommunication: builder.mutation<{ success: boolean; data: FreightOrder }, { orderId: string; communication: { type: string; content: string; sender: string } }>({
      query: ({ orderId, communication }) => ({
        url: `/service-provider/freight/orders/${orderId}/communications`,
        method: 'POST',
        body: communication,
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'FreightOrder', id: orderId },
      ],
    }),

    // ==================== FEEDBACK & TAGS ====================
    
    // Add feedback
    addFreightFeedback: builder.mutation<{ success: boolean; data: FreightOrder }, { orderId: string; rating: number; comment: string }>({
      query: ({ orderId, ...data }) => ({
        url: `/service-provider/freight/orders/${orderId}/feedback`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'FreightOrder', id: orderId },
        'FreightStatistics',
      ],
    }),

    // Add tags
    addFreightTags: builder.mutation<{ success: boolean; data: FreightOrder }, { orderId: string; tags: string[] }>({
      query: ({ orderId, tags }) => ({
        url: `/service-provider/freight/orders/${orderId}/tags`,
        method: 'POST',
        body: { tags },
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'FreightOrder', id: orderId },
      ],
    }),

    // ==================== STATISTICS ====================
    
    // Get freight statistics
    getFreightStatistics: builder.query<{ success: boolean; data: FreightStatistics }, { serviceProviderId: string; period?: 'week' | 'month' | 'quarter' | 'year' }>({
      query: ({ serviceProviderId, period }) => ({
        url: `/service-provider/freight/statistics/${serviceProviderId}`,
        params: { period },
      }),
      providesTags: ['FreightStatistics'],
    }),

    // Freight Service Pricing endpoints
    createFreightPricing: builder.mutation({
      query: (pricing) => ({
        url: '/service-provider/freight/pricing',
        method: 'POST',
        body: pricing,
      }),
      invalidatesTags: ['FreightPricing'],
    }),

    getFreightPricingsByServiceProvider: builder.query({
      query: (serviceProviderId) => `/service-provider/freight/pricing/service-provider/${serviceProviderId}`,
      providesTags: ['FreightPricing'],
    }),

    updateFreightPricing: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/service-provider/freight/pricing/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['FreightPricing'],
    }),

    deleteFreightPricing: builder.mutation({
      query: (id) => ({
        url: `/service-provider/freight/pricing/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['FreightPricing'],
    }),

    batchCreateFreightPricings: builder.mutation({
      query: (pricings) => ({
        url: '/service-provider/freight/pricing/batch',
        method: 'POST',
        body: { pricings },
      }),
      invalidatesTags: ['FreightPricing'],
    }),
  }),
});

// Export hooks
export const {
  useCreateFreightOrderMutation,
  useGetFreightOrderByIdQuery,
  useGetFreightOrdersQuery,
  useGetActiveFreightOrdersQuery,
  useSearchFreightOrdersQuery,
  useUpdateFreightOrderMutation,
  useDeleteFreightOrderMutation,
  useUpdateFreightOrderStatusMutation,
  useUpdateFreightOrderPricingMutation,
  useAddFreightDocumentMutation,
  useAddFreightCommunicationMutation,
  useAddFreightFeedbackMutation,
  useAddFreightTagsMutation,
  useGetFreightStatisticsQuery,
  useCreateFreightPricingMutation,
  useGetFreightPricingsByServiceProviderQuery,
  useUpdateFreightPricingMutation,
  useDeleteFreightPricingMutation,
  useBatchCreateFreightPricingsMutation,
} = freightApi;
