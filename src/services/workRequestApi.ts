import { apiService } from './apiService';

/**
 * Work Request API (broadcast requests)
 * Base path: /service-provider/work/requests and /service-provider/work/service-providers
 */

export interface WorkRequest {
  _id: string;
  title: string;
  description?: string;
  type?: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  status?: 'open' | 'assigned' | 'cancelled' | 'expired' | 'completed';
  expiresAt?: string;
  targetServiceProviders?: string[];
  interestedProviders?: string[];
  acceptedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export const workRequestApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    // ==================== ADMIN ====================

    // POST /work/requests
    createWorkRequest: builder.mutation<{ success: boolean; data: WorkRequest }, Partial<WorkRequest>>({
      query: (data) => ({
        url: '/service-provider/work/requests',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['WorkRequests'],
    }),

    // GET /work/requests
    getAllWorkRequests: builder.query<any, Record<string, any> | void>({
      query: (params) => ({
        url: '/service-provider/work/requests',
        params: params || {},
      }),
      providesTags: ['WorkRequests'],
    }),

    // GET /work/requests/statistics
    getWorkRequestStatistics: builder.query<any, Record<string, any> | void>({
      query: (params) => ({
        url: '/service-provider/work/requests/statistics',
        params: params || {},
      }),
      providesTags: ['Statistics'],
    }),

    // GET /work/requests/:id/responses
    getWorkRequestResponses: builder.query<any, string>({
      query: (id) => ({
        url: `/service-provider/work/requests/${id}/responses`,
      }),
      providesTags: (result, error, id) => [{ type: 'WorkRequest', id }],
    }),

    // PUT /work/requests/:id/extend
    extendWorkRequestExpiry: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/service-provider/work/requests/${id}/extend`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'WorkRequest', id },
        'WorkRequests',
      ],
    }),

    // DELETE /work/requests/:id/cancel
    cancelWorkRequest: builder.mutation<any, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({
        url: `/service-provider/work/requests/${id}/cancel`,
        method: 'DELETE',
        body: reason ? { reason } : undefined,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'WorkRequest', id },
        'WorkRequests',
      ],
    }),

    // POST /work/requests/cleanup-expired
    cleanupExpiredWorkRequests: builder.mutation<any, void>({
      query: () => ({
        url: '/service-provider/work/requests/cleanup-expired',
        method: 'POST',
      }),
      invalidatesTags: ['WorkRequests'],
    }),

    // ==================== SERVICE PROVIDER ====================

    // GET /work/service-providers/:serviceProviderId/requests
    getAvailableWorkRequests: builder.query<any, { serviceProviderId: string } & Record<string, any>>({
      query: ({ serviceProviderId, ...params }) => ({
        url: `/service-provider/work/service-providers/${serviceProviderId}/requests`,
        params,
      }),
      providesTags: ['WorkRequests'],
    }),

    // GET /work/requests/:id/view
    viewWorkRequest: builder.query<{ success: boolean; data: WorkRequest }, string>({
      query: (id) => ({
        url: `/service-provider/work/requests/${id}/view`,
      }),
      providesTags: (result, error, id) => [{ type: 'WorkRequest', id }],
    }),

    // POST /work/requests/:id/interest
    expressInterestInWorkRequest: builder.mutation<any, { id: string; data?: any }>({
      query: ({ id, data }) => ({
        url: `/service-provider/work/requests/${id}/interest`,
        method: 'POST',
        body: data || {},
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'WorkRequest', id },
      ],
    }),

    // POST /work/requests/:id/accept
    acceptWorkRequest: builder.mutation<any, { id: string; data?: any }>({
      query: ({ id, data }) => ({
        url: `/service-provider/work/requests/${id}/accept`,
        method: 'POST',
        body: data || {},
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'WorkRequest', id },
        'WorkRequests',
        'WorkAssignments',
      ],
    }),

    // POST /work/requests/:id/decline
    declineWorkRequest: builder.mutation<any, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({
        url: `/service-provider/work/requests/${id}/decline`,
        method: 'POST',
        body: reason ? { reason } : {},
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'WorkRequest', id },
        'WorkRequests',
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateWorkRequestMutation,
  useGetAllWorkRequestsQuery,
  useGetWorkRequestStatisticsQuery,
  useGetWorkRequestResponsesQuery,
  useExtendWorkRequestExpiryMutation,
  useCancelWorkRequestMutation,
  useCleanupExpiredWorkRequestsMutation,
  useGetAvailableWorkRequestsQuery,
  useViewWorkRequestQuery,
  useExpressInterestInWorkRequestMutation,
  useAcceptWorkRequestMutation,
  useDeclineWorkRequestMutation,
} = workRequestApi;
