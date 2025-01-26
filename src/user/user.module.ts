import { Module } from '@nestjs/common';
import { PostgresModule } from '@common/database/postgres.module';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';

@Module({
    imports: [
        PostgresModule,
    ],
    exports: [UserService],
    controllers: [UserController],
    providers: [
        UserService, 
        UserRepository,
    ],
})
export class UserModule {}
