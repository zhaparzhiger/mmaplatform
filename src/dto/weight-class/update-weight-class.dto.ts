import { InputType, Field, Float, PartialType } from '@nestjs/graphql';
import { CreateWeightClassDto } from './create-weight-class.dto';

@InputType({ description: 'Данные для обновления весовой категории (все поля необязательные)' })
export class UpdateWeightClassDto extends PartialType(CreateWeightClassDto) {}