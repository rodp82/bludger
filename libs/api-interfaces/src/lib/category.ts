import { Transaction } from './transactions';
import { User } from './user';

export interface Category {
  id?: number;
  name?: string;
  type?: CategoryType;
  path?: string;
  order?: number;

  parentId?: number;
  parent?: Category;

  userId?: number;
  user?: User;

  children?: Category[];

  transactions?: Transaction[];
}

export enum CategoryType {
  Income = 1,
  Expense,
  Transfer,
}
