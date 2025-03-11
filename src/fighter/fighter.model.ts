import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType({ description: 'Модель бойца для GraphQL' })
export class Fighter {
  @Field(() => Int, { description: 'Уникальный идентификатор бойца' })
  id: number;

  @Field({ description: 'Имя бойца' })
  firstName: string;

  @Field({ description: 'Фамилия бойца' })
  lastName: string;

  @Field({ nullable: true, description: 'Прозвище бойца' })
  nickname?: string;

  @Field({ nullable: true, description: 'Дата рождения в формате YYYY-MM-DD' })
  dateOfBirth?: string;

  @Field(() => Float, { nullable: true, description: 'Рост бойца в сантиметрах' })
  height?: number;

  @Field(() => Float, { nullable: true, description: 'Размах рук в сантиметрах' })
  reach?: number;

  @Field(() => Int, { nullable: true, description: 'ID весовой категории' })
  weightClassId?: number;

  @Field(() => Float, { nullable: true, description: 'Последний взвешенный вес в килограммах' })
  lastWeighIn?: number;

  @Field({ nullable: true, description: 'Команда или аффилиация бойца' })
  affiliation?: string;

  @Field({ nullable: true, description: 'Место рождения бойца' })
  born?: string;

  @Field({ nullable: true, description: 'Место базирования бойца' })
  fightingOutOf?: string;

  @Field(() => Int, { description: 'Количество побед' })
  wins: number;

  @Field(() => Int, { description: 'Количество поражений' })
  losses: number;

  @Field(() => Int, { description: 'Количество ничьих' })
  draws: number;

  @Field(() => Int, { description: 'Количество нокаутов' })
  knockouts: number;

  @Field(() => Int, { description: 'Количество сабмишенов' })
  submissions: number;

  @Field(() => Int, { description: 'Текущая серия (количество боев)' })
  currentStreak: number;

  @Field({ nullable: true, description: 'Тип текущей серии: W (победа), L (поражение), D (ничья)' })
  currentStreakType?: string;

  @Field(() => Float, { nullable: true, description: 'Карьерные заработки в USD' })
  careerEarnings?: number;

  @Field({ nullable: true, description: 'Дата последнего боя в формате YYYY-MM-DD' })
  lastFightDate?: string;

  @Field({ description: 'Дата создания записи' })
  createdAt: Date;

  @Field({ description: 'Дата последнего обновления записи' })
  updatedAt: Date;
}