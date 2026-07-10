'use client';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

export default function EmailWriterPage() {
  const [context, setContext] = useState('');
  const [tone, setTone] = useState('professional');
  const [result, setResult] = useState<any>(null);

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch('/api/ai/email-writer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to generate email');
      return res.json();
    },
    onSuccess: (data) => setResult(data),
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">AI Email Writer</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
        <label className="block text-sm font-medium text-gray-300 mb-2">Context</label>
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          rows={4}
          className="w-full rounded-md bg-gray-900 border-gray-700 text-white p-3 focus:ring-blue-500 focus:border-blue-500 mb-4"
          placeholder="What is this email about?"
        />
        <label className="block text-sm font-medium text-gray-300 mb-2">Tone</label>
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="w-full rounded-md bg-gray-900 border-gray-700 text-white p-3 mb-4 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="professional">Professional</option>
          <option value="friendly">Friendly</option>
          <option value="urgent">Urgent</option>
          <option value="persuasive">Persuasive</option>
        </select>

        <button
          onClick={() => mutation.mutate({ context, tone })}
          disabled={mutation.isPending || !context.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-50"
        >
          {mutation.isPending ? 'Writing...' : 'Write Email'}
        </button>
      </div>

      {result && (
        <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Subject: {result.subject}</h2>
            <button
              onClick={() => navigator.clipboard.writeText(result.body)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Copy Body
            </button>
          </div>
          <div className="bg-gray-900 p-4 rounded-md text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
            {result.body}
          </div>
        </div>
      )}
    </div>
  );
}
