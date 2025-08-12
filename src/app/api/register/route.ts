import { addUser, findUser } from '@/lib/users';

export async function POST(req: Request) {
  const { username, password } = await req.json();
  if (!username || !password) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
  }
  if (findUser(username)) {
    return new Response(JSON.stringify({ error: 'User exists' }), { status: 400 });
  }
  addUser(username, password);
  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
