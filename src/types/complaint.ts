import type { ComplaintStatus } from "@/types/api";

export interface Complaint {
  id: number;
  tenant: number;
  tenant_name: string;
  title: string;
  description: string;
  status: ComplaintStatus;
  created_at: string;
}

export interface CreateComplaintPayload {
  title: string;
  description: string;
  tenant?: number;
  status?: ComplaintStatus;
}
