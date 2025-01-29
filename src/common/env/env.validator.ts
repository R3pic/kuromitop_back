import { plainToClass } from 'class-transformer';
import {
    IsString, IsEnum, IsNumber, validateSync, 
} from 'class-validator';

export enum Environment {
    DEVELOPMENT = 'development',
    TEST = 'test',
}

export class EnvironmentVariables {
    @IsString()
    JWT_SECRET: string;
    @IsEnum(Environment)
    NODE_ENV: Environment;
    @IsNumber()
    PORT: number;
  
    @IsString()
    DB_HOST: string;
    @IsNumber()
    DB_PORT: number;
    @IsString()
    DB_USER: string;
    @IsString()
    DB_PASSWORD: string;
    @IsString()
    DB_DATABASE: string;
}

export function validate(config: Record<string, any>): EnvironmentVariables {
    const validatedConfig = plainToClass(EnvironmentVariables, config, {
        enableImplicitConversion: true,
    });

    const errors = validateSync(validatedConfig, {
        skipMissingProperties: false,
    });

    if (errors.length > 0) {
        throw new Error(errors.toString());
    }

    return validatedConfig;
}