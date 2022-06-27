import { Account } from "./account";

export interface User {
  id?: number;
  name: string;
  email: string;
  googleId?: string;
  accounts?: Account;
}
