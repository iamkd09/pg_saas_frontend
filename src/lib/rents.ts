import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/config";
import { unwrapResults } from "@/lib/api-utils";
import type { PaginatedResponse } from "@/types/api";
import type {
  GenerateMonthlyRentPayload,
  GenerateMonthlyRentResponse,
  RecordPaymentPayload,
  Rent,
} from "@/types/rent";

export async function getRents(params?: {
  status?: string;
}): Promise<Rent[]> {
  const { data } = await apiClient.get<PaginatedResponse<Rent>>(
    API_ENDPOINTS.rents,
    { params }
  );
  return unwrapResults(data);
}

export async function getMyRents(): Promise<Rent[]> {
  const { data } = await apiClient.get<PaginatedResponse<Rent>>(
    API_ENDPOINTS.rentsMine
  );
  return unwrapResults(data);
}

export async function generateMonthlyRents(
  payload: GenerateMonthlyRentPayload
): Promise<GenerateMonthlyRentResponse> {
  const { data } = await apiClient.post<GenerateMonthlyRentResponse>(
    API_ENDPOINTS.generateMonthlyRents,
    payload
  );
  return data;
}

export async function recordPayment(
  rentId: number,
  payload: RecordPaymentPayload
): Promise<Rent> {
  const { data } = await apiClient.post<Rent>(
    API_ENDPOINTS.recordPayment(rentId),
    payload
  );
  return data;
}
