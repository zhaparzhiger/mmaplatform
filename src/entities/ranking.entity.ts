import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from 'typeorm';
import { Fighter } from './fighter.entity';
import { WeightClass } from './weight-class.entity';

@Entity('rankings')
@Unique(['fighterId', 'weightClassId'])
@Unique(['weightClassId', 'rank'])
export class Ranking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fighterId: number;

  @ManyToOne(() => Fighter, (fighter) => fighter.rankings, { onDelete: 'CASCADE' })
  fighter: Fighter;

  @Column()
  weightClassId: number;

  @ManyToOne(() => WeightClass, (weightClass) => weightClass.rankings)
  weightClass: WeightClass;

  @Column()
  rank: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}