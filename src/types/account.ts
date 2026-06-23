export interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  role: string;
  organization: { id: number; name: string; created_at: string } | null;
  is_active: boolean;
  date_joined: string;
  created_at: string;
  updated_at: string;
}

export interface ProfileUpdatePayload {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
}

export interface CreateManagerPayload {
  username: string;
  email: string;
  password: string;
  phone_number: string;
  first_name?: string;
  last_name?: string;
}

export interface CreateTenantAccountPayload {
  tenant_id: number;
  username: string;
  email: string;
  password: string;
  phone_number?: string;
}

export interface StaffUserUpdatePayload {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  is_active?: boolean;
}
