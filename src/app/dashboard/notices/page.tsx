"use client";

import { Megaphone, Plus, Trash2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { useDashboard } from "@/contexts/dashboard-context";
import { useToast } from "@/contexts/toast-context";
import { parseApiError } from "@/lib/api-utils";
import {
  createNotice,
  deleteNotice,
  getNotices,
  updateNotice,
} from "@/lib/notices";
import type { Notice } from "@/types/notice";

export default function NoticesPage() {
  const { isManager } = useDashboard();
  const { showToast } = useToast();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", message: "" });

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await getNotices();
      setNotices(data);
    } catch (err) {
      setError(parseApiError(err, "Unable to load notices."));
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
      await createNotice(form);
      setOpen(false);
      setForm({ title: "", message: "" });
      showToast("Notice published.");
      await load();
    } catch (err) {
      setFormError(parseApiError(err, "Unable to create notice."));
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleActive(notice: Notice) {
    try {
      await updateNotice(notice.id, { is_active: !notice.is_active });
      showToast(notice.is_active ? "Notice archived." : "Notice activated.");
      await load();
    } catch (err) {
      showToast(parseApiError(err, "Unable to update notice."), "error");
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteNotice(id);
      showToast("Notice deleted.");
      await load();
    } catch (err) {
      showToast(parseApiError(err, "Unable to delete notice."), "error");
    }
  }

  if (loading) return <PageLoader label="Loading notices..." />;
  if (error) return <PageError message={error} />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Communication"
        title="Notices"
        description={
          isManager
            ? "Publish announcements for tenants in your PG."
            : "Important updates from your property management."
        }
        action={
          isManager ? (
            <Button onClick={() => setOpen(true)}>
              <Plus />
              New notice
            </Button>
          ) : undefined
        }
      />

      {notices.length === 0 ? (
        <EmptyState
          title="No notices"
          description={
            isManager
              ? "Publish your first notice for tenants."
              : "Notices from management will appear here."
          }
          action={
            isManager ? (
              <Button onClick={() => setOpen(true)}>Create notice</Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-4">
          {notices.map((notice) => (
            <Card key={notice.id}>
              <CardHeader className="flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Megaphone className="size-4 text-primary" />
                    {notice.title}
                  </CardTitle>
                  <CardDescription>
                    {notice.created_by_name ?? "Management"} ·{" "}
                    {new Date(notice.created_at).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Badge variant={notice.is_active ? "success" : "default"}>
                  {notice.is_active ? "Active" : "Archived"}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {notice.message}
                </p>
                {isManager ? (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => void toggleActive(notice)}
                    >
                      {notice.is_active ? "Archive" : "Activate"}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => void handleDelete(notice.id)}
                    >
                      <Trash2 />
                      Delete
                    </Button>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isManager ? (
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title="Publish notice"
          description="Share an announcement with tenants in your organization."
        >
          <form onSubmit={handleCreate} className="space-y-4">
            {formError ? <PageError message={formError} /> : null}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={form.message}
                onChange={(e) =>
                  setForm((f) => ({ ...f, message: e.target.value }))
                }
                required
              />
            </div>
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Publishing..." : "Publish notice"}
            </Button>
          </form>
        </Dialog>
      ) : null}
    </div>
  );
}
