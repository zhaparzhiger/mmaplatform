import { InputType, PartialType } from '@nestjs/graphql';
import { CreateRankingDto } from './create-ranking.dto';

@InputType({ description: 'Данные для обновления рейтинга (все поля необязательные)' })
export class UpdateRankingDto extends PartialType(CreateRankingDto) {}