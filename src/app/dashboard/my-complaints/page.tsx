"use client";

import { MessageSquarePlus, MessageSquareWarning } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { createComplaint, getMyComplaints } from "@/lib/complaints";
import { parseApiError } from "@/lib/api-utils";
import type { Complaint } from "@/types/complaint";

export default function MyComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "" });

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await getMyComplaints();
      setComplaints(data);
    } catch (err) {
      setError(parseApiError(err, "Unable to load your complaints."));
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
      await createComplaint(form);
      setOpen(false);
      setForm({ title: "", description: "" });
      await load();
    } catch (err) {
      setFormError(parseApiError(err, "Unable to submit complaint."));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <PageLoader label="Loading complaints..." />;
  if (error) return <PageError message={error} />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Support"
        title="My Complaints"
        description="Raise maintenance issues and track their resolution."
        action={
          <Button onClick={() => setOpen(true)}>
            <MessageSquarePlus />
            New complaint
          </Button>
        }
      />

      {complaints.length === 0 ? (
        <EmptyState
          title="No complaints yet"
          description="Report an issue and your property manager will be notified."
          action={<Button onClick={() => setOpen(true)}>Raise complaint</Button>}
        />
      ) : (
        <div className="grid gap-4">
          {complaints.map((complaint) => (
            <Card key={complaint.id}>
              <CardHeader className="flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquareWarning className="size-4 text-primary" />
                    {complaint.title}
                  </CardTitle>
                  <CardDescription>
                    {new Date(complaint.created_at).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Badge variant={statusBadgeVariant(complaint.status)}>
                  {complaint.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {complaint.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Raise a complaint"
        description="Describe the issue clearly so it can be resolved quickly."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          {formError ? <PageError message={formError} /> : null}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Water leakage in bathroom"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Share details about the issue..."
              required
            />
          </div>
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Submitting..." : "Submit complaint"}
          </Button>
        </form>
      </Dialog>
    </div>
  );
}
