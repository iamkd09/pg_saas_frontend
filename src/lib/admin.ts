import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/config";
import { unwrapResults } from "@/lib/api-utils";
import type { PaginatedResponse } from "@/types/api";
import type { UserProfile } from "@/types/account";
import type {
  AdminCreateOwnerPayload,
  AdminDashboard,
  AdminOrganization,
  AdminOrganizationDetail,
  AdminUserUpdatePayload,
} from "@/types/admin";
import type { Organization } from "@/types/organization";

export async function getAdminDashboard(): Promise<AdminDashboard> {
  const { data } = await apiClient.get<AdminDashboard>(
    API_ENDPOINTS.adminDashboard
  );
  return data;
}

export async function getAdminOrganizations(): Promise<AdminOrganization[]> {
  const { data } = await apiClient.get<PaginatedResponse<AdminOrganization>>(
    API_ENDPOINTS.adminOrganizations
  );
  return unwrapResults(data);
}

export async function getAdminOrganization(
  id: number
): Promise<AdminOrganizationDetail> {
  const { data } = await apiClient.get<AdminOrganizationDetail>(
    API_ENDPOINTS.adminOrganizationDetail(id)
  );
  return data;
}

export async function createAdminOrganization(
  name: string
): Promise<Organization> {
  const { data } = await apiClient.post<Organization>(
    API_ENDPOINTS.adminOrganizations,
    { name }
  );
  return data;
}

export async function getAdminUsers(params?: {
  role?: string;
  organization?: number;
}): Promise<UserProfile[]> {
  const { data } = await apiClient.get<PaginatedResponse<UserProfile>>(
    API_ENDPOINTS.adminUsers,
    { params }
  );
  return unwrapResults(data);
}

export async function updateAdminUser(
  id: number,
  payload: AdminUserUpdatePayload
): Promise<UserProfile> {
  const { data } = await apiClient.patch<UserProfile>(
    API_ENDPOINTS.adminUserDetail(id),
    payload
  );
  return data;
}

export async function createAdminOwner(
  payload: AdminCreateOwnerPayload
): Promise<UserProfile> {
  const { data } = await apiClient.post<UserProfile>(
    API_ENDPOINTS.adminCreateOwner,
    payload
  );
  return data;
}
