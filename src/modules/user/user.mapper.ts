import { Injectable } from '@nestjs/common';
import { User } from './domain/user';
import { UserEntity } from './domain/entities/user.entity';
import { ProfileEntity } from './domain/entities/profile.entity';
import { CreateUserDto } from './domain/dto/create-user.dto';
import { CreateProfileDto } from './domain/dto/create-profile.dto';
import { UpdateProfileDto } from './domain/dto/update-profile.dto';
import { UserModel } from './domain/models/user.model';
import { hashPassword } from '@common/utils/crypt';

@Injectable()
export class UserMapper {
    toDomain(model: UserModel): User {
        return new User(
            model.id,
            model.username,
            model.password,
            model.created_at,
            model.updated_at,
        );
    }

    async createDtoToEntity(createUserDto: CreateUserDto) {
        const hashedPassword = await hashPassword(createUserDto.password);

        return new UserEntity.Builder()
            .setUsername(createUserDto.username)
            .setPassword(hashedPassword)
            .build();
    }

    createProfileDtoToEntity(createProfileDto: CreateProfileDto) {
        return new ProfileEntity.Builder()
            .setUserId(createProfileDto.user_id)
            .build();
    }

    updateProfileDtoToEntity(updateProfileDto: UpdateProfileDto) {
        return new ProfileEntity.Builder()
            .setNickName(updateProfileDto.nickname)
            .setThumbnail(updateProfileDto.thumbnail)
            .setIntroduction(updateProfileDto.introduction)
            .setUpdatedAt(new Date())
            .build();
    }
}