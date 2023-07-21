import { FastifyInstance } from "fastify";
import { mediaSchema } from "./Media";

const schemas = [
  mediaSchema
];

export function withSchema(fastify: FastifyInstance) {
  schemas.forEach(schema => {
    fastify.addSchema(schema);
  });
  return fastify;
}