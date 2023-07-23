import { ElasticConnection } from 'utils/es';
import MediaIndex from 'utils/es/index/MediaIndex';
import { schemas } from 'utils/es/schemas';
import Media from 'utils/mongo/models/Media';
import env from '../env';

import { composeWithElastic } from 'graphql-compose-elasticsearch';

const es = new ElasticConnection<Media>(env.esConfig, schemas);

const MediaEsTC = composeWithElastic({
  graphqlTypeName: 'MediaES',
  elasticMapping: {
    properties: MediaIndex.properties,
  },
  elasticClient: es.client,
  elasticIndex: MediaIndex.name,
  elasticType: '_doc',
});

export default MediaEsTC.getResolver('search');