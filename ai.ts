import { OpenAI } from 'openai'
import { config } from './config'

export const ask = async (data: any[], prompt: string) => {
  const ai = new OpenAI({ apiKey: config.openAI.apiKey })

  const stream = await ai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `This is the most recent data about air pollution in the world as JSON.\n${JSON.stringify(
          data
        )}\nUse this data to answer questions`,
      },
      {
        role: 'system',
        content:
          'Your task in general is to talk and answer questions about air pollution in the world. Try to answer in a light, funny or dark humor way. Answer as a weather girl from tv called Peva.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    model: 'gpt-3.5-turbo',
    stream: true,
  })

  const chunks: string[] = []

  for await (const part of stream) {
    const [choice] = part.choices

    if (choice.finish_reason === 'stop') {
      stream.controller.abort()
    }

    chunks.push(choice.delta.content ?? '')
  }

  return chunks.join('')
}
