// Import the framework and instantiate it
import Fastify from 'fastify';
import Logger from 'utils/logger/Logger';
import HealthCheckController from './controllers/HealthCheckController';
import MediaCreateController, { MediaCreateSchema, MediaEditController, MediaEditSchema } from './controllers/MediaController';
import env from './env';
import { withSchema } from './schema';

const logger = new Logger({ level: env.logLevel });
const BIND_HOST = process.env.BIND_HOST ?? '0.0.0.0'

const fastify = withSchema(Fastify({ logger: env.isDebugEnabled }));

// Declare a route
fastify.get('/health', HealthCheckController);
fastify.post('/media/new', MediaCreateSchema, MediaCreateController);
fastify.patch('/media/:id', MediaEditSchema, MediaEditController);

async function run() {
  try {
    logger.debug(`Media uploader started!`);
    await fastify.listen({ host: BIND_HOST, port: 3000 })
  } catch (err) {
    fastify.log.error(err)
  }
}

run();