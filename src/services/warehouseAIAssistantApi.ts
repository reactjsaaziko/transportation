import { apiService } from './apiService';

/**
 * Warehouse AI Assistant API
 * Base path: /service-provider/warehouses/ai-assistant
 */

export interface WarehouseAIConversation {
  _id: string;
  serviceProviderId: string;
  messages: any[];
  status?: 'active' | 'resolved' | 'archived';
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export const warehouseAIAssistantApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    // POST /warehouses/ai-assistant/conversations
    createWarehouseAIConversation: builder.mutation<any, any>({
      query: (data) => ({
        url: '/service-provider/warehouses/ai-assistant/conversations',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['WarehouseAIConversations'],
    }),

    // GET /warehouses/ai-assistant/conversations/:conversationId
    getWarehouseAIConversationById: builder.query<any, string>({
      query: (conversationId) => ({
        url: `/service-provider/warehouses/ai-assistant/conversations/${conversationId}`,
      }),
      providesTags: (result, error, conversationId) => [
        { type: 'WarehouseAIConversation', id: conversationId },
      ],
    }),

    // GET /warehouses/ai-assistant/conversations/service-provider/:serviceProviderId
    getWarehouseAIConversations: builder.query<any, { serviceProviderId: string } & Record<string, any>>({
      query: ({ serviceProviderId, ...params }) => ({
        url: `/service-provider/warehouses/ai-assistant/conversations/service-provider/${serviceProviderId}`,
        params,
      }),
      providesTags: ['WarehouseAIConversations'],
    }),

    // GET /warehouses/ai-assistant/conversations/service-provider/:serviceProviderId/active
    getActiveWarehouseAIConversations: builder.query<any, string>({
      query: (serviceProviderId) => ({
        url: `/service-provider/warehouses/ai-assistant/conversations/service-provider/${serviceProviderId}/active`,
      }),
      providesTags: ['WarehouseAIConversations'],
    }),

    // GET /warehouses/ai-assistant/conversations/service-provider/:serviceProviderId/history
    getWarehouseAIConversationHistory: builder.query<any, { serviceProviderId: string } & Record<string, any>>({
      query: ({ serviceProviderId, ...params }) => ({
        url: `/service-provider/warehouses/ai-assistant/conversations/service-provider/${serviceProviderId}/history`,
        params,
      }),
      providesTags: ['WarehouseAIConversations'],
    }),

    // POST /warehouses/ai-assistant/conversations/:conversationId/messages
    addWarehouseAIMessage: builder.mutation<any, { conversationId: string; message: any }>({
      query: ({ conversationId, message }) => ({
        url: `/service-provider/warehouses/ai-assistant/conversations/${conversationId}/messages`,
        method: 'POST',
        body: message,
      }),
      invalidatesTags: (result, error, { conversationId }) => [
        { type: 'WarehouseAIConversation', id: conversationId },
      ],
    }),

    // POST /warehouses/ai-assistant/conversations/:conversationId/permissions/grant
    grantWarehouseAIPermission: builder.mutation<any, { conversationId: string; permission: any }>({
      query: ({ conversationId, permission }) => ({
        url: `/service-provider/warehouses/ai-assistant/conversations/${conversationId}/permissions/grant`,
        method: 'POST',
        body: permission,
      }),
      invalidatesTags: (result, error, { conversationId }) => [
        { type: 'WarehouseAIConversation', id: conversationId },
      ],
    }),

    // POST /warehouses/ai-assistant/conversations/:conversationId/permissions/revoke
    revokeWarehouseAIPermission: builder.mutation<any, { conversationId: string; permission: any }>({
      query: ({ conversationId, permission }) => ({
        url: `/service-provider/warehouses/ai-assistant/conversations/${conversationId}/permissions/revoke`,
        method: 'POST',
        body: permission,
      }),
      invalidatesTags: (result, error, { conversationId }) => [
        { type: 'WarehouseAIConversation', id: conversationId },
      ],
    }),

    // GET /warehouses/ai-assistant/permissions/:serviceProviderId
    getWarehouseAIPermissions: builder.query<any, string>({
      query: (serviceProviderId) => ({
        url: `/service-provider/warehouses/ai-assistant/permissions/${serviceProviderId}`,
      }),
      providesTags: ['AIPermissions'],
    }),

    // PUT /warehouses/ai-assistant/conversations/:conversationId/resolve
    resolveWarehouseAIConversation: builder.mutation<any, string>({
      query: (conversationId) => ({
        url: `/service-provider/warehouses/ai-assistant/conversations/${conversationId}/resolve`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, conversationId) => [
        { type: 'WarehouseAIConversation', id: conversationId },
        'WarehouseAIConversations',
      ],
    }),

    // POST /warehouses/ai-assistant/conversations/:conversationId/feedback
    addWarehouseAIFeedback: builder.mutation<any, { conversationId: string; data: any }>({
      query: ({ conversationId, data }) => ({
        url: `/service-provider/warehouses/ai-assistant/conversations/${conversationId}/feedback`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { conversationId }) => [
        { type: 'WarehouseAIConversation', id: conversationId },
      ],
    }),

    // GET /warehouses/ai-assistant/statistics/:serviceProviderId
    getWarehouseAIStatistics: builder.query<any, string>({
      query: (serviceProviderId) => ({
        url: `/service-provider/warehouses/ai-assistant/statistics/${serviceProviderId}`,
      }),
      providesTags: ['Statistics'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateWarehouseAIConversationMutation,
  useGetWarehouseAIConversationByIdQuery,
  useGetWarehouseAIConversationsQuery,
  useGetActiveWarehouseAIConversationsQuery,
  useGetWarehouseAIConversationHistoryQuery,
  useAddWarehouseAIMessageMutation,
  useGrantWarehouseAIPermissionMutation,
  useRevokeWarehouseAIPermissionMutation,
  useGetWarehouseAIPermissionsQuery,
  useResolveWarehouseAIConversationMutation,
  useAddWarehouseAIFeedbackMutation,
  useGetWarehouseAIStatisticsQuery,
} = warehouseAIAssistantApi;
