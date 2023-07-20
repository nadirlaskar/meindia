import { randomUUID } from "crypto";
import Logger from "utils/logger/Logger";
import { KafkaQueue } from "utils/queue/QueueBuilder";
import Media, { MEDIA_SCHEMA_NAME } from "../entity/Media";
import env from "../env";

const SERVICE_NAME = env.serviceName;
const UPDATE_TOPIC: string | RegExp = env.metadataUpdateTopic;
const KAFKA_CONFIG = env.kafkaConfig;

const logger = new Logger({
  level: env.logLevel
});

const mediaUploadQueue = new KafkaQueue<Media>(SERVICE_NAME, env.logLevel, KAFKA_CONFIG);

const UploadController = async (request: any) => {
  const media = request.body as Media;
  logger.debug(`Upload media called!`);
  const message = prepareMediaMetadata(media);
  await mediaUploadQueue.connect();
  await mediaUploadQueue.enqueue(message, { topic: UPDATE_TOPIC });
  return {
    status: 'ok',
    mediaId: message.value.id
  };
}

const prepareMediaMetadata = (media: Media) => {
  const mediaToSend = {
    ...media,
    id: randomUUID(),
  }
  return {
    event: 'create',
    value: mediaToSend
  }

}

export const UploadSchema = {
  schema: {
    body: { $ref: `${MEDIA_SCHEMA_NAME}#` }
  }
}

export default UploadController;