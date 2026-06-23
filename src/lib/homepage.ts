import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/config";
import type { HomepageData } from "@/types/homepage";

export async function getHomepage(): Promise<HomepageData> {
  const { data } = await apiClient.get<HomepageData>(API_ENDPOINTS.homepage);
  return data;
}
