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
import { WishesService } from './wishes.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { AuthUser } from 'src/common/decorator/user.decorator';
import { User } from '../users/entities/user.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { Wish } from './entities/wish.entity';
import { UpdateWishDto } from './dto/update-wish.dto';

@Controller('wishes')
export class WishesController {
  constructor(private wishesService: WishesService) {}

  @Get('last')
  async getLastWishes(): Promise<Wish[]> {
    return await this.wishesService.findLast();
  }

  @Get('top')
  async getTopWishes(): Promise<Wish[]> {
    return await this.wishesService.findTop();
  }

  @Get(':wishId')
  async getWishById(@Param() params: any): Promise<Wish> {
    return await this.wishesService.findById(params);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createWish(
    @AuthUser() user: User,
    @Body() createWishDto: CreateWishDto,
  ): Promise<Wish> {
    const id = user.id;
    return await this.wishesService.create(createWishDto, id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':wishId')
  async patchWishById(
    @AuthUser() user: User,
    @Param() params: any,
    @Body() updateWishDto: UpdateWishDto,
  ): Promise<Wish> {
    const userId = user.id;
    return await this.wishesService.updateById(userId, params, updateWishDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':wishId')
  async deleteWishById(
    @AuthUser() user: User,
    @Param() params: any,
  ): Promise<Wish> {
    const userId = user.id;
    return await this.wishesService.deleteById(userId, params);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':wishId/copy')
  async copyWishById(@AuthUser() user: User, @Param() params: any) {
    const userId = user.id;
    return await this.wishesService.copyById(userId, params);
  }
}
