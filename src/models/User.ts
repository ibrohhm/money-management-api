export interface User {
  id?: number;
  email: string;
  name: string;
  created_at?: Date;
  updated_at?: Date;
}

export const DEFAULT_USER_ID = 1;
