import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { AuthUser } from 'src/common/decorator/user.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guard/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { Wish } from '../wishes/entities/wish.entity';
import { UserProfileResponse, UserPublicProfileResponse } from './types';
import { FindUsersDto } from './dto/find-users.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  async findYourself(
    @AuthUser() user: UserProfileResponse,
  ): Promise<UserProfileResponse> {
    return await this.usersService.findYouself(user.id);
  }

  @Get('me/wishes')
  async findOwnWishes(@AuthUser() user: User): Promise<Wish[]> {
    return await this.usersService.findOwnWishes(user.id);
  }

  @Get(':userName')
  async findUserByName(
    @Param() params: any,
  ): Promise<UserPublicProfileResponse> {
    return await this.usersService.findByName(params.userName);
  }

  @Get(':userName/wishes')
  async findWishesByUserName(@Param() params: any): Promise<Wish[]> {
    return await this.usersService.findWishesByUserName(params);
  }

  @Patch('me')
  async changeYourself(
    @AuthUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserProfileResponse> {
    return await this.usersService.update(user, updateUserDto);
  }

  @Post('find')
  async findUsers(
    @Body() findUsersDto: FindUsersDto,
  ): Promise<UserProfileResponse[]> {
    return await this.usersService.findByEmailOrName(findUsersDto);
  }
}
