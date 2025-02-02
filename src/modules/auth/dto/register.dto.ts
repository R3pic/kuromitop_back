import {
    IsDefined, IsString, IsStrongPassword, Length, Matches, 
} from 'class-validator';
import { PASSWORD, USERNAME } from '@auth/constants';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class RegisterDto {
    @ApiProperty({ type: 'string', description: '아이디' })
    @IsDefined()
    @IsString()
    @Length(USERNAME.MIN_LENGTH, USERNAME.MAX_LENGTH)
    @Matches(USERNAME.MATCHES, { message: '아이디는 숫자로 시작하거나 특수문자로 시작할 수 없습니다.' })
    @Transform(({ value }) => value.toLowerCase())
    readonly username: string;

    @ApiProperty({ type: 'string', description: '비밀번호' })
    @IsDefined()
    @IsString()
    @IsStrongPassword(PASSWORD)
    readonly password: string;
}
