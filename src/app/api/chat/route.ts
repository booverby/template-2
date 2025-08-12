import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { convertToCoreMessages, streamText } from 'ai';
import { findUser } from '@/lib/users';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { provider, model, messages } = await req.json();
  const username = req.headers.get('authorization') || '';
  const user = findUser(username);
  if (!user || !user.approved) {
    return new Response('Unauthorized', { status: 401 });
  }
  const apiKey = provider === 'anthropic' ? user.claudeKey : user.openaiKey;
  if (!apiKey) {
    return new Response('Missing API key', { status: 400 });
  }
  const modelFn = provider === 'anthropic'
    ? createAnthropic({ apiKey })(model)
    : createOpenAI({ apiKey })(model);
  const result = await streamText({
    model: modelFn,
    messages: convertToCoreMessages(messages),
    system: 'You are a helpful AI assistant',
  });
  const text = await result.text;
  return new Response(JSON.stringify({ reply: text }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
