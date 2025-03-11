import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fighter } from '../entities/fighter.entity';
import { CreateFighterDto } from '../dto/fighter/create-fighter.dto';
import { UpdateFighterDto } from '../dto/fighter/update-fighter.dto';
import { WeightClass } from '../entities/weight-class.entity';
@Injectable()
export class FighterService {
  constructor(
    @InjectRepository(Fighter)
    private fighterRepository: Repository<Fighter>,
    @InjectRepository(WeightClass)
    private weightClassRepository: Repository<WeightClass>,
  ) {}

  async create(data: CreateFighterDto): Promise<Fighter> {
    let weightClass: WeightClass | undefined;
    if (data.weightClassId) {
      const foundWeightClass = await this.weightClassRepository.findOne({ where: { id: data.weightClassId } });
      if (!foundWeightClass) throw new NotFoundException(`WeightClass with ID ${data.weightClassId} not found`);
      weightClass = foundWeightClass; // Convert null to undefined implicitly handled
    }

    const fighter = this.fighterRepository.create({
      ...data,
      weightClass, // Now safe: WeightClass | undefined
    });
    return this.fighterRepository.save(fighter);
  }

  async findAll(): Promise<Fighter[]> {
    return this.fighterRepository.find({ relations: ['weightClass'] });
  }

  async findOne(id: number): Promise<Fighter> {
    const fighter = await this.fighterRepository.findOne({
      where: { id },
      relations: ['fightsAsFighter1', 'fightsAsFighter2', 'weightClass'],
    });
    if (!fighter) throw new NotFoundException(`Fighter with ID ${id} not found`);
    return fighter;
  }

  async update(id: number, data: UpdateFighterDto): Promise<Fighter> {
    const fighter = await this.findOne(id);

    if (data.weightClassId !== undefined) {
      let weightClass: WeightClass | undefined;
      if (data.weightClassId) {
        const foundWeightClass = await this.weightClassRepository.findOne({ where: { id: data.weightClassId } });
        if (!foundWeightClass) throw new NotFoundException(`WeightClass with ID ${data.weightClassId} not found`);
        weightClass = foundWeightClass;
      } else {
        weightClass = undefined;
      }
      fighter.weightClass = weightClass;
      fighter.weightClassId = data.weightClassId; 
    }

    Object.assign(fighter, data);
    return this.fighterRepository.save(fighter);
  }

  async delete(id: number): Promise<Fighter> {
    const fighter = await this.findOne(id);
    await this.fighterRepository.delete(id);
    return fighter;
  }

  async getStats(id: number): Promise<any> {
    const fighter = await this.findOne(id);
    return {
      wins: fighter.wins,
      losses: fighter.losses,
      draws: fighter.draws,
      knockouts: fighter.knockouts,
      submissions: fighter.submissions,
      currentStreak: fighter.currentStreak,
      currentStreakType: fighter.currentStreakType,
    };
  }
}