const winston = require('winston');

const { format } = winston;
const {
  errors, timestamp, colorize, printf, combine,
} = format;

const errorLog = new winston.transports.File({ filename: 'error.log', level: 'error' });
const combinedLog = new winston.transports.File({ filename: 'combined.log', level: 'info' });

const jsonLogFileFormat = winston.format.combine(
  winston.format.errors({ stack: true }),
  winston.format.timestamp(),
  winston.format.prettyPrint(),
);

const logger = winston.createLogger({
  level: 'info',
  format: jsonLogFileFormat,
  transports: [errorLog, combinedLog],
});

if (process.env.NODE_ENV !== 'production') {
  logger.remove(errorLog);
  logger.remove(combinedLog);
  logger.add(new winston.transports.Console({
    format: combine(
      errors({ stack: true }),
      timestamp(),
      colorize(),
      printf(({
        level, message, _timestamp, stack,
      }) => {
        if (stack) {
          // print log trace
          return `${_timestamp} ${level}: ${message} - ${stack}`;
        }
        return `${_timestamp} ${level}: ${message}`;
      }),
    ),
  }));
}

module.exports = { logger };
