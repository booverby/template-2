import { findUser, setApiKeys } from '@/lib/users';

export async function GET(req: Request) {
  const username = req.headers.get('authorization') || '';
  const user = findUser(username);
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }
  const { openaiKey = '', claudeKey = '', role, approved } = user;
  return new Response(
    JSON.stringify({ openaiKey, claudeKey, role, approved }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}

export async function POST(req: Request) {
  const username = req.headers.get('authorization') || '';
  const user = findUser(username);
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }
  const { openaiKey, claudeKey } = await req.json();
  setApiKeys(username, openaiKey, claudeKey);
  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
