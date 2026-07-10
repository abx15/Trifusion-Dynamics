'use client';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

export default function MeetingSummaryPage() {
  const [transcript, setTranscript] = useState('');
  const [result, setResult] = useState<any>(null);

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch('/api/ai/meeting-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to generate summary');
      return res.json();
    },
    onSuccess: (data) => setResult(data),
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">AI Meeting Summary</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 mb-8">
        <label className="block text-sm font-medium text-gray-300 mb-2">Transcript</label>
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          rows={8}
          className="w-full rounded-md bg-gray-900 border-gray-700 text-white p-3 focus:ring-green-500 focus:border-green-500 mb-4"
          placeholder="Paste meeting transcript here..."
        />
        <button
          onClick={() => mutation.mutate({ transcript })}
          disabled={mutation.isPending || !transcript.trim()}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-50"
        >
          {mutation.isPending ? 'Summarizing...' : 'Summarize Meeting'}
        </button>
      </div>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Summary</h2>
            <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
              {result.summary}
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Action Items</h2>
            <ul className="space-y-3">
              {result.actionItems?.map((item: any, idx: number) => (
                <li key={idx} className="bg-gray-900 p-3 rounded-md text-sm">
                  <div className="text-white font-medium">{item.task}</div>
                  <div className="text-gray-400 text-xs mt-1">
                    Assignee: {item.assignee || 'Unassigned'} | Due: {item.dueDate || 'N/A'}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
