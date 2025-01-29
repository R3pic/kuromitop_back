import * as path from 'path';
import { validate } from './env.validator';

export const configModuleOptions = {
    isGlobal: true,
    validate,
    envFilePath: process.env.NODE_ENV === 'test'
        ? path.resolve(process.cwd(), '.env.test.local')
        : path.resolve(process.cwd(), '.env'),
};