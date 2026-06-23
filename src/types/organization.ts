export interface Organization {
  id: number;
  name: string;
  created_at: string;
}

export interface OrganizationStats {
  organization: { id: number; name: string };
  properties: number;
  occupancy: {
    total_beds: number;
    occupied: number;
    vacant: number;
    occupancy_rate: number;
  };
  tenants: { active: number; left: number };
  complaints: {
    open: number;
    in_progress: number;
    resolved: number;
    total: number;
  };
  rents: {
    pending: number;
    overdue: number;
    paid: number;
    partial: number;
    paid_this_month: number;
  };
  current_month: {
    rent_month: string;
    total_due: string | number;
    total_collected: string | number;
    pending_count: number;
    overdue_count: number;
  };
  staff: {
    owners: number;
    managers: number;
    tenant_accounts: number;
  };
}
