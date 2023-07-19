import Logger, { LoggerLevels } from "../logger/Logger";
type Message<T> = {
    ts: Number;
    value: T;
};
export default abstract class QueueBuilder<T> {
    logger: Logger;
    constructor(name: string, loglevel: LoggerLevels);
    enqueue(message: Message<T>): void;
    dequeue(): Message<T>;
    abstract getLastMessageFromQueue(): Message<T>;
    abstract addMessageToQueue(message: Message<T>): void;
}
export {};
