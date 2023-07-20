import Logger from "utils/logger/Logger";
import { Handler, KafkaQueue, Message } from "utils/queue/QueueBuilder";
import env from "./env";
import Media from "./models/Media";

const SERVICE_NAME = env.serviceName;
const UPDATE_TOPIC: string | RegExp = env.metadataUpdateTopic;
const KAFKA_CONFIG = env.kafkaConfig;


const logger = new Logger({
  level: env.logLevel
});


const processMetaUpdateMessages: Handler<Media> = async (message: Message<Media>): Promise<void> => {
  logger.debug(`Processing message: ${JSON.stringify(message)}`);
}

(
  async () => {
    logger.debug(`Meta updater init!`);
    const Queue = new KafkaQueue<Media>(SERVICE_NAME, env.logLevel, KAFKA_CONFIG);
    await Queue.listen({
      topic: UPDATE_TOPIC,
      groupId: SERVICE_NAME,
      subscribeConfig: {
        fromBeginning: true
      }
    });
    Queue.getLastMessageFromQueue(processMetaUpdateMessages);
    await import('./server');
  }
)()