export type UserRole = 'ADMIN' | 'USER';
export type UserStatus = 'ACTIVE' | 'INACTIVE';

export interface User {
  id: number;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  status: UserStatus;
}

export interface AuthResponse {
  email: string;
  firstName: string;
  lastName: string;
  accessToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
