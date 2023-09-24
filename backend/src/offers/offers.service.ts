import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { UsersService } from 'src/users/users.service';
import { WishesService } from 'src/wishes/wishes.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateWishDto } from 'src/wishes/dto/update-wish.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer) private offerRepository: Repository<Offer>,
    private usersService: UsersService,
    private wishesService: WishesService,
  ) {}

  async create(createOfferDto: CreateOfferDto, userId: number) {
    const { amount, itemId } = createOfferDto;
    const user = await this.usersService.findById(userId);
    const wish = await this.wishesService.findById(createOfferDto.itemId);
    const { price, raised, owner } = wish;
    const costWishes = amount + raised;

    if (owner.id === user.id) {
      throw new ForbiddenException(
        'Вы не можете вносить деньги на свои подарки',
      );
    }

    if (costWishes > price) {
      throw new ForbiddenException(
        `Сумма взноса не должна превышать остатка стоимости подарка.`,
      );
    }
    await this.wishesService.updateOffer(itemId, {
      raised: costWishes,
    } as UpdateWishDto);

    return this.offerRepository.save({ ...createOfferDto, user, item: wish });
  }

  async findAll() {
    return await this.offerRepository.find({
      select: {
        user: {
          id: true,
          username: true,
          about: true,
          avatar: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      relations: ['user', 'item'],
    });
  }

  findOne(id: number) {
    return this.offerRepository.findOne({ where: { id } });
  }
}
