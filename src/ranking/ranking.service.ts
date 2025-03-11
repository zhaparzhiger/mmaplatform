import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ranking as RankingEntity } from '../entities/ranking.entity';
import { Fighter } from '../entities/fighter.entity';
import { WeightClass } from '../entities/weight-class.entity';
import { Fight } from '../entities/fight.entity';
import { Ranking } from './ranking.model';
import { CreateRankingDto } from 'src/dto/ranking/create-ranking.dto';
import { UpdateRankingDto } from 'src/dto/ranking/update-ranking.dto';

@Injectable()
export class RankingService {
  constructor(
    @InjectRepository(RankingEntity)
    private rankingRepository: Repository<RankingEntity>,
    @InjectRepository(Fighter)
    private fighterRepository: Repository<Fighter>,
    @InjectRepository(WeightClass)
    private weightClassRepository: Repository<WeightClass>,
    @InjectRepository(Fight)
    private fightRepository: Repository<Fight>,
  ) {}

  async create(data: CreateRankingDto): Promise<Ranking> {
    const fighter = await this.fighterRepository.findOne({ where: { id: data.fighterId } });
    const weightClass = await this.weightClassRepository.findOne({ where: { id: data.weightClassId } });
    if (!fighter || !weightClass) throw new NotFoundException('Invalid fighter or weight class ID');
  
    // Проверяем, существует ли рейтинг для данной комбинации fighterId и weightClassId
    const existingRanking = await this.rankingRepository.findOne({
      where: { fighterId: data.fighterId, weightClassId: data.weightClassId },
      relations: ['fighter', 'weightClass'],
    });
  
    if (existingRanking) {
      // Если рейтинг уже существует, обновляем его
      existingRanking.rank = data.rank;
      const updatedRanking = await this.rankingRepository.save(existingRanking);
      return this.mapEntityToModel(updatedRanking);
    }
  
    // Если рейтинга нет, создаем новый
    const rankingEntity = this.rankingRepository.create({
      fighter,
      fighterId: data.fighterId,
      weightClass,
      weightClassId: data.weightClassId,
      rank: data.rank,
    });
    const savedRanking = await this.rankingRepository.save(rankingEntity);
    return this.mapEntityToModel(savedRanking);
  }

  async findAll(): Promise<Ranking[]> {
    const rankings = await this.rankingRepository.find({ relations: ['fighter', 'weightClass'] });
    return rankings.map(this.mapEntityToModel);
  }

  async findOne(id: number): Promise<Ranking> {
    const ranking = await this.rankingRepository.findOne({
      where: { id },
      relations: ['fighter', 'weightClass'],
    });
    if (!ranking) throw new NotFoundException(`Ranking with ID ${id} not found`);
    return this.mapEntityToModel(ranking);
  }

  async update(id: number, data: UpdateRankingDto): Promise<Ranking> {
    const ranking = await this.findOne(id);
    if (data.fighterId) {
      const fighter = await this.fighterRepository.findOne({ where: { id: data.fighterId } });
      if (!fighter) throw new NotFoundException(`Fighter with ID ${data.fighterId} not found`);
      ranking.fighter = fighter;
      ranking.fighterId = data.fighterId;
    }
    if (data.weightClassId) {
      const weightClass = await this.weightClassRepository.findOne({ where: { id: data.weightClassId } });
      if (!weightClass) throw new NotFoundException(`WeightClass with ID ${data.weightClassId} not found`);
      ranking.weightClass = weightClass;
      ranking.weightClassId = data.weightClassId;
    }
    if (data.rank !== undefined) ranking.rank = data.rank;
    const updatedRanking = await this.rankingRepository.save(ranking);
    return this.mapEntityToModel(updatedRanking);
  }

  async delete(id: number): Promise<Ranking> {
    const ranking = await this.findOne(id);
    await this.rankingRepository.delete(id);
    return ranking;
  }

  async findByWeightClass(weightClassId: number): Promise<Ranking[]> {
    const rankings = await this.rankingRepository.find({
      where: { weightClassId },
      order: { rank: 'ASC' },
      relations: ['fighter', 'weightClass'],
    });
    return rankings.map(this.mapEntityToModel);
  }

  async updateRankings(fightId: number): Promise<void> {
    const fight = await this.fightRepository.findOne({
      where: { id: fightId },
      relations: ['fighter1', 'fighter2', 'winner', 'fighter1.weightClass', 'fighter2.weightClass'],
    });

    if (!fight) throw new NotFoundException(`Fight with ID ${fightId} not found`);
    if (!fight.winner) return;

    const winner = fight.winner;
    const loser = fight.winner.id === fight.fighter1.id ? fight.fighter2 : fight.fighter1;

    const winnerWeightClassId = fight.fighter1.weightClass?.id;
    const loserWeightClassId = fight.fighter2.weightClass?.id;

    if (!winnerWeightClassId || !loserWeightClassId || winnerWeightClassId !== loserWeightClassId) {
      throw new Error('Fighters must be in the same weight class for ranking updates');
    }

    const weightClassId = winnerWeightClassId;

    const winnerRanking = await this.rankingRepository.findOne({
      where: { fighterId: winner.id, weightClassId },
    });
    const loserRanking = await this.rankingRepository.findOne({
      where: { fighterId: loser.id, weightClassId },
    });

    if (!loserRanking) {
      if (!winnerRanking) {
        await this.createInitialRanking(winner.id, weightClassId, 10);
      }
      return;
    }

    if (!winnerRanking || winnerRanking.rank > loserRanking.rank) {
      const newWinnerRank = loserRanking.rank;
      await this.rankingRepository.update(loserRanking.id, { rank: loserRanking.rank + 1 });

      if (winnerRanking) {
        await this.rankingRepository.update(winnerRanking.id, { rank: newWinnerRank });
      } else {
        const winnerWeightClass = await this.weightClassRepository.findOne({ where: { id: weightClassId } });
        if (!winnerWeightClass) throw new Error('Weight class not found');
        const newRanking = this.rankingRepository.create({
          fighter: winner,
          fighterId: winner.id,
          weightClass: winnerWeightClass,
          weightClassId,
          rank: newWinnerRank,
        });
        await this.rankingRepository.save(newRanking);
      }

      await this.adjustRankingsAfterUpdate(weightClassId, newWinnerRank);
    }
  }

  private async createInitialRanking(fighterId: number, weightClassId: number, initialRank: number): Promise<void> {
    const fighter = await this.fighterRepository.findOne({ where: { id: fighterId } });
    const weightClass = await this.weightClassRepository.findOne({ where: { id: weightClassId } });
    if (!fighter || !weightClass) throw new NotFoundException('Invalid fighter or weight class ID');

    const existingRanking = await this.rankingRepository.findOne({ where: { fighterId, weightClassId } });
    if (!existingRanking) {
      const ranking = this.rankingRepository.create({
        fighter,
        fighterId,
        weightClass,
        weightClassId,
        rank: initialRank,
      });
      await this.rankingRepository.save(ranking);
    }
  }

  private async adjustRankingsAfterUpdate(weightClassId: number, updatedRank: number): Promise<void> {
    const rankings = await this.rankingRepository.find({
      where: { weightClassId },
      order: { rank: 'ASC' },
    });

    for (let i = 0; i < rankings.length; i++) {
      const expectedRank = i + 1;
      if (rankings[i].rank !== expectedRank) {
        await this.rankingRepository.update(rankings[i].id, { rank: expectedRank });
      }
    }
  }

  private mapEntityToModel(entity: RankingEntity): Ranking {
    return {
      id: entity.id,
      fighterId: entity.fighterId,
      fighter: entity.fighter, // Передаем объект Fighter
      weightClassId: entity.weightClassId,
      weightClass: entity.weightClass, // Передаем объект WeightClass
      rank: entity.rank,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  } 
}