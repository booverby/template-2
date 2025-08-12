"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface UserInfo {
  openaiKey: string;
  claudeKey: string;
  role: string;
  approved: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const [info, setInfo] = useState<UserInfo | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [status, setStatus] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    setRole(localStorage.getItem('role') || '');
    fetch('/api/settings', { headers: { Authorization: token } })
      .then((res) => res.json())
      .then((data) => setInfo(data));
    if (localStorage.getItem('role') === 'admin') {
      fetch('/api/users', { headers: { Authorization: token } })
        .then((res) => res.json())
        .then((data) => setUsers(data));
    }
  }, [router]);

  const saveKeys = async () => {
    if (!info) return;
    const token = localStorage.getItem('token') || '';
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({ openaiKey: info.openaiKey, claudeKey: info.claudeKey }),
    });
    if (res.ok) setStatus('Saved');
  };

  const approve = async (username: string) => {
    const token = localStorage.getItem('token') || '';
    await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({ user: username }),
    });
    const list = await fetch('/api/users', { headers: { Authorization: token } });
    setUsers(await list.json());
  };

  if (!info) return null;

  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-xl mb-2">API Keys</h1>
        <input
          value={info.openaiKey}
          onChange={(e) => setInfo({ ...info, openaiKey: e.target.value })}
          placeholder="OpenAI API Key"
          className="border p-1 w-full mb-2"
        />
        <input
          value={info.claudeKey}
          onChange={(e) => setInfo({ ...info, claudeKey: e.target.value })}
          placeholder="Claude API Key"
          className="border p-1 w-full mb-2"
        />
        <button onClick={saveKeys} className="bg-blue-500 text-white px-2 py-1">
          Save
        </button>
        {status && <span className="ml-2 text-sm">{status}</span>}
      </div>
      {role === 'admin' && (
        <div>
          <h2 className="text-lg mb-2">User Management</h2>
          {users.filter((u) => !u.approved).map((u) => (
            <div key={u.username} className="flex gap-2 mb-1">
              <span>{u.username}</span>
              <button
                onClick={() => approve(u.username)}
                className="bg-green-500 text-white px-2"
              >
                Approve
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
