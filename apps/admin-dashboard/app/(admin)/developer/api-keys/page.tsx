'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function ApiKeysPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [generatedKey, setGeneratedKey] = useState<any>(null);

  const { data: apiKeys, isLoading } = useQuery({
    queryKey: ['apiKeys'],
    queryFn: async () => {
      const res = await fetch('/api/developer/api-keys');
      if (!res.ok) throw new Error('Failed to fetch API keys');
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: { name: string; scopes: string[] }) => {
      const res = await fetch('/api/developer/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to create key');
      return res.json();
    },
    onSuccess: (data) => {
      setGeneratedKey(data);
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
    },
  });

  const revokeMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/developer/api-keys/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to revoke key');
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['apiKeys'] }),
  });

  const handleGenerate = () => {
    createMutation.mutate({ name: newKeyName, scopes: ['*'] });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">API Keys</h1>
        <button
          onClick={() => { setShowModal(true); setGeneratedKey(null); setNewKeyName(''); }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Generate New Key
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
        <table className="w-full text-left">
          <thead className="bg-gray-900 border-b border-gray-700">
            <tr>
              <th className="p-4 text-gray-300 font-medium">Name</th>
              <th className="p-4 text-gray-300 font-medium">Key Prefix</th>
              <th className="p-4 text-gray-300 font-medium">Status</th>
              <th className="p-4 text-gray-300 font-medium">Created</th>
              <th className="p-4 text-gray-300 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="p-4 text-gray-400 text-center">Loading...</td></tr>
            ) : apiKeys?.length === 0 ? (
              <tr><td colSpan={5} className="p-4 text-gray-400 text-center">No API keys found.</td></tr>
            ) : (
              apiKeys?.map((key: any) => (
                <tr key={key.id} className="border-b border-gray-700 hover:bg-gray-750">
                  <td className="p-4 text-white font-medium">{key.name}</td>
                  <td className="p-4 text-gray-400 font-mono text-sm">{key.keyPrefix}••••••••</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      key.isActive ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
                    }`}>
                      {key.isActive ? 'Active' : 'Revoked'}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400 text-sm">
                    {new Date(key.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    {key.isActive && (
                      <button
                        onClick={() => {
                          if(confirm('Are you sure you want to revoke this key?')) {
                            revokeMutation.mutate(key.id);
                          }
                        }}
                        className="text-red-400 hover:text-red-300 font-medium text-sm"
                      >
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-lg border border-gray-700">
            {generatedKey ? (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white">Your New API Key</h2>
                <div className="bg-yellow-900/30 border border-yellow-700 text-yellow-300 p-3 rounded text-sm">
                  <strong>Warning:</strong> Please copy this key now. You will not be able to see it again!
                </div>
                <div className="bg-gray-900 p-3 rounded flex justify-between items-center">
                  <code className="text-green-400">{generatedKey.rawKey}</code>
                  <button
                    onClick={() => navigator.clipboard.writeText(generatedKey.rawKey)}
                    className="text-gray-400 hover:text-white"
                  >
                    Copy
                  </button>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded mt-4"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white">Generate API Key</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Key Name</label>
                  <input
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="w-full rounded bg-gray-900 border-gray-700 text-white p-2"
                    placeholder="e.g. Production App"
                  />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-white font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleGenerate}
                    disabled={!newKeyName.trim() || createMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
                  >
                    {createMutation.isPending ? 'Generating...' : 'Generate'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
