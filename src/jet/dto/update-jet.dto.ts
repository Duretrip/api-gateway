import { PartialType } from '@nestjs/mapped-types';
import { CreateJetDto } from './create-jet.dto';

export class UpdateJetDto extends PartialType(CreateJetDto) {}
