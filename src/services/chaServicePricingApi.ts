import { apiService } from './apiService';

// Types for CHA Service Pricing APIs
export interface CHAServicePricing {
  _id: string;
  serviceProviderId: string;
  port: string;
  cargoType: 'Normal Container Cargo' | 'Liquid Bulk' | 'Paracable Cargo' | 'Hazardous Materials' | 'Other';
  containerType: 'LCL' | "20' Standard" | "40' Standard" | "40' High Cube" | "20' Refrigerated" | "40' Refrigerated" | "45' High Cube" | 'Air Cargo' | 'Cross Border Road' | 'Cross Border Rail';
  price: number;
  currency: 'INR' | 'USD' | 'EUR' | 'GBP';
  status: 'active' | 'inactive';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCHAServicePricingRequest {
  serviceProviderId: string;
  port: string;
  cargoType: string;
  containerType: string;
  price: number;
  currency?: string;
  notes?: string;
}

export interface UpdateCHAServicePricingRequest {
  port?: string;
  cargoType?: string;
  containerType?: string;
  price?: number;
  currency?: string;
  status?: string;
  notes?: string;
}

// CHA Service Pricing API
export const chaServicePricingApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    // Create pricing
    createCHAServicePricing: builder.mutation<{ success: boolean; message: string; data: CHAServicePricing }, CreateCHAServicePricingRequest>({
      query: (data) => ({
        url: '/service-provider/cha/service-pricing',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['CHAServicePricing'],
    }),

    // Get all pricings with filtering
    getCHAServicePricings: builder.query<{ success: boolean; message: string; data: CHAServicePricing[]; pagination: any }, { serviceProviderId?: string; port?: string; cargoType?: string; containerType?: string; status?: string; page?: number; limit?: number }>({
      query: (params) => ({
        url: '/service-provider/cha/service-pricing',
        params,
      }),
      providesTags: ['CHAServicePricing'],
    }),

    // Get pricings by service provider
    getCHAServicePricingsByServiceProvider: builder.query<{ success: boolean; message: string; data: CHAServicePricing[] }, string>({
      query: (serviceProviderId) => `/service-provider/cha/service-pricing/service-provider/${serviceProviderId}`,
      providesTags: ['CHAServicePricing'],
    }),

    // Get pricing by ID
    getCHAServicePricingById: builder.query<{ success: boolean; message: string; data: CHAServicePricing }, string>({
      query: (id) => `/service-provider/cha/service-pricing/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'CHAServicePricing', id }],
    }),

    // Update pricing
    updateCHAServicePricing: builder.mutation<{ success: boolean; message: string; data: CHAServicePricing }, { id: string; data: UpdateCHAServicePricingRequest }>({
      query: ({ id, data }) => ({
        url: `/service-provider/cha/service-pricing/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'CHAServicePricing', id }, 'CHAServicePricing'],
    }),

    // Delete pricing
    deleteCHAServicePricing: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/service-provider/cha/service-pricing/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CHAServicePricing'],
    }),

    // Get available ports from searates database
    getAvailablePorts: builder.query<{ 
      success: boolean; 
      message: string; 
      data: Array<{ name: string; country: string; code: string }>; 
      total?: number 
    }, { search?: string; country?: string }>({
      query: (params = {}) => ({
        url: '/service-provider/ports/names',
        params,
      }),
    }),
  }),
});

// Export hooks
export const {
  useCreateCHAServicePricingMutation,
  useGetCHAServicePricingsQuery,
  useGetCHAServicePricingsByServiceProviderQuery,
  useLazyGetCHAServicePricingsByServiceProviderQuery,
  useGetCHAServicePricingByIdQuery,
  useUpdateCHAServicePricingMutation,
  useDeleteCHAServicePricingMutation,
  useGetAvailablePortsQuery,
} = chaServicePricingApi;
