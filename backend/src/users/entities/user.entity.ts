import { Entity, Column, OneToMany } from 'typeorm';
import { BasisEntity } from '../../utils/basis-entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import { Length, IsUrl, IsEmail } from 'class-validator';

@Entity()
export class User extends BasisEntity {
  @Column({ unique: true })
  @Length(2, 30)
  username: string;

  @Column({ default: 'Пока ничего не рассказал о себе' })
  @Length(2, 200)
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsUrl()
  avatar: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}

/*
    id - уникальный числовой идентификатор. Генерируется автоматически и является первичным ключем каждой из таблиц;
    createdAt - дата создания, тип значения Date;
    updatedAt - дата изменения, тип значения Date.

    Схема пользователя (user):
    username - имя пользователя, уникальная строка от 2 до 30 символов, обязательное поле.
    about - **информация о пользователе, строка от 2 до 200 символов, 
            в качестве значения по умолчанию укажите для него строку: «Пока ничего не рассказал о себе».
    avatar - ссылка на аватар, 
             в качестве значения по умолчанию задайте https://i.pravatar.cc/300
    email - адрес электронной почты пользователя, должен быть уникален.
    password - пароль пользователя, строка.
    wishes - список желаемых подарков. Используйте для него соответствующий тип связи.
    offers - содержит список подарков, на которые скидывается пользователь, 
             установите для него подходящий тип связи.
    wishlists - содержит список вишлистов, которые создал пользователь, 
                установите для него подходящий тип связи.
*/
