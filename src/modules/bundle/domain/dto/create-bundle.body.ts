import {
  IsBoolean,
  IsDefined,
  IsString,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BUNDLE_TITLE } from '@bundle/constants';

export class CreateBundleBody {
  @ApiProperty()
  @IsDefined()
  @IsString()
  @Length(3, BUNDLE_TITLE.MAX_LENGTH)
  title: string;

  @ApiProperty()
  @IsDefined()
  @IsBoolean()
  is_private: boolean;
}
