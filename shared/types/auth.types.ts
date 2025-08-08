import { Role, User } from "./user.types";

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
}

export interface LoginResponse {
  access_token: string;
  user: Omit<User, 'password'>;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: Role;
}

export interface LoginRequest {
  email: string;
  password: string;
}