"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = __importDefault(require("../logger/Logger"));
class QueueBuilder {
    constructor(name, loglevel) {
        this.logger = new Logger_1.default({ level: loglevel });
        this.logger.info(`Created queue named: ${name}`);
    }
    enqueue(message) {
        this.logger.debug(`enqueing message ${JSON.stringify(message)}`);
        this.addMessageToQueue(message);
    }
    dequeue() {
        const message = this.getLastMessageFromQueue();
        this.logger.debug(`dequeue message ${JSON.stringify(message)}`);
        return message;
    }
}
exports.default = QueueBuilder;
//# sourceMappingURL=QueueBuilder.js.map