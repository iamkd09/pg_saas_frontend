"use client";

import { UserCircle } from "lucide-react";
import { useEffect, useState } from "react";

import {
  EmptyState,
  PageError,
  PageHeader,
  PageLoader,
} from "@/components/dashboard/page-shell";
import { Badge, statusBadgeVariant } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { parseApiError } from "@/lib/api-utils";
import { getMyTenantProfile } from "@/lib/tenants";
import type { Tenant } from "@/types/tenant";

export default function TenantProfilePage() {
  const [profile, setProfile] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getMyTenantProfile();
        setProfile(data);
      } catch (err) {
        setError(parseApiError(err, "Unable to load your profile."));
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  if (loading) return <PageLoader label="Loading profile..." />;
  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="My Profile" description="Your tenant account details." />
        <EmptyState title="Profile unavailable" description={error} />
      </div>
    );
  }
  if (!profile) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Account"
        title="My Profile"
        description="Your tenant profile and stay information."
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCircle className="size-5 text-primary" />
            {profile.full_name}
          </CardTitle>
          <CardDescription>{profile.phone_number}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-3 text-sm">
            <p>
              <span className="text-muted-foreground">Email: </span>
              {profile.email ?? "—"}
            </p>
            <p>
              <span className="text-muted-foreground">Status: </span>
              <Badge variant={statusBadgeVariant(profile.status)}>
                {profile.status}
              </Badge>
            </p>
            <p>
              <span className="text-muted-foreground">Monthly rent: </span>₹
              {profile.monthly_rent}
            </p>
            <p>
              <span className="text-muted-foreground">Security deposit: </span>₹
              {profile.security_deposit}
            </p>
          </div>
          <div className="space-y-3 text-sm">
            <p>
              <span className="text-muted-foreground">Joining date: </span>
              {profile.joining_date}
            </p>
            <p>
              <span className="text-muted-foreground">Emergency contact: </span>
              {profile.emergency_contact_name} ({profile.emergency_contact_number})
            </p>
            <p>
              <span className="text-muted-foreground">Property: </span>
              {profile.bed_location?.property_name ?? "Not assigned"}
            </p>
            <p>
              <span className="text-muted-foreground">Room / Bed: </span>
              {profile.bed_location
                ? `Room ${profile.bed_location.room_number}, Bed ${profile.bed_location.bed_number}`
                : "—"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
