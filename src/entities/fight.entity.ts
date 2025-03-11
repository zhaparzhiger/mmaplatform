import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Fighter } from './fighter.entity';
import { Event } from './event.entity';

@Entity('fights')
export class Fight {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  eventId: number;

  @ManyToOne(() => Event, (event) => event.fights, { onDelete: 'CASCADE' })
  event: Event;

  @Column()
  fighter1Id: number;

  @ManyToOne(() => Fighter, (fighter) => fighter.fightsAsFighter1)
  fighter1: Fighter;

  @Column()
  fighter2Id: number;

  @ManyToOne(() => Fighter, (fighter) => fighter.fightsAsFighter2)
  fighter2: Fighter;

  @Column({ nullable: true })
  winnerId?: number;

  @ManyToOne(() => Fighter, (fighter) => fighter.winsFights, { nullable: true })
  winner?: Fighter;

  @Column({ nullable: true })
  method?: string;

  @Column({ nullable: true })
  round?: number;

  @Column({ nullable: true })
  time?: string;

  @Column({ type: 'date', nullable: true })
  fightDate?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}