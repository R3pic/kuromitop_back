import { PickType } from '@nestjs/swagger';
import { RegisterDto } from './register.dto';
import { IsDefined, IsString } from 'class-validator';

export class LoginDto extends PickType(RegisterDto, ['username']) {
    @IsDefined()
    @IsString()
    password: string;
}
