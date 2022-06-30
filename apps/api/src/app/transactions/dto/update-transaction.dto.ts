import { Transaction } from '@bludger/api-interfaces';
import { IsNotEmpty } from 'class-validator';

export class UpdateTransactionDto implements Transaction {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  date: Date;

  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  accountId: number;

  categoryId?: number;
}
