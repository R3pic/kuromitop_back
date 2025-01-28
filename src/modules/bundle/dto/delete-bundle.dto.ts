import { PickType } from '@nestjs/swagger';

import { Bundle } from '@bundle/entities/bundle.entity';

export class DeleteBundleDto extends PickType(Bundle, ['uuid']) {}