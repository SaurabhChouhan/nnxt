import winston, {format} from 'winston'

const stringFormat = format((info, opts) => {
    return info.message;
});

const logger = winston.createLogger({
    level: 'debug',
    format: format.combine(
        format.splat(),
        format.simple()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename: 'combined.log'})
    ]
})

/*
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}
*/

export default logger