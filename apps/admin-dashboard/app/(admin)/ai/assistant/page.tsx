'use client';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

export default function AssistantPage() {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState('');

  const mutation = useMutation({
    mutationFn: async (msg: string) => {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, conversationHistory: messages }),
      });
      if (!res.ok) throw new Error('Chat failed');
      return res.json();
    },
    onSuccess: (data, variables) => {
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: variables },
        { role: 'agent', content: data.reply }
      ]);
      setInput('');
    },
  });

  const handleSend = () => {
    if (!input.trim()) return;
    mutation.mutate(input);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto h-[calc(100vh-100px)] flex flex-col">
      <h1 className="text-3xl font-bold mb-6 text-white">AI Assistant</h1>
      
      <div className="flex-1 bg-gray-800 rounded-lg shadow-lg border border-gray-700 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-10">
              Hello! How can I help you today?
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] p-3 rounded-lg text-sm ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                {m.content}
              </div>
            </div>
          ))}
          {mutation.isPending && (
            <div className="flex justify-start">
              <div className="max-w-[75%] p-3 rounded-lg text-sm bg-gray-700 text-gray-400">
                Typing...
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 bg-gray-900 border-t border-gray-700 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 rounded-md bg-gray-800 border-gray-700 text-white p-2 focus:ring-blue-500"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSend}
            disabled={mutation.isPending || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white font-semibold transition-colors disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
