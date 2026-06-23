import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/config";
import type {
  Organization,
  OrganizationStats,
} from "@/types/organization";

export async function getOrganization(): Promise<Organization> {
  const { data } = await apiClient.get<Organization>(API_ENDPOINTS.organization);
  return data;
}

export async function updateOrganization(
  payload: Partial<Pick<Organization, "name">>
): Promise<Organization> {
  const { data } = await apiClient.patch<Organization>(
    API_ENDPOINTS.organization,
    payload
  );
  return data;
}

export async function getOrganizationStats(): Promise<OrganizationStats> {
  const { data } = await apiClient.get<OrganizationStats>(
    API_ENDPOINTS.organizationStats
  );
  return data;
}
