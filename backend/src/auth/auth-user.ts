import type { User } from '@prisma/client';

export type AuthUser = User;

export interface LoginResponse {
  id: number;
  email: string;
  username: string;
  access_token: string;
}