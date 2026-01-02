export type Role = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  provider?: 'local' | 'google';
  createdAt: Date;
}

export interface JwtPayload {
  sub: string;
  name: string;
  email: string;
  role: Role;
  iat: number;
  exp: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: Omit<User, 'password'>;
}

