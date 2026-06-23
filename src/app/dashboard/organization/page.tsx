"use client";

import { useCallback, useEffect, useState } from "react";

import {
  PageError,
  PageHeader,
  PageLoader,
  StatCard,
} from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDashboard } from "@/contexts/dashboard-context";
import { useToast } from "@/contexts/toast-context";
import { parseApiError } from "@/lib/api-utils";
import {
  getOrganization,
  getOrganizationStats,
  updateOrganization,
} from "@/lib/organization";
import type { Organization, OrganizationStats } from "@/types/organization";

export default function OrganizationPage() {
  const { isOwner, refresh } = useDashboard();
  const { showToast } = useToast();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [stats, setStats] = useState<OrganizationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");

  const load = useCallback(async () => {
    try {
      setError(null);
      const [org, orgStats] = await Promise.all([
        getOrganization(),
        getOrganizationStats(),
      ]);
      setOrganization(org);
      setStats(orgStats);
      setName(org.name);
    } catch (err) {
      setError(parseApiError(err, "Unable to load organization."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!isOwner) return;
    setSaving(true);
    try {
      const updated = await updateOrganization({ name });
      setOrganization(updated);
      await refresh();
      showToast("Organization updated.");
    } catch (err) {
      showToast(parseApiError(err, "Unable to update organization."), "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <PageLoader label="Loading organization..." />;
  if (error) return <PageError message={error} />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Organization"
        title={organization?.name ?? "Your organization"}
        description="Detailed analytics and organization settings."
      />

      {stats ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Properties" value={stats.properties} />
          <StatCard
            label="Occupancy"
            value={`${stats.occupancy.occupancy_rate}%`}
            hint={`${stats.occupancy.occupied}/${stats.occupancy.total_beds} beds`}
          />
          <StatCard label="Active tenants" value={stats.tenants.active} />
          <StatCard label="Open complaints" value={stats.complaints.open} />
          <StatCard
            label="Rent due (this month)"
            value={`₹${stats.current_month.total_due}`}
          />
          <StatCard
            label="Collected (this month)"
            value={`₹${stats.current_month.total_collected}`}
          />
          <StatCard label="Pending rents" value={stats.current_month.pending_count} />
          <StatCard label="Overdue rents" value={stats.current_month.overdue_count} />
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        {isOwner ? (
          <Card>
            <CardHeader>
              <CardTitle>Organization settings</CardTitle>
              <CardDescription>Update your PG business name.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="org_name">Organization name</Label>
                  <Input
                    id="org_name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : null}

        {stats ? (
          <Card>
            <CardHeader>
              <CardTitle>Staff overview</CardTitle>
              <CardDescription>Accounts in your organization</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm sm:grid-cols-3">
              <div className="rounded-xl bg-muted/30 p-4 text-center">
                <p className="text-2xl font-semibold">{stats.staff.owners}</p>
                <p className="text-muted-foreground">Owners</p>
              </div>
              <div className="rounded-xl bg-muted/30 p-4 text-center">
                <p className="text-2xl font-semibold">{stats.staff.managers}</p>
                <p className="text-muted-foreground">Managers</p>
              </div>
              <div className="rounded-xl bg-muted/30 p-4 text-center">
                <p className="text-2xl font-semibold">{stats.staff.tenant_accounts}</p>
                <p className="text-muted-foreground">Tenant logins</p>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
