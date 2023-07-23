import mongoose, { Schema } from "mongoose";

interface Media {
  id: string;
  title: string;
  description: string;
  tags: string[];
  mediaType: string;
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

const mediaMongoSchema = new Schema<Media>({
  id: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String
  },
  description: {
    type: String
  },
  tags: {
    type: [String]
  },
  mediaType: {
    type: String
  },
  size: {
    type: Number
  },
  url: {
    type: String
  },
  isDeleted: {
    type: Boolean
  },
  metadata: {
    type: Schema.Types.Mixed
  },
  createdAt: {
    type: Date
  },
  updatedAt: {
    type: Date
  },
  deletedAt: {
    type: Date
  }
});

export const MediaModel = mongoose.model<Media>('Media', mediaMongoSchema);

export default Media;