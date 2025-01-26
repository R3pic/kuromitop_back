import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async getByUsername(username: string) {
        return await this.userRepository.getUserByUsername(username);
    }
}
