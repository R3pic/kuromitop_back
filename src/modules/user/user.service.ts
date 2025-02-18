import { Injectable, Logger } from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';
import { UserRepository } from './user.repository';
import { PostgresError } from 'pg-error-enum';

import { BundleService } from '@bundle/bundle.service';
import { isDataBaseError } from '@common/utils/exception-utils';
import { UserMapper } from './user.mapper';
import { CreateUserDto } from './domain/dto/create-user.dto';
import { CreateProfileDto } from './domain/dto/create-profile.dto';
import { UpdateProfileDto } from './domain/dto/update-profile.dto';
import { RequestUser } from '@common/request-user';
import { UsernameAlreadyExistsException, UserNotFoundException } from './user.errors';

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);

    constructor(
        private readonly userRepository: UserRepository,
        private readonly bundleService: BundleService,
        private readonly mapper: UserMapper,
    ) {}

    @Transactional()
    async create(createUserDto: CreateUserDto) {
        try {
            const userEntity = await this.mapper.createDtoToEntity(createUserDto);
            const user = await this.userRepository.create(userEntity);
            await this.createProfile(new CreateProfileDto(user.id));
        } catch (e) {
            if (isDataBaseError(e, PostgresError.UNIQUE_VIOLATION))
                throw new UsernameAlreadyExistsException();
            throw e;
        }
    }

    @Transactional()
    async createProfile(createProfileDto: CreateProfileDto) {
        const profileEntity = this.mapper.createProfileDtoToEntity(createProfileDto);
        const profile = await this.userRepository.createProfile(profileEntity);
        return profile;
    }

    @Transactional()
    async updateProfile(updateProfileDto: UpdateProfileDto, reqUser: RequestUser) {
        const profileEntity = this.mapper.updateProfileDtoToEntity(updateProfileDto);
        profileEntity.setUserId(reqUser.id);
        this.logger.log(profileEntity);
        const profile = await this.userRepository.updateProfile(profileEntity);
        return profile;
    }

    async findById(id: number) {
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new UserNotFoundException();
        }

        const domain = this.mapper.toDomain(user);

        return domain;
    }

    async findByUsername(username: string) {
        const user = await this.userRepository.findUserByUsername(username);

        if (!user) {
            throw new UserNotFoundException();
        }

        const domain = this.mapper.toDomain(user);

        return domain;
    }

    async findProfileByUsername(username: string, reqUser: RequestUser | null) {
        const profile = await this.userRepository.findProfileByUsername(username);

        if (!profile)
            throw new UserNotFoundException();

        const bundles = await this.bundleService.findMany(username, reqUser);

        return {
            user: {
                name: username,
                ...profile,
            },
            bundles,
        };
    }
}
