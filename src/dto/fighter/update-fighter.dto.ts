import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsInt, IsString, IsOptional } from 'class-validator';
import { CreateFighterDto } from './create-fighter.dto';

@InputType({ description: 'Данные для обновления бойца (все поля необязательные)' })
export class UpdateFighterDto extends PartialType(CreateFighterDto) {
  @Field(() => Int, { nullable: true, description: 'Количество побед' })
  @IsInt()
  @IsOptional()
  wins?: number;

  @Field(() => Int, { nullable: true, description: 'Количество поражений' })
  @IsInt()
  @IsOptional()
  losses?: number;

  @Field(() => Int, { nullable: true, description: 'Количество ничьих' })
  @IsInt()
  @IsOptional()
  draws?: number;

  @Field(() => Int, { nullable: true, description: 'Количество нокаутов' })
  @IsInt()
  @IsOptional()
  knockouts?: number;

  @Field(() => Int, { nullable: true, description: 'Количество сдач' })
  @IsInt()
  @IsOptional()
  submissions?: number;

  @Field(() => Int, { nullable: true, description: 'Текущая серия' })
  @IsInt()
  @IsOptional()
  currentStreak?: number;

  @Field({ nullable: true, description: 'Тип текущей серии (например, "W" или "L")' })
  @IsString()
  @IsOptional()
  currentStreakType?: string;

  @Field(() => Int, { nullable: true, description: 'Заработок за карьеру' })
  @IsInt()
  @IsOptional()
  careerEarnings?: number;

  @Field({ nullable: true, description: 'Дата последнего боя' })
  @IsString()
  @IsOptional()
  lastFightDate?: string;
}