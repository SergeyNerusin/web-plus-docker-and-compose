import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { In, Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { UserPublicProfileResponseDto } from 'src/users/dto/user-profile.dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private wishRepository: Repository<Wish>,
    private userService: UsersService,
  ) {}

  findAll(itemsId: number[]): Promise<Wish[]> {
    return this.wishRepository.find({
      where: { id: In(itemsId) },
    });
  }

  async create(userId: number, createWishDto: CreateWishDto) {
    const user = await this.userService.findById(userId);
    const data = {
      ...createWishDto,
      owner: user,
    };

    return await this.wishRepository.save(data);
  }

  async findLast() {
    return await this.wishRepository.find({
      order: { createdAt: 'DESC' },
      take: 40,
    });
  }

  async findTop() {
    return await this.wishRepository.find({
      order: { copied: 'DESC' },
      take: 10,
      relations: ['owner', 'offers'],
    });
  }

  async findById(id: number) {
    const wishData = await this.wishRepository.findOne({
      where: { id },
      relations: ['owner', 'offers'],
    });
    if (!wishData) {
      throw new BadRequestException(`Список с id: ${id} не существует`);
    }
    return wishData;
  }

  async update(wishId: number, userId: number, updateWishDto: UpdateWishDto) {
    const wishData = await this.findById(wishId);

    if (userId !== wishData.owner.id) {
      throw new ForbiddenException(
        'Вы можете редактировать только свои подарки',
      );
    }

    if (updateWishDto.price && wishData.offers.length > 0) {
      throw new ForbiddenException(
        'Нельзя менять стоимость подарка, уже есть желающие скинуться',
      );
    }

    await this.wishRepository.update(wishId, updateWishDto);
    return this.findById(wishId);
  }

  async updateOffer(wishId: number, updateWishDto: UpdateWishDto) {
    const wishData = await this.findById(wishId);
    if (!wishData) {
      throw new ForbiddenException(`Подарок с id: ${wishId} не найден`);
    }
    await this.wishRepository.update(wishId, updateWishDto);
    return this.findById(wishId);
  }

  async remove(wishId: number, user: UserPublicProfileResponseDto) {
    const wishData = await this.findById(wishId);
    if (user && wishData.owner.id !== user.id) {
      throw new ForbiddenException('Вы можете удалить только свои подарки');
    }
    if (wishData.offers.length > 0) {
      throw new ForbiddenException(
        'Вы можете удалить подарок так как сбор средств был начат',
      );
    }
    await this.wishRepository.delete(wishId);
    return wishData;
  }

  async copyWish(wishId: number, user: UserPublicProfileResponseDto) {
    const wishData = await this.findById(wishId);
    const { name, description, image, link, price, copied } = wishData;

    const copyWishExist = !!(await this.wishRepository.findOne({
      where: { name, link, price, owner: { id: user.id } },
      relations: { owner: true },
    }));

    if (copyWishExist) {
      throw new ForbiddenException('У вас уже есть копия этого подарка');
    }

    const owner = await this.userService.findById(user.id);
    const countCopy = copied + 1;
    const copyWish = {
      name,
      description,
      image,
      link,
      price,
      copied: countCopy,
    };

    const objectWishes = await this.wishRepository.save({
      ...copyWish,
      owner,
    });

    return objectWishes;
  }
}
