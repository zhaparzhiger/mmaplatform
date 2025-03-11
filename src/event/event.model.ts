import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType({ description: 'Модель события для GraphQL' })
export class Event {
  @Field(() => Int, { description: 'Уникальный идентификатор события' })
  id: number;

  @Field({ description: 'Название события' })
  name: string;

  @Field({ description: 'Дата события в формате YYYY-MM-DD' })
  date: string;

  @Field({ nullable: true, description: 'Место проведения события' })
  location?: string;

  @Field({ description: 'Дата создания записи' })
  createdAt: Date;

  @Field({ description: 'Дата последнего обновления записи' })
  updatedAt: Date;
}