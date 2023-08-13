import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @MaxLength(1000)
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(200)
  password: string;
}
