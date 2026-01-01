import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query";
import { getAuthTokensFromCookies } from "@/utils/cookieUtils";

// Global headers configuration for RTK Query
export const globalHeaders: Record<string, string> = {};

// Function to update global headers
export const setGlobalHeaders = (newHeaders: Record<string, string>) => {
  Object.assign(globalHeaders, newHeaders);
};

export const removeGlobalHeaders = (headerKeys: string[]) => {
  headerKeys.forEach((key) => {
    delete globalHeaders[key];
  });
};

// Keep track of refresh attempts to prevent infinite loops
let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

// Notification utility to avoid circular dependency with store
let notificationDispatcher:
  | ((
      message: string,
      variant: "error" | "warning" | "info" | "success",
      duration?: number,
    ) => void)
  | null = null;

export const setNotificationDispatcher = (
  dispatcher: (
    message: string,
    variant: "error" | "warning" | "info" | "success",
    duration?: number,
  ) => void,
) => {
  notificationDispatcher = dispatcher;
};

const showNotification = (
  message: string,
  variant: "error" | "warning" | "info" | "success",
  duration = 5000,
) => {
  if (notificationDispatcher) {
    notificationDispatcher(message, variant, duration);
  } else {
    // Fallback to console if dispatcher not set
    console.warn(`[${variant.toUpperCase()}] ${message}`);
  }
};

/**
 * Handle forced logout scenarios (role changes, token invalidation)
 */
const handleForcedLogout = (message: string) => {
  // Clear all auth data
  localStorage.removeItem("jwt_access_token");
  localStorage.removeItem("jwt_refresh_token");
  delete globalHeaders.Authorization;

  // Determine redirect reason
  const isRoleChange = message.includes("role change");
  const redirectUrl = isRoleChange
    ? "/sign-in?reason=role_changed"
    : "/sign-in?reason=session_expired";

  // Show notification if not on sign-in page
  if (window.location.pathname !== "/sign-in") {
    const notificationMessage = isRoleChange
      ? "Your role has been updated by an administrator. Please log in again to continue with your new permissions."
      : "Your session has expired due to security policy. Please log in again.";

    showNotification(notificationMessage, "warning", 6000);

    // Small delay to show notification before redirect
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 1500);
  } else {
    window.location.href = redirectUrl;
  }
};

/**
 * Handle authentication failures (token refresh failures, etc.)
 */
const handleAuthFailure = (reason: string) => {
  // Clear all auth data
  localStorage.removeItem("jwt_access_token");
  localStorage.removeItem("jwt_refresh_token");
  delete globalHeaders.Authorization;

  // Show notification with reason
  if (window.location.pathname !== "/sign-in") {
    const notificationMessage = `Authentication failed: ${reason}. You will be redirected to login.`;

    showNotification(notificationMessage, "error", 5000);

    // Small delay to show notification before redirect
    setTimeout(() => {
      window.location.href = "/sign-in?reason=auth_failed";
    }, 1500);
  } else {
    window.location.href = "/sign-in?reason=auth_failed";
  }
};

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_COMMON_API_URL || 'http://localhost:3030',
  prepareHeaders: (headers) => {
    // Add global headers (only if they have valid values)
    Object.entries(globalHeaders).forEach(([key, value]) => {
      if (value && value !== 'undefined' && value !== 'null') {
        headers.set(key, value);
      }
    });

    // Add auth token from cookies if available
    try {
      const tokens = getAuthTokensFromCookies();

      // Only add Authorization header if we have a valid, non-empty token
      if (tokens.accessToken && tokens.accessToken.trim() !== '') {
        headers.set("Authorization", `Bearer ${tokens.accessToken}`);
        headers.set("X-Auth-Token", tokens.accessToken);
      }
    } catch (error) {
      // Silently fail if cookie utils are not available
      console.warn("Could not load auth tokens from cookies:", error);
    }

    return headers;
  },
  validateStatus: (response, body) => {
    // Accept response if:
    // 1. HTTP status is 2xx (response.ok), OR
    // 2. Response body has success: true (even if status is 4xx/5xx)
    const isSuccessStatus = response.ok;
    const hasSuccessFlag = body && typeof body === 'object' && (body as any).success === true;
    
    if (hasSuccessFlag && !isSuccessStatus) {
      console.log(`⚠️ API returned success:true with HTTP ${response.status} - treating as success`);
    }
    
    return isSuccessStatus || hasSuccessFlag;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  object,
  FetchBaseQueryMeta
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Handle 401 errors with enhanced logic
  if (result.error && result.error.status === 401) {
    const url = typeof args === "string" ? args : args.url;
    const errorMessage = (result.error.data as any)?.message || "";

    console.log("🔒 401 Error detected:", {
      url,
      errorMessage,
      errorData: result.error.data,
    });
    
    // Check if user is a guest FIRST before any other logic
    const hasRefreshToken = !!localStorage.getItem("jwt_refresh_token");
    const hasAccessToken = !!localStorage.getItem("jwt_access_token");
    const isGuest = !hasRefreshToken && !hasAccessToken;

    console.log("🔍 Auth check:", { 
      isGuest, 
      hasRefreshToken, 
      hasAccessToken,
      url 
    });

    // Public endpoints that should work for guest users
    const isPublicEndpoint = 
      url.includes("/transport-service/public") || 
      url.includes("/common-service/categories") ||
      url.includes("/search");

    // If guest user accessing public endpoints, just return the error without redirect
    if (isGuest && isPublicEndpoint) {
      console.log("✅ Guest user accessing public endpoint - returning 401 without redirect:", url);
      return result;
    }

    // Skip token refresh for registration endpoint
    if (url.includes("/register")) {
      console.log("✅ Registration endpoint 401 - skipping token refresh, returning error to component");
      return result;
    }

    // Check if it's a role change logout or forced logout from backend
    const isRoleChangeLogout =
      errorMessage.includes("role change") ||
      errorMessage.includes("Session expired due to role change") ||
      errorMessage.includes("Token invalidated") ||
      (result.error.data as any)?.roleChanged === true;

    // Skip refresh for auth endpoints OR forced/role change logouts
    const isRegisterEndpoint = url.includes("/register");
    const isLoginEndpoint = url.includes("/login");
    const isRefreshEndpoint = url.includes("/refresh");
    const isVerifyEndpoint = url.includes("/verify");
    const isAuthEndpoint = url.includes("/auth") || url.includes("-auth/");
    
    if (
      isRefreshEndpoint ||
      isLoginEndpoint ||
      isRegisterEndpoint ||
      isVerifyEndpoint ||
      isRoleChangeLogout
    ) {
      // Handle immediate logout for role changes or forced logouts
      if (isRoleChangeLogout) {
        console.log("Role change logout detected, forcing logout");
        handleForcedLogout(errorMessage);
        return result;
      }

      // For auth endpoints that fail (except register and login which don't need logout)
      if (isAuthEndpoint && !isRegisterEndpoint && !isLoginEndpoint) {
        console.log("Auth endpoint failed, logging out");
        handleAuthFailure("Authentication endpoint failed");
        return result;
      }

      // For register and login endpoints, just return the error without logout
      console.log("Auth endpoint (register/login) - skipping token refresh and logout");
      return result;
    }

    // If already refreshing, wait for the existing refresh
    if (isRefreshing && refreshPromise) {
      try {
        await refreshPromise;
        // Retry the original request with potentially new token
        result = await baseQuery(args, api, extraOptions);
      } catch (error) {
        // If refresh failed, sign out the user
        console.log("Refresh promise failed, logging out");
        handleAuthFailure("Token refresh failed during concurrent request");
        return result;
      }
      return result;
    }

    // Start refresh process
    if (!isRefreshing) {
      // Double-check: Don't start refresh if user is a guest
      const refreshToken = localStorage.getItem("jwt_refresh_token");
      if (!refreshToken) {
        console.log("❌ No refresh token available - user is guest, skipping token refresh");
        // Don't trigger auth failure for guest users
        return result;
      }

      isRefreshing = true;

      refreshPromise = (async () => {
        try {
          if (!refreshToken) {
            throw new Error("No refresh token available");
          }

          // Call refresh endpoint with security headers
          const refreshResult = await baseQuery(
            {
              url: "/auth/refresh",
              method: "POST",
              body: { refreshToken },
              headers: {
                "Content-Type": "application/json",
                Authorization: undefined,
              },
            },
            api,
            extraOptions,
          );

          if (refreshResult.data) {
            const response = refreshResult.data as {
              success: boolean;
              data: {
                accessToken: string;
                refreshToken: string;
              };
            };

            if (response.success) {
              // Update tokens in localStorage
              localStorage.setItem(
                "jwt_access_token",
                response.data.accessToken,
              );
              localStorage.setItem(
                "jwt_refresh_token",
                response.data.refreshToken,
              );

              // Update global headers
              globalHeaders.Authorization = `Bearer ${response.data.accessToken}`;

              return response.data.accessToken;
            }
          }

          throw new Error("Token refresh failed");
        } catch (error) {
          // Clear tokens and handle auth failure
          console.log("Token refresh process failed, logging out");
          handleAuthFailure("Token refresh failed");
          throw error;
        } finally {
          isRefreshing = false;
          refreshPromise = null;
        }
      })();

      try {
        await refreshPromise;
        // Retry the original request with new token
        result = await baseQuery(args, api, extraOptions);
      } catch (error) {
        // Refresh failed, logout user
        console.log("Final refresh attempt failed, logging out");
        handleAuthFailure("Token refresh process failed");
        return result;
      }
    }
  }

  // Additional fallback: if we get here with a 401 that wasn't handled above, logout
  if (result.error && result.error.status === 401) {
    const url = typeof args === "string" ? args : args.url;
    
    // Check if user is a guest
    const hasRefreshToken = !!localStorage.getItem("jwt_refresh_token");
    const hasAccessToken = !!localStorage.getItem("jwt_access_token");
    const isGuest = !hasRefreshToken && !hasAccessToken;

    // Public endpoints that should work for guest users
    const isPublicEndpoint = 
      url.includes("/transport-service/public") || 
      url.includes("/common-service/categories") ||
      url.includes("/search");

    // Skip logout for registration endpoint or guest users on public endpoints
    if (url.includes("/register")) {
      console.log("Registration 401 error - returning to component without logout");
    } else if (isGuest && isPublicEndpoint) {
      console.log("Guest user on public endpoint - returning 401 without logout:", url);
    } else {
      console.log("Unhandled 401 error, forcing logout", { url });
      handleAuthFailure("Unhandled authentication error");
    }
  }

  return result;
};

export const apiService = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  reducerPath: "apiService",
  tagTypes: [
    // Transport related tags
    "Transport",
    "Transports",
    "TransportDetails",
    "TransportBooking",
    "TransportSchedule",

    // Auth related tags
    "User",
    "Auth",
    "Profile",

    // Address related tags
    "Address",
    "Addresses",

    // Order related tags
    "Order",
    "Orders",

    // General tags
    "Categories",
    "Countries",
    "Tags",

    // Service Provider tags
    "Dashboard",
    "Trips",
    "Contact",
    "AIHistory",
    "AIPermissions",
    "ServiceProviders",
    "ServiceProvider",
    "Statistics",

    // Vehicle tags
    "Vehicles",
    "Vehicle",
    "VehicleTypes",
    "VehicleModels",

    // Trip management tags
    "Trip",
    "TripStatistics",

    // Warehouse tags
    "Warehouses",
    "Warehouse",
    "WarehouseTransactions",
    "WarehouseTransaction",
    "WarehouseAnalytics",

    // Freight tags
    "FreightOrders",
    "FreightOrder",
    "FreightStatistics",
    "FreightPricing",

    // CHA tags
    "CHAOrders",
    "CHAOrder",
    "CHAConversations",
    "CHAConversation",
    "CHAStatistics",
    "CHAServicePricing",

    // Work tags
    "WorkAssignments",
    "WorkAssignment",
    "WorkRequests",
    "WorkRequest",
  ],
});

export default apiService;
