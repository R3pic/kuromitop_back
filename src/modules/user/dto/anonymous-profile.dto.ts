import { OmitType } from '@nestjs/swagger';
import { Profile } from '../entities/profile.entity';
import { plainToInstance } from 'class-transformer';

export class AnonymousProfile extends OmitType(Profile, ['email'] as const) {
    static of(profile: Profile) {
        return plainToInstance(AnonymousProfile, profile, { excludeExtraneousValues: true });
    }
}