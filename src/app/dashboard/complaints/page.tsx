"use client";

import { MessageSquareWarning } from "lucide-react";
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
import { useToast } from "@/contexts/toast-context";
import { getComplaints, updateComplaint } from "@/lib/complaints";
import { parseApiError } from "@/lib/api-utils";
import type { Complaint } from "@/types/complaint";
import type { ComplaintStatus } from "@/types/api";

const STATUS_FLOW: ComplaintStatus[] = ["OPEN", "IN_PROGRESS", "RESOLVED"];

export default function ComplaintsPage() {
  const { showToast } = useToast();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await getComplaints(
        statusFilter ? { status: statusFilter } : undefined
      );
      setComplaints(data);
    } catch (err) {
      setError(parseApiError(err, "Unable to load complaints."));
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    setLoading(true);
    void load();
  }, [load]);

  async function handleStatusChange(id: number, status: ComplaintStatus) {
    setUpdatingId(id);
    try {
      await updateComplaint(id, { status });
      showToast(`Complaint marked as ${status.replace("_", " ").toLowerCase()}.`);
      await load();
    } catch (err) {
      showToast(parseApiError(err, "Unable to update complaint."), "error");
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) return <PageLoader label="Loading complaints..." />;
  if (error) return <PageError message={error} />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Support"
        title="Complaints"
        description="Track tenant complaints and update their resolution status."
        action={
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
          >
            <option value="">All statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        }
      />

      {complaints.length === 0 ? (
        <EmptyState
          title="No complaints"
          description="Complaints raised by tenants will appear here."
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
                    {complaint.tenant_name} ·{" "}
                    {new Date(complaint.created_at).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Badge variant={statusBadgeVariant(complaint.status)}>
                  {complaint.status}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {complaint.description}
                </p>
                {complaint.status !== "RESOLVED" ? (
                  <div className="flex flex-wrap gap-2">
                    {STATUS_FLOW.filter((s) => s !== complaint.status).map(
                      (status) => (
                        <Button
                          key={status}
                          size="sm"
                          variant="outline"
                          disabled={updatingId === complaint.id}
                          onClick={() =>
                            void handleStatusChange(complaint.id, status)
                          }
                        >
                          Mark {status.replace("_", " ").toLowerCase()}
                        </Button>
                      )
                    )}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
