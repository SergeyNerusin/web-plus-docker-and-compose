import { BasisEntity } from 'src/utils/basis-entity';
import { Entity, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { IsUrl, Length } from 'class-validator';

@Entity()
export class Wishlist extends BasisEntity {
  @Column()
  name: string;

  @Column({ default: 'Набор из:' })
  @Length(1, 1500)
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;

  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];
}

/*
    Cхема списка подарков (wishlist):
    name — название списка. Не может быть длиннее 250 символов и короче одного;
    description — описание подборки, строка до 1500 символов;
    image — обложка для подборки;
    items содержит набор ссылок на подарки.
    
*/
