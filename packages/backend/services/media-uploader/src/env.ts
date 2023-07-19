import { LoggerLevels } from "utils/logger/Logger";

const env = {
    logLevel: process.env.logLevel as unknown as LoggerLevels ?? LoggerLevels.DEBUG,
    isDebugEnabled: process.env.NDOE_ENV !== 'production'
}

export default env;