"use client";

import { LogOut, MapPin, Plus, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import {
  EmptyState,
  PageError,
  PageHeader,
  PageLoader,
} from "@/components/dashboard/page-shell";
import { Badge, statusBadgeVariant } from "@/components/ui/badge";
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
import { parseApiError } from "@/lib/api-utils";
import { getProperties, getVacantBeds } from "@/lib/properties";
import {
  assignBed,
  checkoutTenant,
  createTenant,
  getTenants,
} from "@/lib/tenants";
import type { Property } from "@/types/property";
import type { Tenant } from "@/types/tenant";

const initialForm = {
  full_name: "",
  phone_number: "",
  email: "",
  emergency_contact_name: "",
  emergency_contact_number: "",
  joining_date: "",
  monthly_rent: "",
  security_deposit: "0",
  bed: "",
};

export default function TenantsPage() {
  const { showToast } = useToast();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [vacantBeds, setVacantBeds] = useState<{ id: number; label: string }[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [assignOpenFor, setAssignOpenFor] = useState<Tenant | null>(null);
  const [checkoutOpenFor, setCheckoutOpenFor] = useState<Tenant | null>(null);
  const [assignBedId, setAssignBedId] = useState("");
  const [checkoutDate, setCheckoutDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);
  const [propertyFilter, setPropertyFilter] = useState("");

  const load = useCallback(async () => {
    try {
      setError(null);
      const [tenantData, propertyData] = await Promise.all([
        getTenants(),
        getProperties(),
      ]);
      setTenants(tenantData);
      setProperties(propertyData);
    } catch (err) {
      setError(parseApiError(err, "Unable to load tenants."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    async function loadBeds() {
      try {
        const beds = await getVacantBeds(
          propertyFilter ? Number(propertyFilter) : undefined
        );
        setVacantBeds(
          beds.map((bed) => ({
            id: bed.id,
            label: `Bed ${bed.bed_number} (Room #${bed.room})`,
          }))
        );
      } catch {
        setVacantBeds([]);
      }
    }
    if (open || assignOpenFor) void loadBeds();
  }, [propertyFilter, open, assignOpenFor]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      await createTenant({
        full_name: form.full_name,
        phone_number: form.phone_number,
        email: form.email || undefined,
        emergency_contact_name: form.emergency_contact_name,
        emergency_contact_number: form.emergency_contact_number,
        joining_date: form.joining_date,
        monthly_rent: form.monthly_rent,
        security_deposit: form.security_deposit || "0",
        bed: form.bed ? Number(form.bed) : undefined,
      });
      setOpen(false);
      setForm(initialForm);
      showToast("Tenant created successfully.");
      await load();
    } catch (err) {
      setFormError(parseApiError(err, "Unable to create tenant."));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAssignBed(e: React.FormEvent) {
    e.preventDefault();
    if (!assignOpenFor || !assignBedId) return;
    setSubmitting(true);
    setFormError(null);
    try {
      await assignBed(assignOpenFor.id, Number(assignBedId));
      setAssignOpenFor(null);
      setAssignBedId("");
      showToast("Bed assigned successfully.");
      await load();
    } catch (err) {
      setFormError(parseApiError(err, "Unable to assign bed."));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    if (!checkoutOpenFor) return;
    setSubmitting(true);
    setFormError(null);
    try {
      await checkoutTenant(
        checkoutOpenFor.id,
        checkoutDate || undefined
      );
      setCheckoutOpenFor(null);
      setCheckoutDate("");
      showToast("Tenant checked out successfully.");
      await load();
    } catch (err) {
      setFormError(parseApiError(err, "Unable to check out tenant."));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <PageLoader label="Loading tenants..." />;
  if (error) return <PageError message={error} />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="People"
        title="Tenants"
        description="Onboard tenants and assign them to vacant beds."
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus />
            Add tenant
          </Button>
        }
      />

      {tenants.length === 0 ? (
        <EmptyState
          title="No tenants yet"
          description="Add your first tenant and assign a vacant bed."
          action={<Button onClick={() => setOpen(true)}>Add tenant</Button>}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {tenants.map((tenant) => (
            <Card key={tenant.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2">
                    <Users className="size-4 text-primary" />
                    {tenant.full_name}
                  </span>
                  <Badge variant={statusBadgeVariant(tenant.status)}>
                    {tenant.status}
                  </Badge>
                </CardTitle>
                <CardDescription>{tenant.phone_number}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <p>
                  <span className="text-muted-foreground">Rent: </span>₹
                  {tenant.monthly_rent}
                </p>
                <p className="flex items-start gap-2">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  {tenant.bed_location
                    ? `${tenant.bed_location.property_name}, Room ${tenant.bed_location.room_number}, Bed ${tenant.bed_location.bed_number}`
                    : "No bed assigned"}
                </p>
                {tenant.status === "ACTIVE" ? (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {!tenant.bed ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setAssignOpenFor(tenant);
                          setFormError(null);
                        }}
                      >
                        Assign bed
                      </Button>
                    ) : null}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setCheckoutOpenFor(tenant);
                        setFormError(null);
                      }}
                    >
                      <LogOut className="size-3.5" />
                      Checkout
                    </Button>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Add tenant"
        description="Create a tenant profile and optionally assign a vacant bed."
        className="max-w-2xl"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          {formError ? <PageError message={formError} /> : null}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full name</Label>
              <Input
                id="full_name"
                value={form.full_name}
                onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone</Label>
              <Input
                id="phone_number"
                value={form.phone_number}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone_number: e.target.value }))
                }
                required
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="joining_date">Joining date</Label>
              <Input
                id="joining_date"
                type="date"
                value={form.joining_date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, joining_date: e.target.value }))
                }
                required
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="monthly_rent">Monthly rent</Label>
              <Input
                id="monthly_rent"
                value={form.monthly_rent}
                onChange={(e) =>
                  setForm((f) => ({ ...f, monthly_rent: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="security_deposit">Security deposit</Label>
              <Input
                id="security_deposit"
                value={form.security_deposit}
                onChange={(e) =>
                  setForm((f) => ({ ...f, security_deposit: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="emergency_contact_name">Emergency contact name</Label>
              <Input
                id="emergency_contact_name"
                value={form.emergency_contact_name}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    emergency_contact_name: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergency_contact_number">Emergency contact phone</Label>
              <Input
                id="emergency_contact_number"
                value={form.emergency_contact_number}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    emergency_contact_number: e.target.value,
                  }))
                }
                required
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="property_filter">Filter beds by property</Label>
              <select
                id="property_filter"
                value={propertyFilter}
                onChange={(e) => setPropertyFilter(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              >
                <option value="">All properties</option>
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bed">Vacant bed</Label>
              <select
                id="bed"
                value={form.bed}
                onChange={(e) => setForm((f) => ({ ...f, bed: e.target.value }))}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              >
                <option value="">Assign later</option>
                {vacantBeds.map((bed) => (
                  <option key={bed.id} value={bed.id}>
                    {bed.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Creating..." : "Create tenant"}
          </Button>
        </form>
      </Dialog>

      <Dialog
        open={assignOpenFor !== null}
        onOpenChange={(open) => !open && setAssignOpenFor(null)}
        title="Assign bed"
        description={
          assignOpenFor ? `Assign a vacant bed to ${assignOpenFor.full_name}` : undefined
        }
      >
        <form onSubmit={handleAssignBed} className="space-y-4">
          {formError ? <PageError message={formError} /> : null}
          <div className="space-y-2">
            <Label>Vacant bed</Label>
            <select
              value={assignBedId}
              onChange={(e) => setAssignBedId(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              required
            >
              <option value="">Select bed</option>
              {vacantBeds.map((bed) => (
                <option key={bed.id} value={bed.id}>
                  {bed.label}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Assigning..." : "Assign bed"}
          </Button>
        </form>
      </Dialog>

      <Dialog
        open={checkoutOpenFor !== null}
        onOpenChange={(open) => !open && setCheckoutOpenFor(null)}
        title="Check out tenant"
        description={
          checkoutOpenFor
            ? `Mark ${checkoutOpenFor.full_name} as left and vacate their bed.`
            : undefined
        }
      >
        <form onSubmit={handleCheckout} className="space-y-4">
          {formError ? <PageError message={formError} /> : null}
          <div className="space-y-2">
            <Label htmlFor="leaving_date">Leaving date</Label>
            <Input
              id="leaving_date"
              type="date"
              value={checkoutDate}
              onChange={(e) => setCheckoutDate(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Processing..." : "Confirm checkout"}
          </Button>
        </form>
      </Dialog>
    </div>
  );
}
