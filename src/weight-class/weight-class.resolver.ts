import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { WeightClassService } from './weight-class.service';
import { WeightClass } from './weight-class.model';
import { CreateWeightClassDto } from '../dto/weight-class/create-weight-class.dto';
import { UpdateWeightClassDto } from '../dto/weight-class/update-weight-class.dto';

@Resolver(() => WeightClass)
export class WeightClassResolver {
  constructor(private readonly weightClassService: WeightClassService) {}

  @Query(() => [WeightClass], { name: 'weightClasses', description: 'Получить список всех весовых категорий' })
  async getAllWeightClasses() {
    return this.weightClassService.findAll();
  }

  @Query(() => WeightClass, { name: 'weightClass', description: 'Получить весовую категорию по ID' })
  async getWeightClass(@Args('id', { type: () => Int, description: 'ID весовой категории' }) id: number) {
    return this.weightClassService.findOne(id);
  }

  @Mutation(() => WeightClass, { name: 'createWeightClass', description: 'Создать новую весовую категорию' })
  async createWeightClass(@Args('data', { description: 'Данные новой весовой категории' }) data: CreateWeightClassDto) {
    return this.weightClassService.create(data);
  }

  @Mutation(() => WeightClass, { name: 'updateWeightClass', description: 'Обновить данные весовой категории' })
  async updateWeightClass(
    @Args('id', { type: () => Int, description: 'ID весовой категории' }) id: number,
    @Args('data', { description: 'Обновленные данные весовой категории' }) data: UpdateWeightClassDto,
  ) {
    return this.weightClassService.update(id, data);
  }

  @Mutation(() => WeightClass, { name: 'deleteWeightClass', description: 'Удалить весовую категорию' })
  async deleteWeightClass(@Args('id', { type: () => Int, description: 'ID весовой категории' }) id: number) {
    return this.weightClassService.delete(id);
  }
}