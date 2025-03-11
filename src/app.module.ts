import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fighter } from './entities/fighter.entity';
import { Fight } from './entities/fight.entity';
import { Ranking } from './entities/ranking.entity';
import { Event } from './entities/event.entity';
import { FighterModule } from './fighter/fighter.module';
import { EventModule } from './event/event.module';
import { FightModule } from './fight/fight.module';
import { WeightClassModule } from './weight-class/weight-class.module';
import { RankingModule } from './ranking/ranking.module';
import { WeightClass } from './entities/weight-class.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'mma',
      entities: [Event, Fight, Fighter, WeightClass, Ranking],
      synchronize: true,
      logging: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    FighterModule,
    EventModule,
    FightModule,
    RankingModule,
    WeightClassModule
  ],
})
export class AppModule {}
