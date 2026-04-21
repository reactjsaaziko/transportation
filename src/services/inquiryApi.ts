import { apiService } from './apiService';

/**
 * Service Provider Inquiry + Detailed Form Workflow API
 * Base paths:
 *   - /service-provider/service-provider/*
 *   - /service-provider/service-providers/*
 *   - /service-provider/detailed-forms/*
 */

// ==================== TYPES ====================

export interface ServiceProviderInquiry {
  username: string;
  workEmail: string;
  password: string;
  contactNo?: string;
  companyName?: string;
  serviceType?: string;
  description?: string;
}

export interface PublicInquiry {
  name: string;
  contactNo: string;
  type: string;
  description: string;
}

export interface ApproveInquiryPayload {
  sendEmail?: boolean;
}

export interface DetailedFormSubmission {
  firstName: string;
  lastName: string;
  contactNo: string;
  emailAddress: string;
  companyName: string;
  gstNo?: string;
  address: string;
  inspectionZones?: Array<{
    country: string;
    containerType: 'LCL' | 'FCL';
    cargoType: string;
  }>;
  bankDetails?: Record<string, any>;
  [key: string]: any;
}

export interface ReviewFormPayload {
  action: 'approve' | 'corrections' | 'reject';
  comments?: string;
  corrections?: any;
}

export const inquiryApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    // ==================== PUBLIC INQUIRY ====================

    // POST /service-provider/inquiry (public) — gateway routes this directly to the backend
    submitServiceProviderInquiry: builder.mutation<any, ServiceProviderInquiry>({
      query: (data) => ({
        url: '/service-provider/inquiry',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Inquiries'],
    }),

    // POST /service-providers/inquiry (public alt)
    submitPublicInquiry: builder.mutation<any, PublicInquiry>({
      query: (data) => ({
        url: '/service-provider/service-providers/inquiry',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Inquiries'],
    }),

    // GET /service-providers/public
    getPublicServiceProviders: builder.query<any, Record<string, any> | void>({
      query: (params) => ({
        url: '/service-provider/service-providers/public',
        params: params || {},
      }),
      providesTags: ['ServiceProviders'],
    }),

    // GET /service-providers/public/:id
    getPublicServiceProviderById: builder.query<any, string>({
      query: (id) => ({
        url: `/service-provider/service-providers/public/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: 'ServiceProvider', id }],
    }),

    // ==================== ADMIN INQUIRY MANAGEMENT ====================

    // GET /service-provider/inquiries
    getInquiries: builder.query<any, Record<string, any> | void>({
      query: (params) => ({
        url: '/service-provider/service-provider/inquiries',
        params: params || {},
      }),
      providesTags: ['Inquiries'],
    }),

    // POST /service-provider/inquiries/:id/approve
    approveInquiry: builder.mutation<any, { id: string; data?: ApproveInquiryPayload }>({
      query: ({ id, data }) => ({
        url: `/service-provider/service-provider/inquiries/${id}/approve`,
        method: 'POST',
        body: data || { sendEmail: true },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Inquiry', id },
        'Inquiries',
      ],
    }),

    // POST /service-provider/inquiries/:id/resend-credentials
    resendInquiryCredentials: builder.mutation<any, string>({
      query: (id) => ({
        url: `/service-provider/service-provider/inquiries/${id}/resend-credentials`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Inquiry', id }],
    }),

    // ==================== DETAILED FORM WORKFLOW ====================

    // GET /detailed-forms/form/:token (public)
    getDetailedForm: builder.query<any, string>({
      query: (token) => ({
        url: `/service-provider/detailed-forms/form/${token}`,
      }),
      providesTags: (result, error, token) => [{ type: 'DetailedForm', id: token }],
    }),

    // POST /detailed-forms/form/:token/submit (public)
    submitDetailedForm: builder.mutation<any, { token: string; data: DetailedFormSubmission }>({
      query: ({ token, data }) => ({
        url: `/service-provider/detailed-forms/form/${token}/submit`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { token }) => [
        { type: 'DetailedForm', id: token },
        'DetailedForms',
      ],
    }),

    // POST /detailed-forms/service-providers/:id/send-form (admin)
    sendDetailedForm: builder.mutation<any, { serviceProviderId: string; data?: any }>({
      query: ({ serviceProviderId, data }) => ({
        url: `/service-provider/detailed-forms/service-providers/${serviceProviderId}/send-form`,
        method: 'POST',
        body: data || {},
      }),
      invalidatesTags: ['DetailedForms'],
    }),

    // GET /detailed-forms/forms/pending-review (admin)
    getPendingReviewForms: builder.query<any, Record<string, any> | void>({
      query: (params) => ({
        url: '/service-provider/detailed-forms/forms/pending-review',
        params: params || {},
      }),
      providesTags: ['DetailedForms'],
    }),

    // GET /detailed-forms/forms/:formId/review (admin)
    getFormForReview: builder.query<any, string>({
      query: (formId) => ({
        url: `/service-provider/detailed-forms/forms/${formId}/review`,
      }),
      providesTags: (result, error, formId) => [{ type: 'DetailedForm', id: formId }],
    }),

    // POST /detailed-forms/forms/:formId/review (admin)
    reviewDetailedForm: builder.mutation<any, { formId: string; data: ReviewFormPayload }>({
      query: ({ formId, data }) => ({
        url: `/service-provider/detailed-forms/forms/${formId}/review`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { formId }) => [
        { type: 'DetailedForm', id: formId },
        'DetailedForms',
      ],
    }),

    // GET /detailed-forms/workflow/statistics (admin)
    getWorkflowStatistics: builder.query<any, void>({
      query: () => ({
        url: '/service-provider/detailed-forms/workflow/statistics',
      }),
      providesTags: ['Statistics'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useSubmitServiceProviderInquiryMutation,
  useSubmitPublicInquiryMutation,
  useGetPublicServiceProvidersQuery,
  useGetPublicServiceProviderByIdQuery,
  useGetInquiriesQuery,
  useApproveInquiryMutation,
  useResendInquiryCredentialsMutation,
  useGetDetailedFormQuery,
  useSubmitDetailedFormMutation,
  useSendDetailedFormMutation,
  useGetPendingReviewFormsQuery,
  useGetFormForReviewQuery,
  useReviewDetailedFormMutation,
  useGetWorkflowStatisticsQuery,
} = inquiryApi;
