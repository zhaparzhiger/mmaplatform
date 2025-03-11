import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Fighter } from '../fighter/fighter.model'; // Импорт модели Fighter
import { WeightClass } from '../weight-class/weight-class.model'; // Импорт модели WeightClass

@ObjectType({ description: 'Модель рейтинга для GraphQL' })
export class Ranking {
  @Field(() => Int, { description: 'Уникальный идентификатор рейтинга' })
  id: number;

  @Field(() => Int, { description: 'ID бойца' })
  fighterId: number;

  @Field(() => Fighter, { description: 'Объект бойца' })
  fighter: Fighter;

  @Field(() => Int, { description: 'ID весовой категории' })
  weightClassId: number;

  @Field(() => WeightClass, { description: 'Объект весовой категории' })
  weightClass: WeightClass;

  @Field(() => Int, { description: 'Позиция в рейтинге' })
  rank: number;

  @Field({ description: 'Дата создания записи' })
  createdAt: Date;

  @Field({ description: 'Дата последнего обновления записи' })
  updatedAt: Date;
}