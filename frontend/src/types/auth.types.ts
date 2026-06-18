export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  organizationId: number | null;
  role: 'admin' | 'member' | null;
  loading: boolean;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
