import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { WeightClass } from './weight-class.entity';
import { Fight } from './fight.entity';
import { Ranking } from './ranking.entity';

@Entity('fighters')
export class Fighter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  nickname?: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth?: string;

  @Column({ type: 'float', nullable: true })
  height?: number;

  @Column({ type: 'float', nullable: true })
  reach?: number;

  @Column({ nullable: true }) // Add scalar ID as nullable
  weightClassId?: number;

  @ManyToOne(() => WeightClass, (weightClass) => weightClass.fighters, { nullable: true }) // Make optional
  weightClass?: WeightClass;

  @Column({ type: 'float', nullable: true })
  lastWeighIn?: number;

  @Column({ nullable: true })
  affiliation?: string;

  @Column({ nullable: true })
  born?: string;

  @Column({ nullable: true })
  fightingOutOf?: string;

  @Column({ default: 0 })
  wins: number;

  @Column({ default: 0 })
  losses: number;

  @Column({ default: 0 })
  draws: number;

  @Column({ default: 0 })
  knockouts: number;

  @Column({ default: 0 })
  submissions: number;

  @Column({ default: 0 })
  currentStreak: number;

  @Column({ nullable: true })
  currentStreakType?: string;

  @Column({ type: 'float', nullable: true })
  careerEarnings?: number;

  @Column({ type: 'date', nullable: true })
  lastFightDate?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => Fight, (fight) => fight.fighter1)
  fightsAsFighter1: Fight[];

  @OneToMany(() => Fight, (fight) => fight.fighter2)
  fightsAsFighter2: Fight[];

  @OneToMany(() => Fight, (fight) => fight.winner)
  winsFights: Fight[];

  @OneToMany(() => Ranking, (ranking) => ranking.fighter)
  rankings: Ranking[];
}