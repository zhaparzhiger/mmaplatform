import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { EventService } from './event.service';
import { Event } from './event.model';
import { UpdateEventDto } from 'src/dto/event/update-event.dto';
import { CreateEventDto } from 'src/dto/event/create-event.dto';

@Resolver(() => Event)
export class EventResolver {
  constructor(private readonly eventService: EventService) {}

  @Query(() => [Event], { name: 'events', description: 'Получить список всех событий' })
  async getAllEvents() {
    return this.eventService.findAll();
  }

  @Query(() => Event, { name: 'event', description: 'Получить событие по ID' })
  async getEvent(@Args('id', { type: () => Int, description: 'ID события' }) id: number) {
    return this.eventService.findOne(id);
  }

  @Mutation(() => Event, { name: 'createEvent', description: 'Создать новое событие' })
  async createEvent(@Args('data', { description: 'Данные нового события' }) data: CreateEventDto) {
    return this.eventService.create(data);
  }

  @Mutation(() => Event, { name: 'updateEvent', description: 'Обновить данные события' })
  async updateEvent(
    @Args('id', { type: () => Int, description: 'ID события' }) id: number,
    @Args('data', { description: 'Обновленные данные события' }) data: UpdateEventDto,
  ) {
    return this.eventService.update(id, data);
  }

  @Mutation(() => Event, { name: 'deleteEvent', description: 'Удалить событие' })
  async deleteEvent(@Args('id', { type: () => Int, description: 'ID события' }) id: number) {
    return this.eventService.delete(id);
  }
}