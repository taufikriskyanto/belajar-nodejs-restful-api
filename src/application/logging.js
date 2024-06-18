import winston from "winston";

export const logger = winston.createLogger({
    level: "info",
        colorize : winston.addColors({ request: 'bold cyan magentaBG' }),
        format: winston.format.combine(
            winston.format.timestamp('YYYY-MM-DD hh:mm:ss'), 
            winston.format.ms(), 
            winston.format.json(),
            winston.format.colorize({
                all: true,
              })),
        transports: [
            new winston.transports.Console({}),
            new winston.transports.File({
                filename : "application.log"
            })
        ]
})