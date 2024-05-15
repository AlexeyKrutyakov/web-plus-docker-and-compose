import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { AuthUser } from 'src/common/decorator/user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('offers')
export class OffersController {
  constructor(private offersService: OffersService) {}

  @Get()
  async getAllOffers(): Promise<Offer[]> {
    return await this.offersService.getAll();
  }

  @Get(':offerId')
  async getOfferById(@Param() params: any): Promise<Offer> {
    return await this.offersService.getById(params);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOffer(
    @AuthUser()
    user: User,
    @Body()
    createOfferDto: CreateOfferDto,
  ): Promise<Offer> {
    return await this.offersService.create(user.id, createOfferDto);
  }
}
