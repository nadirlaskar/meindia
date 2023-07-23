import { Client, ClientOptions } from '@elastic/elasticsearch';
import { Index } from '@elastic/elasticsearch/api/requestParams';

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
  async saveDataToIndex(indexName: string, document: T) {
    try {
      // Check if the index exists
      const indexExists = await this.client.indices.exists({ index: indexName });

      // If the index doesn't exist, create it with the desired mapping
      if (!indexExists) {
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
        body: document as Record<string, T>,
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
}