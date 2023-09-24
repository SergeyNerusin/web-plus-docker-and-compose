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
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Wish } from './entities/wish.entity';
import { UserPublicProfileResponseDto } from 'src/users/dto/user-profile.dto';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createWishes(
    @Req() req: { user: UserPublicProfileResponseDto },
    @Body() createWishesDto: CreateWishDto,
  ): Promise<Wish> {
    return this.wishesService.create(req.user.id, createWishesDto);
  }

  @Get('last')
  getLast(): Promise<Wish[]> {
    return this.wishesService.findLast();
  }

  @Get('top')
  getTop(): Promise<Wish[]> {
    return this.wishesService.findTop();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getById(@Param('id') id: string): Promise<Wish> {
    return this.wishesService.findById(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') wishId: string,
    @Req() req: { user: UserPublicProfileResponseDto },
    @Body() updateWishDto: UpdateWishDto,
  ): Promise<Wish> {
    return this.wishesService.update(
      Number(wishId),
      req.user.id,
      updateWishDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Param('id') wishId: string,
    @Req() req: { user: UserPublicProfileResponseDto },
  ) {
    return this.wishesService.remove(Number(wishId), req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  copy(
    @Param('id') wishId: string,
    @Req() req: { user: UserPublicProfileResponseDto },
  ): Promise<Wish> {
    return this.wishesService.copyWish(Number(wishId), req.user);
  }
}
