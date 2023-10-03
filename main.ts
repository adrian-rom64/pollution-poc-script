import { config as configure } from 'dotenv'
configure()

import axios from "axios";
import { StreamrClient } from "streamr-client";
import { writeFileSync } from 'fs'
import { ask } from './ai'
import { AISummary, PollutionData } from "./interfaces";
import { config } from "./config";

writeFileSync('pid', process.pid.toString())

const ping = () => {
  writeFileSync('ping', new Date().toISOString() + '\n', 'utf8')
}

const getPollutionData = async (city: string): Promise<PollutionData | null> => {
  try {
    const res = await axios.request({
      method: "GET",
      baseURL: config.ambee.baseUrl,
      url: "latest/by-city",
      params: { city, limit: 1 },
      headers: {
        "x-api-key": config.ambee.apiKey,
        "Content-type": "application/json",
      },
    });

    if (
      res.data.message !== "success" ||
      !Array.isArray(res.data.stations) ||
      !res.data.stations.length
    ) {
      throw new Error("Invalid response data");
    }

    return { ...res.data.stations[0], type: 'city_stat' }
  } catch (e) {
    console.error(e)
    return null
  }
};

const updateAll = async (client: StreamrClient) => {
  try {
    const dataStream = await client.getStream(config.streamr.dataStreamId);
    const summaryStream = await client.getStream(config.streamr.summaryStreamd);

    const items: PollutionData[] = []

    for (const city of config.cities) {
      console.log('Updating city:', city)

      const data = await getPollutionData(city);
      if (!data) continue

      items.push(data)

      console.log(`${city} pollution: ${data.AQI} AQI`)

      const msg = await client.publish(dataStream, data, { timestamp: Date.now() });
      console.log(`${city} msg signature: `, msg.signature);
    }

    const obj: AISummary = {
      type: 'ai_summary',
      content: await ask(items, 'Create a summary about air pollution')
    }

    console.log(`SUMMARY:\n\n${obj.content}\n`)

    const msg = await client.publish(summaryStream, obj, { timestamp: Date.now() });
    console.log(`AI summary msg signature: `, msg.signature);
  } catch (e) {
    console.error(e)
  }
}

const streamr = new StreamrClient({
  auth: { privateKey: config.streamr.privateKey },
});

updateAll(streamr)

setInterval(async () => {
  await updateAll(streamr)
}, config.interval)


ping()

setInterval(() => {
  ping()
}, 60000)
