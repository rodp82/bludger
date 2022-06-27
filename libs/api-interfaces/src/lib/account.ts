import { User } from './user';

export interface Account {
  id?: number;
  name?: string;
  type?: string;
  balance?: number;
  userId?: number;
  user?: User
}