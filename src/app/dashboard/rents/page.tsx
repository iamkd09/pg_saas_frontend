"use client";

import { CalendarPlus, IndianRupee } from "lucide-react";
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
import { parseApiError } from "@/lib/api-utils";
import {
  generateMonthlyRents,
  getRents,
  recordPayment,
} from "@/lib/rents";
import type { Rent } from "@/types/rent";

function firstDayOfMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
}

export default function RentsPage() {
  const [rents, setRents] = useState<Rent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [paymentOpenFor, setPaymentOpenFor] = useState<Rent | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [generateForm, setGenerateForm] = useState({
    rent_month: firstDayOfMonth(),
    due_date: "",
  });
  const [paymentForm, setPaymentForm] = useState({
    amount_paid: "",
    paid_date: "",
    remarks: "",
  });

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await getRents();
      setRents(data);
    } catch (err) {
      setError(parseApiError(err, "Unable to load rents."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      await generateMonthlyRents(generateForm);
      setGenerateOpen(false);
      await load();
    } catch (err) {
      setFormError(parseApiError(err, "Unable to generate monthly rents."));
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePayment(e: React.FormEvent) {
    e.preventDefault();
    if (!paymentOpenFor) return;
    setSubmitting(true);
    setFormError(null);
    try {
      await recordPayment(paymentOpenFor.id, {
        amount_paid: paymentForm.amount_paid,
        paid_date: paymentForm.paid_date || undefined,
        remarks: paymentForm.remarks || undefined,
      });
      setPaymentOpenFor(null);
      setPaymentForm({ amount_paid: "", paid_date: "", remarks: "" });
      await load();
    } catch (err) {
      setFormError(parseApiError(err, "Unable to record payment."));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <PageLoader label="Loading rents..." />;
  if (error) return <PageError message={error} />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Finance"
        title="Rents"
        description="Generate monthly rent records and record tenant payments."
        action={
          <Button onClick={() => setGenerateOpen(true)}>
            <CalendarPlus />
            Generate monthly
          </Button>
        }
      />

      {rents.length === 0 ? (
        <EmptyState
          title="No rent records"
          description="Generate monthly rent entries for all active tenants."
          action={
            <Button onClick={() => setGenerateOpen(true)}>
              Generate monthly rents
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4">
          {rents.map((rent) => (
            <Card key={rent.id}>
              <CardHeader className="flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle>{rent.tenant_name}</CardTitle>
                  <CardDescription>
                    {rent.property_name ?? "No property"} · {rent.rent_month}
                  </CardDescription>
                </div>
                <Badge variant={statusBadgeVariant(rent.status)}>
                  {rent.status}
                </Badge>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="grid gap-1 text-sm">
                  <p>
                    <span className="text-muted-foreground">Amount: </span>₹
                    {rent.amount}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Paid: </span>₹
                    {rent.amount_paid}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Due date: </span>
                    {rent.due_date}
                  </p>
                </div>
                {rent.status !== "PAID" ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPaymentOpenFor(rent);
                      setPaymentForm({
                        amount_paid: rent.amount,
                        paid_date: "",
                        remarks: "",
                      });
                      setFormError(null);
                    }}
                  >
                    <IndianRupee />
                    Record payment
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={generateOpen}
        onOpenChange={setGenerateOpen}
        title="Generate monthly rents"
        description="Create rent records for all active tenants for a month."
      >
        <form onSubmit={handleGenerate} className="space-y-4">
          {formError ? <PageError message={formError} /> : null}
          <div className="space-y-2">
            <Label htmlFor="rent_month">Rent month</Label>
            <Input
              id="rent_month"
              type="date"
              value={generateForm.rent_month}
              onChange={(e) =>
                setGenerateForm((f) => ({ ...f, rent_month: e.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="due_date">Due date</Label>
            <Input
              id="due_date"
              type="date"
              value={generateForm.due_date}
              onChange={(e) =>
                setGenerateForm((f) => ({ ...f, due_date: e.target.value }))
              }
              required
            />
          </div>
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Generating..." : "Generate rents"}
          </Button>
        </form>
      </Dialog>

      <Dialog
        open={paymentOpenFor !== null}
        onOpenChange={(open) => !open && setPaymentOpenFor(null)}
        title="Record payment"
        description={
          paymentOpenFor
            ? `Payment for ${paymentOpenFor.tenant_name}`
            : undefined
        }
      >
        <form onSubmit={handlePayment} className="space-y-4">
          {formError ? <PageError message={formError} /> : null}
          <div className="space-y-2">
            <Label htmlFor="amount_paid">Amount paid</Label>
            <Input
              id="amount_paid"
              value={paymentForm.amount_paid}
              onChange={(e) =>
                setPaymentForm((f) => ({ ...f, amount_paid: e.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="paid_date">Paid date</Label>
            <Input
              id="paid_date"
              type="date"
              value={paymentForm.paid_date}
              onChange={(e) =>
                setPaymentForm((f) => ({ ...f, paid_date: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Input
              id="remarks"
              value={paymentForm.remarks}
              onChange={(e) =>
                setPaymentForm((f) => ({ ...f, remarks: e.target.value }))
              }
            />
          </div>
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Saving..." : "Record payment"}
          </Button>
        </form>
      </Dialog>
    </div>
  );
}
