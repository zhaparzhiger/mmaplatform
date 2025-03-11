import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { FighterService } from './fighter.service';
import { Fighter } from './fighter.model';
import { CreateFighterDto } from '../dto/fighter/create-fighter.dto';
import { UpdateFighterDto } from '../dto/fighter/update-fighter.dto';
import { FighterStats } from '../dto/fighter/fighter-stats.dto';

@Resolver(() => Fighter)
export class FighterResolver {
  constructor(private readonly fighterService: FighterService) {}

  @Query(() => [Fighter], { name: 'fighters', description: 'Получить список всех бойцов' })
  async getAllFighters() {
    return this.fighterService.findAll();
  }

  @Query(() => Fighter, { name: 'fighter', description: 'Получить бойца по ID' })
  async getFighter(@Args('id', { type: () => Int, description: 'ID бойца' }) id: number) {
    return this.fighterService.findOne(id);
  }

  @Mutation(() => Fighter, { name: 'createFighter', description: 'Создать нового бойца' })
  async createFighter(@Args('data', { description: 'Данные нового бойца' }) data: CreateFighterDto) {
    return this.fighterService.create(data);
  }

  @Mutation(() => Fighter, { name: 'updateFighter', description: 'Обновить данные бойца' })
  async updateFighter(
    @Args('id', { type: () => Int, description: 'ID бойца' }) id: number,
    @Args('data', { description: 'Обновленные данные бойца' }) data: UpdateFighterDto,
  ) {
    return this.fighterService.update(id, data);
  }

  @Mutation(() => Fighter, { name: 'deleteFighter', description: 'Удалить бойца' })
  async deleteFighter(@Args('id', { type: () => Int, description: 'ID бойца' }) id: number) {
    return this.fighterService.delete(id);
  }

  @Query(() => FighterStats, { name: 'fighterStats', description: 'Получить статистику бойца по ID' })
  async getFighterStats(@Args('id', { type: () => Int, description: 'ID бойца' }) id: number) {
    return this.fighterService.getStats(id);
  }
}