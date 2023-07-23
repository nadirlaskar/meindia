import { ElasticConnection } from "utils/es";
import MediaIndex from "utils/es/index/MediaIndex";
import { schemas } from "utils/es/schemas";
import Logger from "utils/logger/Logger";
import { connectToMongoDb } from "utils/mongo";
import Media, { MediaModel } from "utils/mongo/models/Media";
import { Handler, KafkaQueue, Message } from "utils/queue/QueueBuilder";
import env from "./env";

const SERVICE_NAME = env.serviceName;
const UPDATE_TOPIC: string | RegExp = env.metadataUpdateTopic;
const KAFKA_CONFIG = env.kafkaConfig;


const logger = new Logger({
  level: env.logLevel
});


const processMetaUpdateMessages: Handler<Media> = async (message: Message<Media>): Promise<void> => {
  logger.debug(`Processing message: ${JSON.stringify(message)}`);
  await saveToMongoDb(message);
  await saveToElasticSearch(message);
}

(
  async () => {
    logger.debug(`Meta updater init!`);
    const Queue = new KafkaQueue<Media>(SERVICE_NAME, env.logLevel, KAFKA_CONFIG);
    logger.debug(`Connecting to mongo...`);
    await connectToMongoDb(env.mongoURL, env.mongoConfig);
    logger.debug(`Connected to mongo!`);
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

async function saveToMongoDb(message: Message<Media>) {
  logger.debug(`Creating media: ${JSON.stringify(message.value)}`);
  const media = new MediaModel(message.value);
  const existingItem = await MediaModel.findOne({ id: media.id });
  if (existingItem) {
    logger.debug(`Media already exists in db: ${JSON.stringify(existingItem)}`);
    return;
  }
  await media.save();
  logger.debug(`Created media: ${JSON.stringify(media)}`);
}

async function saveToElasticSearch(message: Message<Media>) {
  logger.debug(`Adding media to ES: ${JSON.stringify(message.value)}`);
  const es = new ElasticConnection<Media>(env.esConfig, schemas);
  await es.saveDataToIndex(MediaIndex.name, message.value);
  logger.debug(`Added media to ES: ${JSON.stringify(message.value)}`);
}