import { Account, AccountType } from '@bludger/api-interfaces';
import { Decimal } from '@prisma/client/runtime';
import { IsNotEmpty } from 'class-validator';

export class CreateAccountDto implements Account {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  type: AccountType;

  balance?: number;
}
