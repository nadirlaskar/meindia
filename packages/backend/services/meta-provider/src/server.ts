import fastify from "fastify";
import env from "./env";

// index.js
import mercurius from 'mercurius';
import { connectToMongoDb } from 'utils/mongo';
import graphqlSchema from "./schemas";

const app = fastify({ logger: env.isDebugEnabled });
const BIND_HOST = process.env.BIND_HOST ?? '0.0.0.0';

// Connect to MongoDB using Mongoose
connectToMongoDb(env.mongoURL, env.mongoConfig);

// Register the fastify-gql plugin
app.register(mercurius, {
  schema: graphqlSchema,
  graphiql: env.isDebugEnabled,
});

app.get('/health', async () => {
  return { status: 'OK' }
});

// Start the Fastify server
app.listen({ host: BIND_HOST, port: 5555 })
