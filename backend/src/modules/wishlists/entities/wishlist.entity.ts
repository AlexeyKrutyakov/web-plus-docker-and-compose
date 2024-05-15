import { IsUrl, Length } from 'class-validator';
import { User } from 'src/modules/users/entities/user.entity';
import { UserPublicProfileResponse } from 'src/modules/users/types';
import { Wish } from 'src/modules/wishes/entities/wish.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: string;

  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: UserPublicProfileResponse;

  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];
}
