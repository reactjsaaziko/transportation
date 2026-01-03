/**
 * Cookie utility functions for handling authentication tokens
 */

/**
 * Get a cookie value by name
 */
export const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
};

/**
 * Set a cookie
 */
export const setCookie = (
  name: string,
  value: string,
  days?: number,
  options: {
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: 'Strict' | 'Lax' | 'None';
  } = {}
): void => {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }

  const path = options.path || '/';
  const domain = options.domain ? `; domain=${options.domain}` : '';
  const secure = options.secure ? '; secure' : '';
  const sameSite = options.sameSite ? `; samesite=${options.sameSite}` : '; samesite=Lax';

  document.cookie = `${name}=${value || ''}${expires}; path=${path}${domain}${secure}${sameSite}`;
};

/**
 * Delete a cookie
 */
export const deleteCookie = (
  name: string,
  options: {
    path?: string;
    domain?: string;
  } = {}
): void => {
  const path = options.path || '/';
  const domain = options.domain ? `; domain=${options.domain}` : '';
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}${domain}`;
};

/**
 * Get auth tokens from cookies
 */
export const getAuthTokensFromCookies = (): {
  accessToken: string | null;
  refreshToken: string | null;
} => {
  // First try to get from cookies
  let accessToken = getCookie('jwt_access_token');
  let refreshToken = getCookie('jwt_refresh_token');

  // Fallback to localStorage if not in cookies
  if (!accessToken) {
    accessToken = localStorage.getItem('jwt_access_token');
  }
  if (!refreshToken) {
    refreshToken = localStorage.getItem('jwt_refresh_token');
  }

  return {
    accessToken,
    refreshToken,
  };
};

/**
 * Set auth tokens in both cookies and localStorage
 */
export const setAuthTokens = (
  accessToken: string,
  refreshToken: string,
  options: {
    secure?: boolean;
    sameSite?: 'Strict' | 'Lax' | 'None';
  } = {}
): void => {
  // Set in localStorage
  localStorage.setItem('jwt_access_token', accessToken);
  localStorage.setItem('jwt_refresh_token', refreshToken);

  // Set in cookies (7 days expiry)
  const cookieOptions = {
    path: '/',
    secure: options.secure ?? (window.location.protocol === 'https:'),
    sameSite: options.sameSite ?? 'Lax' as const,
  };

  setCookie('jwt_access_token', accessToken, 7, cookieOptions);
  setCookie('jwt_refresh_token', refreshToken, 7, cookieOptions);
};

/**
 * Clear auth tokens from both cookies and localStorage
 */
export const clearAuthTokens = (): void => {
  // Remove from localStorage
  localStorage.removeItem('jwt_access_token');
  localStorage.removeItem('jwt_refresh_token');

  // Remove from cookies
  deleteCookie('jwt_access_token');
  deleteCookie('jwt_refresh_token');
};
