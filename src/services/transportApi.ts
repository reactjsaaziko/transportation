import { apiService } from './apiService';
import type {
  CalculateMultipleContainersMinimalResponse,
  CalculateMultipleContainersRequest,
  ApiResponse,
} from '@/components/Domestraction transportiton/vehicle/types';

export const addTagTypes = [
  'Transports',
  'Transport',
  'TransportDetails',
  'TransportSchedule',
  'TransportBooking',
  'Orders',
  'LoadCalculation',
  'ContainerVisualization',
  'CargoTypes',
  'Containers',
  'Pallets',
] as const;

// ── Load Calculator Types ──────────────────────────────────────────

export interface ProductInput {
  name: string;
  cargoType: string; // 'box' | 'bigbags' | 'sacks' | 'barrels' | 'roll' | etc.
  length: number; // mm
  width: number; // mm
  height: number; // mm
  weight: number; // kg per unit
  quantity: number;
  color?: string;
  spacingSettings?: SpacingSettings;
  stuffingSettings?: StuffingSettings;
}

export interface SpacingSettings {
  tiltToLength?: boolean;
  tiltToWidth?: boolean;
  tiltToHeight?: boolean;
}

export interface StuffingSettings {
  layersCount?: number;
  height?: number; // mm
  mass?: number; // kg
  disableStacking?: boolean;
}

export interface VisualizationItem {
  id: string;
  name: string;
  cargoType: string;
  color: string;
  opacity: number;
  position: { x: number; y: number; z: number };
  dimensions: { length: number; width: number; height: number };
  originalDimensions: { length: number; width: number; height: number };
  weight: number;
  volume: number;
  layer: number;
  stackingInfo: {
    canStack: boolean;
    canTilt: { length: boolean; width: boolean; height: boolean };
    fragility: string;
  };
  spacingApplied: boolean;
}

export interface VisualizationLayer {
  layer: number;
  items: VisualizationItem[];
  height: number;
}

export interface Visualization3D {
  containerDimensions: {
    length: number;
    width: number;
    height: number;
    volume: number;
  };
  items: VisualizationItem[];
  layers: VisualizationLayer[];
  cargoBreakdown: Record<
    string,
    { count: number; totalWeight: number; totalVolume: number }
  >;
  utilization: {
    volumeUtilization: number;
    weightUtilization: number;
    volumeUsed: number;
    volumeRemaining: number;
    spaceEfficiency: number;
    remainingVolume?: number;
    remainingWeight?: number;
  };
  emptySpaces: Array<{
    position: { x: number; y: number; z: number };
    dimensions: { length: number; width: number; height: number };
  }>;
  visualization: {
    totalItems: number;
    totalLayers: number;
    cargoTypes: string[];
    colorLegend: Record<string, string>;
  };
  loadingSequence: Array<{ step: number; items: string[] }>;
  viewAngles: {
    front: { x: number; y: number; z: number };
    side: { x: number; y: number; z: number };
    top: { x: number; y: number; z: number };
    isometric: { x: number; y: number; z: number };
  };
}

export interface ContainerResult {
  containerId: string;
  containerSpec: {
    name: string;
    length: number;
    width: number;
    height: number;
    volume: number;
    maxWeight: number;
  };
  loadedProducts: ProductInput[];
  totalPackages: number;
  totalVolume: number;
  totalWeight: number;
  utilization: {
    volumeUtilization: number;
    weightUtilization: number;
    remainingVolume: number;
    remainingWeight: number;
  };
  visualization3D: Visualization3D;
  cargoSummary: {
    totalPackages: number;
    cargoVolume: string;
    cargoWeight: string;
    volumeUtilization: string;
    weightUtilization: string;
  };
}

export interface MultiContainerResponse {
  multipleContainers: boolean;
  optimalSolution?: {
    containers: ContainerResult[];
    overallEfficiency: number;
    totalCost: number;
    allProductsFit: boolean;
    containerMix?: Record<string, number>;
  };
  solutions?: Array<{
    containerSpec: { name: string };
    containers: ContainerResult[];
    overallEfficiency: number;
    estimatedTotalCost: number;
    allProductsFit: boolean;
  }>;
  totalRequirements: {
    totalWeight: number;
    totalVolume: number;
    totalPackages: number;
  };
  recommendations?: {
    recommendations: Array<{ description: string }>;
  };
  totalContainersNeeded: number;
  bestSolution?: {
    containers: ContainerResult[];
    overallEfficiency: number;
  } | null;
}

export interface Enhanced3DResponse {
  containerInfo: {
    containerId: string;
    containerType: string;
    containerSpec: {
      name: string;
      length: number;
      width: number;
      height: number;
    };
    utilization: {
      volumeUtilization: number;
      weightUtilization: number;
      remainingVolume: number;
      remainingWeight: number;
    };
  };
  visualization: Visualization3D;
  allContainers: Array<{
    index: number;
    containerId: string;
    containerType: string;
    utilization: {
      volumeUtilization: number;
      weightUtilization: number;
    };
    totalItems: number;
  }>;
  settingsUsed: {
    spacingSettings: SpacingSettings;
    stuffingSettings: StuffingSettings;
    autoOptimized: boolean;
  };
}

export interface CargoTypeSpec {
  name: string;
  icon: string;
  description: string;
  defaultDimensions: { length: number; width: number; height: number };
  stackable: boolean;
  tilting: { length: boolean; width: boolean; height: boolean };
  density: number;
  fragility: 'low' | 'medium' | 'high' | string;
  cylindrical?: boolean;
  flowable?: boolean;
}

export type CargoTypesMap = Record<string, CargoTypeSpec>;

// ── Base URLs ─────────────────────────────────────────────────────
// The api-gateway's `/transport-service/load-calculator/api` proxy in
// common-aaziko has a buggy static `pathRewrite` that loses the path
// under http-proxy-middleware v3's mount-stripping behavior, so we hit
// transport-service directly (same trick the buyer side uses in dev via
// VITE_TRANSPORT_SERVICE_URL defaulting to http://localhost:3037).
const TRANSPORT_SERVICE_URL =
  (import.meta as any).env?.VITE_TRANSPORT_SERVICE_URL || 'http://localhost:3037';
const TRANSPORT_BASE = `${TRANSPORT_SERVICE_URL}/load-calculator`;
const PALLETS_BASE = `${TRANSPORT_SERVICE_URL}/pallets`;

// ── API Endpoints ──────────────────────────────────────────────────

export const transportApi = apiService
  .enhanceEndpoints({ addTagTypes })
  .injectEndpoints({
    endpoints: (builder) => ({
      // Existing transport endpoints (preserved) ────────────────────
      getTransports: builder.query({
        query: (params) => ({
          url: '/transport-service/transports',
          params,
        }),
        providesTags: ['Transports'],
      }),

      getTransportById: builder.query({
        query: (id) => `/transport-service/transports/${id}`,
        providesTags: (_result, _error, id) => [{ type: 'Transport', id }],
      }),

      getTransportDetails: builder.query({
        query: (id) => `/transport-service/transports/${id}/details`,
        providesTags: (_result, _error, id) => [{ type: 'TransportDetails', id }],
      }),

      createTransport: builder.mutation({
        query: (data) => ({
          url: '/transport-service/transports',
          method: 'POST',
          body: data,
        }),
        invalidatesTags: ['Transports'],
      }),

      updateTransport: builder.mutation({
        query: ({ id, ...data }) => ({
          url: `/transport-service/transports/${id}`,
          method: 'PUT',
          body: data,
        }),
        invalidatesTags: (_result, _error, { id }) => [
          { type: 'Transport', id },
          { type: 'TransportDetails', id },
          'Transports',
        ],
      }),

      deleteTransport: builder.mutation({
        query: (id) => ({
          url: `/transport-service/transports/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: (_result, _error, id) => [
          { type: 'Transport', id },
          'Transports',
        ],
      }),

      getTransportSchedule: builder.query({
        query: ({ id, date }) => ({
          url: `/transport-service/transports/${id}/schedule`,
          params: { date },
        }),
        providesTags: (_result, _error, { id }) => [
          { type: 'TransportSchedule', id },
        ],
      }),

      createBooking: builder.mutation({
        query: (data) => ({
          url: '/transport-service/bookings',
          method: 'POST',
          body: data,
        }),
        invalidatesTags: ['TransportBooking', 'Orders'],
      }),

      getUserBookings: builder.query({
        query: (params) => ({
          url: '/transport-service/bookings/user',
          params,
        }),
        providesTags: ['TransportBooking'],
      }),

      getBookingById: builder.query({
        query: (id) => `/transport-service/bookings/${id}`,
        providesTags: (_result, _error, id) => [{ type: 'TransportBooking', id }],
      }),

      cancelBooking: builder.mutation({
        query: (id) => ({
          url: `/transport-service/bookings/${id}/cancel`,
          method: 'POST',
        }),
        invalidatesTags: (_result, _error, id) => [
          { type: 'TransportBooking', id },
          'TransportBooking',
        ],
      }),

      // Load Calculator endpoints ──────────────────────────────────
      // Calculate multiple containers (minimal format - used by LoadCalculator component)
      calculateMultipleContainersMinimal: builder.mutation<
        ApiResponse<CalculateMultipleContainersMinimalResponse>,
        CalculateMultipleContainersRequest & {
          format?: 'full' | 'minimal' | 'pdf';
        }
      >({
        query: ({ format = 'minimal', ...body }) => ({
          url: `${TRANSPORT_BASE}/api/calculate-multiple-containers?format=${format}`,
          method: 'POST',
          body,
        }),
        invalidatesTags: ['LoadCalculation'],
      }),

      // Calculate multiple container solutions (full format)
      calculateMultipleContainers: builder.mutation<
        { success: boolean; message: string; data: MultiContainerResponse },
        {
          products: ProductInput[];
          preferences?: Record<string, unknown>;
          spacingSettings?: SpacingSettings;
          stuffingSettings?: StuffingSettings;
          format?: 'full' | 'minimal';
        }
      >({
        query: ({ format = 'full', ...body }) => ({
          url: `${TRANSPORT_BASE}/test/calculate-multiple-containers?format=${format}`,
          method: 'POST',
          body,
        }),
        invalidatesTags: ['LoadCalculation'],
      }),

      // Enhanced 3D visualization
      getEnhanced3DVisualization: builder.mutation<
        { success: boolean; message: string; data: Enhanced3DResponse },
        {
          products: ProductInput[];
          spacingSettings?: SpacingSettings;
          stuffingSettings?: StuffingSettings;
          preferences?: Record<string, unknown>;
          containerIndex?: number;
        }
      >({
        query: ({ containerIndex = 0, ...body }) => ({
          url: `${TRANSPORT_BASE}/api/enhanced-3d-visualization?containerIndex=${containerIndex}`,
          method: 'POST',
          body,
        }),
      }),

      // Get cargo types
      getCargoTypes: builder.query<
        { success: boolean; message?: string; data: CargoTypesMap },
        void
      >({
        query: () => ({
          url: `${TRANSPORT_BASE}/api/cargo-types`,
          method: 'GET',
        }),
        providesTags: ['CargoTypes'],
      }),

      // Search containers
      searchContainers: builder.query<
        {
          success: boolean;
          data: {
            containers: Array<{
              containerId: string;
              name: string;
              category: string;
              dimensions: {
                insideLength: number;
                insideWidth: number;
                insideHeight: number;
              };
              capacity: { volume: number; maxWeight: number };
            }>;
            count: number;
          };
        },
        { category?: string; minVolume?: number; maxVolume?: number }
      >({
        query: (params) => ({
          url: `${TRANSPORT_BASE}/api/search-containers`,
          method: 'GET',
          params,
        }),
        providesTags: ['Containers'],
      }),

      // Get container categories
      getContainerCategories: builder.query<
        { success: boolean; data: Array<{ category: string; count: number }> },
        void
      >({
        query: () => ({
          url: `${TRANSPORT_BASE}/api/container-categories`,
          method: 'GET',
        }),
        providesTags: ['Containers'],
      }),

      // Get available pallet types
      getPalletTypes: builder.query<
        { success: boolean; message?: string; data: string[] },
        void
      >({
        query: () => ({
          url: `${PALLETS_BASE}/api/types`,
          method: 'GET',
        }),
        providesTags: ['Pallets'],
      }),

      // Get pallets by type
      getPalletsByType: builder.query<
        {
          success: boolean;
          data: {
            pallets: Array<{
              _id: string;
              name: string;
              type: string;
              dimensions: {
                length: number;
                width: number;
                height: number;
                depth?: number;
              };
              maxWeight: number;
              color?: string;
              material?: string;
            }>;
          };
        },
        string
      >({
        query: (type) => ({
          url: `${PALLETS_BASE}/api?type=${encodeURIComponent(type)}&availableOnly=true&limit=1`,
          method: 'GET',
        }),
        providesTags: ['Pallets'],
      }),
    }),
    overrideExisting: false,
  });

// Export hooks
export const {
  // Existing transport hooks
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
  // Load calculator hooks
  useCalculateMultipleContainersMinimalMutation,
  useCalculateMultipleContainersMutation,
  useGetEnhanced3DVisualizationMutation,
  useGetCargoTypesQuery,
  useSearchContainersQuery,
  useGetContainerCategoriesQuery,
  useGetPalletTypesQuery,
  useGetPalletsByTypeQuery,
} = transportApi;

export default transportApi;
