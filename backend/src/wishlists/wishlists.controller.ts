import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Wishlist } from './entities/wishlist.entity';
import { UserProfileResponseDto } from 'src/users/dto/user-profile.dto';

@UseGuards(JwtAuthGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  findAll(): Promise<Wishlist[]> {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Wishlist> {
    return this.wishlistsService.findOne(Number(id));
  }

  @Post()
  create(
    @Body() createWishlistDto: CreateWishlistDto,
    @Req() req: { user: UserProfileResponseDto },
  ): Promise<Wishlist> {
    return this.wishlistsService.create(createWishlistDto, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Req() req: { user: UserProfileResponseDto },
  ) {
    return this.wishlistsService.update(
      Number(id),
      updateWishlistDto,
      req.user.id,
    );
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Req() req: { user: UserProfileResponseDto },
  ): Promise<Wishlist> {
    return this.wishlistsService.remove(Number(id), req.user.id);
  }
}
