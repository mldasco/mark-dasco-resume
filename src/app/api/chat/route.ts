import {OpenAIStream, StreamingTextResponse} from 'ai';
import OpenAI from 'openai';

import {botContext} from '../../../data/botContext';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';
const newSystemMessage = {
  role: 'system',
  content: botContext.context,
};

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const {messages} = await req.json();

  messages.unshift(newSystemMessage);

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: messages,
  });
  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response as unknown as Response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
