import { composeWithMongoose } from 'graphql-compose-mongoose';
import Media, { MediaModel } from 'utils/mongo/models/Media';

const MediaTC = composeWithMongoose(MediaModel);
MediaTC.addResolver({
  name: 'mediaById',
  args: {
    id: 'String!',
  },
  type: MediaTC,
  resolve: async ({ args }: { args: Partial<Media> }) => {
    const { id }: Partial<Media> = args;
    // Fetch the media from the database based on the id attribute
    const media = await MediaModel.findOne({ id });
    return media;
  },
});

export default MediaTC.getResolver('mediaById');