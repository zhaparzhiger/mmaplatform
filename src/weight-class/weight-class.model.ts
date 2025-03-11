import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType({ description: 'Модель весовой категории для GraphQL' })
export class WeightClass {
  @Field(() => Int, { description: 'Уникальный идентификатор весовой категории' })
  id: number;

  @Field({ description: 'Название весовой категории' })
  name: string;

  @Field(() => Float, { description: 'Минимальный вес в килограммах' })
  minWeight: number;

  @Field(() => Float, { description: 'Максимальный вес в килограммах' })
  maxWeight: number;

  @Field({ description: 'Дата создания записи' })
  createdAt: Date;

  @Field({ description: 'Дата последнего обновления записи' })
  updatedAt: Date;
}