import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UsersService } from '../users/users.service';
import { WishesService } from '../wishes/wishes.service';
import throwErrorIfBadId from 'src/utils/throw-error-if-bad-id';
import { ERROR_MESSAGES } from 'src/constants';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import throwErrorIfNotOwner from 'src/utils/throw-error-if-not-owner';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
    private readonly usersService: UsersService,
    private readonly wishService: WishesService,
  ) {}

  async create(
    userId: number,
    createWishlistDto: CreateWishlistDto,
  ): Promise<Wishlist> {
    const user = await this.usersService.findById(userId);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { email, ...owner } = user;

    const wishes = await this.wishService.findManyByIdList(
      createWishlistDto.itemsId,
    );

    const wishlist = this.wishlistsRepository.create({
      ...createWishlistDto,
      owner,
      items: wishes,
    });

    return await this.wishlistsRepository.save(wishlist);
  }

  async findWishlists() {
    return await this.wishlistsRepository.find({
      relations: ['owner', 'items'],
    });
  }

  async findById(wishlistId: any): Promise<Wishlist> {
    throwErrorIfBadId(wishlistId);

    const wishlist = await this.wishlistsRepository.findOne({
      where: {
        id: wishlistId,
      },
      relations: ['owner', 'items'],
    });

    if (!wishlist) {
      throw new NotFoundException(ERROR_MESSAGES.wishlistWithThisIdNotFound);
    }

    return wishlist;
  }

  async patchById(
    wishlistId: any,
    userId: number,
    updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    const wishlist = await this.wishlistsRepository.findOne({
      where: {
        id: wishlistId,
      },
      relations: ['owner', 'items'],
    });

    if (!wishlist) {
      throw new NotFoundException(ERROR_MESSAGES.wishlistWithThisIdNotFound);
    }

    throwErrorIfNotOwner(userId, wishlist);

    if (updateWishlistDto.itemsId !== undefined) {
      const wishes = await this.wishService.findManyByIdList(
        updateWishlistDto.itemsId,
      );

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { itemsId, ...data } = updateWishlistDto;

      wishlist.items = [...wishes];

      await this.wishlistsRepository.save(wishlist);
      await this.wishlistsRepository.update(wishlist.id, data);
    } else {
      await this.wishlistsRepository.update(wishlistId, updateWishlistDto);
    }

    return await this.findById(wishlistId);
  }

  async deleteById(userId: number, params: any): Promise<Wishlist> {
    throwErrorIfBadId(params.wishlistId);

    const wishlistId = +params.wishlistId;

    const wishlist = await this.findById(wishlistId);

    throwErrorIfNotOwner(userId, wishlist);

    await this.wishlistsRepository.delete(wishlist.id);

    return wishlist;
  }
}
