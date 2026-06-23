"use client";

import { AppShell } from "@/components/dashboard/app-shell";
import { PageLoader } from "@/components/dashboard/page-shell";
import { DashboardProvider, useDashboard } from "@/contexts/dashboard-context";
import { ToastProvider } from "@/contexts/toast-context";

function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  const { loading, error } = useDashboard();

  if (loading) {
    return <PageLoader label="Preparing your workspace..." />;
  }

  if (error) {
    return (
      <div className="flex min-h-svh items-center justify-center p-6">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <DashboardProvider>
        <DashboardLayoutInner>{children}</DashboardLayoutInner>
      </DashboardProvider>
    </ToastProvider>
  );
}
