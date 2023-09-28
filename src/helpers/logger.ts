import * as log4js from 'log4js';

const defaultLoggerConfig = {
  appenders: {
    console: {
      type: 'console',
    },
    application: {
      type: 'file',
      filename: './logs/application.log'
    }
  },
  categories: {
    default: {
      appenders: ['console', 'application'],
      level: 'debug'
    },
    appDev: {
      appenders: ['console'],
      level: 'debug'
    },
    appProd: {
      appenders: ['application'],
      level: 'error'
    },
  }
}

log4js.configure(defaultLoggerConfig);

export const logger = log4js.getLogger(process.env.ENVIRONMENT === 'prod' ? 'appProd' : 'appDev');