import { IsOptional, IsUrl } from 'class-validator';

export class UpdateWishlistDto {
  @IsOptional()
  name: string;

  @IsOptional()
  @IsUrl()
  image: string;

  @IsOptional()
  itemsId: number[];
}
