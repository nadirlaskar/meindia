// Import the framework and instantiate it
import Fastify from 'fastify';
import Logger from 'utils/logger/Logger';
import HealthCheckController from './controllers/HealthCheckController';
import UploadController, { UploadSchema } from './controllers/UploadController';
import { withSchema } from './entity/schemas';
import env from './env';

const logger = new Logger({ level: env.logLevel });
const BIND_HOST = process.env.BIND_HOST ?? '0.0.0.0'

const fastify = withSchema(Fastify({ logger: env.isDebugEnabled }));

// Declare a route
fastify.get('/health', HealthCheckController);
fastify.post('/upload', UploadSchema, UploadController);

async function run() {
  try {
    logger.debug(`Media uploader started!`);
    await fastify.listen({ host: BIND_HOST, port: 3000 })
  } catch (err) {
    fastify.log.error(err)
  }
}

run();