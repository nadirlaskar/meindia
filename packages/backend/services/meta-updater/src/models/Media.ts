interface Media {
  id: string;
  title: string;
  description: string;
  tags: string[];
  type: string;
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

export default Media;