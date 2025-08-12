import { createOpenAI } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "ai";

export const runtime = "edge";

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response("Missing OpenAI API key", { status: 400 });
  }

  const openai = createOpenAI({ apiKey });
  const { messages } = await req.json();
  const result = await streamText({
    model: openai("gpt-4o"),
    messages: convertToCoreMessages(messages),
    system: "You are a helpful AI assistant",
  });

  return result.toDataStreamResponse();
}
