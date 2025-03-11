import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FighterService } from './fighter.service';
import { FighterResolver } from './fighter.resolver';
import { Fighter } from '../entities/fighter.entity';
import { WeightClass } from '../entities/weight-class.entity'; // Add this

@Module({
  imports: [TypeOrmModule.forFeature([Fighter, WeightClass])], // Add WeightClass
  providers: [FighterService, FighterResolver],
})
export class FighterModule {}