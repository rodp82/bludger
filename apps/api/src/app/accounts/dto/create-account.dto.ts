import { Account, AccountType } from '@bludger/api-interfaces';
import { IsNotEmpty } from 'class-validator';

export class CreateAccountDto implements Account {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  type: AccountType;

  balance?: number;
}
