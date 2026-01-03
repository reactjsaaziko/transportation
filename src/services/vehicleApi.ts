import { apiService } from './apiService';

// Types for Vehicle APIs
export interface Vehicle {
  _id: string;
  vehicleNumber: string;
  vehicleType: string;
  vehicleModel: string;
  specifications: {
    length: { value: number; unit: string };
    width: { value: number; unit: string };
    height: { value: number; unit: string };
    maxWeight: { value: number; unit: string };
  };
  vehicleImage: string;
  transportationMode: 'Road' | 'Rail' | 'Air' | 'Water';
  status: 'pending' | 'verified' | 'rejected' | 'active' | 'inactive';
  availability: 'Available' | 'Busy' | 'Maintenance' | 'Inactive';
  pricing: {
    loadingUnloadingFreeTime: { time: number; unit: string };
    afterFreeTime: { price: number; unit: string };
    minimumDistance: { value: number; unit: string };
    rateType: string;
    baseRate: number;
  };
  currentLocation?: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  serviceProviderId: string;
  driverDetails?: {
    name: string;
    phone: string;
    license: string;
  };
  insurance?: {
    provider: string;
    policyNumber: string;
    expiryDate: string;
  };
  rating?: number;
  totalTrips?: number;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleType {
  _id: string;
  name: string;
  category: string;
  description?: string;
}

export interface VehicleModel {
  _id: string;
  name: string;
  type: string;
  manufacturer: string;
  capacity: {
    weight: number;
    volume: number;
  };
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
}

export interface VehicleFilters {
  page?: number;
  limit?: number;
  status?: string;
  transportationMode?: string;
  vehicleType?: string;
}

/**
 * Vehicle API endpoints
 * Base path: /service-provider/vehicles
 */
export const vehicleApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    // ==================== VEHICLE TYPES & MODELS ====================
    
    // Get all vehicle types (public)
    getVehicleTypes: builder.query<{ success: boolean; data: VehicleType[] }, void>({
      query: () => ({
        url: '/service-provider/vehicles/vehicle-types',
      }),
      providesTags: ['VehicleTypes'],
    }),

    // Get vehicle models by type (public)
    getVehicleModels: builder.query<{ success: boolean; data: VehicleModel[] }, string>({
      query: (type) => ({
        url: `/service-provider/vehicles/vehicle-models/${type}`,
      }),
      providesTags: (result, error, type) => [{ type: 'VehicleModels', id: type }],
    }),

    // Create vehicle type
    createVehicleType: builder.mutation<{ success: boolean; data: VehicleType }, Partial<VehicleType>>({
      query: (data) => ({
        url: '/service-provider/vehicles/vehicle-types',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['VehicleTypes'],
    }),

    // Create vehicle model
    createVehicleModel: builder.mutation<{ success: boolean; data: VehicleModel }, Partial<VehicleModel>>({
      query: (data) => ({
        url: '/service-provider/vehicles/vehicle-models',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['VehicleModels'],
    }),

    // ==================== VEHICLE CRUD ====================
    
    // Get all vehicles
    getVehicles: builder.query<{ success: boolean; data: Vehicle[]; pagination?: any }, VehicleFilters | void>({
      query: (params) => ({
        url: '/service-provider/vehicles',
        params: params || {},
      }),
      providesTags: ['Vehicles'],
    }),

    // Get vehicle by ID
    getVehicleById: builder.query<{ success: boolean; data: Vehicle }, string>({
      query: (id) => ({
        url: `/service-provider/vehicles/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: 'Vehicle', id }],
    }),

    // Create vehicle
    createVehicle: builder.mutation<{ success: boolean; data: Vehicle }, Partial<Vehicle>>({
      query: (data) => ({
        url: '/service-provider/vehicles',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Vehicles'],
    }),

    // Update vehicle
    updateVehicle: builder.mutation<{ success: boolean; data: Vehicle }, { id: string; data: Partial<Vehicle> }>({
      query: ({ id, data }) => ({
        url: `/service-provider/vehicles/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Vehicle', id },
        'Vehicles',
      ],
    }),

    // Delete vehicle
    deleteVehicle: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/service-provider/vehicles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Vehicle', id },
        'Vehicles',
      ],
    }),

    // ==================== SERVICE PROVIDER VEHICLES ====================
    
    // Get vehicles by service provider
    getVehiclesByServiceProvider: builder.query<{ success: boolean; data: Vehicle[] }, string>({
      query: (serviceProviderId) => ({
        url: `/service-provider/vehicles/service-provider/${serviceProviderId}`,
      }),
      providesTags: ['Vehicles'],
    }),

    // ==================== TRANSPORTATION MODE ====================
    
    // Get vehicles by transportation mode (public)
    getVehiclesByTransportationMode: builder.query<{ success: boolean; data: Vehicle[] }, string>({
      query: (transportationMode) => ({
        url: `/service-provider/vehicles/transportation-mode/${transportationMode}`,
      }),
      providesTags: ['Vehicles'],
    }),

    // Get available vehicles (public)
    getAvailableVehicles: builder.query<{ success: boolean; data: Vehicle[] }, any>({
      query: (params) => ({
        url: '/service-provider/vehicles/available',
        params,
      }),
      providesTags: ['Vehicles'],
    }),

    // ==================== VEHICLE MANAGEMENT ====================
    
    // Update vehicle availability
    updateVehicleAvailability: builder.mutation<{ success: boolean; data: Vehicle }, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/service-provider/vehicles/${id}/availability`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Vehicle', id },
        'Vehicles',
      ],
    }),

    // Add rating to vehicle
    addVehicleRating: builder.mutation<{ success: boolean; data: Vehicle }, { id: string; rating: number; comment?: string }>({
      query: ({ id, ...data }) => ({
        url: `/service-provider/vehicles/${id}/rating`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Vehicle', id },
        'Vehicles',
      ],
    }),

    // ==================== STATISTICS ====================
    
    // Get vehicle statistics (admin)
    getVehicleStatistics: builder.query({
      query: () => ({
        url: '/service-provider/vehicles/admin/statistics',
      }),
      providesTags: ['Statistics'],
    }),
  }),
});

// Export hooks
export const {
  useGetVehicleTypesQuery,
  useGetVehicleModelsQuery,
  useCreateVehicleTypeMutation,
  useCreateVehicleModelMutation,
  useGetVehiclesQuery,
  useGetVehicleByIdQuery,
  useCreateVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
  useGetVehiclesByServiceProviderQuery,
  useGetVehiclesByTransportationModeQuery,
  useGetAvailableVehiclesQuery,
  useUpdateVehicleAvailabilityMutation,
  useAddVehicleRatingMutation,
  useGetVehicleStatisticsQuery,
} = vehicleApi;
