import { IsDefined, IsOptional, IsString, IsStrongPassword, Length, Matches, MaxLength } from 'class-validator';
import { EMAIL, PASSWORD, USERNAME } from '@auth/constants';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SignUpDto {
    @ApiProperty({
        type: 'string',
        description: '아이디'
    })
    @IsDefined()
    @IsString()
    @Length(USERNAME.MIN_LENGTH, USERNAME.MAX_LENGTH)
    @Matches(USERNAME.MATCHES, { message: '아이디는 숫자로 시작하거나 특수문자로 시작할 수 없습니다.' })
    username: string;

    @ApiPropertyOptional({
        type: 'string',
        description: '이메일'
    })
    @IsOptional()
    @IsString()
    @MaxLength(EMAIL.MAX_LENGTH)
    email?: string;

    @ApiProperty({
        type: 'string',
        description: '비밀번호'
    })
    @IsDefined()
    @IsString()
    @IsStrongPassword(PASSWORD)
    password: string;
}
