import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    private usersService: UsersService,
    private wishesService: WishesService,
  ) {}

  async findAll() {
    return await this.wishlistRepository.find({
      relations: ['owner', 'items'],
    });
  }

  async findOne(id: number) {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });
    if (!wishlist) {
      throw new BadRequestException(`Лист пожеланий с id: ${id} не найден`);
    }
    return wishlist;
  }

  async create(createWishlistDto: CreateWishlistDto, userId: number) {
    const user = await this.usersService.findById(userId);

    const wishes = await this.wishesService.findAll(createWishlistDto.itemsId);
    const wishlist = {
      ...createWishlistDto,
      owner: user,
      items: wishes,
    };

    return this.wishlistRepository.save(wishlist);
  }

  async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    userId: number,
  ) {
    const wishlist = await this.findOne(id);

    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException(
        'Нельзя редактировать чужой список подарков',
      );
    }

    if (updateWishlistDto.itemsId) {
      const { itemsId, ...restUpdateWishlistDto } = updateWishlistDto;
      const wishes = await this.wishesService.findAll(itemsId);
      wishlist.items.push(...wishes);
      await this.wishlistRepository.save(wishlist);
      await this.wishlistRepository.update(id, restUpdateWishlistDto);
    } else {
      await this.wishlistRepository.update(id, updateWishlistDto);
    }
    return wishlist;
  }

  async remove(id: number, userId: number) {
    const wishlist = await this.findOne(id);
    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException('Удалить можно только свой список подарков');
    }
    await this.wishlistRepository.delete(id);
    return wishlist;
  }
}
