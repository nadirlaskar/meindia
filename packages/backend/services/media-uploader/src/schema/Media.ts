import { JSONSchemaType } from "ajv";

export const MEDIA_SCHEMA_NAME_CREATE = "mediaSchemaCreate";
export const MEDIA_SCHEMA_NAME_EDIT = "mediaSchemaEdit";

export interface MediaEdit {
  title?: string;
  description?: string;
  tags?: string[];
}

export interface MediaCreate extends MediaEdit {
  title: string;
  description: string;
  mediaType: string;
}

export const mediaSchemaForCreate: JSONSchemaType<MediaCreate> = {
  $id: MEDIA_SCHEMA_NAME_CREATE,
  type: "object",
  properties: {
    title: { type: "string", minLength: 10, maxLength: 100 },
    description: { type: "string", minLength: 20, maxLength: 5000 },
    tags: {
      type: "array",
      items: { type: "string", minLength: 3, maxLength: 20 },
      maxItems: 10,
      nullable: true
    },
    mediaType: { type: "string", enum: ["image", "video", "audio", "list"] }
  },
  required: ["title", "description", "mediaType"],
  additionalProperties: false
}

export const mediaSchemaForEdit: JSONSchemaType<MediaEdit> = {
  $id: MEDIA_SCHEMA_NAME_EDIT,
  type: "object",
  properties: {
    title: { type: "string", minLength: 10, maxLength: 100, nullable: true },
    description: { type: "string", minLength: 20, maxLength: 5000, nullable: true },
    tags: {
      type: "array",
      items: { type: "string", minLength: 3, maxLength: 20 },
      maxItems: 10,
      nullable: true
    },
  },
  additionalProperties: false,
  anyOf: [
    { required: ["title"] },
    { required: ["description"] },
    { required: ["tags"] }
  ]
}

export default MediaCreate;