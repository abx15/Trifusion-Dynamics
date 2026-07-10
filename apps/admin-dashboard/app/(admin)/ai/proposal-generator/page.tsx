'use client';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

export default function ProposalGeneratorPage() {
  const [requirements, setRequirements] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');

  const mutation = useMutation({
    mutationFn: async (reqs: string) => {
      const res = await fetch('/api/ai/proposal-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requirements: reqs }),
      });
      if (!res.ok) throw new Error('Failed to generate proposal');
      return res.json();
    },
    onSuccess: (data) => {
      setGeneratedContent(data.generatedContent);
    },
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">AI Proposal Generator</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
        <label className="block text-sm font-medium text-gray-300 mb-2">Requirements</label>
        <textarea
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          rows={6}
          className="w-full rounded-md bg-gray-900 border-gray-700 text-white p-3 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Describe the project requirements..."
        />
        <button
          onClick={() => mutation.mutate(requirements)}
          disabled={mutation.isPending || !requirements.trim()}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-50 flex items-center justify-center"
        >
          {mutation.isPending ? 'Generating...' : 'Generate Proposal'}
        </button>
      </div>

      {generatedContent && (
        <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Generated Proposal</h2>
            <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors">
              Save as Document
            </button>
          </div>
          <div className="bg-gray-900 p-4 rounded-md text-gray-300 whitespace-pre-wrap font-mono text-sm">
            {generatedContent}
          </div>
        </div>
      )}
    </div>
  );
}
