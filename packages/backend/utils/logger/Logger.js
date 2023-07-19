"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerLevels = void 0;
var LoggerLevels;
(function (LoggerLevels) {
    LoggerLevels[LoggerLevels["DEBUG"] = 0] = "DEBUG";
    LoggerLevels[LoggerLevels["INFO"] = 1] = "INFO";
    LoggerLevels[LoggerLevels["WARN"] = 2] = "WARN";
    LoggerLevels[LoggerLevels["ERROR"] = 3] = "ERROR";
})(LoggerLevels || (exports.LoggerLevels = LoggerLevels = {}));
class Logger {
    constructor(option) {
        this.options = option;
    }
    info(message) {
        if (this.options.level >= LoggerLevels.INFO) {
            return console.info(`[INFO]`, message);
        }
    }
    debug(message) {
        if (this.options.level >= LoggerLevels.DEBUG) {
            return console.info(`[DEBUG]`, message);
        }
    }
    warn(message) {
        if (this.options.level >= LoggerLevels.WARN) {
            console.log(`[WARN]`, message);
        }
    }
    error(message) {
        console.log(`[ERROR]`, message);
    }
}
exports.default = Logger;
//# sourceMappingURL=Logger.js.map