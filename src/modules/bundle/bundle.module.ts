import { Module } from '@nestjs/common';

import { PostgresModule } from '@common/database/postgres.module';
import { TrackModule } from '@tracks/track.module';

import { BundleController } from './bundle.controller';
import { BundleService } from './bundle.service';
import { BundleRepository } from './bundle.repository';
import { BundleMapper } from './bundle.mapper';

@Module({
    imports: [
        PostgresModule,
        TrackModule,
    ],
    exports: [BundleService],
    controllers: [BundleController],
    providers: [ 
        BundleService, 
        BundleMapper,
        BundleRepository,
    ],
})
export class BundleModule {}
