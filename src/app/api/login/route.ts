import { findUser } from '@/lib/users';

export async function POST(req: Request) {
  const { username, password } = await req.json();
  const user = findUser(username);
  if (!user || user.password !== password) {
    return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
  }
  if (!user.approved) {
    return new Response(JSON.stringify({ error: 'Not approved' }), { status: 403 });
  }
  return new Response(
    JSON.stringify({ token: user.username, role: user.role }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}
