import { Client, ClientOptions } from '@elastic/elasticsearch';
import { Index } from '@elastic/elasticsearch/api/requestParams';

export type ElasticDocument<T> = { id: string } & T;

export class ElasticConnection<T> {
  client: Client;
  indexDefination: { [key: string]: any; }
  constructor(config: Partial<ClientOptions>, indexMappings: any) {
    // Elasticsearch client configuration
    this.client = new Client({
      node: config.node,
      nodes: config.nodes,
    });
    this.indexDefination = indexMappings;
  }
  // Function to save data to the index
  async saveDataToIndex(indexName: string, document: ElasticDocument<T>) {
    try {
      // Check if the index exists
      const indexExists = await this.client.indices.exists({ index: indexName });

      console.debug(`Index ${indexName} exists: ${indexExists.statusCode}`);

      // If the index doesn't exist, create it with the desired mapping
      if (!indexExists.body) {
        console.debug(`Creating index ${indexName}`);
        await this.client.indices.create({
          index: indexName,
          body: {
            mappings: {
              properties: this.indexDefination[indexName],
            },
          },
        });
        console.debug(`Created index ${indexName}`);
      }
      const payload: Index<Record<string, any>> = {
        index: indexName,
        body: document as Record<string, ElasticDocument<T>>,
      }

      const existingId = await this.checkIfDocExistInEs(indexName, document);
      if (existingId) {
        payload.id = existingId;
      }
      // Save the document to the index
      const result = await this.client.index(payload);

      console.log('Document saved:', result.body);
      return result.body;
    } catch (error) {
      console.error('Error saving document:', error);
      throw error;
    }
  }
  async checkIfDocExistInEs(indexName: string, document: ElasticDocument<T>) {
    const result = await this.client.search({
      index: indexName,
      body: {
        query: {
          match: {
            id: document.id
          }
        }
      }
    });
    if (result.body.hits.total.value > 0) {
      console.log('Document already exist in ES:', result.body);
      return result.body.hits.hits[0]._id;
    }
    return false;
  }
}