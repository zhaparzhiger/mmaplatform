import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@InputType({ description: 'Данные для создания нового рейтинга' })
export class CreateRankingDto {
  @Field(() => Int, { description: 'ID бойца (обязательное поле)' })
  @IsNumber()
  fighterId: number;

  @Field(() => Int, { description: 'ID весовой категории (обязательное поле)' })
  @IsNumber()
  weightClassId: number;

  @Field(() => Int, { description: 'Позиция в рейтинге (обязательное поле)' })
  @IsNumber()
  rank: number;
}