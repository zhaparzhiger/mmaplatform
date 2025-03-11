import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType({ description: 'Модель боя для GraphQL' })
export class Fight {
  @Field(() => Int, { description: 'Уникальный идентификатор боя' })
  id: number;

  @Field(() => Int, { description: 'ID события' })
  eventId: number;

  @Field(() => Int, { description: 'ID первого бойца' })
  fighter1Id: number;

  @Field(() => Int, { description: 'ID второго бойца' })
  fighter2Id: number;

  @Field(() => Int, { nullable: true, description: 'ID победителя' })
  winnerId?: number;

  @Field({ nullable: true, description: 'Метод победы (например, KO, SUB, DEC)' })
  method?: string;

  @Field(() => Int, { nullable: true, description: 'Раунд окончания боя' })
  round?: number;

  @Field({ nullable: true, description: 'Время окончания боя в формате MM:SS' })
  time?: string;

  @Field({ nullable: true, description: 'Дата боя в формате YYYY-MM-DD' })
  fightDate?: string;

  @Field({ description: 'Дата создания записи' })
  createdAt: Date;

  @Field({ description: 'Дата последнего обновления записи' })
  updatedAt: Date;
}