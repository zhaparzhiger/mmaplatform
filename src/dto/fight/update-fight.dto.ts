import { InputType, PartialType } from '@nestjs/graphql';
import { CreateFightDto } from './create-fight.dto';

@InputType({ description: 'Данные для обновления боя (все поля необязательные)' })
export class UpdateFightDto extends PartialType(CreateFightDto) {}