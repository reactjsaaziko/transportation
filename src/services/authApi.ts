import { apiService } from './apiService';
import { setAuthTokens, clearAuthTokens } from '@/utils/cookieUtils';

/**
 * Authentication API for Service Provider Login
 * Integrates with common-backend service-provider service through API Gateway
 * 
 * Flow:
 * 1. Admin creates service provider account
 * 2. Credentials sent to service provider via email
 * 3. Service provider logs in with email/password
 * 4. System validates role and returns tokens
 */

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      username: string;
      email: string;
      role: string;
      [key: string]: any;
    };
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
  };
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  companyName?: string;
  phoneNumber?: string;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  data?: {
    user: any;
    accessToken?: string;
    refreshToken?: string;
  };
}

/**
 * Service Provider Authentication API
 * Uses API Gateway at localhost:3030
 */
export const authApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Service Provider Login
     * POST /service-provider/users/login
     * 
     * Request: { email, password }
     * Response: { success, message, data: { user, accessToken, refreshToken, expiresIn } }
     */
    loginServiceProvider: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/service-provider/users/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          
          if (data.success && data.data) {
            // Store tokens in cookies and localStorage
            setAuthTokens(
              data.data.accessToken,
              data.data.refreshToken
            );
            
            // Store user data
            localStorage.setItem('user', JSON.stringify(data.data.user));
            localStorage.setItem('userRole', data.data.user.role);
          }
        } catch (error) {
          console.error('Login failed:', error);
        }
      },
      invalidatesTags: ['Auth', 'User'],
    }),

    /**
     * Service Provider Registration
     * POST /service-provider/users/register
     * 
     * For direct user registration (no admin approval required)
     */
    registerServiceProvider: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/service-provider/users/register',
        method: 'POST',
        body: userData,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          
          if (data.success && data.data?.accessToken && data.data?.refreshToken) {
            // If registration returns tokens, store them
            setAuthTokens(
              data.data.accessToken,
              data.data.refreshToken
            );
            
            // Store user data
            if (data.data.user) {
              localStorage.setItem('user', JSON.stringify(data.data.user));
              localStorage.setItem('userRole', data.data.user.role);
            }
          }
        } catch (error) {
          console.error('Registration failed:', error);
        }
      },
      invalidatesTags: ['Auth'],
    }),

    /**
     * Logout
     * Clears all authentication data
     */
    logoutServiceProvider: builder.mutation<void, void>({
      queryFn: () => {
        // Clear all auth data
        clearAuthTokens();
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        
        return { data: undefined };
      },
      invalidatesTags: ['Auth', 'User'],
    }),

    /**
     * Get Current User Profile
     * Uses the auth service through API Gateway
     */
    getCurrentUser: builder.query({
      query: () => '/api/v1/auth/me',
      providesTags: ['User', 'Profile'],
    }),

    /**
     * Check if user exists
     * GET /api/v1/auth/check-user
     */
    checkUser: builder.query({
      query: (params: { username?: string; email?: string }) => ({
        url: '/api/v1/auth/check-user',
        params,
      }),
    }),
  }),
  overrideExisting: false,
});

// Export hooks for usage in components
export const {
  useLoginServiceProviderMutation,
  useRegisterServiceProviderMutation,
  useLogoutServiceProviderMutation,
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
  useCheckUserQuery,
  useLazyCheckUserQuery,
} = authApi;

/**
 * Helper function to handle login with error handling
 */
export const handleServiceProviderLogin = async (
  loginMutation: any,
  credentials: LoginRequest
): Promise<{ success: boolean; error?: string; data?: any }> => {
  try {
    const response = await loginMutation(credentials).unwrap();
    
    if (response.success && response.data) {
      return {
        success: true,
        data: response.data,
      };
    }
    
    return {
      success: false,
      error: response.message || 'Login failed',
    };
  } catch (error: any) {
    console.error('Login error:', error);
    
    // Handle different error types
    if (error.status === 403) {
      return {
        success: false,
        error: 'Access denied. Only service providers can login here.',
      };
    }
    
    if (error.status === 401) {
      return {
        success: false,
        error: 'Invalid email or password',
      };
    }
    
    if (error.status === 400) {
      return {
        success: false,
        error: error.data?.message || 'Invalid credentials',
      };
    }
    
    return {
      success: false,
      error: error.data?.message || 'Login service unavailable. Please try again later.',
    };
  }
};

/**
 * Helper function to handle logout
 */
export const handleServiceProviderLogout = (logoutMutation: any) => {
  try {
    logoutMutation();
    
    // Redirect to login page
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout error:', error);
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const accessToken = localStorage.getItem('jwt_access_token');
  const user = localStorage.getItem('user');
  
  return !!(accessToken && user);
};

/**
 * Get user role
 */
export const getUserRole = (): string | null => {
  return localStorage.getItem('userRole');
};

/**
 * Get user data
 */
export const getUserData = (): any | null => {
  const userData = localStorage.getItem('user');
  
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }
  
  return null;
};
