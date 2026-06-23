"use client";

import Link from "next/link";

import { useDashboard } from "@/contexts/dashboard-context";
import {
  EmptyState,
  PageHeader,
  StatCard,
} from "@/components/dashboard/page-shell";
import { Badge, statusBadgeVariant } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type {
  HomepageData,
  OrganizationHomepage,
  SuperAdminHomepage,
  TenantHomepage,
} from "@/types/homepage";

function getDisplayName(data: HomepageData): string {
  const fullName = [data.user.first_name, data.user.last_name]
    .filter(Boolean)
    .join(" ");
  return fullName || data.user.username;
}

function ManagerDashboard({ data }: { data: OrganizationHomepage | SuperAdminHomepage }) {
  if (!("dashboard" in data) || !data.dashboard) {
    return (
      <EmptyState
        title="No dashboard data"
        description={
          "message" in data && data.message
            ? data.message
            : "Your organization dashboard is not available yet."
        }
      />
    );
  }

  const dashboard = data.dashboard;
  const isSuperAdmin = data.role === "SUPER_ADMIN";

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {isSuperAdmin && "organizations" in dashboard ? (
          <StatCard label="Organizations" value={dashboard.organizations} />
        ) : null}
        <StatCard
          label="Properties"
          value={"properties" in dashboard ? dashboard.properties : 0}
        />
        <StatCard
          label="Occupancy"
          value={`${dashboard.occupancy.occupancy_rate}%`}
          hint={`${dashboard.occupancy.occupied}/${dashboard.occupancy.total_beds} beds occupied`}
        />
        <StatCard label="Active tenants" value={dashboard.tenants.active} />
        <StatCard label="Open complaints" value={dashboard.complaints.open} />
        <StatCard
          label={isSuperAdmin ? "Overdue rents" : "Pending rents"}
          value={isSuperAdmin ? dashboard.rents.overdue : dashboard.rents.pending}
        />
      </div>

      {"recent_complaints" in data && data.recent_complaints?.length ? (
        <Card>
          <CardHeader>
            <CardTitle>Recent complaints</CardTitle>
            <CardDescription>Latest issues reported by tenants</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.recent_complaints.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl border bg-muted/20 px-4 py-3"
              >
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.tenant_name}</p>
                </div>
                <Badge variant={statusBadgeVariant(item.status)}>{item.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {"recent_tenants" in data && data.recent_tenants?.length ? (
        <Card>
          <CardHeader>
            <CardTitle>Recent tenants</CardTitle>
            <CardDescription>Recently added tenant profiles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.recent_tenants.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl border bg-muted/20 px-4 py-3"
              >
                <div>
                  <p className="font-medium">{item.full_name}</p>
                  <p className="text-sm text-muted-foreground">{item.phone_number}</p>
                </div>
                <p className="text-sm font-medium">₹{item.monthly_rent}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

function TenantDashboard({ data }: { data: TenantHomepage }) {
  if (!data.tenant_profile) {
    return (
      <EmptyState
        title="Profile not linked"
        description={data.message ?? "No tenant profile is linked to this account."}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Monthly rent" value={`₹${data.tenant_profile.monthly_rent}`} />
        <StatCard label="Open complaints" value={data.complaints?.open ?? 0} />
        <StatCard
          label="Rent status"
          value={data.current_rent?.status ?? "N/A"}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your stay</CardTitle>
          <CardDescription>Current accommodation details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">Property: </span>
            {data.tenant_profile.location?.property.name ?? "Not assigned"}
          </p>
          <p>
            <span className="text-muted-foreground">Room: </span>
            {data.tenant_profile.location?.room_number ?? "—"}
          </p>
          <p>
            <span className="text-muted-foreground">Bed: </span>
            {data.tenant_profile.location?.bed_number ?? "—"}
          </p>
        </CardContent>
      </Card>

      {data.recent_complaints.length ? (
        <Card>
          <CardHeader>
            <CardTitle>Recent complaints</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.recent_complaints.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl border px-4 py-3"
              >
                <p className="font-medium">{item.title}</p>
                <Badge variant={statusBadgeVariant(item.status)}>{item.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

export default function DashboardPage() {
  const { homepage } = useDashboard();

  if (!homepage) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Overview"
        title={`Welcome back, ${getDisplayName(homepage)}`}
        description="Your live snapshot from the PG management platform."
        action={
          homepage.role !== "TENANT" ? (
            <Link
              href="/dashboard/properties"
              className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-md shadow-primary/20 transition hover:bg-primary/90"
            >
              Manage properties
            </Link>
          ) : (
            <Link
              href="/dashboard/my-complaints"
              className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-md shadow-primary/20 transition hover:bg-primary/90"
            >
              Raise complaint
            </Link>
          )
        }
      />

      {homepage.role === "TENANT" ? (
        <TenantDashboard data={homepage as TenantHomepage} />
      ) : (
        <ManagerDashboard
          data={homepage as OrganizationHomepage | SuperAdminHomepage}
        />
      )}
    </div>
  );
}
