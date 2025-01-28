import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { AnonymousProfile } from './dto/anonymous-profile.dto';
import { User } from './entities/user.entity';
import { UserServiceException } from './exceptions';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async findByNo(no: number) {
        const user = await this.userRepository.findByNo(no);

        if (!user) {
            throw UserServiceException.USER_NOT_FOUND;
        }

        return user;
    }

    async isExistByUsername(username: string) {
        const { exists } = await this.userRepository.isExistByUsername(username);
        
        if (!exists) {
            throw UserServiceException.USER_NOT_FOUND;
        }
    }

    async getByUsername(username: string) {
        const user = await this.userRepository.getUserByUsername(username);

        if (!user) {
            throw UserServiceException.USER_NOT_FOUND;
        }
        
        return user;
    }

    async getProfile(username: string, user: User) {
        const profile = await this.userRepository.getProfileByUsername(username);

        if (!profile)
            throw UserServiceException.USER_NOT_FOUND;

        if (!user || profile.user_no !== user.user_no) {
            return AnonymousProfile.of(profile);
        }

        return profile;
    }
}
