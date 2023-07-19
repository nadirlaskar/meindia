import { LoggerLevels } from "../../utils/logger/Logger";

const env = {
    logLevel: process.env.logLevel as unknown as LoggerLevels ?? LoggerLevels.DEBUG
}

export default env;