import { JSONSchemaType } from "ajv";

export const MEDIA_SCHEMA_NAME = "mediaSchema";

export interface Payload {
  title: string;
  description: string;
  tags: string[];
  type: string;
}

export interface Media extends Payload {
  id: string;
  size?: number;
  url?: string;
  isDeleted?: boolean;
  metadata?: {
    [key: string]: any;
  }
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export const mediaSchema: JSONSchemaType<Payload> = {
  $id: MEDIA_SCHEMA_NAME,
  type: "object",
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    tags: { type: "array", items: { type: "string" } },
    type: { type: "string" }
  },
  required: ["title", "description", "tags", "type"],
  additionalProperties: false
}

export default Media;