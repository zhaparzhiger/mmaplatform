import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Event } from '../entities/event.entity';
import { CreateEventDto } from '../dto/event/create-event.dto'; // Adjust path
import { UpdateEventDto } from '../dto/event/update-event.dto'; // Adjust path

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  async create(data: CreateEventDto): Promise<Event> {
    const event = this.eventRepository.create(data);
    return this.eventRepository.save(event);
  }

  async findAll(): Promise<Event[]> {
    return this.eventRepository.find({ relations: ['fights'] });
  }

  async findOne(id: number): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['fights'],
    });
    if (!event) throw new NotFoundException(`Event with ID ${id} not found`);
    return event;
  }

  async update(id: number, data: UpdateEventDto): Promise<Event> {
    const event = await this.findOne(id);
    Object.assign(event, data);
    return this.eventRepository.save(event);
  }

  async delete(id: number): Promise<Event> {
    const event = await this.findOne(id);
    await this.eventRepository.delete(id);
    return event;
  }

  async findUpcomingEvents(): Promise<Event[]> {
    return this.eventRepository.find({
      where: { date: MoreThanOrEqual(new Date().toISOString().split('T')[0]) }, // Use 'date'
      order: { date: 'ASC' }, // Use 'date'
      relations: ['fights'],
    });
  }
}