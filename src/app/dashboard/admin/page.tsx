"use client";

import { useEffect, useState } from "react";

import {
  PageError,
  PageHeader,
  PageLoader,
  StatCard,
} from "@/components/dashboard/page-shell";
import { parseApiError } from "@/lib/api-utils";
import { getAdminDashboard } from "@/lib/admin";
import type { AdminDashboard } from "@/types/admin";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAdminDashboard();
        setStats(data);
      } catch (err) {
        setError(parseApiError(err, "Unable to load platform dashboard."));
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  if (loading) return <PageLoader label="Loading platform data..." />;
  if (error) return <PageError message={error} />;
  if (!stats) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Platform admin"
        title="Platform overview"
        description="Monitor organizations, users, and occupancy across the entire platform."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Organizations" value={stats.organizations} />
        <StatCard label="Total users" value={stats.users} />
        <StatCard label="Owners" value={stats.owners} />
        <StatCard label="Managers" value={stats.managers} />
        <StatCard label="Active tenants" value={stats.tenants} />
        <StatCard label="Properties" value={stats.properties} />
        <StatCard label="Total beds" value={stats.beds} />
        <StatCard label="Vacant beds" value={stats.vacant_beds} />
        <StatCard label="Occupied beds" value={stats.occupied_beds} />
      </div>
    </div>
  );
}
