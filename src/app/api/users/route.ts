import { users, approveUser, findUser } from '@/lib/users';

export async function GET(req: Request) {
  const username = req.headers.get('authorization') || '';
  const user = findUser(username);
  if (!user || user.role !== 'admin') {
    return new Response('Unauthorized', { status: 401 });
  }
  return new Response(JSON.stringify(users), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(req: Request) {
  const username = req.headers.get('authorization') || '';
  const admin = findUser(username);
  if (!admin || admin.role !== 'admin') {
    return new Response('Unauthorized', { status: 401 });
  }
  const { user: target } = await req.json();
  approveUser(target);
  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
