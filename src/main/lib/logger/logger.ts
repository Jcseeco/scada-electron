import { createLogger, format, transports } from 'winston'
const { printf, combine, timestamp } = format

/**
 * uses tab as delimeter so it works nice when importing into excel
 */
const loggerFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp}\t[${level}]\t${message}`
})

export const logger = createLogger({
  level: 'info',
  format: combine(timestamp({ format: new Date().toLocaleString('zh-tw') }), loggerFormat),
  transports: [
    /**
     * logs with level of error will be written to error.log
     */
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' })
  ]
})

// log to console if not in production
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.simple()
    })
  )
}
