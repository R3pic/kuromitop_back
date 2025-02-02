import { PickType } from '@nestjs/swagger';
import { CreateBundleBody } from './create-bundle.body';

export class UpdateBundleBody extends PickType(CreateBundleBody, [ 'title', 'is_private' ] as const) {}