import { apiService } from './apiService';

// Types for Trip APIs
export interface Trip {
  _id: string;
  tripId: string;
  serviceProviderId: string;
  vehicleId: string;
  driverId?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'delayed';
  origin: {
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  destination: {
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  scheduledDepartureTime: string;
  scheduledArrivalTime: string;
  actualDepartureTime?: string;
  actualArrivalTime?: string;
  distance?: number;
  duration?: number;
  cargo?: {
    description: string;
    weight: number;
    volume: number;
    packages: number;
    cargoType: string;
  };
  pricing?: {
    basePrice: number;
    additionalCharges: number;
    discount: number;
    total: number;
    currency: string;
  };
  customer?: {
    name: string;
    phone: string;
    email: string;
    companyName?: string;
  };
  tracking?: {
    currentLocation?: {
      address: string;
      coordinates?: {
        latitude: number;
        longitude: number;
      };
      updatedAt: string;
    };
    history: Array<{
      location: string;
      timestamp: string;
      status: string;
    }>;
  };
  invoice?: {
    invoiceNumber: string;
    generatedAt: string;
    dueDate: string;
    status: 'pending' | 'paid' | 'overdue';
  };
  feedback?: {
    rating: number;
    comment: string;
    submittedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TripFilters {
  page?: number;
  limit?: number;
  status?: string;
  fromDate?: string;
  toDate?: string;
  from?: string;
  to?: string;
  driverName?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TripStatistics {
  totalTrips: number;
  completedTrips: number;
  inProgressTrips: number;
  scheduledTrips: number;
  cancelledTrips: number;
  delayedTrips: number;
  totalRevenue: number;
  averageRating: number;
  averageTripDuration: number;
  totalDistance: number;
  tripsPerDay: Array<{ date: string; count: number }>;
  revenuePerDay: Array<{ date: string; amount: number }>;
}

export interface CreateTripData {
  vehicleId: string;
  origin: Trip['origin'];
  destination: Trip['destination'];
  scheduledDepartureTime: string;
  scheduledArrivalTime: string;
  cargo?: Trip['cargo'];
  pricing?: Trip['pricing'];
  customer?: Trip['customer'];
}

/**
 * Trip API endpoints
 * Base path: /service-provider/trips
 */
export const tripApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    // ==================== TRIP CRUD ====================
    
    // Create a new trip
    createTrip: builder.mutation<{ success: boolean; data: Trip }, CreateTripData>({
      query: (data) => ({
        url: '/service-provider/trips',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Trips', 'TripStatistics'],
    }),

    // Get trip by ID
    getTripById: builder.query<{ success: boolean; data: Trip }, string>({
      query: (tripId) => ({
        url: `/service-provider/trips/${tripId}`,
      }),
      providesTags: (result, error, tripId) => [{ type: 'Trip', id: tripId }],
    }),

    // Update trip
    updateTrip: builder.mutation<{ success: boolean; data: Trip }, { tripId: string; data: Partial<Trip> }>({
      query: ({ tripId, data }) => ({
        url: `/service-provider/trips/${tripId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { tripId }) => [
        { type: 'Trip', id: tripId },
        'Trips',
      ],
    }),

    // Delete trip
    deleteTrip: builder.mutation<{ success: boolean; message: string }, string>({
      query: (tripId) => ({
        url: `/service-provider/trips/${tripId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, tripId) => [
        { type: 'Trip', id: tripId },
        'Trips',
        'TripStatistics',
      ],
    }),

    // ==================== TRIP STATUS ====================
    
    // Update trip status
    updateTripStatus: builder.mutation<{ success: boolean; data: Trip }, { tripId: string; status: Trip['status']; reason?: string }>({
      query: ({ tripId, ...data }) => ({
        url: `/service-provider/trips/${tripId}/status`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { tripId }) => [
        { type: 'Trip', id: tripId },
        'Trips',
        'TripStatistics',
      ],
    }),

    // ==================== TRIP TRACKING ====================
    
    // Update trip location
    updateTripLocation: builder.mutation<{ success: boolean; data: Trip }, { tripId: string; location: { address: string; coordinates?: { latitude: number; longitude: number } } }>({
      query: ({ tripId, location }) => ({
        url: `/service-provider/trips/${tripId}/location`,
        method: 'PUT',
        body: location,
      }),
      invalidatesTags: (result, error, { tripId }) => [
        { type: 'Trip', id: tripId },
      ],
    }),

    // Get trip route/tracking data
    getTripRoute: builder.query<{ success: boolean; data: Trip['tracking'] }, string>({
      query: (tripId) => ({
        url: `/service-provider/trips/${tripId}/route`,
      }),
      providesTags: (result, error, tripId) => [{ type: 'Trip', id: tripId }],
    }),

    // ==================== INVOICE ====================
    
    // Generate invoice for trip
    generateInvoice: builder.mutation<{ success: boolean; data: Trip['invoice'] }, string>({
      query: (tripId) => ({
        url: `/service-provider/trips/${tripId}/invoice`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, tripId) => [
        { type: 'Trip', id: tripId },
      ],
    }),

    // ==================== FEEDBACK ====================
    
    // Add customer feedback
    addTripFeedback: builder.mutation<{ success: boolean; data: Trip }, { tripId: string; rating: number; comment: string }>({
      query: ({ tripId, ...data }) => ({
        url: `/service-provider/trips/${tripId}/feedback`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { tripId }) => [
        { type: 'Trip', id: tripId },
        'TripStatistics',
      ],
    }),

    // ==================== STATISTICS ====================
    
    // Get trip statistics
    getTripStatistics: builder.query<{ success: boolean; data: TripStatistics }, { serviceProviderId: string; period?: 'week' | 'month' | 'quarter' | 'year' }>({
      query: ({ serviceProviderId, period }) => ({
        url: `/service-provider/trips/statistics/${serviceProviderId}`,
        params: { period },
      }),
      providesTags: ['TripStatistics'],
    }),
  }),
});

// Export hooks
export const {
  useCreateTripMutation,
  useGetTripByIdQuery,
  useUpdateTripMutation,
  useDeleteTripMutation,
  useUpdateTripStatusMutation,
  useUpdateTripLocationMutation,
  useGetTripRouteQuery,
  useGenerateInvoiceMutation,
  useAddTripFeedbackMutation,
  useGetTripStatisticsQuery,
} = tripApi;
