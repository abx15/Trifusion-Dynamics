'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export default function NewWorkflowPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [triggerType, setTriggerType] = useState('EVENT');
  const [triggerConfig, setTriggerConfig] = useState('{}');
  const [actions, setActions] = useState('[\n  { "type": "send_notification", "config": { "template": "hello" } }\n]');

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch('/api/automation/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to create workflow');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      router.push('/automation');
    },
  });

  const handleSave = () => {
    try {
      const parsedTrigger = JSON.parse(triggerConfig);
      const parsedActions = JSON.parse(actions);

      mutation.mutate({
        name,
        triggerType,
        triggerConfig: parsedTrigger,
        actions: parsedActions,
        isActive: true,
      });
    } catch (e) {
      alert('Invalid JSON in config or actions');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Create Workflow</h1>
        <button
          onClick={() => router.back()}
          className="text-gray-400 hover:text-white"
        >
          Cancel
        </button>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Workflow Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md bg-gray-900 border-gray-700 text-white p-3 focus:ring-blue-500"
            placeholder="e.g. Welcome New Leads"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Trigger Type</label>
          <select
            value={triggerType}
            onChange={(e) => setTriggerType(e.target.value)}
            className="w-full rounded-md bg-gray-900 border-gray-700 text-white p-3 focus:ring-blue-500"
          >
            <option value="EVENT">Event-based (e.g. lead.created)</option>
            <option value="SCHEDULED">Scheduled (Cron)</option>
            <option value="MANUAL">Manual Trigger</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Trigger Config (JSON)</label>
          <textarea
            value={triggerConfig}
            onChange={(e) => setTriggerConfig(e.target.value)}
            rows={2}
            className="w-full rounded-md bg-gray-900 border-gray-700 text-white p-3 font-mono text-sm focus:ring-blue-500"
            placeholder='{ "event": "lead.created" }'
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Actions (JSON Array)</label>
          <textarea
            value={actions}
            onChange={(e) => setActions(e.target.value)}
            rows={6}
            className="w-full rounded-md bg-gray-900 border-gray-700 text-white p-3 font-mono text-sm focus:ring-blue-500"
          />
          <p className="text-gray-500 text-xs mt-2">
            Available actions: send_notification, create_task, update_status
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={mutation.isPending || !name.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md transition-colors disabled:opacity-50"
        >
          {mutation.isPending ? 'Saving...' : 'Save Workflow'}
        </button>
      </div>
    </div>
  );
}
