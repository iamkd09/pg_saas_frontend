import { TOKEN_KEYS } from "@/lib/config";

type StorageType = "local" | "session";

function getStorage(type: StorageType): Storage | null {
  if (typeof window === "undefined") return null;
  return type === "local" ? window.localStorage : window.sessionStorage;
}

export function saveTokens(
  access: string,
  refresh: string,
  rememberMe: boolean
): void {
  const storage = getStorage(rememberMe ? "local" : "session");
  const otherStorage = getStorage(rememberMe ? "session" : "local");

  otherStorage?.removeItem(TOKEN_KEYS.access);
  otherStorage?.removeItem(TOKEN_KEYS.refresh);

  storage?.setItem(TOKEN_KEYS.access, access);
  storage?.setItem(TOKEN_KEYS.refresh, refresh);
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return (
    window.localStorage.getItem(TOKEN_KEYS.access) ??
    window.sessionStorage.getItem(TOKEN_KEYS.access)
  );
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return (
    window.localStorage.getItem(TOKEN_KEYS.refresh) ??
    window.sessionStorage.getItem(TOKEN_KEYS.refresh)
  );
}

export function usesPersistentStorage(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(TOKEN_KEYS.refresh) !== null;
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

export function clearTokens(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEYS.access);
  window.localStorage.removeItem(TOKEN_KEYS.refresh);
  window.sessionStorage.removeItem(TOKEN_KEYS.access);
  window.sessionStorage.removeItem(TOKEN_KEYS.refresh);
}
