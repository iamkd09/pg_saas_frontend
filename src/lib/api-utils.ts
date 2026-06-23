import axios from "axios";

import type { PaginatedResponse } from "@/types/api";

export function parseApiError(error: unknown, fallback = "Something went wrong."): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as Record<string, unknown> | undefined;
    if (typeof data?.detail === "string") return data.detail;
    if (typeof data?.message === "string") return data.message;
    if (data && typeof data === "object") {
      const firstKey = Object.keys(data)[0];
      const value = data[firstKey];
      if (Array.isArray(value) && typeof value[0] === "string") {
        return value[0];
      }
      if (typeof value === "string") return value;
    }
    if (!error.response) {
      return "Unable to reach the server. Check your connection.";
    }
  }
  return fallback;
}

export function unwrapResults<T>(data: PaginatedResponse<T> | T[]): T[] {
  return Array.isArray(data) ? data : data.results;
}
