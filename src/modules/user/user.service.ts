import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { AnonymousProfile } from './dto/anonymous-profile.dto';
import { User } from './entities/user.entity';
import { UserServiceException } from './exceptions';
import { isDataBaseError } from '@common/exception/utils';
import { PostgresError } from 'pg-error-enum';
import { Transactional } from '@nestjs-cls/transactional';

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);
    constructor(private readonly userRepository: UserRepository) {}

    @Transactional()
    async create(username: string) {
        try {
            const user = await this.userRepository.create(username);
            return user;
        } catch (e) {
            if (isDataBaseError(e)
                && e.code === PostgresError.UNIQUE_VIOLATION)
                throw UserServiceException.USER_ALREADY_EXISTS;
            throw e;
        }
    }

    async findByNo(no: number) {
        const user = await this.userRepository.findByNo(no);

        if (!user) {
            throw UserServiceException.USER_NOT_FOUND;
        }

        return user;
    }

    async isExistByUsername(username: string) {
        const exists = await this.userRepository.isExistByUsername(username);
        return exists;
    }

    async findByUsername(username: string) {
        const user = await this.userRepository.findUserByUsername(username);

        if (!user) {
            throw UserServiceException.USER_NOT_FOUND;
        }
        
        return user;
    }

    async findProfileByUsername(username: string, user: User | null) {
        const profile = await this.userRepository.findProfileByUsername(username);

        if (!profile)
            throw UserServiceException.USER_NOT_FOUND;

        if (!user || profile.user_no !== user.user_no) {
            return AnonymousProfile.of(profile);
        }

        return profile;
    }
}
