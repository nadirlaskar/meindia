import { LoggerLevels } from "utils/logger/Logger";

const env = {
  serviceName: process.env.SERVICE_NAME ?? 'meta-updater',
  logLevel: process.env.logLevel as unknown as LoggerLevels ?? LoggerLevels.DEBUG,
  isDebugEnabled: process.env.NDOE_ENV !== 'production',
  mongoURL: process.env.MONGO_URL ?? 'mongodb://mongo:27017',
  mongoConfig: {
    /** The name of the database you want to use. If not provided, Mongoose uses the database name from connection string. */
    dbName: process.env.MONGO_DB_NAME ?? 'media-metadata',
    /** username for authentication, equivalent to `options.auth.user`. Maintained for backwards compatibility. */
    user: process.env.MONGO_USER ?? 'root',
    /** password for authentication, equivalent to `options.auth.password`. Maintained for backwards compatibility. */
    pass: process.env.MONGO_PASS ?? 'root',
    /** Set to false to disable automatic index creation for all models associated with this connection. */
    autoIndex: process.env.MONGO_AUTO_INDEX === 'true' ?? true,
    /** Set to `true` to make Mongoose automatically call `createCollection()` on every model created on this connection. */
    autoCreate: process.env.MONGO_AUTO_CREATE === 'true' ?? true,
  }
}

export default env;