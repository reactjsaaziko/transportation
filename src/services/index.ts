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
  useRefreshServiceProviderTokenMutation,
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
  useDeleteServiceProviderMutation,
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
  useCreateFreightPricingMutation,
  useGetFreightPricingsByServiceProviderQuery,
  useGetFreightPricingByIdQuery,
  useUpdateFreightPricingMutation,
  useDeleteFreightPricingMutation,
  useBatchCreateFreightPricingsMutation,
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
  useGetCHAConversationHistoryQuery,
  useGetCHAAIPermissionsQuery,
  useUpdateCHAConversationPriorityMutation,
  useAddCHAConversationTagsMutation,
  useRemoveCHAConversationTagsMutation,
  useAddCHAConversationFeedbackMutation,
  useGetCHAConversationStatisticsQuery,
  useGetCHAOrderManagementQuery,
  useGetCHAAIDashboardQuery,
  useGetCHAContactDashboardQuery,
  useGetCHAPerformanceAnalyticsQuery,
} from './chaApi';

// CHA Service Pricing API
export {
  chaServicePricingApi,
  useCreateCHAServicePricingMutation,
  useGetCHAServicePricingsQuery,
  useGetCHAServicePricingsByServiceProviderQuery,
  useLazyGetCHAServicePricingsByServiceProviderQuery,
  useGetCHAServicePricingByIdQuery,
  useUpdateCHAServicePricingMutation,
  useDeleteCHAServicePricingMutation,
  useGetAvailablePortsQuery,
  useGetCHAServicePricingPortsQuery,
} from './chaServicePricingApi';

// Inquiry API (public inquiry + admin approval + detailed-form workflow)
export {
  inquiryApi,
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
} from './inquiryApi';

// Work Assignment API (admin ↔ service-provider assignment workflow)
export {
  workAssignmentApi,
  useCreateWorkAssignmentMutation,
  useGetAllWorkAssignmentsQuery,
  useGetWorkAssignmentStatisticsQuery,
  useGetWorkAssignmentByIdQuery,
  useUpdateWorkAssignmentMutation,
  useCancelWorkAssignmentMutation,
  useReviewWorkAssignmentMutation,
  useGetMyWorkAssignmentsQuery,
  useAcknowledgeWorkAssignmentMutation,
  useDeclineWorkAssignmentMutation,
  useStartWorkAssignmentMutation,
  useAddWorkAssignmentProgressMutation,
  useSubmitWorkAssignmentForReviewMutation,
  useAddWorkAssignmentMessageMutation,
} from './workAssignmentApi';

// Work Request API (broadcast work-request workflow)
export {
  workRequestApi,
  useCreateWorkRequestMutation,
  useGetAllWorkRequestsQuery,
  useGetWorkRequestStatisticsQuery,
  useGetWorkRequestResponsesQuery,
  useExtendWorkRequestExpiryMutation,
  useCancelWorkRequestMutation,
  useCleanupExpiredWorkRequestsMutation,
  useGetAvailableWorkRequestsQuery,
  useViewWorkRequestQuery,
  useExpressInterestInWorkRequestMutation,
  useAcceptWorkRequestMutation,
  useDeclineWorkRequestMutation,
} from './workRequestApi';

// Transport AI Assistant API (legacy /ai-assistant/*)
export {
  transportAIAssistantApi,
  useStartConversationMutation,
  useContinueConversationMutation,
  useGetConversationQuery,
  useResolveConversationMutation,
  useAddConversationFeedbackMutation,
  useMarkMessageHelpfulMutation,
  useGetAIUsageAnalyticsQuery,
  useGetConversationSuggestionsQuery,
} from './transportAIAssistantApi';

// Warehouse AI Assistant API
export {
  warehouseAIAssistantApi,
  useCreateWarehouseAIConversationMutation,
  useGetWarehouseAIConversationByIdQuery,
  useGetWarehouseAIConversationsQuery,
  useGetActiveWarehouseAIConversationsQuery,
  useGetWarehouseAIConversationHistoryQuery,
  useAddWarehouseAIMessageMutation,
  useGrantWarehouseAIPermissionMutation,
  useRevokeWarehouseAIPermissionMutation,
  useGetWarehouseAIPermissionsQuery,
  useResolveWarehouseAIConversationMutation,
  useAddWarehouseAIFeedbackMutation,
  useGetWarehouseAIStatisticsQuery,
} from './warehouseAIAssistantApi';

// Freight AI Assistant API
export {
  freightAIAssistantApi,
  useCreateFreightAIConversationMutation,
  useGetFreightAIConversationByIdQuery,
  useGetFreightAIConversationsQuery,
  useGetActiveFreightAIConversationsQuery,
  useGetFreightAIConversationHistoryQuery,
  useAddFreightAIMessageMutation,
  useGrantFreightAIPermissionMutation,
  useRevokeFreightAIPermissionMutation,
  useGetFreightAIPermissionsQuery,
  useUpdateFreightAIPriorityMutation,
  useAddFreightAITagsMutation,
  useRemoveFreightAITagsMutation,
  useResolveFreightAIConversationMutation,
  useAddFreightAIFeedbackMutation,
  useGetFreightAIStatisticsQuery,
} from './freightAIAssistantApi';

// Ports API
export {
  portsApi,
  useGetPortsQuery,
  useGetPortNamesQuery,
  useSearchPortsQuery,
  useGetPortStatisticsQuery,
  useGetPortsByCountryQuery,
  useGetPortByIdQuery,
} from './portsApi';

// Re-export types
export type { Vehicle, VehicleType, VehicleModel, VehicleFilters } from './vehicleApi';
export type { Trip, TripFilters, TripStatistics, CreateTripData } from './tripApi';
export type { Warehouse, WarehouseTransaction, WarehouseFilters, TransactionFilters } from './warehouseApi';
export type { FreightOrder, FreightOrderFilters, FreightStatistics } from './freightApi';
export type { CHAOrder, CHAConversation, CHAOrderFilters, CHAStatistics } from './chaApi';
export type {
  CHAServicePricing,
  CreateCHAServicePricingRequest,
  UpdateCHAServicePricingRequest,
} from './chaServicePricingApi';
export type {
  DashboardOverview,
  ContactInfo,
  AIPermissions,
  ServiceProviderProfile,
} from './serviceProviderApi';
