import { apiService } from './apiService';

/**
 * Searates Ports API
 * Base path: /service-provider/ports
 * Note: getPortNames already lives in chaServicePricingApi.ts; keep compatibility but
 * expose full ports CRUD/search here for broader use.
 */

export interface Port {
  _id: string;
  name: string;
  code?: string;
  country?: string;
  countryCode?: string;
  city?: string;
  type?: string;
  coordinates?: { latitude: number; longitude: number };
  [key: string]: any;
}

export interface PortFilters {
  page?: number;
  limit?: number;
  country?: string;
  type?: string;
  search?: string;
  [key: string]: any;
}

export const portsApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    // GET /ports
    getPorts: builder.query<{ success: boolean; data: Port[]; pagination?: any }, PortFilters | void>({
      query: (params) => ({
        url: '/service-provider/ports',
        params: params || {},
      }),
      providesTags: ['Ports'],
    }),

    // GET /ports/names
    getPortNames: builder.query<{ success: boolean; data: Array<{ name: string; code?: string }> }, Record<string, any> | void>({
      query: (params) => ({
        url: '/service-provider/ports/names',
        params: params || {},
      }),
      providesTags: ['Ports'],
    }),

    // GET /ports/search
    searchPorts: builder.query<{ success: boolean; data: Port[] }, { q?: string } & Record<string, any>>({
      query: (params) => ({
        url: '/service-provider/ports/search',
        params,
      }),
      providesTags: ['Ports'],
    }),

    // GET /ports/statistics
    getPortStatistics: builder.query<any, void>({
      query: () => ({
        url: '/service-provider/ports/statistics',
      }),
      providesTags: ['Statistics'],
    }),

    // GET /ports/country/:countryCode
    getPortsByCountry: builder.query<{ success: boolean; data: Port[] }, string>({
      query: (countryCode) => ({
        url: `/service-provider/ports/country/${countryCode}`,
      }),
      providesTags: ['Ports'],
    }),

    // GET /ports/:id
    getPortById: builder.query<{ success: boolean; data: Port }, string>({
      query: (id) => ({
        url: `/service-provider/ports/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: 'Port', id }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPortsQuery,
  useGetPortNamesQuery,
  useSearchPortsQuery,
  useGetPortStatisticsQuery,
  useGetPortsByCountryQuery,
  useGetPortByIdQuery,
} = portsApi;
