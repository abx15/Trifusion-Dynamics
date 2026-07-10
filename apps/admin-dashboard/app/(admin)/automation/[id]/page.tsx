'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';

export default function WorkflowDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: workflow, isLoading, error } = useQuery({
    queryKey: ['workflow', id],
    queryFn: async () => {
      const res = await fetch(`/api/automation/workflows/${id}`);
      if (!res.ok) throw new Error('Failed to fetch workflow');
      return res.json();
    },
  });

  if (isLoading) return <div className="p-6 text-white">Loading workflow...</div>;
  if (error || !workflow) return <div className="p-6 text-red-500">Error loading workflow</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">{workflow.name}</h1>
          <p className="text-gray-400 mt-1">ID: {workflow.id}</p>
        </div>
        <button
          onClick={() => router.back()}
          className="text-gray-400 hover:text-white"
        >
          &larr; Back to Automation
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Config Summary */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Configuration</h2>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-400">Trigger Type</div>
              <div className="text-white font-medium">{workflow.triggerType}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Status</div>
              <div className={`font-medium ${workflow.isActive ? 'text-green-400' : 'text-red-400'}`}>
                {workflow.isActive ? 'Active' : 'Inactive'}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Trigger Config</div>
              <pre className="bg-gray-900 p-2 rounded text-xs text-gray-300 font-mono">
                {JSON.stringify(workflow.triggerConfig, null, 2)}
              </pre>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Actions</div>
              <pre className="bg-gray-900 p-2 rounded text-xs text-gray-300 font-mono">
                {JSON.stringify(workflow.actions, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        {/* Run History */}
        <div className="lg:col-span-2 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Execution History</h2>
          </div>
          <table className="w-full text-left">
            <thead className="bg-gray-900 border-b border-gray-700">
              <tr>
                <th className="p-4 text-gray-300 font-medium text-sm">Date</th>
                <th className="p-4 text-gray-300 font-medium text-sm">Status</th>
                <th className="p-4 text-gray-300 font-medium text-sm">Output/Error</th>
              </tr>
            </thead>
            <tbody>
              {workflow.runs?.map((run: any) => (
                <tr key={run.id} className="border-b border-gray-700 hover:bg-gray-750">
                  <td className="p-4 text-gray-300 text-sm">
                    {new Date(run.startedAt).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      run.status === 'SUCCESS' ? 'bg-green-900/50 text-green-400' :
                      run.status === 'FAILED' ? 'bg-red-900/50 text-red-400' :
                      'bg-blue-900/50 text-blue-400'
                    }`}>
                      {run.status}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-gray-400 font-mono max-w-xs truncate">
                    {run.status === 'FAILED' ? run.errorMessage : JSON.stringify(run.output)}
                  </td>
                </tr>
              ))}
              {workflow.runs?.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-500">
                    No run history available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
