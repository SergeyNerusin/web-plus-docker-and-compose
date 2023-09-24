import { BasisEntity } from 'src/utils/basis-entity';
import { Entity, Column, ManyToOne } from 'typeorm';
import { IsNumber, IsBoolean } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Entity()
export class Offer extends BasisEntity {
  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;

  @Column()
  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number;

  @Column({ default: false })
  @IsBoolean()
  hidden: boolean;
}

/*
  Схема желающих скинуться (offer):
  user - содержит id желающего скинуться;
  item - содержит ссылку на товар;
  amount - сумма заявки, округляется до двух знаков после запятой;
  hidden - флаг, который определяет показывать ли информацию о скидывающемся в списке, 
           по умолчанию равен false.
*/
