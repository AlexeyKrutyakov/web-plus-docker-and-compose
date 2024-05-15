import { IsEmail, IsUrl, Length } from 'class-validator';
import { DEFAULT_USER } from 'src/constants';
import { Offer } from 'src/modules/offers/entities/offer.entity';
import { Wish } from 'src/modules/wishes/entities/wish.entity';
import { Wishlist } from 'src/modules/wishlists/entities/wishlist.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  @Length(2, 30)
  username: string;

  @Column({
    default: DEFAULT_USER.about,
  })
  @Length(2, 200)
  about: string;

  @Column({
    default: DEFAULT_USER.avatar,
  })
  @IsUrl()
  avatar: string;

  @Column({
    unique: true,
    select: false,
  })
  @IsEmail()
  email: string;

  @Column({
    select: false,
  })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wish[];
}
