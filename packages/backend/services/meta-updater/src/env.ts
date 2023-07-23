import { LoggerLevels } from "utils/logger/Logger";

const env = {
    serviceName: process.env.SERVICE_NAME ?? 'meta-updater',
    logLevel: process.env.logLevel as unknown as LoggerLevels ?? LoggerLevels.DEBUG,
    isDebugEnabled: process.env.NDOE_ENV !== 'production',
    updaterGroupdId: process.env.UPDATER_GROUP_ID ?? 'meta-updater',
    metadataUpdateTopic: process.env.METADATA_UPDATE_TOPIC ?? 'metadata-update',
    kafkaConfig: {
        clientId: process.env.KAFKA_CLIENT_ID ?? 'meta-updater',
        brokers: process.env.KAFKA_BROKERS?.split(',') ?? ['kafka:9092'],
        ssl: process.env.KAFKA_SSL === 'true',
        connectionTimeout: Number(process.env.KAFKA_CONNECTION_TIMEOUT) ?? 3000,
        authenticationTimeout: Number(process.env.KAFKA_AUTHENTICATION_TIMEOUT) ?? 1000,
        reauthenticationThreshold: Number(process.env.KAFKA_REAUTHENTICATION_THRESHOLD) ?? 10000,
        requestTimeout: Number(process.env.KAFKA_REQUEST_TIMEOUT) ?? 30000,
        enforceRequestTimeout: process.env.KAFKA_ENFORCE_REQUEST_TIMEOUT === 'true',
        retry: {
            initialRetryTime: Number(process.env.KAFKA_RETRY_INITIAL_RETRY_TIME) ?? 300,
            retries: Number(process.env.KAFKA_RETRY_RETRIES) ?? 10
        }
    },
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
    },
    esConfig: {
        node: process.env.ELASTIC_SEARCH_NODE ?? 'http://elasticsearch:9200'
    }
}

export default env;