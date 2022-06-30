import { Account, Category, Transaction, User } from '@bludger/api-interfaces';
import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTransactionDto implements Transaction {
  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  accountId: number;
  // account?: Account;
  catgegoryId?: number;
  // catgegory?: Category;
}
