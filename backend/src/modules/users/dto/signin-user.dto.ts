import { IsNotEmpty, Length, MinLength } from 'class-validator';

export class SigninUserDto {
  @IsNotEmpty()
  @Length(1, 64)
  username: string;

  @IsNotEmpty()
  @MinLength(2)
  password: string;
}
