export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}