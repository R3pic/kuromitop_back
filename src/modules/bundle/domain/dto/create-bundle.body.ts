import {
    IsBoolean,
    IsDefined, 
    IsString, 
    MaxLength, 
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BUNDLE_TITLE } from '@bundle/constants';

export class CreateBundleBody {
    @ApiProperty()
    @IsDefined()
    @IsString()
    @MaxLength(BUNDLE_TITLE.MAX_LENGTH)
    title: string;

    @ApiProperty()
    @IsDefined()
    @IsBoolean()
    is_private: boolean;
}
