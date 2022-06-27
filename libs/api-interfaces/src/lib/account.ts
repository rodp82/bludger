import { User } from './user';

export interface Account {
  id?: number;
  name?: string;
  type?: AccountType;
  balance?: number;
  userId?: number;
  user?: User
}

export type AccountType = 'Cash' | 'Credit' | 'Loan';