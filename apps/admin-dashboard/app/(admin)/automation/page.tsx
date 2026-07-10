'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';

export default function AutomationDashboard() {
  const queryClient = useQueryClient();

  const { data: workflows, isLoading } = useQuery({
    queryKey: ['workflows'],
    queryFn: async () => {
      const res = await fetch('/api/automation/workflows');
      if (!res.ok) throw new Error('Failed to fetch workflows');
      return res.json();
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/automation/workflows/${id}/toggle`, { method: 'PATCH' });
      if (!res.ok) throw new Error('Failed to toggle workflow');
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['workflows'] }),
  });

  const triggerMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/automation/workflows/${id}/trigger`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to trigger workflow');
      return res.json();
    },
    onSuccess: () => {
      alert('Workflow triggered successfully');
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
  });

  if (isLoading) return <div className="p-6 text-white">Loading workflows...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Automation Engine</h1>
        <Link
          href="/automation/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          + New Workflow
        </Link>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-900 border-b border-gray-700">
            <tr>
              <th className="p-4 text-gray-300 font-medium">Name</th>
              <th className="p-4 text-gray-300 font-medium">Trigger</th>
              <th className="p-4 text-gray-300 font-medium">Status</th>
              <th className="p-4 text-gray-300 font-medium">Last Run</th>
              <th className="p-4 text-gray-300 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {workflows?.map((wf: any) => (
              <tr key={wf.id} className="border-b border-gray-700 hover:bg-gray-750">
                <td className="p-4 text-white font-medium">
                  <Link href={`/automation/${wf.id}`} className="hover:text-blue-400">
                    {wf.name}
                  </Link>
                </td>
                <td className="p-4 text-gray-300">
                  <span className="bg-gray-700 px-2 py-1 rounded text-xs">
                    {wf.triggerType}
                  </span>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => toggleMutation.mutate(wf.id)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      wf.isActive ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
                    }`}
                  >
                    {wf.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="p-4 text-gray-400 text-sm">
                  {wf.runs?.[0] ? new Date(wf.runs[0].startedAt).toLocaleString() : 'Never'}
                  {wf.runs?.[0] && (
                    <span className={`ml-2 ${wf.runs[0].status === 'SUCCESS' ? 'text-green-400' : 'text-red-400'}`}>
                      ({wf.runs[0].status})
                    </span>
                  )}
                </td>
                <td className="p-4 text-right space-x-2">
                  {wf.triggerType === 'MANUAL' && (
                    <button
                      onClick={() => triggerMutation.mutate(wf.id)}
                      disabled={!wf.isActive}
                      className="text-blue-400 hover:text-blue-300 text-sm disabled:opacity-50"
                    >
                      Run Now
                    </button>
                  )}
                  <Link href={`/automation/${wf.id}`} className="text-gray-400 hover:text-white text-sm">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {workflows?.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            No workflows found. Create one to get started.
          </div>
        )}
      </div>
    </div>
  );
}
