// Import the framework and instantiate it
import Fastify from 'fastify';
import Logger from 'utils/logger/Logger';
import env from './env';
const fastify = Fastify({
  logger: env.isDebugEnabled
})

const logger = new Logger({
  level: env.logLevel
});

// Declare a route
fastify.get('/', async function handler (request: any, reply: any) {
  return { hello: 'world' }
})


async function run(){
  // Run the server!
  try {
    logger.debug(`Media uploader started!`);
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
  }
}

run();