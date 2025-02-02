import {
    IsOptional,
    IsString, IsUrl, MaxLength,
    NotEquals, 
} from 'class-validator';
import { INTRODUCTION, NICKNAME } from '@user/constants';

export class UpdateProfileDto {
    @IsOptional()
    @NotEquals(undefined)
    @IsString()
    @MaxLength(NICKNAME.MAX_LENGHT)
    nickname: string;

    @IsOptional()
    @NotEquals(undefined)
    @IsString()
    @IsUrl()
    thumbnail: string;

    @IsOptional()
    @IsString()
    @MaxLength(INTRODUCTION.MAX_LENGTH)
    introduction: string;
}