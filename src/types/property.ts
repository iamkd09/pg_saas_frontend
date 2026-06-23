import type { BedStatus } from "@/types/api";

export interface Property {
  id: number;
  organization: number;
  name: string;
  address: string;
  total_floors: number;
  room_count: number;
  total_beds: number;
  vacant_beds: number;
  created_at: string;
  updated_at: string;
}

export interface CreatePropertyPayload {
  name: string;
  address: string;
  total_floors?: number;
}

export interface Bed {
  id: number;
  room: number;
  bed_number: string;
  status: BedStatus;
  created_at: string;
}

export interface Room {
  id: number;
  property: number;
  room_number: string;
  floor_number: number;
  rent_amount: string;
  capacity: number;
  bed_count: number;
  vacant_bed_count: number;
  beds: Bed[];
  created_at: string;
}

export interface CreateRoomPayload {
  room_number: string;
  floor_number: number;
  rent_amount: string;
  capacity?: number;
}

export interface CreateBedPayload {
  bed_number: string;
  status?: BedStatus;
}
