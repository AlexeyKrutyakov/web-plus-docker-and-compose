import { IsEmail, IsOptional, IsUrl, Length } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @Length(1, 64)
  username: string;

  @IsOptional()
  @Length(2)
  password: string;

  @IsOptional()
  @Length(1, 200)
  about: string;

  @IsOptional()
  @IsUrl()
  avatar: string;

  @IsOptional()
  @IsEmail()
  email: string;
}
