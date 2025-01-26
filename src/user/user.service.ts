import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async isExistByUsername(username: string) {
        return await this.userRepository.isExistByUsername(username);
    }

    async getByUsername(username: string) {
        return await this.userRepository.getUserByUsername(username);
    }

    async getProfileByUsername(username: string) {
        return await this.userRepository.getProfileByUsername(username);
    }
}
