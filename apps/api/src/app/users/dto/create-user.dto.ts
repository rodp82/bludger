import { User } from "@bludger/api-interfaces";
import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto implements User {

  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  googleId?: string;

}
