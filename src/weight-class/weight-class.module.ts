import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeightClass } from '../entities/weight-class.entity';
import { WeightClassService } from './weight-class.service';
import { WeightClassResolver } from './weight-class.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([WeightClass])],
  providers: [WeightClassService, WeightClassResolver],
  exports: [WeightClassService], // Экспортируем сервис для использования в других модулях
})
export class WeightClassModule {}