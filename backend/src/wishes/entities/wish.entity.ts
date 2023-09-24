import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import {
  Length,
  IsUrl,
  IsPositive,
  IsNumber,
  IsDecimal,
} from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { BasisEntity } from 'src/utils/basis-entity';

@Entity()
export class Wish extends BasisEntity {
  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column()
  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;

  @Column({ default: 0 })
  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 2 })
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @Column()
  @Length(1, 1024)
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @Column({ default: 0 })
  @IsDecimal()
  copied: number;
}

/*
    Схема для подарков (wish):
    
    id — уникальный числовой идентификатор, 
        генерируется автоматически и является первичным ключем каждой из таблиц;
    name — название подарка. Не может быть длиннее 250 символов и короче одного.
    link — ссылка на интернет-магазин, в котором можно приобрести подарок, строка.
    image - ссылка на изображение подарка, строка, должна быть валидным URL.
    price — стоимость подарка, с округлением до сотых, число.
    raised — сумма предварительного сбора или сумма, 
    которую пользователи сейчас готовы скинуть на подарок, также округляется до сотых.
    owner — ссылка на пользователя, который добавил пожелание подарка.
    description — строка с описанием подарка длиной от 1 и до 1024 символов.
    offers — массив ссылок на заявки скинуться от других пользователей.
    copied — содержит cчётчик тех, кто скопировал подарок себе, целое десятичное число.
    createdAt — дата создания, тип значения Date.
    updatedAt — дата изменения, тип значения Date.
*/
