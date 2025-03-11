import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WeightClass as WeightClassEntity } from '../entities/weight-class.entity';
import { CreateWeightClassDto } from '../dto/weight-class/create-weight-class.dto';
import { UpdateWeightClassDto } from '../dto/weight-class/update-weight-class.dto';
import { WeightClass } from './weight-class.model';

@Injectable()
export class WeightClassService {
  constructor(
    @InjectRepository(WeightClassEntity)
    private weightClassRepository: Repository<WeightClassEntity>,
  ) {}

  async create(data: CreateWeightClassDto): Promise<WeightClass> {
    const weightClassEntity = this.weightClassRepository.create(data);
    const savedWeightClass = await this.weightClassRepository.save(weightClassEntity);
    return this.mapEntityToModel(savedWeightClass);
  }

  async findAll(): Promise<WeightClass[]> {
    const weightClasses = await this.weightClassRepository.find();
    return weightClasses.map(this.mapEntityToModel);
  }

  async findOne(id: number): Promise<WeightClass> {
    const weightClass = await this.weightClassRepository.findOne({ where: { id } });
    if (!weightClass) throw new NotFoundException(`WeightClass with ID ${id} not found`);
    return this.mapEntityToModel(weightClass);
  }

  async update(id: number, data: UpdateWeightClassDto): Promise<WeightClass> {
    const weightClass = await this.findOne(id);
    Object.assign(weightClass, data);
    const updatedWeightClass = await this.weightClassRepository.save(weightClass);
    return this.mapEntityToModel(updatedWeightClass);
  }

  async delete(id: number): Promise<WeightClass> {
    const weightClass = await this.findOne(id);
    await this.weightClassRepository.delete(id);
    return weightClass;
  }

  private mapEntityToModel(entity: WeightClassEntity): WeightClass {
    return {
      id: entity.id,
      name: entity.name,
      minWeight: entity.minWeight,
      maxWeight: entity.maxWeight,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}