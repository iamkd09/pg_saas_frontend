import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/config";
import { unwrapResults } from "@/lib/api-utils";
import type { PaginatedResponse } from "@/types/api";
import type { CreateTenantPayload, Tenant } from "@/types/tenant";

export async function getTenants(): Promise<Tenant[]> {
  const { data } = await apiClient.get<PaginatedResponse<Tenant>>(
    API_ENDPOINTS.tenants
  );
  return unwrapResults(data);
}

export async function createTenant(payload: CreateTenantPayload): Promise<Tenant> {
  const { data } = await apiClient.post<Tenant>(API_ENDPOINTS.tenants, payload);
  return data;
}

export async function assignBed(
  tenantId: number,
  bedId: number
): Promise<Tenant> {
  const { data } = await apiClient.post<Tenant>(
    API_ENDPOINTS.assignBed(tenantId),
    { bed_id: bedId }
  );
  return data;
}

export async function checkoutTenant(
  tenantId: number,
  leavingDate?: string
): Promise<Tenant> {
  const { data } = await apiClient.post<Tenant>(
    API_ENDPOINTS.checkoutTenant(tenantId),
    leavingDate ? { leaving_date: leavingDate } : {}
  );
  return data;
}

export async function getMyTenantProfile(): Promise<Tenant> {
  const { data } = await apiClient.get<Tenant>(API_ENDPOINTS.tenantMine);
  return data;
}
