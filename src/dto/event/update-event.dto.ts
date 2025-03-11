import { InputType, PartialType } from '@nestjs/graphql';
import { CreateEventDto } from './create-event.dto';

@InputType({ description: 'Данные для обновления события (все поля необязательные)' })
export class UpdateEventDto extends PartialType(CreateEventDto) {}