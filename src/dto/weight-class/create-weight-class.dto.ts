import { InputType, Field, Float } from '@nestjs/graphql';
import { IsString, IsNumber } from 'class-validator';

@InputType({ description: 'Данные для создания новой весовой категории' })
export class CreateWeightClassDto {
  @Field({ description: 'Название весовой категории (обязательное поле)' })
  @IsString()
  name: string;

  @Field(() => Float, { description: 'Минимальный вес в килограммах (обязательное поле)' })
  @IsNumber()
  minWeight: number;

  @Field(() => Float, { description: 'Максимальный вес в килограммах (обязательное поле)' })
  @IsNumber()
  maxWeight: number;
}