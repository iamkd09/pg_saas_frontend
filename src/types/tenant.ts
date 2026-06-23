import type { TenantStatus } from "@/types/api";

export interface BedLocation {
  bed_number: string;
  bed_status: string;
  room_number: string;
  floor_number: number;
  property_id: number;
  property_name: string;
}

export interface Tenant {
  id: number;
  organization: number;
  user: number | null;
  bed: number | null;
  full_name: string;
  phone_number: string;
  email: string | null;
  aadhaar_number: string | null;
  emergency_contact_name: string;
  emergency_contact_number: string;
  joining_date: string;
  leaving_date: string | null;
  security_deposit: string;
  monthly_rent: string;
  status: TenantStatus;
  bed_location: BedLocation | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTenantPayload {
  bed?: number;
  user?: number;
  full_name: string;
  phone_number: string;
  email?: string;
  aadhaar_number?: string;
  emergency_contact_name: string;
  emergency_contact_number: string;
  joining_date: string;
  leaving_date?: string;
  security_deposit?: string;
  monthly_rent: string;
  status?: TenantStatus;
}
