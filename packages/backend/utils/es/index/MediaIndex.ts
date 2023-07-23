
const MediaSchema = {
  name: 'media',
  properties: {
    id: { type: 'keyword' },
    title: { type: 'text' },
    description: { type: 'text' },
    tags: { type: 'keyword' },
    mediaType: {
      type: 'keyword'
    },
  }
}

export default MediaSchema;