import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UsersService } from '../users/users.service';
import throwErrorIfBadId from 'src/utils/throw-error-if-bad-id';
import { WishesService } from '../wishes/wishes.service';
import { ERROR_MESSAGES } from 'src/constants';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  async getAll(): Promise<Offer[]> {
    const offers = await this.offersRepository.find({
      relations: ['item', 'user'],
    });
    return offers;
  }

  async create(userId: number, createOfferDto: CreateOfferDto): Promise<Offer> {
    const user = await this.usersService.findById(userId);
    const wish = await this.wishesService.findById({
      wishId: createOfferDto.itemId,
    });

    if (+createOfferDto.amount > wish.price - wish.raised) {
      throw new BadRequestException(ERROR_MESSAGES.badOfferAmount);
    }

    if (userId === wish.owner.id) {
      throw new BadRequestException(ERROR_MESSAGES.notValidPayment);
    }

    await this.wishRepository.update(wish.id, {
      raised: createOfferDto.amount,
    });

    const offer = this.offersRepository.create({
      amount: createOfferDto.amount,
      user: user.id,
      item: wish,
    });

    return await this.offersRepository.save(offer);
  }

  async getById(params: any): Promise<Offer> {
    throwErrorIfBadId(params.offerId);

    const offer = await this.offersRepository.findOne({
      where: { id: params.offerId },
      relations: ['item', 'user'],
    });

    return offer;
  }
}
