import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/config";
import { unwrapResults } from "@/lib/api-utils";
import type { PaginatedResponse } from "@/types/api";
import type { Complaint, CreateComplaintPayload } from "@/types/complaint";

export async function getComplaints(params?: {
  status?: string;
}): Promise<Complaint[]> {
  const { data } = await apiClient.get<PaginatedResponse<Complaint>>(
    API_ENDPOINTS.complaints,
    { params }
  );
  return unwrapResults(data);
}

export async function getMyComplaints(): Promise<Complaint[]> {
  const { data } = await apiClient.get<PaginatedResponse<Complaint>>(
    API_ENDPOINTS.complaintsMine
  );
  return unwrapResults(data);
}

export async function createComplaint(
  payload: CreateComplaintPayload
): Promise<Complaint> {
  const { data } = await apiClient.post<Complaint>(
    API_ENDPOINTS.complaints,
    payload
  );
  return data;
}

export async function updateComplaint(
  id: number,
  payload: Partial<CreateComplaintPayload>
): Promise<Complaint> {
  const { data } = await apiClient.patch<Complaint>(
    API_ENDPOINTS.complaintDetail(id),
    payload
  );
  return data;
}
