import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async findByNo(no: number) {
        return await this.userRepository.findByNo(no);
    }

    async isExistByUsername(username: string) {
        return await this.userRepository.isExistByUsername(username);
    }

    async getByUsername(username: string) {
        return await this.userRepository.getUserByUsername(username);
    }

    async getProfile(username: string) {
        const profile = await this.userRepository.getProfileByUsername(username);

        if (!profile)
            throw new NotFoundException('존재하지 않는 유저입니다.');

        return profile;
    }
}
