import {
  Length,
  IsUrl,
  IsOptional,
  IsArray,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateWishlistDto {
  @Length(1, 250)
  name: string;

  @IsOptional()
  @IsString()
  @Length(1, 1500)
  description: string;

  @IsUrl()
  image: string;

  @IsArray()
  @IsNumber({}, { each: true })
  itemsId: number[];
}
