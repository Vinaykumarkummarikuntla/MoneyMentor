const winston = require('winston')

// Configure the logger
const logger = winston.createLogger({
  level: 'info', // Set the log level
  format: winston.format.simple(), // Set the log format
  transports: [
    new winston.transports.Console(), // Log to console
    new winston.transports.File({ filename: 'error.log', level: 'error' }) // Log to a file
  ]
})

// Export the logger instance
module.exports = logger
