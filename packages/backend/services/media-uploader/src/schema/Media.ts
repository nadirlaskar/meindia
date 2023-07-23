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
    title: { type: "string", minLength: 4, maxLength: 100 },
    description: { type: "string", minLength: 30, maxLength: 1000 },
    tags: { type: "array", items: { type: "string", minLength:4, maxLength: 20 } },
    type: { type: "string", enum: ["image", "video", "audio", "list"] }
  },
  required: ["title", "description", "tags", "type"],
  additionalProperties: false
}

export default Media;