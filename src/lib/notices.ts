import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/config";
import { unwrapResults } from "@/lib/api-utils";
import type { PaginatedResponse } from "@/types/api";
import type {
  CreateNoticePayload,
  Notice,
  UpdateNoticePayload,
} from "@/types/notice";

export async function getNotices(): Promise<Notice[]> {
  const { data } = await apiClient.get<PaginatedResponse<Notice>>(
    API_ENDPOINTS.notices
  );
  return unwrapResults(data);
}

export async function createNotice(
  payload: CreateNoticePayload
): Promise<Notice> {
  const { data } = await apiClient.post<Notice>(
    API_ENDPOINTS.notices,
    payload
  );
  return data;
}

export async function updateNotice(
  id: number,
  payload: UpdateNoticePayload
): Promise<Notice> {
  const { data } = await apiClient.patch<Notice>(
    API_ENDPOINTS.noticeDetail(id),
    payload
  );
  return data;
}

export async function deleteNotice(id: number): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.noticeDetail(id));
}
