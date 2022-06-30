import { Account, AccountType } from '@bludger/api-interfaces';

export class UpdateAccountDto implements Account {
  id: number;
  name: string;
  type: AccountType;
  balance: number;
}
