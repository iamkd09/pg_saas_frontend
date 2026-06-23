export interface HomepageUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  role: string;
  organization: {
    id: number;
    name: string;
  } | null;
}

export interface OccupancyStats {
  total_beds: number;
  occupied: number;
  vacant: number;
  occupancy_rate: number;
}

export interface TenantStats {
  active: number;
  left: number;
}

export interface ComplaintStats {
  open: number;
  in_progress: number;
  resolved: number;
  total: number;
}

export interface RentStats {
  pending: number;
  overdue: number;
  paid: number;
  partial: number;
  paid_this_month: number;
}

export interface SuperAdminDashboard {
  organizations: number;
  properties: number;
  occupancy: OccupancyStats;
  tenants: TenantStats;
  complaints: ComplaintStats;
  rents: RentStats;
}

export interface OrganizationDashboard {
  properties: number;
  occupancy: OccupancyStats;
  tenants: TenantStats;
  complaints: ComplaintStats;
  rents: RentStats;
}

export interface RecentComplaint {
  id: number;
  title: string;
  status: string;
  tenant_name: string;
  created_at: string;
}

export interface RecentTenant {
  id: number;
  full_name: string;
  phone_number: string;
  status: string;
  monthly_rent: string;
  joining_date: string;
}

export interface SuperAdminHomepage {
  role: string;
  user: HomepageUser;
  dashboard: SuperAdminDashboard;
}

export interface OrganizationHomepage {
  role: string;
  user: HomepageUser;
  organization: {
    id: number;
    name: string;
    created_at: string;
  } | null;
  dashboard: OrganizationDashboard | null;
  recent_complaints?: RecentComplaint[];
  recent_tenants?: RecentTenant[];
  message?: string;
}

export interface TenantProfile {
  id: number;
  full_name: string;
  phone_number: string;
  email: string;
  status: string;
  monthly_rent: string;
  security_deposit: string;
  joining_date: string;
  leaving_date: string | null;
  location: {
    bed_number: string;
    bed_status: string;
    room_number: string;
    floor_number: number;
    property: {
      id: number;
      name: string;
      address: string;
    };
  } | null;
}

export interface CurrentRent {
  id: number;
  rent_month: string;
  amount: string;
  amount_paid: string;
  due_date: string;
  paid_date: string | null;
  status: string;
  late_fee: string;
}

export interface TenantHomepage {
  role: string;
  user: HomepageUser;
  tenant_profile: TenantProfile | null;
  current_rent: CurrentRent | null;
  complaints: ComplaintStats | null;
  recent_complaints: RecentComplaint[];
  message?: string;
}

export type HomepageData =
  | SuperAdminHomepage
  | OrganizationHomepage
  | TenantHomepage;
