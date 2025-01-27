import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';

export const winstonLogger = WinstonModule.createLogger({
    exitOnError: false,
    format: winston.format.json({ space: 2 }),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss',
                }),
                winston.format.errors({ stack: true }),
                winston.format.ms(),
                nestWinstonModuleUtilities.format.nestLike('Winston', {
                    colors: true,
                    prettyPrint: true,
                    processId: true,
                    appName: true,
                }),
            ),
        }),
    ],
});