import { apiService } from './apiService';

// Types for Service Provider APIs
export interface DashboardOverview {
  totalTrips: number;
  activeTrips: number;
  completedTrips: number;
  pendingTrips: number;
  totalRevenue: number;
  totalVehicles: number;
  activeVehicles: number;
  totalWarehouses: number;
  recentTrips: any[];
  statistics: {
    dailyTrips: number[];
    weeklyRevenue: number[];
    monthlyGrowth: number;
  };
}

export interface ContactInfo {
  companyName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  website?: string;
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

export interface AIPermissions {
  manageAllTasks: boolean;
  giveAnswerForQuestions: boolean;
  manageCargoArrivalDate: boolean;
  manageAllTrips: boolean;
  taskSuggestions: boolean;
  manageYourCargo: boolean;
  suggestedBestPrices: boolean;
}

export interface ServiceProviderProfile {
  id: string;
  username: string;
  email: string;
  role: string;
  companyName?: string;
  contactNumber?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Service Provider API endpoints
 * Base path: /service-provider
 */
export const serviceProviderApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    // ==================== DASHBOARD ====================
    
    // Get dashboard overview with statistics
    getDashboardOverview: builder.query<{ success: boolean; data: DashboardOverview }, string>({
      query: (serviceProviderId) => ({
        url: `/service-provider/dashboard/${serviceProviderId}/overview`,
      }),
      providesTags: ['Dashboard'],
    }),

    // Get trip management data
    getDashboardTrips: builder.query({
      query: ({ serviceProviderId, ...params }) => ({
        url: `/service-provider/dashboard/${serviceProviderId}/trips`,
        params,
      }),
      providesTags: ['Trips'],
    }),

    // Get contact information
    getContactInfo: builder.query<{ success: boolean; data: ContactInfo }, string>({
      query: (serviceProviderId) => ({
        url: `/service-provider/dashboard/${serviceProviderId}/contact`,
      }),
      providesTags: ['Contact'],
    }),

    // Update contact information
    updateContactInfo: builder.mutation<{ success: boolean; data: ContactInfo }, { serviceProviderId: string; data: Partial<ContactInfo> }>({
      query: ({ serviceProviderId, data }) => ({
        url: `/service-provider/dashboard/${serviceProviderId}/contact`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Contact'],
    }),

    // Get AI assistant history
    getAIAssistantHistory: builder.query({
      query: ({ serviceProviderId, ...params }) => ({
        url: `/service-provider/dashboard/${serviceProviderId}/ai-assistant/history`,
        params,
      }),
      providesTags: ['AIHistory'],
    }),

    // Get AI assistant permissions
    getAIPermissions: builder.query<{ success: boolean; data: AIPermissions }, string>({
      query: (serviceProviderId) => ({
        url: `/service-provider/dashboard/${serviceProviderId}/ai-assistant/permissions`,
      }),
      providesTags: ['AIPermissions'],
    }),

    // Update AI assistant permissions
    updateAIPermissions: builder.mutation<{ success: boolean; data: AIPermissions }, { serviceProviderId: string; permissions: Partial<AIPermissions> }>({
      query: ({ serviceProviderId, permissions }) => ({
        url: `/service-provider/dashboard/${serviceProviderId}/ai-assistant/permissions`,
        method: 'PUT',
        body: permissions,
      }),
      invalidatesTags: ['AIPermissions'],
    }),

    // ==================== PROFILE ====================
    
    // Get current user profile
    getCurrentUser: builder.query<{ success: boolean; data: { user: ServiceProviderProfile } }, void>({
      query: () => ({
        url: '/service-provider/users/me',
      }),
      providesTags: ['Profile'],
    }),

    // ==================== SERVICE PROVIDERS ====================
    
    // Get all service providers (for admin)
    getServiceProviders: builder.query({
      query: (params) => ({
        url: '/service-provider/service-providers',
        params,
      }),
      providesTags: ['ServiceProviders'],
    }),

    // Get service provider by ID
    getServiceProviderById: builder.query({
      query: (id) => ({
        url: `/service-provider/service-providers/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: 'ServiceProvider', id }],
    }),

    // Get service providers by type
    getServiceProvidersByType: builder.query({
      query: (type) => ({
        url: `/service-provider/service-providers/type/${type}`,
      }),
      providesTags: ['ServiceProviders'],
    }),

    // Update service provider
    updateServiceProvider: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/service-provider/service-providers/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'ServiceProvider', id },
        'ServiceProviders',
      ],
    }),

    // ==================== STATISTICS ====================
    
    // Get admin statistics
    getAdminStatistics: builder.query({
      query: () => ({
        url: '/service-provider/admin/statistics',
      }),
      providesTags: ['Statistics'],
    }),
  }),
});

// Export hooks
export const {
  useGetDashboardOverviewQuery,
  useGetDashboardTripsQuery,
  useGetContactInfoQuery,
  useUpdateContactInfoMutation,
  useGetAIAssistantHistoryQuery,
  useGetAIPermissionsQuery,
  useUpdateAIPermissionsMutation,
  useGetCurrentUserQuery,
  useGetServiceProvidersQuery,
  useGetServiceProviderByIdQuery,
  useGetServiceProvidersByTypeQuery,
  useUpdateServiceProviderMutation,
  useGetAdminStatisticsQuery,
} = serviceProviderApi;
