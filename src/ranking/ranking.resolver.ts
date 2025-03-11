import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RankingService } from './ranking.service';
import { Ranking } from './ranking.model';
import { CreateRankingDto } from 'src/dto/ranking/create-ranking.dto';
import { UpdateRankingDto } from 'src/dto/ranking/update-ranking.dto';

@Resolver(() => Ranking)
export class RankingResolver {
  constructor(private readonly rankingService: RankingService) {}

  @Query(() => [Ranking], { name: 'rankings', description: 'Получить список всех рейтингов' })
  async getAllRankings() {
    return this.rankingService.findAll();
  }

  @Query(() => Ranking, { name: 'ranking', description: 'Получить рейтинг по ID' })
  async getRanking(@Args('id', { type: () => Int, description: 'ID рейтинга' }) id: number) {
    return this.rankingService.findOne(id);
  }

  @Query(() => [Ranking], {
    name: 'rankingsByWeightClass',
    description: 'Получить список рейтингов в заданной весовой категории',
  })
  async getRankingsByWeightClass(
    @Args('weightClassId', { type: () => Int, description: 'ID весовой категории' }) weightClassId: number,
  ): Promise<Ranking[]> {
    return this.rankingService.findByWeightClass(weightClassId);
  }

  @Mutation(() => Ranking, { name: 'createRanking', description: 'Создать новый рейтинг' })
  async createRanking(@Args('data', { description: 'Данные нового рейтинга' }) data: CreateRankingDto) {
    return this.rankingService.create(data);
  }

  @Mutation(() => Ranking, { name: 'updateRanking', description: 'Обновить данные рейтинга' })
  async updateRanking(
    @Args('id', { type: () => Int, description: 'ID рейтинга' }) id: number,
    @Args('data', { description: 'Обновленные данные рейтинга' }) data: UpdateRankingDto,
  ) {
    return this.rankingService.update(id, data);
  }

  @Mutation(() => Ranking, { name: 'deleteRanking', description: 'Удалить рейтинг' })
  async deleteRanking(@Args('id', { type: () => Int, description: 'ID рейтинга' }) id: number) {
    return this.rankingService.delete(id);
  }

  @Mutation(() => Boolean, {
    name: 'updateRankingsAfterFight',
    description: 'Обновляет рейтинги бойцов после завершения боя',
  })
  async updateRankingsAfterFight(
    @Args('fightId', { type: () => Int, description: 'ID боя, после которого обновляются рейтинги' }) fightId: number,
  ): Promise<boolean> {
    await this.rankingService.updateRankings(fightId);
    return true;
  }
}