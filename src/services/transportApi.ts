import { apiService } from './apiService';

/**
 * Transport API endpoints
 * Example API integration using RTK Query
 */
export const transportApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    // Get all transports with optional filters
    getTransports: builder.query({
      query: (params) => ({
        url: '/transport-service/transports',
        params,
      }),
      providesTags: ['Transports'],
    }),

    // Get transport by ID
    getTransportById: builder.query({
      query: (id) => `/transport-service/transports/${id}`,
      providesTags: (result, error, id) => [{ type: 'Transport', id }],
    }),

    // Get transport details
    getTransportDetails: builder.query({
      query: (id) => `/transport-service/transports/${id}/details`,
      providesTags: (result, error, id) => [{ type: 'TransportDetails', id }],
    }),

    // Create new transport
    createTransport: builder.mutation({
      query: (data) => ({
        url: '/transport-service/transports',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Transports'],
    }),

    // Update transport
    updateTransport: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/transport-service/transports/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Transport', id },
        { type: 'TransportDetails', id },
        'Transports',
      ],
    }),

    // Delete transport
    deleteTransport: builder.mutation({
      query: (id) => ({
        url: `/transport-service/transports/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Transport', id },
        'Transports',
      ],
    }),

    // Get transport schedule
    getTransportSchedule: builder.query({
      query: ({ id, date }) => ({
        url: `/transport-service/transports/${id}/schedule`,
        params: { date },
      }),
      providesTags: (result, error, { id }) => [{ type: 'TransportSchedule', id }],
    }),

    // Create transport booking
    createBooking: builder.mutation({
      query: (data) => ({
        url: '/transport-service/bookings',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['TransportBooking', 'Orders'],
    }),

    // Get user bookings
    getUserBookings: builder.query({
      query: (params) => ({
        url: '/transport-service/bookings/user',
        params,
      }),
      providesTags: ['TransportBooking'],
    }),

    // Get booking by ID
    getBookingById: builder.query({
      query: (id) => `/transport-service/bookings/${id}`,
      providesTags: (result, error, id) => [{ type: 'TransportBooking', id }],
    }),

    // Cancel booking
    cancelBooking: builder.mutation({
      query: (id) => ({
        url: `/transport-service/bookings/${id}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'TransportBooking', id },
        'TransportBooking',
      ],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetTransportsQuery,
  useGetTransportByIdQuery,
  useGetTransportDetailsQuery,
  useCreateTransportMutation,
  useUpdateTransportMutation,
  useDeleteTransportMutation,
  useGetTransportScheduleQuery,
  useCreateBookingMutation,
  useGetUserBookingsQuery,
  useGetBookingByIdQuery,
  useCancelBookingMutation,
} = transportApi;
