import { apiService } from './apiService';

// Inspection Service Pricing interfaces
export interface InspectionServicePricing {
  _id?: string;
  serviceProviderId: string;
  product: string;
  city: string;
  inspectionType: string;
  price: number;
  currency?: string;
  note?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateInspectionPricingRequest {
  serviceProviderId: string;
  product: string;
  city: string;
  inspectionType: string;
  price: number;
  currency?: string;
  note?: string;
}

export interface UpdateInspectionPricingRequest {
  id: string;
  product?: string;
  city?: string;
  inspectionType?: string;
  price?: number;
  currency?: string;
  note?: string;
  status?: string;
}

// Extend the API service with inspection pricing endpoints
export const inspectionApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    // Inspection Service Pricing endpoints
    createInspectionPricing: builder.mutation({
      query: (pricing) => ({
        url: '/service-provider/inspection/pricing',
        method: 'POST',
        body: pricing,
      }),
      invalidatesTags: ['InspectionPricing'],
    }),

    getInspectionPricingsByServiceProvider: builder.query({
      query: (serviceProviderId) =>
        `/service-provider/inspection/pricing/service-provider/${serviceProviderId}`,
      providesTags: ['InspectionPricing'],
    }),

    getInspectionPricingById: builder.query({
      query: (id) => `/service-provider/inspection/pricing/${id}`,
      providesTags: ['InspectionPricing'],
    }),

    updateInspectionPricing: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/service-provider/inspection/pricing/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['InspectionPricing'],
    }),

    deleteInspectionPricing: builder.mutation({
      query: (id) => ({
        url: `/service-provider/inspection/pricing/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['InspectionPricing'],
    }),

    batchCreateInspectionPricings: builder.mutation({
      query: (pricings) => ({
        url: '/service-provider/inspection/pricing/batch',
        method: 'POST',
        body: { pricings },
      }),
      invalidatesTags: ['InspectionPricing'],
    }),

    getAvailableProducts: builder.query({
      query: () => '/service-provider/inspection/pricing/meta/products',
    }),

    getAvailableCities: builder.query({
      query: () => '/service-provider/inspection/pricing/meta/cities',
    }),
  }),
});

// Export hooks
export const {
  useCreateInspectionPricingMutation,
  useGetInspectionPricingsByServiceProviderQuery,
  useGetInspectionPricingByIdQuery,
  useUpdateInspectionPricingMutation,
  useDeleteInspectionPricingMutation,
  useBatchCreateInspectionPricingsMutation,
  useGetAvailableProductsQuery,
  useGetAvailableCitiesQuery,
} = inspectionApi;
