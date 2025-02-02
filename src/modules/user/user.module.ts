import { Module } from '@nestjs/common';
import { PostgresModule } from '@common/database/postgres.module';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { BundleModule } from '@bundle/bundle.module';
import { UserMapper } from './user.mapper';

@Module({
    imports: [
        PostgresModule,
        BundleModule,
    ],
    exports: [UserService],
    controllers: [UserController],
    providers: [
        UserService, 
        UserMapper,
        UserRepository,
    ],
})
export class UserModule {}
