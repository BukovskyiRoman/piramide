import winston from "winston";
import morgan from 'morgan';

export const logger = winston.createLogger({
    level: 'debug',
    transports: [
        new winston.transports.Console(),
    ]
});

export const httpLogger = morgan('tiny');
