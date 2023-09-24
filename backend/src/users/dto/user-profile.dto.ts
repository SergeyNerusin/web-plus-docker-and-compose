import { OmitType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UserProfileResponseDto extends OmitType(User, ['password']) {}

export class UserPublicProfileResponseDto extends OmitType(
  UserProfileResponseDto,
  ['email'],
) {}

export class UserSigninDto {
  @IsOptional()
  id: number;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
