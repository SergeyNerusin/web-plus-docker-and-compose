import {
  Controller,
  Req,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { FindUserDto } from './dto/find-user.dto';
import { UserProfileResponseDto } from './dto/user-profile.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  findOwn(@Req() req: { user: User }): Promise<UserProfileResponseDto> {
    return this.usersService.findDataUser({
      where: { id: req.user.id },
      select: {
        email: true,
        username: true,
        id: true,
        avatar: true,
        about: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  @Patch('me')
  update(
    @Req() req: { user: User },
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserProfileResponseDto> {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @Get('me/wishes')
  getMyWishes(@Req() req: { user: User }) {
    return this.usersService.getWishes(req.user.username);
  }

  @Get(':username')
  getusername(@Param('username') username: string) {
    return this.usersService.getUserByName(username);
  }

  @Get(':username/wishes')
  getuserwihes(@Param('username') username: string) {
    return this.usersService.getWishes(username);
  }

  @Post('find')
  find(@Body() findUsertDto: FindUserDto): Promise<UserProfileResponseDto[]> {
    const { query } = findUsertDto;
    return this.usersService.findUser(query);
  }
}
