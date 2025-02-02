import { PASSWORD } from '@auth/constants';
import { comparePassword, hashPassword } from '@common/utils/crypt';
import { WeakPasswordException } from '@user/user.error';
import { isStrongPassword } from 'class-validator';

export class User {
    constructor(
        public readonly id: number,
        public readonly username: string,
        private _password: string,
        public readonly created_at: Date,
        private _updated_at: Date,
    ) {}

    async validatePassword(inputPassword: string): Promise<boolean> {
        return await comparePassword(this._password, inputPassword);
    }

    async updatePassword(newPassword: string) {
        const isStrong = isStrongPassword(newPassword, PASSWORD);

        if (!isStrong) {
            throw new WeakPasswordException();
        }

        this._password = await hashPassword(newPassword);
        this._updated_at = new Date();
    }

    getpassword() {
        return this._password;
    }

    getUpdatedAt() {
        return this._updated_at;
    }
}
