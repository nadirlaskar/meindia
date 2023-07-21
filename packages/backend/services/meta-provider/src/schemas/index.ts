
import { schemaComposer } from 'graphql-compose';
import mediaById from "../resolvers/mediaById";

// Add your GraphQL types to the schemaComposer
schemaComposer.Query.addFields({
  mediaById: mediaById,
});

// Create the GraphQL schema
const graphqlSchema = schemaComposer.buildSchema();
export default graphqlSchema;