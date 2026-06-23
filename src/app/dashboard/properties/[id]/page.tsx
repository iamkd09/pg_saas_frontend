"use client";

import { BedDouble, DoorOpen, Plus } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
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
  createBed,
  createRoom,
  getProperties,
  getPropertyRooms,
} from "@/lib/properties";
import type { Property, Room } from "@/types/property";

export default function PropertyDetailPage() {
  const params = useParams<{ id: string }>();
  const propertyId = Number(params.id);
  const [property, setProperty] = useState<Property | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roomOpen, setRoomOpen] = useState(false);
  const [bedOpenForRoom, setBedOpenForRoom] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [roomForm, setRoomForm] = useState({
    room_number: "",
    floor_number: "1",
    rent_amount: "",
    capacity: "4",
  });
  const [bedForm, setBedForm] = useState({ bed_number: "" });

  const load = useCallback(async () => {
    try {
      setError(null);
      const [properties, roomList] = await Promise.all([
        getProperties(),
        getPropertyRooms(propertyId),
      ]);
      setProperty(properties.find((p) => p.id === propertyId) ?? null);
      setRooms(roomList);
    } catch (err) {
      setError(parseApiError(err, "Unable to load property details."));
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleCreateRoom(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      await createRoom(propertyId, {
        room_number: roomForm.room_number,
        floor_number: Number(roomForm.floor_number),
        rent_amount: roomForm.rent_amount,
        capacity: Number(roomForm.capacity) || 4,
      });
      setRoomOpen(false);
      setRoomForm({
        room_number: "",
        floor_number: "1",
        rent_amount: "",
        capacity: "4",
      });
      await load();
    } catch (err) {
      setFormError(parseApiError(err, "Unable to create room."));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCreateBed(e: React.FormEvent) {
    e.preventDefault();
    if (!bedOpenForRoom) return;
    setSubmitting(true);
    setFormError(null);
    try {
      await createBed(bedOpenForRoom, { bed_number: bedForm.bed_number });
      setBedOpenForRoom(null);
      setBedForm({ bed_number: "" });
      await load();
    } catch (err) {
      setFormError(parseApiError(err, "Unable to create bed."));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <PageLoader label="Loading property..." />;
  if (error) return <PageError message={error} />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Property"
        title={property?.name ?? `Property #${propertyId}`}
        description={property?.address}
        action={
          <div className="flex gap-2">
            <Link
              href="/dashboard/properties"
              className="inline-flex h-7 items-center rounded-lg border border-border bg-background px-2.5 text-sm font-medium hover:bg-muted"
            >
              Back
            </Link>
            <Button onClick={() => setRoomOpen(true)}>
              <Plus />
              Add room
            </Button>
          </div>
        }
      />

      {rooms.length === 0 ? (
        <EmptyState
          title="No rooms yet"
          description="Add rooms to this property, then create beds inside each room."
          action={<Button onClick={() => setRoomOpen(true)}>Add room</Button>}
        />
      ) : (
        <div className="grid gap-4">
          {rooms.map((room) => (
            <Card key={room.id}>
              <CardHeader className="flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <DoorOpen className="size-4 text-primary" />
                    Room {room.room_number}
                  </CardTitle>
                  <CardDescription>
                    Floor {room.floor_number} · ₹{room.rent_amount}/month ·{" "}
                    {room.vacant_bed_count}/{room.bed_count} vacant
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setBedOpenForRoom(room.id);
                    setFormError(null);
                  }}
                >
                  <Plus />
                  Add bed
                </Button>
              </CardHeader>
              <CardContent>
                {room.beds.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No beds added yet.</p>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {room.beds.map((bed) => (
                      <div
                        key={bed.id}
                        className="flex items-center justify-between rounded-xl border bg-muted/20 px-4 py-3"
                      >
                        <div className="flex items-center gap-2">
                          <BedDouble className="size-4 text-muted-foreground" />
                          <span className="font-medium">Bed {bed.bed_number}</span>
                        </div>
                        <Badge variant={statusBadgeVariant(bed.status)}>
                          {bed.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={roomOpen}
        onOpenChange={setRoomOpen}
        title="Add room"
        description="Create a room inside this property."
      >
        <form onSubmit={handleCreateRoom} className="space-y-4">
          {formError ? <PageError message={formError} /> : null}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="room_number">Room number</Label>
              <Input
                id="room_number"
                value={roomForm.room_number}
                onChange={(e) =>
                  setRoomForm((f) => ({ ...f, room_number: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="floor_number">Floor</Label>
              <Input
                id="floor_number"
                type="number"
                min={0}
                value={roomForm.floor_number}
                onChange={(e) =>
                  setRoomForm((f) => ({ ...f, floor_number: e.target.value }))
                }
                required
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="rent_amount">Rent amount</Label>
              <Input
                id="rent_amount"
                value={roomForm.rent_amount}
                onChange={(e) =>
                  setRoomForm((f) => ({ ...f, rent_amount: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                min={1}
                value={roomForm.capacity}
                onChange={(e) =>
                  setRoomForm((f) => ({ ...f, capacity: e.target.value }))
                }
              />
            </div>
          </div>
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Creating..." : "Create room"}
          </Button>
        </form>
      </Dialog>

      <Dialog
        open={bedOpenForRoom !== null}
        onOpenChange={(open) => !open && setBedOpenForRoom(null)}
        title="Add bed"
        description="Add a bed to the selected room."
      >
        <form onSubmit={handleCreateBed} className="space-y-4">
          {formError ? <PageError message={formError} /> : null}
          <div className="space-y-2">
            <Label htmlFor="bed_number">Bed number</Label>
            <Input
              id="bed_number"
              value={bedForm.bed_number}
              onChange={(e) => setBedForm({ bed_number: e.target.value })}
              placeholder="A, B, 1..."
              required
            />
          </div>
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Creating..." : "Create bed"}
          </Button>
        </form>
      </Dialog>
    </div>
  );
}
