import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegistrationDto {

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  password: string;

}
