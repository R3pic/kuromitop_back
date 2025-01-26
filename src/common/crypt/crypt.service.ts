import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

@Injectable()
export class CryptService {
    salt_round = 10;

    constructor() {}

    async hashPassword(password: string) {
        const salt = await bcrypt.genSalt(this.salt_round);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    }

    async validate(hashedPassword: string, password: string) {
        return await bcrypt.compare(password, hashedPassword);
    }
}