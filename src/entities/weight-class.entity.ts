import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Fighter } from './fighter.entity';
import { Ranking } from './ranking.entity';

@Entity('weight_classes')
export class WeightClass {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'float' })
  minWeight: number;

  @Column({ type: 'float' })
  maxWeight: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => Fighter, (fighter) => fighter.weightClass)
  fighters: Fighter[];

  @OneToMany(() => Ranking, (ranking) => ranking.weightClass)
  rankings: Ranking[];
}