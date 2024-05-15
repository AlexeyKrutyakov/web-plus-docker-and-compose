import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ERROR_MESSAGES } from 'src/constants';
import { SigninUserDto } from 'src/modules/users/dto/signin-user.dto';
import { User } from 'src/modules/users/entities/user.entity';
import { UsersService } from 'src/modules/users/users.service';
import { verifyHash } from 'src/utils/hash';
import { Repository } from 'typeorm';
import { UserProfileResponse } from '../users/types';
import { SigninUserResponse } from './types';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<UserProfileResponse | null> {
    const user = await this.usersRepository.findOne({
      where: {
        username,
      },
      select: ['username', 'password'],
    });

    if (user) {
      const isVerified = await verifyHash(pass, user.password);

      if (isVerified) return user;
    }

    return null;
  }

  async signin(signinUser: SigninUserDto): Promise<SigninUserResponse> {
    const user = await this.usersRepository.findOne({
      where: {
        username: signinUser.username,
      },
    });

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.wrongNameOrPass);
    }

    const verifiedUser = await this.validateUser(
      signinUser.username,
      signinUser.password,
    );

    if (!verifiedUser) {
      throw new BadRequestException(ERROR_MESSAGES.wrongNameOrPass);
    } else {
      const { username, id } = user;

      return {
        access_token: await this.jwtService.signAsync({
          username,
          sub: id,
        }),
      };
    }
  }
}
