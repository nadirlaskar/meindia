export declare enum LoggerLevels {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3
}
export interface LoggerOptions {
    level: LoggerLevels;
}
export default class Logger {
    options: LoggerOptions;
    constructor(option: LoggerOptions);
    info(message: string): void;
    debug(message: string): void;
    warn(message: string): void;
    error(message: string): void;
}
