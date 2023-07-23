import { randomUUID } from "crypto";
import { FastifySchema } from "fastify";
import Logger from "utils/logger/Logger";
import { KafkaQueue } from "utils/queue/QueueBuilder";
import env from "../env";
import MediaCreate, { MEDIA_SCHEMA_NAME_CREATE, MEDIA_SCHEMA_NAME_EDIT, MediaEdit } from "../schema/Media";

const SERVICE_NAME = env.serviceName;
const UPDATE_TOPIC: string | RegExp = env.metadataUpdateTopic;
const KAFKA_CONFIG = env.kafkaConfig;

const logger = new Logger({
  level: env.logLevel
});

const mediaUploadQueue = new KafkaQueue<MediaCreate | MediaEdit>(SERVICE_NAME, env.logLevel, KAFKA_CONFIG);

const MediaCreateController = async (request: any) => {
  const media = request.body as MediaCreate;
  logger.debug(`Upload media called!`);
  const message = prepareMediaMetadata(media, 'create');
  await mediaUploadQueue.connect();
  await mediaUploadQueue.enqueue(message, { topic: UPDATE_TOPIC });
  return {
    status: 'ok',
    mediaId: message.value.id
  };
}

export const MediaEditController = async (request: any) => {
  const media = request.body as MediaEdit;
  const mediaId = request.params.id;
  logger.debug(`Edit media called!`);
  const message = prepareMediaMetadata(media, 'edit', mediaId);
  await mediaUploadQueue.connect();
  await mediaUploadQueue.enqueue(message, { topic: UPDATE_TOPIC });
  return {
    status: 'ok',
    mediaId: message.value.id
  };
}

const prepareMediaMetadata = (
  media: MediaCreate | MediaEdit,
  event: 'create' | 'edit',
  mediaId: string = randomUUID()
) => {
  const mediaToSend = {
    ...media,
    id: mediaId
  }
  return {
    event,
    value: mediaToSend
  }

}

export const MediaEditSchema: { schema: FastifySchema } = {
  schema: {
    body: { $ref: `${MEDIA_SCHEMA_NAME_EDIT}#` }
  }
}

export const MediaCreateSchema: { schema: FastifySchema } = {
  schema: {
    body: {
      $ref: `${MEDIA_SCHEMA_NAME_CREATE}#`,
    }
  }
}

export default MediaCreateController;