export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export type RentStatus = "PENDING" | "PAID" | "PARTIAL" | "OVERDUE";
export type ComplaintStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED";
export type BedStatus = "VACANT" | "OCCUPIED";
export type TenantStatus = "ACTIVE" | "LEFT";
