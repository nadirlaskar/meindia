import { randomUUID } from "crypto";
import { Consumer, ConsumerSubscribeTopics, EachMessagePayload, Kafka, KafkaConfig, Producer, ProducerConfig } from "kafkajs";
import Logger, { LoggerLevels } from "../logger/Logger";

export type Message<T> = { ts?: Number, event?: string, value: T }
type QueueResponse<T> = Message<T> | void | null;
export type Handler<T> = (message: Message<T>) => Promise<void>;

export default abstract class QueueBuilder<T> {
    logger: Logger;
    constructor(name: string, loglevel: LoggerLevels) {
        this.logger = new Logger({ level: loglevel });
        this.logger.info(`Created queue named: ${name}`);
    }
    enqueue(message: Message<T>, options?: any): Promise<any> | void {
        this.logger.debug(`enqueing message ${JSON.stringify(message)}`);
        return this.addMessageToQueue(message, options);
    }
    dequeue(handler: Handler<T>): QueueResponse<T> {
        const logMessage = (message: Message<T>) => this.logger.debug(`dequeue message ${JSON.stringify(message)}`);
        const proxyHandler = this.proxyHandler(handler, logMessage);
        const message: QueueResponse<T> = this.getLastMessageFromQueue(proxyHandler);
        if (message) {
            logMessage(message);
            return message;
        }
    }
    private proxyHandler(handler: Handler<T>, logMessage: (message: Message<T>) => void) {
        if (!handler) return;
        return async (message: Message<T>) => {
            logMessage(message);
            const result = handler(message);
            if (result instanceof Promise) {
                await result;
            }
        };
    }

    abstract getLastMessageFromQueue(handler: Handler<T> | void, options?: any): QueueResponse<T>;
    abstract addMessageToQueue(message: Message<T>, options?: any): Promise<any> | void;
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


type KafkaConnectOptions = {
    groupId: string;
    topic: string | RegExp;
    subscribeConfig?: Partial<ConsumerSubscribeTopics>;
}

type MessageOptions = {
    topic: string;
}
export class KafkaQueue<T> extends QueueBuilder<T> {
    private kafkaInstance: any;
    private consumer?: Consumer;
    private producer?: Producer;
    constructor(name: string, loglevel: LoggerLevels, kafkaConfig: KafkaConfig) {
        super(name, loglevel);
        this.kafkaInstance = new Kafka({
            clientId: name,
            ...kafkaConfig
        });
    }
    async listen(options: KafkaConnectOptions) {
        if (!this.consumer) {
            this.logger.debug(`[Consumer] Connecting to kafka with options: ${JSON.stringify(options)}`);
            this.consumer = this.kafkaInstance.consumer({ groupId: options.groupId });
            await this.consumer?.connect();
            this.logger.debug(`[Consumer] connected to kafka!`);
        }
        await this.consumer?.subscribe({
            fromBeginning: true,
            topics: [options.topic],
            ...(options?.subscribeConfig ?? {})
        });
    }
    async connect(options?: ProducerConfig) {
        if (!this.producer) {
            this.logger.debug(`[Producer] Connecting to kafka with options: ${JSON.stringify(options)}`);
            this.producer = this.kafkaInstance.producer(options);
            await this.producer?.connect();
            this.logger.debug(`[Producer] connected to kafka!`);
        }
    }
    getLastMessageFromQueue(handler: Handler<T>): void {
        if (!this.consumer) {
            throw new Error('Consumer not initialized! call listen() first!');
        }
        this.consumer.run({
            autoCommit: true,
            eachMessage: async (queueItem: EachMessagePayload) => {
                const { topic, partition, message } = queueItem;
                const messageValue: string = message.value?.toString() ?? '{}';
                this.logger.debug(`Received message ${messageValue} on topic ${topic} and partition ${partition}`);
                const valueAsType: T = JSON.parse(messageValue) as unknown as T;
                await handler({
                    ts: Number(message.timestamp),
                    event: message.headers?.event?.toString() ?? '',
                    value: valueAsType
                });
            },
        });
    }
    async addMessageToQueue(message: Message<T>, options: MessageOptions): Promise<any> {
        if (!this.producer) {
            throw new Error('Producer not initialized! call connect() first!');
        }
        return this.producer.send({
            topic: options.topic,
            messages: [
                {
                    key: randomUUID(),
                    value: JSON.stringify(message.value),
                    headers: {
                        event: message.event
                    }
                },
            ],
        });
    }
}