export interface Notice {
  id: number;
  organization: number;
  created_by: number;
  created_by_name: string | null;
  title: string;
  message: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateNoticePayload {
  title: string;
  message: string;
  is_active?: boolean;
}

export interface UpdateNoticePayload {
  title?: string;
  message?: string;
  is_active?: boolean;
}
