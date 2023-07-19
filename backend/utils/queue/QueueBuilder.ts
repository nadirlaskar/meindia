import Logger, { LoggerLevels } from "../logger/Logger";

type Message<T>  = {
   ts:Number,
   value: T
}

export default abstract class QueueBuilder<T> {
    logger:Logger;
    constructor(name:string, loglevel:LoggerLevels){
        this.logger = new Logger({ level: loglevel });
        this.logger.info(`Created queue named: ${name}`);
    }
    enqueue(message:Message<T>){
        this.logger.debug(`enqueing message ${JSON.stringify(message)}`);
        this.addMessageToQueue(message);
    }
    dequeue(){
        const message:Message<T> = this.getLastMessageFromQueue();
        this.logger.debug(`dequeue message ${JSON.stringify(message)}`);
        return message;
    }
    abstract getLastMessageFromQueue():Message<T>;
    abstract addMessageToQueue(message:Message<T>):void;
}