import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { UsersService } from 'src/modules/users/users.service';
import { AuthService } from './auth.service';
import { SigninUserDto } from 'src/modules/users/dto/signin-user.dto';
import { SigninUserResponse, SignupUserResponse } from './types';

@Controller()
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  async signup(
    @Body() createUserDto: CreateUserDto,
  ): Promise<SignupUserResponse> {
    const user = await this.usersService.create(createUserDto);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  @Post('signin')
  async signin(
    @Body() signinUserDto: SigninUserDto,
  ): Promise<SigninUserResponse> {
    return await this.authService.signin(signinUserDto);
  }
}
