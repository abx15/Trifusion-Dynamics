'use client';

import { useQuery } from '@tanstack/react-query';

export default function RequestLogsPage() {
  const { data: logs, isLoading } = useQuery({
    queryKey: ['requestLogs'],
    queryFn: async () => {
      const res = await fetch('/api/developer/request-logs');
      if (!res.ok) throw new Error('Failed to fetch request logs');
      return res.json();
    },
  });

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">API Request Logs</h1>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
        <table className="w-full text-left">
          <thead className="bg-gray-900 border-b border-gray-700">
            <tr>
              <th className="p-4 text-gray-300 font-medium text-sm">Timestamp</th>
              <th className="p-4 text-gray-300 font-medium text-sm">Method</th>
              <th className="p-4 text-gray-300 font-medium text-sm">Path</th>
              <th className="p-4 text-gray-300 font-medium text-sm">Status</th>
              <th className="p-4 text-gray-300 font-medium text-sm">Latency</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="p-4 text-gray-400 text-center">Loading...</td></tr>
            ) : logs?.length === 0 ? (
              <tr><td colSpan={5} className="p-4 text-gray-400 text-center">No logs found.</td></tr>
            ) : (
              logs?.map((log: any) => (
                <tr key={log.id} className="border-b border-gray-700 hover:bg-gray-750 text-sm">
                  <td className="p-4 text-gray-400">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="p-4 text-white font-mono">{log.method}</td>
                  <td className="p-4 text-gray-300 font-mono truncate max-w-xs">{log.path}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      log.statusCode < 400 ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
                    }`}>
                      {log.statusCode}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400">{log.responseTimeMs}ms</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
