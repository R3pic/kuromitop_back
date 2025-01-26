
import { OmitType } from '@nestjs/swagger';
import { SignUpDto } from './signup.dto';

export class SignInDto extends OmitType(SignUpDto, ['email'] as const) {}
