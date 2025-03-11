import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsDateString, IsOptional } from 'class-validator';

@InputType({ description: 'Данные для создания нового события' })
export class CreateEventDto {
  @Field({ description: 'Название события (обязательное поле)' })
  @IsString()
  name: string;

  @Field({ description: 'Дата события в формате YYYY-MM-DD (обязательное поле)' })
  @IsDateString()
  date: string;

  @Field({ nullable: true, description: 'Место проведения события' })
  @IsString()
  @IsOptional()
  location?: string;
}