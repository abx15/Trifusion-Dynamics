'use client';

import { useQuery } from '@tanstack/react-query';

export default function WebhooksPage() {
  const { data: webhooks, isLoading } = useQuery({
    queryKey: ['webhooks'],
    queryFn: async () => {
      const res = await fetch('/api/developer/webhooks');
      if (!res.ok) throw new Error('Failed to fetch webhooks');
      return res.json();
    },
  });

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Webhooks</h1>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Add Webhook
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
        <table className="w-full text-left">
          <thead className="bg-gray-900 border-b border-gray-700">
            <tr>
              <th className="p-4 text-gray-300 font-medium">URL</th>
              <th className="p-4 text-gray-300 font-medium">Events</th>
              <th className="p-4 text-gray-300 font-medium">Status</th>
              <th className="p-4 text-gray-300 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={4} className="p-4 text-gray-400 text-center">Loading...</td></tr>
            ) : webhooks?.length === 0 ? (
              <tr><td colSpan={4} className="p-4 text-gray-400 text-center">No webhooks configured.</td></tr>
            ) : (
              webhooks?.map((webhook: any) => (
                <tr key={webhook.id} className="border-b border-gray-700 hover:bg-gray-750">
                  <td className="p-4 text-white font-medium">{webhook.url}</td>
                  <td className="p-4 text-gray-400 text-sm">
                    {webhook.events.join(', ')}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      webhook.isActive ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
                    }`}>
                      {webhook.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400 text-sm">
                    {new Date(webhook.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
