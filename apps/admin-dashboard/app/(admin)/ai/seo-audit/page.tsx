'use client';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

export default function SeoAuditPage() {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [result, setResult] = useState<any>(null);

  const mutation = useMutation({
    mutationFn: async (url: string) => {
      const res = await fetch('/api/ai/seo-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ websiteUrl: url }),
      });
      if (!res.ok) throw new Error('Failed to audit website');
      return res.json();
    },
    onSuccess: (data) => {
      setResult(data);
    },
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">AI SEO Audit</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
        <label className="block text-sm font-medium text-gray-300 mb-2">Website URL</label>
        <input
          type="url"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          className="w-full rounded-md bg-gray-900 border-gray-700 text-white p-3 focus:ring-purple-500 focus:border-purple-500"
          placeholder="https://example.com"
        />
        <button
          onClick={() => mutation.mutate(websiteUrl)}
          disabled={mutation.isPending || !websiteUrl.trim()}
          className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-50"
        >
          {mutation.isPending ? 'Auditing...' : 'Run Audit'}
        </button>
      </div>

      {result && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-2">Audit Score</h2>
            <div className="text-5xl font-bold text-purple-400">{result.score}/100</div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-2">Recommendations</h2>
            <ul className="space-y-2">
              {result.recommendations?.map((rec: any, idx: number) => (
                <li key={idx} className="flex justify-between items-center text-sm">
                  <span className="text-gray-300">{rec.title}</span>
                  <span className={`px-2 py-1 rounded text-xs ${rec.priority === 'high' ? 'bg-red-900/50 text-red-400' : 'bg-yellow-900/50 text-yellow-400'}`}>
                    {rec.priority}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
