import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { FightService } from './fight.service';
import { Fight } from './fight.model';
import { CreateFightDto } from '../dto/fight/create-fight.dto';
import { UpdateFightDto } from '../dto/fight/update-fight.dto';

@Resolver(() => Fight)
export class FightResolver {
  constructor(private readonly fightService: FightService) {}

  @Query(() => [Fight], { name: 'fights', description: 'Получить список всех боев' })
  async getAllFights() {
    return this.fightService.findAll();
  }

  @Query(() => Fight, { name: 'fight', description: 'Получить бой по ID' })
  async getFight(@Args('id', { type: () => Int, description: 'ID боя' }) id: number) {
    return this.fightService.findOne(id);
  }

  @Mutation(() => Fight, { name: 'createFight', description: 'Создать новый бой' })
  async createFight(@Args('data', { description: 'Данные нового боя' }) data: CreateFightDto) {
    return this.fightService.create(data);
  }

  @Mutation(() => Fight, { name: 'updateFight', description: 'Обновить данные боя' })
  async updateFight(
    @Args('id', { type: () => Int, description: 'ID боя' }) id: number,
    @Args('data', { description: 'Обновленные данные боя' }) data: UpdateFightDto,
  ) {
    return this.fightService.update(id, data);
  }

  @Mutation(() => Fight, { name: 'deleteFight', description: 'Удалить бой' })
  async deleteFight(@Args('id', { type: () => Int, description: 'ID боя' }) id: number) {
    return this.fightService.delete(id);
  }
}