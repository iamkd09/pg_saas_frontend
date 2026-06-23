import type { RentStatus } from "@/types/api";

export interface Rent {
  id: number;
  tenant: number;
  tenant_name: string;
  property_name: string | null;
  rent_month: string;
  amount: string;
  due_date: string;
  paid_date: string | null;
  late_fee: string;
  amount_paid: string;
  status: RentStatus;
  remarks: string | null;
  created_at: string;
}

export interface GenerateMonthlyRentPayload {
  rent_month: string;
  due_date: string;
}

export interface GenerateMonthlyRentResponse {
  created_count: number;
  skipped_tenant_ids: number[];
  rents: Rent[];
}

export interface RecordPaymentPayload {
  amount_paid: string;
  paid_date?: string;
  remarks?: string;
}
