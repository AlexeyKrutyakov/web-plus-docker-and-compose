import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { UsersService } from '../users/users.service';
import { ERROR_MESSAGES } from 'src/constants';
import { UpdateWishDto } from './dto/update-wish.dto';
import throwErrorIfNotOwner from 'src/utils/throw-error-if-not-owner';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
    private readonly usersService: UsersService,
  ) {}

  async create(createWishDto: CreateWishDto, userId: number): Promise<Wish> {
    const user = await this.usersService.findById(userId);
    const wish = this.wishesRepository.create({
      ...createWishDto,
      owner: user,
    });
    await this.wishesRepository.save(wish);
    return wish;
  }

  async updateById(
    userId: number,
    params: any,
    updateWishDto: UpdateWishDto,
  ): Promise<Wish> {
    const wish = await this.findById(params);

    if (wish.offers.length !== 0) {
      throw new BadRequestException(ERROR_MESSAGES.invalidWishUpdate);
    }
    throwErrorIfNotOwner(userId, wish);
    await this.wishesRepository.update(wish.id, updateWishDto);
    return await this.findById(params);
  }

  async deleteById(userId: number, params: any) {
    const wish = await this.findById(params);
    if (!wish) {
      throw new NotFoundException(ERROR_MESSAGES.badId);
    }

    if (wish.offers.length !== 0) {
      throw new BadRequestException(ERROR_MESSAGES.invalidWishDeletion);
    }

    throwErrorIfNotOwner(userId, wish);
    await this.wishesRepository.delete(wish.id);
    return wish;
  }

  async findLast(): Promise<Wish[]> {
    const wishes = await this.wishesRepository.find({
      relations: ['owner', 'offers'],
      order: {
        createdAt: 'DESC',
      },
      take: +process.env.QTY_OF_LAST_WISHES,
    });
    return wishes;
  }

  async findTop(): Promise<Wish[]> {
    const wishes = await this.wishesRepository.find({
      relations: ['owner', 'offers'],
      order: {
        copied: 'DESC',
      },
      take: +process.env.QTY_OF_TOP_WISHES,
    });
    return wishes;
  }

  async findById(params: any): Promise<Wish> {
    const id = +params.wishId;
    if (isNaN(id)) {
      throw new BadRequestException(ERROR_MESSAGES.badId);
    }
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: ['owner', 'offers', 'offers.user'],
    });
    if (!wish) {
      throw new NotFoundException(ERROR_MESSAGES.badId);
    }
    return wish;
  }

  async findManyByIdList(idList: number[]): Promise<Wish[]> {
    return await this.wishesRepository.find({
      where: {
        id: In(idList),
      },
    });
  }

  async copyById(userId: number, params: any): Promise<void> {
    const wish = await this.findById(params);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, owner, offers, raised, copied, ...result } = wish;
    await this.create(result, userId);
    await this.wishesRepository.update(wish.id, { copied: wish.copied + 1 });
  }
}
