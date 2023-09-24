import { IsNumber, Min, IsOptional, IsBoolean } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  itemId: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  amount: number;

  @IsOptional()
  @IsBoolean()
  hidden: boolean;
}
