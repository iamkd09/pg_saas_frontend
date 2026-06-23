"use client";

import { Building2, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import {
  EmptyState,
  PageError,
  PageHeader,
  PageLoader,
} from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/contexts/toast-context";
import {
  createAdminOrganization,
  getAdminOrganizations,
} from "@/lib/admin";
import { parseApiError } from "@/lib/api-utils";
import type { AdminOrganization } from "@/types/admin";

export default function AdminOrganizationsPage() {
  const { showToast } = useToast();
  const [organizations, setOrganizations] = useState<AdminOrganization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await getAdminOrganizations();
      setOrganizations(data);
    } catch (err) {
      setError(parseApiError(err, "Unable to load organizations."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createAdminOrganization(name);
      setOpen(false);
      setName("");
      showToast("Organization created.");
      await load();
    } catch (err) {
      showToast(parseApiError(err, "Unable to create organization."), "error");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <PageLoader label="Loading organizations..." />;
  if (error) return <PageError message={error} />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Platform admin"
        title="Organizations"
        description="All PG organizations registered on the platform."
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus />
            Add organization
          </Button>
        }
      />

      {organizations.length === 0 ? (
        <EmptyState
          title="No organizations"
          description="Create the first organization on the platform."
          action={<Button onClick={() => setOpen(true)}>Add organization</Button>}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {organizations.map((org) => (
            <Card key={org.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="size-4 text-primary" />
                  {org.name}
                </CardTitle>
                <CardDescription>
                  Created {new Date(org.created_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="rounded-xl bg-muted/30 p-3">
                  <p className="font-semibold">{org.owner_count}</p>
                  <p className="text-xs text-muted-foreground">Owners</p>
                </div>
                <div className="rounded-xl bg-muted/30 p-3">
                  <p className="font-semibold">{org.property_count}</p>
                  <p className="text-xs text-muted-foreground">Properties</p>
                </div>
                <div className="rounded-xl bg-muted/30 p-3">
                  <p className="font-semibold">{org.tenant_count}</p>
                  <p className="text-xs text-muted-foreground">Tenants</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Create organization"
        description="Add a new PG organization to the platform."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="org_name">Organization name</Label>
            <Input
              id="org_name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Creating..." : "Create organization"}
          </Button>
        </form>
      </Dialog>
    </div>
  );
}
