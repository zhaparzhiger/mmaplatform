import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fight } from '../entities/fight.entity';
import { Fighter } from '../entities/fighter.entity';
import { Event } from '../entities/event.entity';
import { CreateFightDto } from '../dto/fight/create-fight.dto'; // Adjust path if needed
import { UpdateFightDto } from '../dto/fight/update-fight.dto'; // Adjust path if needed
import { RankingService } from '../ranking/ranking.service';

@Injectable()
export class FightService {
  constructor(
    @InjectRepository(Fight)
    private fightRepository: Repository<Fight>,
    @InjectRepository(Fighter)
    private fighterRepository: Repository<Fighter>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    private rankingService: RankingService,
  ) {}

  async create(data: CreateFightDto): Promise<Fight> {
    const event = await this.eventRepository.findOne({ where: { id: data.eventId } });
    const fighter1 = await this.fighterRepository.findOne({ where: { id: data.fighter1Id } });
    const fighter2 = await this.fighterRepository.findOne({ where: { id: data.fighter2Id } });
    const winner = data.winnerId ? await this.fighterRepository.findOne({ where: { id: data.winnerId } }) : undefined;

    if (!event || !fighter1 || !fighter2 || (data.winnerId && !winner)) {
      throw new NotFoundException('Invalid event or fighter ID');
    }

    const fight = this.fightRepository.create({
      eventId: data.eventId,
      fighter1Id: data.fighter1Id,
      fighter2Id: data.fighter2Id,
      winnerId: data.winnerId,
      method: data.method,
      round: data.round,
      time: data.time,
      fightDate: data.fightDate,
    });

    fight.event = event;
    fight.fighter1 = fighter1;
    fight.fighter2 = fighter2;
    fight.winner = winner ?? undefined;

    const savedFight = await this.fightRepository.save(fight);
    if (data.winnerId) await this.updateFighterStats(savedFight);
    await this.rankingService.updateRankings(savedFight.id);
    return savedFight;
  }

  async findAll(): Promise<Fight[]> {
    return this.fightRepository.find({ relations: ['event', 'fighter1', 'fighter2', 'winner'] });
  }

  async findOne(id: number): Promise<Fight> {
    const fight = await this.fightRepository.findOne({
      where: { id },
      relations: ['event', 'fighter1', 'fighter2', 'winner'],
    });
    if (!fight) throw new NotFoundException(`Fight with ID ${id} not found`);
    return fight;
  }

  async update(id: number, data: UpdateFightDto): Promise<Fight> {
    const fight = await this.findOne(id);

    Object.assign(fight, {
      method: data.method,
      round: data.round,
      time: data.time,
      fightDate: data.fightDate,
    });

    if (data.eventId) {
      const event = await this.eventRepository.findOne({ where: { id: data.eventId } });
      if (!event) throw new NotFoundException(`Event with ID ${data.eventId} not found`);
      fight.event = event;
      fight.eventId = data.eventId;
    }
    if (data.fighter1Id) {
      const fighter1 = await this.fighterRepository.findOne({ where: { id: data.fighter1Id } });
      if (!fighter1) throw new NotFoundException(`Fighter with ID ${data.fighter1Id} not found`);
      fight.fighter1 = fighter1;
      fight.fighter1Id = data.fighter1Id;
    }
    if (data.fighter2Id) {
      const fighter2 = await this.fighterRepository.findOne({ where: { id: data.fighter2Id } });
      if (!fighter2) throw new NotFoundException(`Fighter with ID ${data.fighter2Id} not found`);
      fight.fighter2 = fighter2;
      fight.fighter2Id = data.fighter2Id;
    }
    if (data.winnerId !== undefined) {
      const winner = data.winnerId ? await this.fighterRepository.findOne({ where: { id: data.winnerId } }) : undefined;
      if (data.winnerId && !winner) throw new NotFoundException(`Winner with ID ${data.winnerId} not found`);
      fight.winner = winner ?? undefined;
      fight.winnerId = data.winnerId;
    }

    const updatedFight = await this.fightRepository.save(fight);
    if (data.winnerId) await this.updateFighterStats(updatedFight);
    await this.rankingService.updateRankings(updatedFight.id);
    return updatedFight;
  }

  async delete(id: number): Promise<Fight> {
    const fight = await this.findOne(id);
    await this.fightRepository.delete(id);
    return fight;
  }

  private async updateFighterStats(fight: Fight) {
    if (!fight.winner) {
      throw new Error('No winner specified for fight stats update');
    }

    const winner = await this.fighterRepository.findOne({ where: { id: fight.winner.id } });
    if (!winner) throw new NotFoundException(`Winner with ID ${fight.winner.id} not found`);

    const loser = fight.winner.id === fight.fighter1.id ? fight.fighter2 : fight.fighter1;

    await this.fighterRepository.update(winner.id, {
      wins: winner.wins + 1,
      knockouts: fight.method === 'KO' ? winner.knockouts + 1 : winner.knockouts,
      submissions: fight.method === 'Submission' ? winner.submissions + 1 : winner.submissions,
      currentStreak: winner.currentStreak >= 0 ? winner.currentStreak + 1 : 1,
      currentStreakType: 'Win',
      lastFightDate: fight.fightDate || new Date().toISOString().split('T')[0],
    });

    await this.fighterRepository.update(loser.id, {
      losses: loser.losses + 1,
      currentStreak: loser.currentStreak <= 0 ? loser.currentStreak - 1 : -1,
      currentStreakType: 'Loss',
      lastFightDate: fight.fightDate || new Date().toISOString().split('T')[0],
    });
  }
}