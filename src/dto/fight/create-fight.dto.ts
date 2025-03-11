import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString, IsDateString } from 'class-validator';

@InputType({ description: 'Данные для создания нового боя' })
export class CreateFightDto {
  @Field(() => Int, { description: 'ID события (обязательное поле)' })
  @IsNumber()
  eventId: number;

  @Field(() => Int, { description: 'ID первого бойца (обязательное поле)' })
  @IsNumber()
  fighter1Id: number;

  @Field(() => Int, { description: 'ID второго бойца (обязательное поле)' })
  @IsNumber()
  fighter2Id: number;

  @Field(() => Int, { nullable: true, description: 'ID победителя' })
  @IsNumber()
  @IsOptional()
  winnerId?: number;

  @Field({ nullable: true, description: 'Метод победы (например, KO, SUB, DEC)' })
  @IsString()
  @IsOptional()
  method?: string;

  @Field(() => Int, { nullable: true, description: 'Раунд окончания боя' })
  @IsNumber()
  @IsOptional()
  round?: number;

  @Field({ nullable: true, description: 'Время окончания боя в формате MM:SS' })
  @IsString()
  @IsOptional()
  time?: string;

  @Field({ nullable: true, description: 'Дата боя в формате YYYY-MM-DD' })
  @IsDateString()
  @IsOptional()
  fightDate?: string;
}