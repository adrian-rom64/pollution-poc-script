export const config = {
  openAI: {
    apiKey: process.env.OPEN_AI_API_KEY!
  },
  ambee: {
    apiKey: process.env.AMBEE_API_KEY!,
    baseUrl: 'https://api.ambeedata.com'
  },
  streamr: {
    dataStreamId: process.env.STREAMR_DATA_STREAM_ID!,
    summaryStreamd: process.env.STREAMR_SUMMARY_STREAM_ID!,
    privateKey: process.env.STREAMR_PRIVATE_KEY!
  },
  cities: ['Warsaw', 'Berlin', 'London', 'Dubai', 'New York City', 'Delhi', 'Tokyo', 'Sydney', 'Rio de Janeiro', 'Cape Town'],
  interval: 4 * 3600 * 1000
}