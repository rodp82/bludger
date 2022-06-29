import { Transaction } from './transactions';
import { User } from './user';

export enum AccountType {
  Cash = 1,
  Credit,
  Loan,
}

export interface Account {
  id?: number;
  name: string;
  type: AccountType;
  balance?: number;

  userId?: number;
  user?: User;

  transactions?: Transaction[];
}
