import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RankingService } from './ranking.service';
import { RankingResolver } from './ranking.resolver';
import { Ranking } from '../entities/ranking.entity';
import { Fighter } from '../entities/fighter.entity';
import { WeightClass } from '../entities/weight-class.entity';
import { Fight } from '../entities/fight.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ranking, Fighter, WeightClass, Fight])],
  providers: [RankingService, RankingResolver],
})
export class RankingModule {}