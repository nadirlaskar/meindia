import { ConsumerSubscribeTopics, EachMessagePayload, Kafka, KafkaConfig } from "kafkajs";
import Logger, { LoggerLevels } from "../logger/Logger";

type Message<T> = { ts: Number, value: T }
type QueueResponse<T> = Message<T> | void | null;
type Handler = (message: Message<any>) => Promise<void>;

export default abstract class QueueBuilder<T> {
    logger: Logger;
    constructor(name: string, loglevel: LoggerLevels) {
        this.logger = new Logger({ level: loglevel });
        this.logger.info(`Created queue named: ${name}`);
    }
    enqueue(message: Message<T>) {
        this.logger.debug(`enqueing message ${JSON.stringify(message)}`);
        this.addMessageToQueue(message);
    }
    dequeue(handler: Handler): QueueResponse<T> {
        const logMessage = (message: Message<T>) => this.logger.debug(`dequeue message ${JSON.stringify(message)}`);
        const proxyHandler = this.proxyHandler(handler, logMessage);
        const message: QueueResponse<T> = this.getLastMessageFromQueue(proxyHandler);
        if (message) {
            logMessage(message);
            return message;
        }
    }
    private proxyHandler(handler: Handler, logMessage: (message: Message<T>) => void) {
        if (!handler) return;
        return async (message: Message<T>) => {
            logMessage(message);
            const result = handler(message);
            if (result instanceof Promise) {
                await result;
            }
        };
    }

    abstract getLastMessageFromQueue(handler: Handler | void, options?: any): QueueResponse<T>;
    abstract addMessageToQueue(message: Message<T>, options?: any): void;
}

export class ArrayQueueBuilder<T> extends QueueBuilder<T> {
    queue: Message<T>[] = [];
    getLastMessageFromQueue(): QueueResponse<T> {
        return this.queue.pop() ?? null;
    }
    addMessageToQueue(message: Message<T>): void {
        this.queue.push(message);
    }
}

export class KafkaQueue<T> extends QueueBuilder<T> {
    kafkaInstance: any;
    consumer: any;
    constructor(name: string, loglevel: LoggerLevels, kafkaConfig: KafkaConfig) {
        super(name, loglevel);
        this.kafkaInstance = new Kafka({
            clientId: name,
            ...kafkaConfig
        });
    }
    async connect(groupId: string, subscribeConfig: ConsumerSubscribeTopics) {
        await this.kafkaInstance.connect();
        await this.consumer.connect();
        this.consumer = this.kafkaInstance.consumer({ groupId });
        await this.consumer.subscribe(subscribeConfig);
    }
    getLastMessageFromQueue(handler: Handler): void {
        this.consumer.run({
            autoCommit: true,
            eachMessage: async (queueItem: EachMessagePayload) => {
                const { topic, partition, message } = queueItem;
                const messageValue: string = message.value?.toString() ?? '{}';
                this.logger.debug(`Received message ${messageValue} on topic ${topic} and partition ${partition}`);
                const valueAsType: T = JSON.parse(messageValue) as unknown as T;
                await handler({
                    ts: Number(message.timestamp),
                    value: valueAsType
                });
            },
        });
    }
    addMessageToQueue(message: Message<T>, topic: string): void {
        this.kafkaInstance.producer().send({
            topic: topic,
            messages: [
                { value: JSON.stringify(message) },
            ],
        });
    }
}