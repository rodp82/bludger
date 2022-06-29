import { Account } from './account';
import { Category } from './category';
import { User } from './user';

export interface Transaction {
  id?: number;
  date: Date;
  amount: number;
  description?: string;

  userId?: number;
  user?: User;

  accountId: number;
  account?: Account;

  catgegoryId?: number;
  catgegory?: Category;
}
