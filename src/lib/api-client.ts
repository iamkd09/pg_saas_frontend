import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

import {
  API_BASE_URL,
  AUTH_ENDPOINTS,
} from "@/lib/config";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  saveTokens,
  usesPersistentStorage,
} from "@/lib/token-storage";
import type { RefreshTokenResponse } from "@/types/auth";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken();
  if (!refresh) {
    clearTokens();
    return null;
  }

  try {
    const { data } = await axios.post<RefreshTokenResponse>(
      `${API_BASE_URL}${AUTH_ENDPOINTS.refresh}`,
      { refresh },
      { headers: { "Content-Type": "application/json" } }
    );

    saveTokens(data.access, data.refresh ?? refresh, usesPersistentStorage());
    return data.access;
  } catch {
    clearTokens();
    return null;
  }
}

function isAuthEndpoint(url: string | undefined): boolean {
  if (!url) return false;
  return (
    url.includes(AUTH_ENDPOINTS.login) ||
    url.includes(AUTH_ENDPOINTS.register) ||
    url.includes(AUTH_ENDPOINTS.refresh)
  );
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      isAuthEndpoint(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
    }

    const newAccessToken = await refreshPromise;
    if (!newAccessToken) {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
    return apiClient(originalRequest);
  }
);
