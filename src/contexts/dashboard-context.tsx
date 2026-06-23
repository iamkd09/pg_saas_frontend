"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { isAuthenticated } from "@/lib/auth";
import { getHomepage } from "@/lib/homepage";
import type { HomepageData } from "@/types/homepage";

interface DashboardContextValue {
  homepage: HomepageData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  isManager: boolean;
  isOwner: boolean;
  isTenant: boolean;
  isSuperAdmin: boolean;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [homepage, setHomepage] = useState<HomepageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const data = await getHomepage();
    setHomepage(data);
    setError(null);
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    async function load() {
      try {
        await refresh();
      } catch {
        setError("Unable to load your account data.");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [router, refresh]);

  const role = homepage?.role ?? "";
  const isSuperAdmin = role === "SUPER_ADMIN";
  const isOwner = role === "OWNER";
  const isManager =
    role === "OWNER" || role === "MANAGER" || isSuperAdmin;
  const isTenant = role === "TENANT";

  return (
    <DashboardContext.Provider
      value={{
        homepage,
        loading,
        error,
        refresh,
        isManager,
        isOwner,
        isTenant,
        isSuperAdmin,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return context;
}
