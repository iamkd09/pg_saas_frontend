import axios from "axios";

import { parseApiError } from "@/lib/api-utils";
import { API_BASE_URL, AUTH_ENDPOINTS } from "@/lib/config";
import {
  clearTokens,
  isAuthenticated,
  saveTokens,
} from "@/lib/token-storage";
import type {
  LoginCredentials,
  RegisterPayload,
  RegisterResponse,
  TokenPair,
} from "@/types/auth";

export { isAuthenticated };

export async function login(
  credentials: LoginCredentials,
  rememberMe: boolean
): Promise<void> {
  try {
    const { data } = await axios.post<TokenPair>(
      `${API_BASE_URL}${AUTH_ENDPOINTS.login}`,
      credentials,
      { headers: { "Content-Type": "application/json" } }
    );
    saveTokens(data.access, data.refresh, rememberMe);
  } catch (error) {
    throw new Error(parseApiError(error, "Invalid username or password."));
  }
}

export async function register(
  payload: RegisterPayload,
  rememberMe = true
): Promise<RegisterResponse> {
  try {
    const { data } = await axios.post<RegisterResponse>(
      `${API_BASE_URL}${AUTH_ENDPOINTS.register}`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );
    saveTokens(data.access, data.refresh, rememberMe);
    return data;
  } catch (error) {
    throw new Error(parseApiError(error, "Unable to create account."));
  }
}

export function logout(): void {
  clearTokens();
}
