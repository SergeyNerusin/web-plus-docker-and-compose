import { IsNumber, IsPositive, IsUrl, Length } from 'class-validator';

export class CreateWishDto {
  @Length(1, 250)
  name: string;

  @IsUrl()
  link: string;

  @IsUrl()
  image: string;

  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;

  @Length(1, 1024)
  description: string;
}
