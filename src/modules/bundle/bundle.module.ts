import { Module } from '@nestjs/common';
import { BundleService } from './bundle.service';
import { BundleController } from './bundle.controller';
import { PostgresModule } from '@common/database/postgres.module';
import { BundleRepository } from './bundle.repository';
import { UserModule } from '@user/user.module';

@Module({
    imports: [
        PostgresModule,
        UserModule,
    ],
    exports: [BundleService],
    controllers: [BundleController],
    providers: [ 
        BundleService, 
        BundleRepository,
    ],
})
export class BundleModule {}
