import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/config";
import { unwrapResults } from "@/lib/api-utils";
import type { PaginatedResponse } from "@/types/api";
import type {
  Bed,
  CreateBedPayload,
  CreatePropertyPayload,
  CreateRoomPayload,
  Property,
  Room,
} from "@/types/property";

export async function getProperties(): Promise<Property[]> {
  const { data } = await apiClient.get<PaginatedResponse<Property>>(
    API_ENDPOINTS.properties
  );
  return unwrapResults(data);
}

export async function createProperty(
  payload: CreatePropertyPayload
): Promise<Property> {
  const { data } = await apiClient.post<Property>(
    API_ENDPOINTS.properties,
    payload
  );
  return data;
}

export async function updateProperty(
  id: number,
  payload: Partial<CreatePropertyPayload>
): Promise<Property> {
  const { data } = await apiClient.patch<Property>(
    API_ENDPOINTS.propertyDetail(id),
    payload
  );
  return data;
}

export async function getPropertyRooms(propertyId: number): Promise<Room[]> {
  const { data } = await apiClient.get<PaginatedResponse<Room> | Room[]>(
    API_ENDPOINTS.propertyRooms(propertyId)
  );
  return unwrapResults(data);
}

export async function createRoom(
  propertyId: number,
  payload: CreateRoomPayload
): Promise<Room> {
  const { data } = await apiClient.post<Room>(
    API_ENDPOINTS.propertyRooms(propertyId),
    payload
  );
  return data;
}

export async function createBed(
  roomId: number,
  payload: CreateBedPayload
): Promise<Bed> {
  const { data } = await apiClient.post<Bed>(
    API_ENDPOINTS.roomBeds(roomId),
    payload
  );
  return data;
}

export async function getVacantBeds(propertyId?: number): Promise<Bed[]> {
  const { data } = await apiClient.get<PaginatedResponse<Bed>>(
    API_ENDPOINTS.vacantBeds,
    { params: propertyId ? { property: propertyId } : undefined }
  );
  return unwrapResults(data);
}
