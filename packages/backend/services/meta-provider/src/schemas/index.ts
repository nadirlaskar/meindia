
import { schemaComposer } from 'graphql-compose';
import mediaById from "../resolvers/mediaById";
import searchMedia from '../resolvers/searchMedia';

// Add your GraphQL types to the schemaComposer
schemaComposer.Query.addFields({
  mediaById: mediaById,
  searchMedia: searchMedia
});

// Create the GraphQL schema
const graphqlSchema = schemaComposer.buildSchema();
export default graphqlSchema;