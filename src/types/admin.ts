import type { UserProfile } from "@/types/account";
import type { Organization } from "@/types/organization";

export interface AdminDashboard {
  organizations: number;
  users: number;
  owners: number;
  managers: number;
  tenants: number;
  properties: number;
  beds: number;
  vacant_beds: number;
  occupied_beds: number;
}

export interface AdminOrganization extends Organization {
  owner_count: number;
  property_count: number;
  tenant_count: number;
}

export interface AdminOrganizationDetail extends AdminOrganization {
  owners: UserProfile[];
}

export interface AdminCreateOwnerPayload {
  organization_id?: number;
  organization_name?: string;
  username: string;
  email: string;
  password: string;
  phone_number: string;
  first_name?: string;
  last_name?: string;
}

export interface AdminUserUpdatePayload {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  role?: string;
  is_active?: boolean;
  organization?: number;
}
