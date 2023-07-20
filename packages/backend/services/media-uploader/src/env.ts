import { LoggerLevels } from "utils/logger/Logger";

const env = {
    logLevel: process.env.logLevel as unknown as LoggerLevels ?? LoggerLevels.DEBUG,
    isDebugEnabled: process.env.NDOE_ENV !== 'production',
    queueAuthor: process.env.QUEUE_AUTHOR ?? 'media-uploader',
    updaterGroupdId: process.env.UPDATER_GROUP_ID ?? 'media-uploader',
    metadataUpdateTopic: process.env.METADATA_UPDATE_TOPIC ?? 'metadata-update',
    kafkaConfig: {
        clientId: process.env.KAFKA_CLIENT_ID ?? 'media-uploader',
        brokers: process.env.KAFKA_BROKERS?.split(',') ?? ['kafka:9092'],
        ssl: process.env.KAFKA_SSL === 'true',
        connectionTimeout: Number(process.env.KAFKA_CONNECTION_TIMEOUT) ?? 1000,
        authenticationTimeout: Number(process.env.KAFKA_AUTHENTICATION_TIMEOUT) ?? 1000,
        reauthenticationThreshold: Number(process.env.KAFKA_REAUTHENTICATION_THRESHOLD) ?? 10000,
        requestTimeout: Number(process.env.KAFKA_REQUEST_TIMEOUT) ?? 30000,
        enforceRequestTimeout: process.env.KAFKA_ENFORCE_REQUEST_TIMEOUT === 'true',
        retry: {
            initialRetryTime: Number(process.env.KAFKA_RETRY_INITIAL_RETRY_TIME) ?? 300,
            retries: Number(process.env.KAFKA_RETRY_RETRIES) ?? 10
        }
    }
}

export default env;