import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/config";
import { unwrapResults } from "@/lib/api-utils";
import type { PaginatedResponse } from "@/types/api";
import type {
  ChangePasswordPayload,
  CreateManagerPayload,
  CreateTenantAccountPayload,
  ProfileUpdatePayload,
  StaffUserUpdatePayload,
  UserProfile,
} from "@/types/account";

export async function getProfile(): Promise<UserProfile> {
  const { data } = await apiClient.get<UserProfile>(API_ENDPOINTS.profile);
  return data;
}

export async function updateProfile(
  payload: ProfileUpdatePayload
): Promise<UserProfile> {
  const { data } = await apiClient.patch<UserProfile>(
    API_ENDPOINTS.profile,
    payload
  );
  return data;
}

export async function changePassword(
  payload: ChangePasswordPayload
): Promise<void> {
  await apiClient.post(API_ENDPOINTS.changePassword, payload);
}

export async function getUsers(params?: {
  role?: string;
}): Promise<UserProfile[]> {
  const { data } = await apiClient.get<PaginatedResponse<UserProfile>>(
    API_ENDPOINTS.users,
    { params }
  );
  return unwrapResults(data);
}

export async function createManager(
  payload: CreateManagerPayload
): Promise<UserProfile> {
  const { data } = await apiClient.post<UserProfile>(
    API_ENDPOINTS.createManager,
    payload
  );
  return data;
}

export async function createTenantAccount(
  payload: CreateTenantAccountPayload
): Promise<UserProfile> {
  const { data } = await apiClient.post<UserProfile>(
    API_ENDPOINTS.createTenantAccount,
    payload
  );
  return data;
}

export async function updateStaffUser(
  id: number,
  payload: StaffUserUpdatePayload
): Promise<UserProfile> {
  const { data } = await apiClient.patch<UserProfile>(
    API_ENDPOINTS.userDetail(id),
    payload
  );
  return data;
}
