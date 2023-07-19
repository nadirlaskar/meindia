export enum LoggerLevels {
    DEBUG,
    INFO,
    WARN,
    ERROR,
}

export interface LoggerOptions {
    level: LoggerLevels
}
export default class Logger {
    options: LoggerOptions;
    constructor(option:LoggerOptions){
        this.options = option;
    }
    public info(message: string){
        if(this.options.level >= LoggerLevels.INFO){
            return console.info(`[INFO]`,message);
        }
    }
    public debug(message: string){
        if(this.options.level >= LoggerLevels.DEBUG){
            return console.info(`[DEBUG]`,message);
        }
    }
    public warn(message: string){
        if(this.options.level >= LoggerLevels.WARN){
            console.log(`[WARN]`,message);
        }
    }
    public error(message: string){
        console.log(`[ERROR]`,message);
    }
}