import { IsUrl, Length, Min } from 'class-validator';
import { Offer } from 'src/modules/offers/entities/offer.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { UserPublicProfileResponse } from 'src/modules/users/types';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  @Min(1)
  price: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  @Min(1)
  raised: number;

  @Column({
    default: 0,
  })
  copied: number;

  @Column()
  @Length(1, 1024)
  description: string;

  @ManyToOne(() => User, (owner) => owner.wishes)
  owner: UserPublicProfileResponse;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];
}
