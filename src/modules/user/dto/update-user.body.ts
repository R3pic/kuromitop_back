import {
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { INTRODUCTION } from '@user/constants';

export class UpdateUserBody {
  @IsOptional()
  @IsString()
  @MaxLength(INTRODUCTION.MAX_LENGTH)
  introduction: string;
}