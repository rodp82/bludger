import { Account } from './account';
import { Category } from './category';
import { Transaction } from './transactions';

export interface User {
  id?: number;
  name: string;
  email: string;
  googleId?: string;

  accounts?: Account[];
  transactions?: Transaction[];
  categories?: Category[];
}
