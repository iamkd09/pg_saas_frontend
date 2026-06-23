"use client";

import { Plus, UserPlus, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import {
  EmptyState,
  PageError,
  PageHeader,
  PageLoader,
} from "@/components/dashboard/page-shell";
import { Badge } from "@/components/ui/badge";
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
import { useDashboard } from "@/contexts/dashboard-context";
import { useToast } from "@/contexts/toast-context";
import {
  createManager,
  createTenantAccount,
  getUsers,
  updateStaffUser,
} from "@/lib/accounts";
import { parseApiError } from "@/lib/api-utils";
import { getTenants } from "@/lib/tenants";
import type { UserProfile } from "@/types/account";
import type { Tenant } from "@/types/tenant";

export default function TeamPage() {
  const { isOwner } = useDashboard();
  const { showToast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [managerOpen, setManagerOpen] = useState(false);
  const [tenantAccountOpen, setTenantAccountOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [managerForm, setManagerForm] = useState({
    username: "",
    email: "",
    password: "",
    phone_number: "",
    first_name: "",
    last_name: "",
  });
  const [tenantAccountForm, setTenantAccountForm] = useState({
    tenant_id: "",
    username: "",
    email: "",
    password: "",
  });

  const load = useCallback(async () => {
    try {
      setError(null);
      const [userData, tenantData] = await Promise.all([
        getUsers(),
        getTenants(),
      ]);
      setUsers(userData);
      setTenants(tenantData.filter((t) => !t.user && t.status === "ACTIVE"));
    } catch (err) {
      setError(parseApiError(err, "Unable to load team."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleCreateManager(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      await createManager(managerForm);
      setManagerOpen(false);
      setManagerForm({
        username: "",
        email: "",
        password: "",
        phone_number: "",
        first_name: "",
        last_name: "",
      });
      showToast("Manager account created.");
      await load();
    } catch (err) {
      setFormError(parseApiError(err, "Unable to create manager."));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCreateTenantAccount(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      await createTenantAccount({
        tenant_id: Number(tenantAccountForm.tenant_id),
        username: tenantAccountForm.username,
        email: tenantAccountForm.email,
        password: tenantAccountForm.password,
      });
      setTenantAccountOpen(false);
      setTenantAccountForm({ tenant_id: "", username: "", email: "", password: "" });
      showToast("Tenant login account created.");
      await load();
    } catch (err) {
      setFormError(parseApiError(err, "Unable to create tenant account."));
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleUserActive(user: UserProfile) {
    try {
      await updateStaffUser(user.id, { is_active: !user.is_active });
      showToast(user.is_active ? "User deactivated." : "User activated.");
      await load();
    } catch (err) {
      showToast(parseApiError(err, "Unable to update user."), "error");
    }
  }

  if (loading) return <PageLoader label="Loading team..." />;
  if (error) return <PageError message={error} />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="People"
        title="Team"
        description="Manage managers and tenant login accounts in your organization."
        action={
          <div className="flex flex-wrap gap-2">
            {isOwner ? (
              <Button onClick={() => setManagerOpen(true)}>
                <Plus />
                Add manager
              </Button>
            ) : null}
            <Button variant="outline" onClick={() => setTenantAccountOpen(true)}>
              <UserPlus />
              Tenant login
            </Button>
          </div>
        }
      />

      {users.length === 0 ? (
        <EmptyState
          title="No team members"
          description="Create manager accounts or tenant logins to collaborate."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {users.map((user) => (
            <Card key={user.id}>
              <CardHeader className="flex-row items-start justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="size-4 text-primary" />
                    {[user.first_name, user.last_name].filter(Boolean).join(" ") ||
                      user.username}
                  </CardTitle>
                  <CardDescription>
                    @{user.username} · {user.email}
                  </CardDescription>
                </div>
                <Badge variant={user.is_active ? "success" : "danger"}>
                  {user.is_active ? user.role : "INACTIVE"}
                </Badge>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">{user.phone_number}</p>
                {user.role !== "OWNER" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => void toggleUserActive(user)}
                  >
                    {user.is_active ? "Deactivate" : "Activate"}
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={managerOpen}
        onOpenChange={setManagerOpen}
        title="Add manager"
        description="Create a manager who can manage properties, tenants, and rents."
      >
        <form onSubmit={handleCreateManager} className="space-y-4">
          {formError ? <PageError message={formError} /> : null}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Username</Label>
              <Input
                value={managerForm.username}
                onChange={(e) =>
                  setManagerForm((f) => ({ ...f, username: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={managerForm.phone_number}
                onChange={(e) =>
                  setManagerForm((f) => ({ ...f, phone_number: e.target.value }))
                }
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={managerForm.email}
              onChange={(e) =>
                setManagerForm((f) => ({ ...f, email: e.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              value={managerForm.password}
              onChange={(e) =>
                setManagerForm((f) => ({ ...f, password: e.target.value }))
              }
              required
            />
          </div>
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Creating..." : "Create manager"}
          </Button>
        </form>
      </Dialog>

      <Dialog
        open={tenantAccountOpen}
        onOpenChange={setTenantAccountOpen}
        title="Create tenant login"
        description="Link a login account to an existing tenant profile."
      >
        <form onSubmit={handleCreateTenantAccount} className="space-y-4">
          {formError ? <PageError message={formError} /> : null}
          <div className="space-y-2">
            <Label>Tenant</Label>
            <select
              value={tenantAccountForm.tenant_id}
              onChange={(e) =>
                setTenantAccountForm((f) => ({ ...f, tenant_id: e.target.value }))
              }
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              required
            >
              <option value="">Select tenant</option>
              {tenants.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.full_name} ({tenant.phone_number})
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Username</Label>
            <Input
              value={tenantAccountForm.username}
              onChange={(e) =>
                setTenantAccountForm((f) => ({ ...f, username: e.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={tenantAccountForm.email}
              onChange={(e) =>
                setTenantAccountForm((f) => ({ ...f, email: e.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              value={tenantAccountForm.password}
              onChange={(e) =>
                setTenantAccountForm((f) => ({ ...f, password: e.target.value }))
              }
              required
            />
          </div>
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Creating..." : "Create tenant login"}
          </Button>
        </form>
      </Dialog>
    </div>
  );
}
