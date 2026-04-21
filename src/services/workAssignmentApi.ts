import { apiService } from './apiService';

/**
 * Work Assignment API
 * Base path: /service-provider/work/assignments and /service-provider/work/service-providers
 */

export interface WorkAssignment {
  _id: string;
  serviceProviderId: string;
  title: string;
  description?: string;
  type?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  status?:
    | 'assigned'
    | 'acknowledged'
    | 'in_progress'
    | 'submitted'
    | 'reviewed'
    | 'completed'
    | 'cancelled';
  dueDate?: string;
  assignedBy?: string;
  progressUpdates?: any[];
  messages?: any[];
  review?: any;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export const workAssignmentApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    // ==================== ADMIN ====================

    // POST /work/assignments
    createWorkAssignment: builder.mutation<{ success: boolean; data: WorkAssignment }, Partial<WorkAssignment>>({
      query: (data) => ({
        url: '/service-provider/work/assignments',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['WorkAssignments'],
    }),

    // GET /work/assignments
    getAllWorkAssignments: builder.query<any, Record<string, any> | void>({
      query: (params) => ({
        url: '/service-provider/work/assignments',
        params: params || {},
      }),
      providesTags: ['WorkAssignments'],
    }),

    // GET /work/assignments/statistics
    getWorkAssignmentStatistics: builder.query<any, Record<string, any> | void>({
      query: (params) => ({
        url: '/service-provider/work/assignments/statistics',
        params: params || {},
      }),
      providesTags: ['Statistics'],
    }),

    // GET /work/assignments/:id
    getWorkAssignmentById: builder.query<{ success: boolean; data: WorkAssignment }, string>({
      query: (id) => ({
        url: `/service-provider/work/assignments/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: 'WorkAssignment', id }],
    }),

    // PUT /work/assignments/:id
    updateWorkAssignment: builder.mutation<any, { id: string; data: Partial<WorkAssignment> }>({
      query: ({ id, data }) => ({
        url: `/service-provider/work/assignments/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'WorkAssignment', id },
        'WorkAssignments',
      ],
    }),

    // DELETE /work/assignments/:id/cancel
    cancelWorkAssignment: builder.mutation<any, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({
        url: `/service-provider/work/assignments/${id}/cancel`,
        method: 'DELETE',
        body: reason ? { reason } : undefined,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'WorkAssignment', id },
        'WorkAssignments',
      ],
    }),

    // POST /work/assignments/:id/review
    reviewWorkAssignment: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/service-provider/work/assignments/${id}/review`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'WorkAssignment', id },
        'WorkAssignments',
      ],
    }),

    // ==================== SERVICE PROVIDER ====================

    // GET /work/service-providers/:serviceProviderId/assignments
    getMyWorkAssignments: builder.query<any, { serviceProviderId: string } & Record<string, any>>({
      query: ({ serviceProviderId, ...params }) => ({
        url: `/service-provider/work/service-providers/${serviceProviderId}/assignments`,
        params,
      }),
      providesTags: ['WorkAssignments'],
    }),

    // POST /work/assignments/:id/acknowledge
    acknowledgeWorkAssignment: builder.mutation<any, string>({
      query: (id) => ({
        url: `/service-provider/work/assignments/${id}/acknowledge`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'WorkAssignment', id },
        'WorkAssignments',
      ],
    }),

    // POST /work/assignments/:id/decline
    declineWorkAssignment: builder.mutation<any, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({
        url: `/service-provider/work/assignments/${id}/decline`,
        method: 'POST',
        body: reason ? { reason } : {},
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'WorkAssignment', id },
        'WorkAssignments',
      ],
    }),

    // POST /work/assignments/:id/start
    startWorkAssignment: builder.mutation<any, string>({
      query: (id) => ({
        url: `/service-provider/work/assignments/${id}/start`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'WorkAssignment', id },
        'WorkAssignments',
      ],
    }),

    // POST /work/assignments/:id/progress
    addWorkAssignmentProgress: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/service-provider/work/assignments/${id}/progress`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'WorkAssignment', id },
      ],
    }),

    // POST /work/assignments/:id/submit
    submitWorkAssignmentForReview: builder.mutation<any, { id: string; data?: any }>({
      query: ({ id, data }) => ({
        url: `/service-provider/work/assignments/${id}/submit`,
        method: 'POST',
        body: data || {},
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'WorkAssignment', id },
        'WorkAssignments',
      ],
    }),

    // POST /work/assignments/:id/messages
    addWorkAssignmentMessage: builder.mutation<any, { id: string; message: any }>({
      query: ({ id, message }) => ({
        url: `/service-provider/work/assignments/${id}/messages`,
        method: 'POST',
        body: message,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'WorkAssignment', id },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateWorkAssignmentMutation,
  useGetAllWorkAssignmentsQuery,
  useGetWorkAssignmentStatisticsQuery,
  useGetWorkAssignmentByIdQuery,
  useUpdateWorkAssignmentMutation,
  useCancelWorkAssignmentMutation,
  useReviewWorkAssignmentMutation,
  useGetMyWorkAssignmentsQuery,
  useAcknowledgeWorkAssignmentMutation,
  useDeclineWorkAssignmentMutation,
  useStartWorkAssignmentMutation,
  useAddWorkAssignmentProgressMutation,
  useSubmitWorkAssignmentForReviewMutation,
  useAddWorkAssignmentMessageMutation,
} = workAssignmentApi;
