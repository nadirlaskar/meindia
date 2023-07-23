import { FastifyInstance } from "fastify";
import { mediaSchemaForCreate, mediaSchemaForEdit } from "./Media";

const schemas = [
  mediaSchemaForCreate,
  mediaSchemaForEdit
];

export function withSchema(fastify: FastifyInstance) {
  schemas.forEach(schema => {
    fastify.addSchema(schema);
  });
  return fastify;
}