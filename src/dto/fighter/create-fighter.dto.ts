import { InputType, Field, Float } from '@nestjs/graphql';
import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';

@InputType({ description: 'Данные для создания нового бойца' })
export class CreateFighterDto {
  @Field({ description: 'Имя бойца (обязательное поле)' })
  @IsString()
  firstName: string;

  @Field({ description: 'Фамилия бойца (обязательное поле)' })
  @IsString()
  lastName: string;

  @Field({ nullable: true, description: 'Прозвище бойца' })
  @IsString()
  @IsOptional()
  nickname?: string;

  @Field({ nullable: true, description: 'Дата рождения в формате YYYY-MM-DD' })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @Field(() => Float, { nullable: true, description: 'Рост бойца в сантиметрах' })
  @IsNumber()
  @IsOptional()
  height?: number;

  @Field(() => Float, { nullable: true, description: 'Размах рук в сантиметрах' })
  @IsNumber()
  @IsOptional()
  reach?: number;

  @Field(() => Float, { nullable: true, description: 'Последний взвешенный вес в килограммах' })
  @IsNumber()
  @IsOptional()
  lastWeighIn?: number;

  @Field({ nullable: true, description: 'Команда или аффилиация бойца' })
  @IsString()
  @IsOptional()
  affiliation?: string;

  @Field({ nullable: true, description: 'Место рождения бойца' })
  @IsString()
  @IsOptional()
  born?: string;

  @Field({ nullable: true, description: 'Место базирования бойца' })
  @IsString()
  @IsOptional()
  fightingOutOf?: string;

  @Field({ nullable: true, description: 'ID весовой категории' })
  @IsNumber()
  @IsOptional()
  weightClassId?: number;
}