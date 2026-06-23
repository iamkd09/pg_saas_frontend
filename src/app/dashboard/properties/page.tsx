"use client";

import { motion } from "framer-motion";
import { BedDouble, Building2, DoorOpen, Plus } from "lucide-react";
import Link from "next/link";
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
import { parseApiError } from "@/lib/api-utils";
import { createProperty, getProperties } from "@/lib/properties";
import type { Property } from "@/types/property";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    address: "",
    total_floors: "1",
  });

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await getProperties();
      setProperties(data);
    } catch (err) {
      setError(parseApiError(err, "Unable to load properties."));
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
    setFormError(null);
    try {
      await createProperty({
        name: form.name,
        address: form.address,
        total_floors: Number(form.total_floors) || 1,
      });
      setOpen(false);
      setForm({ name: "", address: "", total_floors: "1" });
      await load();
    } catch (err) {
      setFormError(parseApiError(err, "Unable to create property."));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <PageLoader label="Loading properties..." />;
  if (error) return <PageError message={error} />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Operations"
        title="Properties"
        description="Manage your PG buildings, rooms, and beds from one place."
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus />
            Add property
          </Button>
        }
      />

      {properties.length === 0 ? (
        <EmptyState
          title="No properties yet"
          description="Create your first property to start adding rooms and beds."
          action={<Button onClick={() => setOpen(true)}>Add property</Button>}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full transition-shadow hover:shadow-lg hover:shadow-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="size-4 text-primary" />
                    {property.name}
                  </CardTitle>
                  <CardDescription>{property.address}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div className="rounded-xl bg-muted/40 p-3">
                      <DoorOpen className="mx-auto mb-1 size-4 text-muted-foreground" />
                      <p className="font-semibold">{property.room_count}</p>
                      <p className="text-xs text-muted-foreground">Rooms</p>
                    </div>
                    <div className="rounded-xl bg-muted/40 p-3">
                      <BedDouble className="mx-auto mb-1 size-4 text-muted-foreground" />
                      <p className="font-semibold">{property.total_beds}</p>
                      <p className="text-xs text-muted-foreground">Beds</p>
                    </div>
                    <div className="rounded-xl bg-muted/40 p-3">
                      <p className="font-semibold text-emerald-600">
                        {property.vacant_beds}
                      </p>
                      <p className="text-xs text-muted-foreground">Vacant</p>
                    </div>
                  </div>
                  <Link
                    href={`/dashboard/properties/${property.id}`}
                    className="inline-flex h-8 w-full items-center justify-center rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/80"
                  >
                    Manage rooms & beds
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Add property"
        description="Create a new PG property under your organization."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          {formError ? <PageError message={formError} /> : null}
          <div className="space-y-2">
            <Label htmlFor="name">Property name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="floors">Total floors</Label>
            <Input
              id="floors"
              type="number"
              min={1}
              value={form.total_floors}
              onChange={(e) =>
                setForm((f) => ({ ...f, total_floors: e.target.value }))
              }
            />
          </div>
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Creating..." : "Create property"}
          </Button>
        </form>
      </Dialog>
    </div>
  );
}
