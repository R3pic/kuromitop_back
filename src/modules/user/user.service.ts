import { Injectable, Logger } from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';
import { PostgresError } from 'pg-error-enum';

import { isDataBaseError } from '@common/utils/exception-utils';
import { BundleService } from '@bundle/bundle.service';
import { RequestUser } from '@common/request-user';
import { UserRepository } from './user.repository';
import {
  UserAlreadyExistsException,
  UserForbiddenException,
  UserNotFoundException,
} from './user.errors';
import { UserMapper } from '@user/user.mapper';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { UpdateUserDto } from '@user/dto/update-user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly bundleService: BundleService,
  ) {}

  @Transactional()
  async create(createUserDto: CreateUserDto) {
    this.logger.log(createUserDto);
    try {
      const user = await this.userRepository.create(createUserDto);

      return UserMapper.toDto(user);
    } catch (e) {
      if (isDataBaseError(e, PostgresError.UNIQUE_VIOLATION))
        throw new UserAlreadyExistsException();
      throw e;
    }
  }

  @Transactional()
  async update(updateUserDto: UpdateUserDto, reqUser: RequestUser) {
    this.logger.log(updateUserDto);

    const user = await this.userRepository.findById(updateUserDto.id);

    if (!user || (user.id !== reqUser.id))
      throw new UserForbiddenException();

    const updated = await this.userRepository.update(updateUserDto);

    return UserMapper.toDto(updated);
  }

  async findById(id: string) {
    this.logger.log('findById');
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundException();
    }

    return UserMapper.toDto(user);
  }

  async findUserWithBundles(id: string, reqUser: RequestUser) {
    this.logger.log('findUserWithBundles');
    const userDto = await this.findById(id);
    const bundlesDto = await this.bundleService.findMany(id, reqUser);
    return {
      user: userDto,
      bundles: bundlesDto,
    };
  }

  async findByUsername(username: string) {
    this.logger.log('findByUsername');
    const user = await this.userRepository.findUserByUsername(username);

    if (!user) {
      throw new UserNotFoundException();
    }

    return UserMapper.toDto(user);
  }
}
