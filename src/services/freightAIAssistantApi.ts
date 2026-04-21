import { apiService } from './apiService';

/**
 * Freight AI Assistant API
 * Base path: /service-provider/freight/ai-assistant
 */

export interface FreightAIConversation {
  _id: string;
  serviceProviderId: string;
  messages: any[];
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  tags?: string[];
  status?: 'active' | 'resolved' | 'archived';
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export const freightAIAssistantApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    // POST /freight/ai-assistant/conversations
    createFreightAIConversation: builder.mutation<any, any>({
      query: (data) => ({
        url: '/service-provider/freight/ai-assistant/conversations',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['FreightAIConversations'],
    }),

    // GET /freight/ai-assistant/conversations/:conversationId
    getFreightAIConversationById: builder.query<any, string>({
      query: (conversationId) => ({
        url: `/service-provider/freight/ai-assistant/conversations/${conversationId}`,
      }),
      providesTags: (result, error, conversationId) => [
        { type: 'FreightAIConversation', id: conversationId },
      ],
    }),

    // GET /freight/ai-assistant/conversations/service-provider/:serviceProviderId
    getFreightAIConversations: builder.query<any, { serviceProviderId: string } & Record<string, any>>({
      query: ({ serviceProviderId, ...params }) => ({
        url: `/service-provider/freight/ai-assistant/conversations/service-provider/${serviceProviderId}`,
        params,
      }),
      providesTags: ['FreightAIConversations'],
    }),

    // GET /freight/ai-assistant/conversations/service-provider/:serviceProviderId/active
    getActiveFreightAIConversations: builder.query<any, string>({
      query: (serviceProviderId) => ({
        url: `/service-provider/freight/ai-assistant/conversations/service-provider/${serviceProviderId}/active`,
      }),
      providesTags: ['FreightAIConversations'],
    }),

    // GET /freight/ai-assistant/conversations/service-provider/:serviceProviderId/history
    getFreightAIConversationHistory: builder.query<any, { serviceProviderId: string } & Record<string, any>>({
      query: ({ serviceProviderId, ...params }) => ({
        url: `/service-provider/freight/ai-assistant/conversations/service-provider/${serviceProviderId}/history`,
        params,
      }),
      providesTags: ['FreightAIConversations'],
    }),

    // POST /freight/ai-assistant/conversations/:conversationId/messages
    addFreightAIMessage: builder.mutation<any, { conversationId: string; message: any }>({
      query: ({ conversationId, message }) => ({
        url: `/service-provider/freight/ai-assistant/conversations/${conversationId}/messages`,
        method: 'POST',
        body: message,
      }),
      invalidatesTags: (result, error, { conversationId }) => [
        { type: 'FreightAIConversation', id: conversationId },
      ],
    }),

    // POST /freight/ai-assistant/conversations/:conversationId/permissions/grant
    grantFreightAIPermission: builder.mutation<any, { conversationId: string; permission: any }>({
      query: ({ conversationId, permission }) => ({
        url: `/service-provider/freight/ai-assistant/conversations/${conversationId}/permissions/grant`,
        method: 'POST',
        body: permission,
      }),
      invalidatesTags: (result, error, { conversationId }) => [
        { type: 'FreightAIConversation', id: conversationId },
      ],
    }),

    // POST /freight/ai-assistant/conversations/:conversationId/permissions/revoke
    revokeFreightAIPermission: builder.mutation<any, { conversationId: string; permission: any }>({
      query: ({ conversationId, permission }) => ({
        url: `/service-provider/freight/ai-assistant/conversations/${conversationId}/permissions/revoke`,
        method: 'POST',
        body: permission,
      }),
      invalidatesTags: (result, error, { conversationId }) => [
        { type: 'FreightAIConversation', id: conversationId },
      ],
    }),

    // GET /freight/ai-assistant/permissions/:serviceProviderId
    getFreightAIPermissions: builder.query<any, string>({
      query: (serviceProviderId) => ({
        url: `/service-provider/freight/ai-assistant/permissions/${serviceProviderId}`,
      }),
      providesTags: ['AIPermissions'],
    }),

    // PUT /freight/ai-assistant/conversations/:conversationId/priority
    updateFreightAIPriority: builder.mutation<any, { conversationId: string; priority: string }>({
      query: ({ conversationId, priority }) => ({
        url: `/service-provider/freight/ai-assistant/conversations/${conversationId}/priority`,
        method: 'PUT',
        body: { priority },
      }),
      invalidatesTags: (result, error, { conversationId }) => [
        { type: 'FreightAIConversation', id: conversationId },
      ],
    }),

    // POST /freight/ai-assistant/conversations/:conversationId/tags
    addFreightAITags: builder.mutation<any, { conversationId: string; tags: string[] }>({
      query: ({ conversationId, tags }) => ({
        url: `/service-provider/freight/ai-assistant/conversations/${conversationId}/tags`,
        method: 'POST',
        body: { tags },
      }),
      invalidatesTags: (result, error, { conversationId }) => [
        { type: 'FreightAIConversation', id: conversationId },
      ],
    }),

    // DELETE /freight/ai-assistant/conversations/:conversationId/tags
    removeFreightAITags: builder.mutation<any, { conversationId: string; tags: string[] }>({
      query: ({ conversationId, tags }) => ({
        url: `/service-provider/freight/ai-assistant/conversations/${conversationId}/tags`,
        method: 'DELETE',
        body: { tags },
      }),
      invalidatesTags: (result, error, { conversationId }) => [
        { type: 'FreightAIConversation', id: conversationId },
      ],
    }),

    // PUT /freight/ai-assistant/conversations/:conversationId/resolve
    resolveFreightAIConversation: builder.mutation<any, string>({
      query: (conversationId) => ({
        url: `/service-provider/freight/ai-assistant/conversations/${conversationId}/resolve`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, conversationId) => [
        { type: 'FreightAIConversation', id: conversationId },
        'FreightAIConversations',
      ],
    }),

    // POST /freight/ai-assistant/conversations/:conversationId/feedback
    addFreightAIFeedback: builder.mutation<any, { conversationId: string; data: any }>({
      query: ({ conversationId, data }) => ({
        url: `/service-provider/freight/ai-assistant/conversations/${conversationId}/feedback`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { conversationId }) => [
        { type: 'FreightAIConversation', id: conversationId },
      ],
    }),

    // GET /freight/ai-assistant/statistics/:serviceProviderId
    getFreightAIStatistics: builder.query<any, string>({
      query: (serviceProviderId) => ({
        url: `/service-provider/freight/ai-assistant/statistics/${serviceProviderId}`,
      }),
      providesTags: ['Statistics'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateFreightAIConversationMutation,
  useGetFreightAIConversationByIdQuery,
  useGetFreightAIConversationsQuery,
  useGetActiveFreightAIConversationsQuery,
  useGetFreightAIConversationHistoryQuery,
  useAddFreightAIMessageMutation,
  useGrantFreightAIPermissionMutation,
  useRevokeFreightAIPermissionMutation,
  useGetFreightAIPermissionsQuery,
  useUpdateFreightAIPriorityMutation,
  useAddFreightAITagsMutation,
  useRemoveFreightAITagsMutation,
  useResolveFreightAIConversationMutation,
  useAddFreightAIFeedbackMutation,
  useGetFreightAIStatisticsQuery,
} = freightAIAssistantApi;
