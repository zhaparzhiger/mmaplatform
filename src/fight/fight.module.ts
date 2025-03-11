import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FightService } from './fight.service';
import { FightResolver } from './fight.resolver';
import { Fight } from '../entities/fight.entity';
import { Fighter } from '../entities/fighter.entity';
import { Event } from '../entities/event.entity';
import { Ranking } from '../entities/ranking.entity';
import { RankingService } from '../ranking/ranking.service';
import { WeightClass } from '../entities/weight-class.entity'; // Add this import

@Module({
  imports: [
    TypeOrmModule.forFeature([Fight, Fighter, Event, Ranking, WeightClass]), // Add WeightClass here
  ],
  providers: [FightService, FightResolver, RankingService],
})
export class FightModule {}