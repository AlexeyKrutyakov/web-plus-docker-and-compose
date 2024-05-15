import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { Wishlist } from './entities/wishlist.entity';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { AuthUser } from 'src/common/decorator/user.decorator';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { User } from '../users/entities/user.entity';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private wishlistsService: WishlistsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createWishlist(
    @AuthUser() user: User,
    @Body() createWishlistDto: CreateWishlistDto,
  ): Promise<Wishlist> {
    return await this.wishlistsService.create(user.id, createWishlistDto);
  }

  @Get()
  async getWishlists(): Promise<Wishlist[]> {
    return await this.wishlistsService.findWishlists();
  }

  @Get(':wishlistId')
  async getWishlistById(@Param() params: any): Promise<Wishlist> {
    return await this.wishlistsService.findById(params.wishlistId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':wishlistId')
  async patchWishlistById(
    @AuthUser() user: User,
    @Param() params: any,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    return await this.wishlistsService.patchById(
      params.wishlistId,
      user.id,
      updateWishlistDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':wishlistId')
  async deleteById(
    @AuthUser() user: User,
    @Param() params: any,
  ): Promise<Wishlist> {
    return await this.wishlistsService.deleteById(user.id, params);
  }
}
