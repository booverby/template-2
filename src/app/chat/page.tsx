"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Message = { role: 'user' | 'assistant'; content: string };

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [provider, setProvider] = useState<'openai' | 'anthropic'>('openai');
  const [model, setModel] = useState('gpt-4o');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

    const sendMessage = async () => {
      const token = localStorage.getItem('token') || '';
      const userMessage: Message = { role: 'user', content: input };
      const newMessages: Message[] = [...messages, userMessage];
      setMessages(newMessages);
      setInput('');
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ provider, model, messages: newMessages }),
      });
      const data = await res.json();
      if (res.ok) {
        const assistantMessage: Message = { role: 'assistant', content: data.reply };
        setMessages([...newMessages, assistantMessage]);
      }
    };

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-2">
        <select
          value={provider}
          onChange={(e) => {
            const val = e.target.value as 'openai' | 'anthropic';
            setProvider(val);
            setModel(val === 'anthropic' ? 'claude-3-5-sonnet-20240620' : 'gpt-4o');
          }}
          className="border p-1"
        >
          <option value="openai">ChatGPT</option>
          <option value="anthropic">Claude</option>
        </select>
        <input
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="border p-1 flex-1"
        />
        <a href="/settings" className="underline text-sm self-center">
          Settings
        </a>
      </div>
      <div className="border p-2 h-80 overflow-y-auto">
        {messages.map((m, i) => (
          <div key={i} className="mb-2">
            <b>{m.role}:</b> {m.content}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-1 flex-1"
          placeholder="Say something"
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-3">
          Send
        </button>
      </div>
    </div>
  );
}
