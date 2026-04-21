import { apiService } from './apiService';

/**
 * Transport AI Assistant API (legacy /ai-assistant/*)
 * Base path: /service-provider/ai-assistant
 */

export interface AIConversation {
  _id: string;
  serviceProviderId: string;
  messages: any[];
  status?: 'active' | 'resolved' | 'archived';
  category?: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export const transportAIAssistantApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    // POST /ai-assistant/:serviceProviderId/conversations
    startConversation: builder.mutation<any, { serviceProviderId: string; data?: any }>({
      query: ({ serviceProviderId, data }) => ({
        url: `/service-provider/ai-assistant/${serviceProviderId}/conversations`,
        method: 'POST',
        body: data || {},
      }),
      invalidatesTags: ['AIConversations'],
    }),

    // POST /ai-assistant/conversations/:conversationId/messages
    continueConversation: builder.mutation<any, { conversationId: string; message: any }>({
      query: ({ conversationId, message }) => ({
        url: `/service-provider/ai-assistant/conversations/${conversationId}/messages`,
        method: 'POST',
        body: message,
      }),
      invalidatesTags: (result, error, { conversationId }) => [
        { type: 'AIConversation', id: conversationId },
      ],
    }),

    // GET /ai-assistant/conversations/:conversationId
    getConversation: builder.query<any, string>({
      query: (conversationId) => ({
        url: `/service-provider/ai-assistant/conversations/${conversationId}`,
      }),
      providesTags: (result, error, conversationId) => [
        { type: 'AIConversation', id: conversationId },
      ],
    }),

    // PUT /ai-assistant/conversations/:conversationId/resolve
    resolveConversation: builder.mutation<any, string>({
      query: (conversationId) => ({
        url: `/service-provider/ai-assistant/conversations/${conversationId}/resolve`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, conversationId) => [
        { type: 'AIConversation', id: conversationId },
        'AIConversations',
      ],
    }),

    // POST /ai-assistant/conversations/:conversationId/feedback
    addConversationFeedback: builder.mutation<any, { conversationId: string; data: any }>({
      query: ({ conversationId, data }) => ({
        url: `/service-provider/ai-assistant/conversations/${conversationId}/feedback`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { conversationId }) => [
        { type: 'AIConversation', id: conversationId },
      ],
    }),

    // PUT /ai-assistant/conversations/:conversationId/messages/:messageId/helpful
    markMessageHelpful: builder.mutation<any, { conversationId: string; messageId: string; helpful: boolean }>({
      query: ({ conversationId, messageId, helpful }) => ({
        url: `/service-provider/ai-assistant/conversations/${conversationId}/messages/${messageId}/helpful`,
        method: 'PUT',
        body: { helpful },
      }),
      invalidatesTags: (result, error, { conversationId }) => [
        { type: 'AIConversation', id: conversationId },
      ],
    }),

    // GET /ai-assistant/:serviceProviderId/analytics
    getAIUsageAnalytics: builder.query<any, { serviceProviderId: string } & Record<string, any>>({
      query: ({ serviceProviderId, ...params }) => ({
        url: `/service-provider/ai-assistant/${serviceProviderId}/analytics`,
        params,
      }),
      providesTags: ['Statistics'],
    }),

    // GET /ai-assistant/:serviceProviderId/suggestions
    getConversationSuggestions: builder.query<any, string>({
      query: (serviceProviderId) => ({
        url: `/service-provider/ai-assistant/${serviceProviderId}/suggestions`,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useStartConversationMutation,
  useContinueConversationMutation,
  useGetConversationQuery,
  useResolveConversationMutation,
  useAddConversationFeedbackMutation,
  useMarkMessageHelpfulMutation,
  useGetAIUsageAnalyticsQuery,
  useGetConversationSuggestionsQuery,
} = transportAIAssistantApi;
