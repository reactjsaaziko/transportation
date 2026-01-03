import { apiService } from './apiService';

// Types for CHA (Customs House Agent) APIs
export interface CHAOrder {
  _id: string;
  orderId: string;
  serviceProviderId: string;
  status: 'yet_to_confirm' | 'current' | 'upcoming' | 'completed' | 'cancelled';
  
  // Shipment Information
  shipment: {
    type: 'import' | 'export';
    mode: 'sea' | 'air' | 'rail' | 'road';
    containerType: string; // LCL, 20 Standard, 40 Standard, etc.
    cargoType: string; // Normal Container Cargo, Liquid Bulk, etc.
  };

  // Route Information
  origin: {
    port: string;
    city: string;
    country: string;
  };
  destination: {
    port: string;
    city: string;
    country: string;
  };

  // Cargo Information
  cargo: {
    product: string;
    description?: string;
    hsCode: string;
    weight: number;
    volume: number;
    packages: number;
    value: number;
    currency: string;
  };

  // Dates
  schedule: {
    gateInDate?: string;
    receiveDate?: string;
    customsClearanceDate?: string;
    deliveryDate?: string;
    cargoReadyDate: string;
  };

  // Customer Information
  customer: {
    name: string;
    companyName?: string;
    phone: string;
    email: string;
    address?: string;
    importerExporterCode?: string;
  };

  // Timeline Events
  timeline: Array<{
    event: string;
    description?: string;
    scheduledDate: string;
    completedDate?: string;
    status: 'pending' | 'in_progress' | 'completed' | 'delayed';
    notes?: string;
  }>;

  // Documents
  documents?: Array<{
    name: string;
    type: string; // Bill of Lading, Invoice, Packing List, Customs Declaration, etc.
    url: string;
    status: 'pending' | 'submitted' | 'approved' | 'rejected';
    uploadedAt: string;
  }>;

  // Pricing
  pricing: {
    customsDuty: number;
    clearanceCharges: number;
    documentationFees: number;
    handlingCharges: number;
    transportCharges: number;
    additionalCharges: number;
    discount: number;
    total: number;
    currency: string;
  };

  // Tracking
  tracking: {
    currentStatus: string;
    location?: string;
    lastUpdated?: string;
    history: Array<{
      status: string;
      location?: string;
      timestamp: string;
      remarks?: string;
    }>;
  };

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

  notes?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CHAConversation {
  _id: string;
  conversationId: string;
  serviceProviderId: string;
  orderId?: string;
  category: 'task_management' | 'cargo_management' | 'documentation' | 'customs_clearance' | 'pricing' | 'general' | 'support';
  status: 'active' | 'resolved' | 'pending' | 'escalated';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  subject: string;
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
    attachments?: Array<{
      name: string;
      url: string;
      type: string;
    }>;
  }>;
  permissions: {
    manageAllTasks: boolean;
    giveAnswerForQuestions: boolean;
    manageCargoArrivalDate: boolean;
    manageAllTrips: boolean;
    taskSuggestions: boolean;
    manageYourCargo: boolean;
    suggestedBestPrices: boolean;
  };
  feedback?: {
    rating: number;
    helpful: boolean;
    comment?: string;
  };
  tags?: string[];
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CHAOrderFilters {
  page?: number;
  limit?: number;
  status?: string;
  shipmentType?: string;
  mode?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CHAStatistics {
  totalOrders: number;
  ordersByStatus: {
    yet_to_confirm: number;
    current: number;
    upcoming: number;
    completed: number;
    cancelled: number;
  };
  ordersByMode: Record<string, number>;
  totalCustomsDuty: number;
  totalRevenue: number;
  averageProcessingTime: number;
  averageRating: number;
  documentsProcessed: number;
  ordersPerDay: Array<{ date: string; count: number }>;
}

/**
 * CHA API endpoints
 * Base path: /service-provider/cha
 */
export const chaApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    // ==================== CHA ORDER CRUD ====================
    
    // Create CHA order
    createCHAOrder: builder.mutation<{ success: boolean; data: CHAOrder }, Partial<CHAOrder>>({
      query: (data) => ({
        url: '/service-provider/cha/orders',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['CHAOrders', 'CHAStatistics'],
    }),

    // Get CHA order by ID
    getCHAOrderById: builder.query<{ success: boolean; data: CHAOrder }, string>({
      query: (orderId) => ({
        url: `/service-provider/cha/orders/${orderId}`,
      }),
      providesTags: (result, error, orderId) => [{ type: 'CHAOrder', id: orderId }],
    }),

    // Get CHA orders by service provider
    getCHAOrders: builder.query<{ success: boolean; data: CHAOrder[]; pagination?: any }, { serviceProviderId: string } & CHAOrderFilters>({
      query: ({ serviceProviderId, ...params }) => ({
        url: `/service-provider/cha/orders/service-provider/${serviceProviderId}`,
        params,
      }),
      providesTags: ['CHAOrders'],
    }),

    // Get CHA orders by status
    getCHAOrdersByStatus: builder.query<{ success: boolean; data: CHAOrder[] }, { serviceProviderId: string; status: string }>({
      query: ({ serviceProviderId, status }) => ({
        url: `/service-provider/cha/orders/service-provider/${serviceProviderId}/status/${status}`,
      }),
      providesTags: ['CHAOrders'],
    }),

    // Update CHA order
    updateCHAOrder: builder.mutation<{ success: boolean; data: CHAOrder }, { orderId: string; data: Partial<CHAOrder> }>({
      query: ({ orderId, data }) => ({
        url: `/service-provider/cha/orders/${orderId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'CHAOrder', id: orderId },
        'CHAOrders',
      ],
    }),

    // Delete CHA order
    deleteCHAOrder: builder.mutation<{ success: boolean; message: string }, string>({
      query: (orderId) => ({
        url: `/service-provider/cha/orders/${orderId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, orderId) => [
        { type: 'CHAOrder', id: orderId },
        'CHAOrders',
        'CHAStatistics',
      ],
    }),

    // ==================== STATUS & TIMELINE ====================
    
    // Update CHA order status
    updateCHAOrderStatus: builder.mutation<{ success: boolean; data: CHAOrder }, { orderId: string; status: CHAOrder['status']; reason?: string }>({
      query: ({ orderId, ...data }) => ({
        url: `/service-provider/cha/orders/${orderId}/status`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'CHAOrder', id: orderId },
        'CHAOrders',
        'CHAStatistics',
      ],
    }),

    // Add timeline event
    addTimelineEvent: builder.mutation<{ success: boolean; data: CHAOrder }, { orderId: string; event: CHAOrder['timeline'][0] }>({
      query: ({ orderId, event }) => ({
        url: `/service-provider/cha/orders/${orderId}/timeline`,
        method: 'POST',
        body: event,
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'CHAOrder', id: orderId },
      ],
    }),

    // Complete timeline event
    completeTimelineEvent: builder.mutation<{ success: boolean; data: CHAOrder }, { orderId: string; eventIndex: number; completedDate?: string }>({
      query: ({ orderId, eventIndex, completedDate }) => ({
        url: `/service-provider/cha/orders/${orderId}/timeline/${eventIndex}/complete`,
        method: 'PUT',
        body: { completedDate },
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'CHAOrder', id: orderId },
      ],
    }),

    // ==================== DOCUMENTS & TRACKING ====================
    
    // Upload document
    uploadCHADocument: builder.mutation<{ success: boolean; data: CHAOrder }, { orderId: string; document: { name: string; type: string; url: string } }>({
      query: ({ orderId, document }) => ({
        url: `/service-provider/cha/orders/${orderId}/documents`,
        method: 'POST',
        body: document,
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'CHAOrder', id: orderId },
      ],
    }),

    // Update cargo tracking
    updateCHATracking: builder.mutation<{ success: boolean; data: CHAOrder }, { orderId: string; tracking: Partial<CHAOrder['tracking']> }>({
      query: ({ orderId, tracking }) => ({
        url: `/service-provider/cha/orders/${orderId}/tracking`,
        method: 'PUT',
        body: tracking,
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'CHAOrder', id: orderId },
      ],
    }),

    // ==================== FEEDBACK ====================
    
    // Add feedback
    addCHAFeedback: builder.mutation<{ success: boolean; data: CHAOrder }, { orderId: string; rating: number; comment: string }>({
      query: ({ orderId, ...data }) => ({
        url: `/service-provider/cha/orders/${orderId}/feedback`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'CHAOrder', id: orderId },
        'CHAStatistics',
      ],
    }),

    // ==================== STATISTICS ====================
    
    // Get CHA order statistics
    getCHAStatistics: builder.query<{ success: boolean; data: CHAStatistics }, { serviceProviderId: string; period?: 'week' | 'month' | 'quarter' | 'year' }>({
      query: ({ serviceProviderId, period }) => ({
        url: `/service-provider/cha/orders/statistics/${serviceProviderId}`,
        params: { period },
      }),
      providesTags: ['CHAStatistics'],
    }),

    // ==================== AI ASSISTANT ====================
    
    // Create conversation
    createCHAConversation: builder.mutation<{ success: boolean; data: CHAConversation }, Partial<CHAConversation>>({
      query: (data) => ({
        url: '/service-provider/cha/ai-assistant/conversations',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['CHAConversations'],
    }),

    // Get conversation by ID
    getCHAConversationById: builder.query<{ success: boolean; data: CHAConversation }, string>({
      query: (conversationId) => ({
        url: `/service-provider/cha/ai-assistant/conversations/${conversationId}`,
      }),
      providesTags: (result, error, id) => [{ type: 'CHAConversation', id }],
    }),

    // Get conversations by service provider
    getCHAConversations: builder.query<{ success: boolean; data: CHAConversation[] }, { serviceProviderId: string; status?: string; category?: string }>({
      query: ({ serviceProviderId, ...params }) => ({
        url: `/service-provider/cha/ai-assistant/conversations/service-provider/${serviceProviderId}`,
        params,
      }),
      providesTags: ['CHAConversations'],
    }),

    // Get active conversations
    getActiveCHAConversations: builder.query<{ success: boolean; data: CHAConversation[] }, string>({
      query: (serviceProviderId) => ({
        url: `/service-provider/cha/ai-assistant/conversations/service-provider/${serviceProviderId}/active`,
      }),
      providesTags: ['CHAConversations'],
    }),

    // Add message to conversation
    addCHAMessage: builder.mutation<{ success: boolean; data: CHAConversation }, { conversationId: string; message: { role: string; content: string } }>({
      query: ({ conversationId, message }) => ({
        url: `/service-provider/cha/ai-assistant/conversations/${conversationId}/messages`,
        method: 'POST',
        body: message,
      }),
      invalidatesTags: (result, error, { conversationId }) => [
        { type: 'CHAConversation', id: conversationId },
      ],
    }),

    // Grant AI permission
    grantCHAPermission: builder.mutation<{ success: boolean; data: CHAConversation }, { conversationId: string; permission: string }>({
      query: ({ conversationId, permission }) => ({
        url: `/service-provider/cha/ai-assistant/conversations/${conversationId}/permissions/grant`,
        method: 'POST',
        body: { permission },
      }),
      invalidatesTags: (result, error, { conversationId }) => [
        { type: 'CHAConversation', id: conversationId },
      ],
    }),

    // Revoke AI permission
    revokeCHAPermission: builder.mutation<{ success: boolean; data: CHAConversation }, { conversationId: string; permission: string }>({
      query: ({ conversationId, permission }) => ({
        url: `/service-provider/cha/ai-assistant/conversations/${conversationId}/permissions/revoke`,
        method: 'POST',
        body: { permission },
      }),
      invalidatesTags: (result, error, { conversationId }) => [
        { type: 'CHAConversation', id: conversationId },
      ],
    }),

    // Resolve conversation
    resolveCHAConversation: builder.mutation<{ success: boolean; data: CHAConversation }, string>({
      query: (conversationId) => ({
        url: `/service-provider/cha/ai-assistant/conversations/${conversationId}/resolve`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, conversationId) => [
        { type: 'CHAConversation', id: conversationId },
        'CHAConversations',
      ],
    }),

    // ==================== DASHBOARD ====================
    
    // Get CHA dashboard overview
    getCHADashboardOverview: builder.query<{ success: boolean; data: any }, string>({
      query: (serviceProviderId) => ({
        url: `/service-provider/cha/dashboard/${serviceProviderId}/overview`,
      }),
      providesTags: ['CHAStatistics'],
    }),
  }),
});

// Export hooks
export const {
  useCreateCHAOrderMutation,
  useGetCHAOrderByIdQuery,
  useGetCHAOrdersQuery,
  useGetCHAOrdersByStatusQuery,
  useUpdateCHAOrderMutation,
  useDeleteCHAOrderMutation,
  useUpdateCHAOrderStatusMutation,
  useAddTimelineEventMutation,
  useCompleteTimelineEventMutation,
  useUploadCHADocumentMutation,
  useUpdateCHATrackingMutation,
  useAddCHAFeedbackMutation,
  useGetCHAStatisticsQuery,
  useCreateCHAConversationMutation,
  useGetCHAConversationByIdQuery,
  useGetCHAConversationsQuery,
  useGetActiveCHAConversationsQuery,
  useAddCHAMessageMutation,
  useGrantCHAPermissionMutation,
  useRevokeCHAPermissionMutation,
  useResolveCHAConversationMutation,
  useGetCHADashboardOverviewQuery,
} = chaApi;
