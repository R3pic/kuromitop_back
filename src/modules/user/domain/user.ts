import { comparePassword, hashPassword } from '@common/utils/crypt';
import { UserEntity } from './entities/user.entity';

export class User {
    constructor(
        public readonly id: number,
        public readonly username: string,
        private _password: string,
        public readonly created_at: Date,
        private _updated_at: Date,
    ) {}

    async comparePassword(inputPassword: string): Promise<boolean> {
        return await comparePassword(this._password, inputPassword);
    }

    async updatePassword(newPassword: string) {
        this._password = await hashPassword(newPassword);
        this._updated_at = new Date();
    }

    toEntity() {
        return new UserEntity.Builder()
            .setId(this.id)
            .setUsername(this.username)
            .setPassword(this._password)
            .setUpdatedAt(this._updated_at)
            .build();
    }
}
