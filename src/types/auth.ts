export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterPayload {
  organization_name: string;
  username: string;
  email: string;
  password: string;
  phone_number: string;
  first_name?: string;
  last_name?: string;
}

export interface RegisterResponse {
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    role: string;
    organization: { id: number; name: string; created_at: string } | null;
  };
  access: string;
  refresh: string;
}

export interface TokenPair {
  access: string;
  refresh: string;
}

/** SimpleJWT refresh response — only returns a new access token by default. */
export interface RefreshTokenResponse {
  access: string;
  refresh?: string;
}

export interface AuthError {
  detail?: string;
  message?: string;
}
