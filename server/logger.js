import winston, {format} from 'winston'

const stringFormat = format((info, opts) => {
    return info.message
})

const logger = winston.createLogger({
    level: 'debug',
    format: format.combine(
        format.splat(),
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.printf(info => {
            return `${info.timestamp} ${info.level}: ${info.message} ` + JSON.stringify(
                Object.assign({}, info, {
                    level: undefined,
                    message: undefined,
                    splat: undefined,
                    timestamp: undefined
                })
            , null, 4)
        })
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