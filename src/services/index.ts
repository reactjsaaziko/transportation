/**
 * Central export for all API services
 * 
 * This file re-exports all API hooks and types for easy importing
 * throughout the application.
 */

// Base API service
export { apiService, setGlobalHeaders, removeGlobalHeaders, setNotificationDispatcher } from './apiService';

// Auth API
export {
  authApi,
  useLoginServiceProviderMutation,
  useRegisterServiceProviderMutation,
  useLogoutServiceProviderMutation,
  useGetCurrentUserQuery as useGetAuthCurrentUserQuery,
  useLazyGetCurrentUserQuery,
  useCheckUserQuery,
  useLazyCheckUserQuery,
  handleServiceProviderLogin,
  handleServiceProviderLogout,
} from './authApi';

// Transport API
export {
  transportApi,
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
} from './transportApi';

// Service Provider API
export {
  serviceProviderApi,
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
} from './serviceProviderApi';

// Vehicle API
export {
  vehicleApi,
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
} from './vehicleApi';

// Trip API
export {
  tripApi,
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
} from './tripApi';

// Warehouse API
export {
  warehouseApi,
  useCreateWarehouseMutation,
  useGetWarehousesQuery,
  useGetWarehouseByIdQuery,
  useUpdateWarehouseMutation,
  useDeleteWarehouseMutation,
  useGetFacilityTypesQuery,
  useSearchWarehousesQuery,
  useCheckWarehouseAvailabilityMutation,
  useGetWarehouseAnalyticsQuery,
  useCreateTransactionMutation,
  useGetTransactionsQuery,
  useGetTransactionByIdQuery,
  useGetTransactionsByWarehouseQuery,
  useUpdateTransactionMutation,
  useCompleteTransactionMutation,
  useUpdateTransactionStatusMutation,
  useGetTransactionAnalyticsQuery,
  useLazyExportTransactionsQuery,
} from './warehouseApi';

// Freight API
export {
  freightApi,
  useCreateFreightOrderMutation,
  useGetFreightOrderByIdQuery,
  useGetFreightOrdersQuery,
  useGetActiveFreightOrdersQuery,
  useSearchFreightOrdersQuery,
  useUpdateFreightOrderMutation,
  useDeleteFreightOrderMutation,
  useUpdateFreightOrderStatusMutation,
  useUpdateFreightOrderPricingMutation,
  useAddFreightDocumentMutation,
  useAddFreightCommunicationMutation,
  useAddFreightFeedbackMutation,
  useAddFreightTagsMutation,
  useGetFreightStatisticsQuery,
} from './freightApi';

// CHA API
export {
  chaApi,
  useCreateCHAOrderMutation,
  useGetCHAOrderByIdQuery,
  useGetCHAOrdersQuery,
  useGetCHAOrdersByStatusQuery,
  useUpdateCHAOrderMutation,
  useDeleteCHAOrderMutation,
  useUpdateCHAOrderStatusMutation,
  useAddTimelineEventMutation,
  useCompleteTimelineEventMutation,
  useUploadCHADocumentMutation,
  useUpdateCHATrackingMutation,
  useAddCHAFeedbackMutation,
  useGetCHAStatisticsQuery,
  useCreateCHAConversationMutation,
  useGetCHAConversationByIdQuery,
  useGetCHAConversationsQuery,
  useGetActiveCHAConversationsQuery,
  useAddCHAMessageMutation,
  useGrantCHAPermissionMutation,
  useRevokeCHAPermissionMutation,
  useResolveCHAConversationMutation,
  useGetCHADashboardOverviewQuery,
} from './chaApi';

// Re-export types
export type { Vehicle, VehicleType, VehicleModel, VehicleFilters } from './vehicleApi';
export type { Trip, TripFilters, TripStatistics, CreateTripData } from './tripApi';
export type { Warehouse, WarehouseTransaction, WarehouseFilters, TransactionFilters } from './warehouseApi';
export type { FreightOrder, FreightOrderFilters, FreightStatistics } from './freightApi';
export type { CHAOrder, CHAConversation, CHAOrderFilters, CHAStatistics } from './chaApi';
export type { 
  DashboardOverview, 
  ContactInfo, 
  AIPermissions, 
  ServiceProviderProfile 
} from './serviceProviderApi';
