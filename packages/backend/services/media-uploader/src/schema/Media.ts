import { JSONSchemaType } from "ajv";

export const MEDIA_SCHEMA_NAME = "mediaSchema";

export interface Media {
  title: string;
  description: string;
  tags: string[];
  type: string;
}

export const mediaSchema: JSONSchemaType<Media> = {
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