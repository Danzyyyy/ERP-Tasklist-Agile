// src/Types/auth.ts

export type UserRole = 'TECHNICAL_LEAD' | 'PROJECT_MANAGER' | 'DEVELOPER' | 'TESTER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface DemoToken {
  role: UserRole;
  name: string;
  email: string;
  token: string;
  description: string;
}
