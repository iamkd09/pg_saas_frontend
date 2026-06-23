"use client";

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
import { useToast } from "@/contexts/toast-context";
import { getAdminUsers, updateAdminUser } from "@/lib/admin";
import { parseApiError } from "@/lib/api-utils";
import type { UserProfile } from "@/types/account";

export default function AdminUsersPage() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState("");

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await getAdminUsers(
        roleFilter ? { role: roleFilter } : undefined
      );
      setUsers(data);
    } catch (err) {
      setError(parseApiError(err, "Unable to load users."));
    } finally {
      setLoading(false);
    }
  }, [roleFilter]);

  useEffect(() => {
    setLoading(true);
    void load();
  }, [load]);

  async function toggleActive(user: UserProfile) {
    try {
      await updateAdminUser(user.id, { is_active: !user.is_active });
      showToast(user.is_active ? "User deactivated." : "User activated.");
      await load();
    } catch (err) {
      showToast(parseApiError(err, "Unable to update user."), "error");
    }
  }

  if (loading) return <PageLoader label="Loading users..." />;
  if (error) return <PageError message={error} />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Platform admin"
        title="Users"
        description="Manage all platform users across organizations."
        action={
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
          >
            <option value="">All roles</option>
            <option value="OWNER">Owner</option>
            <option value="MANAGER">Manager</option>
            <option value="TENANT">Tenant</option>
          </select>
        }
      />

      {users.length === 0 ? (
        <EmptyState title="No users found" description="Try changing the role filter." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {users.map((user) => (
            <Card key={user.id}>
              <CardHeader className="flex-row items-start justify-between gap-3">
                <div>
                  <CardTitle>
                    {[user.first_name, user.last_name].filter(Boolean).join(" ") ||
                      user.username}
                  </CardTitle>
                  <CardDescription>
                    @{user.username} · {user.organization?.name ?? "No org"}
                  </CardDescription>
                </div>
                <Badge variant={user.is_active ? "success" : "danger"}>
                  {user.is_active ? user.role : "INACTIVE"}
                </Badge>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => void toggleActive(user)}
                >
                  {user.is_active ? "Deactivate" : "Activate"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
