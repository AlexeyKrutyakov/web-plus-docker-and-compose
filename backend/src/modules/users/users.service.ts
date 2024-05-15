import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { hashValue } from 'src/utils/hash';
import { ERROR_MESSAGES } from 'src/constants';
import { UpdateUserDto } from './dto/update-user.dto';
import REGEXP from 'src/constants/regexp';
import { Wish } from '../wishes/entities/wish.entity';
import { UserProfileResponse, UserPublicProfileResponse } from './types';
import { FindUsersDto } from './dto/find-users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  throwErrorIfNotExist(user: User): void {
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.userWithThisNameNotFound);
    }
  }

  async throwErrorIfNonUnique(
    field: keyof User,
    value: string,
    errorMessage: string,
  ) {
    const whereParam: Record<keyof User, any> = {
      id: undefined,
      username: undefined,
      about: undefined,
      avatar: undefined,
      email: undefined,
      password: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      wishes: undefined,
      offers: undefined,
      wishlists: undefined,
    };

    whereParam[field] = value;

    const alreadyExists = await this.usersRepository.exists({
      where: whereParam,
    });

    if (alreadyExists) throw new BadRequestException(errorMessage);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password } = createUserDto;

    await this.throwErrorIfNonUnique(
      'username',
      username,
      ERROR_MESSAGES.usernameAlreadyExist,
    );

    await this.throwErrorIfNonUnique(
      'email',
      email,
      ERROR_MESSAGES.emailAlreadyExist,
    );

    const user = this.usersRepository.create({
      ...createUserDto,
      password: await hashValue(password),
    });

    return await this.usersRepository.save(user);
  }

  //* utility function
  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {
        id,
      },
      select: [
        'id',
        'username',
        'about',
        'avatar',
        'email',
        'createdAt',
        'updatedAt',
        'wishes',
        'offers',
        'wishlists',
      ],
      relations: [
        'wishes',
        'wishes.owner',
        'offers',
        'wishlists',
        'wishlists.owner',
      ],
    });
    return user;
  }

  async findYouself(userId: number): Promise<UserProfileResponse> {
    const user = await this.findById(userId);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { wishes, offers, wishlists, ...result } = user;
    return result;
  }

  async findByName(username: string): Promise<UserPublicProfileResponse> {
    const user = await this.usersRepository.findOne({
      where: { username },
    });

    this.throwErrorIfNotExist(user);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { email, ...result } = user;
    return result;
  }

  async findWishesByUserName(params: any): Promise<Wish[]> {
    const user = await this.usersRepository.findOne({
      where: { username: params.userName },
      relations: ['wishes', 'wishes.offers', 'wishes.offers.user'],
    });

    this.throwErrorIfNotExist(user);

    return user.wishes;
  }

  async update(
    user: User,
    updateUserDto: UpdateUserDto,
  ): Promise<UserProfileResponse> {
    if (updateUserDto.username) {
      const newUsername = updateUserDto.username;

      if (newUsername !== user.username) {
        await this.throwErrorIfNonUnique(
          'username',
          newUsername,
          ERROR_MESSAGES.usernameAlreadyExist,
        );
      }
    }

    if (updateUserDto.email) {
      const newEmail = updateUserDto.email;

      if (newEmail !== user.email) {
        await this.throwErrorIfNonUnique(
          'email',
          newEmail,
          ERROR_MESSAGES.emailAlreadyExist,
        );
      }
    }

    if (updateUserDto.password) {
      const newPass = updateUserDto.password;
      updateUserDto.password = await hashValue(newPass);
    }

    await this.usersRepository.update(user.id, updateUserDto);

    return await this.findYouself(user.id);
  }

  async findByEmailOrName(
    findusersDto: FindUsersDto,
  ): Promise<UserProfileResponse[]> {
    const queryString = findusersDto.query;
    if (queryString === undefined)
      throw new BadRequestException(ERROR_MESSAGES.badRequest);

    const isEmail = REGEXP.email.test(queryString);
    let users: User[];

    if (isEmail) {
      users = await this.usersRepository.find({
        where: {
          email: queryString,
        },
        select: [
          'id',
          'username',
          'about',
          'avatar',
          'email',
          'createdAt',
          'updatedAt',
        ],
      });
    } else {
      users = await this.usersRepository.find({
        where: {
          username: queryString,
        },
        select: [
          'id',
          'username',
          'about',
          'avatar',
          'email',
          'createdAt',
          'updatedAt',
        ],
      });
    }

    if (!users) return [];

    return [...users];
  }

  async findOwnWishes(userId: number): Promise<Wish[]> {
    const user = await this.findById(userId);

    return user.wishes;
  }
}
