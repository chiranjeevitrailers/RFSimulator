'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { fetchActiveTestCases, fetchTestCaseIEs, fetchTestCaseMessages } from '@/lib/test-data';
import { ingestLogs } from '@/lib/log-ingest';
import LogViewer from '@/components/logs/LogViewer';

export default function TestRunnerPage() {
	const [loading, setLoading] = useState(false);
	const [cases, setCases] = useState<any[]>([]);
	const [selectedId, setSelectedId] = useState<string>('');
	const [execId, setExecId] = useState<string>('');
	const [source, setSource] = useState<string>('srsran');
	const [runState, setRunState] = useState<'idle' | 'running' | 'done' | 'error'>('idle');
	const [error, setError] = useState<string>('');

	useEffect(() => {
		(async () => {
			try {
				setLoading(true);
				const list = await fetchActiveTestCases(200);
				setCases(list);
				if (list.length) setSelectedId(list[0].id);
				setExecId(`exec_${Date.now()}`);
			} catch (e: any) {
				setError(e?.message || 'Failed to load test cases');
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	const selected = useMemo(() => cases.find(c => c.id === selectedId), [cases, selectedId]);

	async function run() {
		if (!selectedId) return;
		setRunState('running');
		setError('');
		try {
			const [messages, ies] = await Promise.all([
				fetchTestCaseMessages(selectedId),
				fetchTestCaseIEs(selectedId),
			]);

			// stream logs in message order
			for (const m of messages) {
				const relatedIEs = ies.filter(i => i.message_id === m.id || i.test_case_id === selectedId);
				await ingestLogs(source, {
					message: `${m.protocol}:${m.layer}:${m.message_type}`,
					level: 'info',
					layer: m.layer,
					protocol: m.protocol,
					source,
					executionId: execId,
					testCaseId: selectedId,
					data: { direction: m.direction, order: m.order_index },
					informationElements: relatedIEs.map(i => ({ name: i.name, type: i.type, value: i.value, hex: i.hex_value, mandatory: i.mandatory })),
				});
				await new Promise(r => setTimeout(r, 200));
			}
			setRunState('done');
		} catch (e: any) {
			setRunState('error');
			setError(e?.message || 'Run failed');
		}
	}

	return (
		<div className="max-w-7xl mx-auto p-6 space-y-6">
			<div className="bg-white rounded-lg border p-4">
				<h1 className="text-xl font-semibold">Test Runner</h1>
				<p className="text-sm text-gray-600">Select a test case, run it, and view live logs.</p>
				<div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
					<div>
						<label className="block text-sm text-gray-700 mb-1">Test Case</label>
						<select className="w-full border rounded px-2 py-2" value={selectedId} onChange={e => setSelectedId(e.target.value)} disabled={loading}>
							{cases.map(tc => (
								<option key={tc.id} value={tc.id}>{tc.name}</option>
							))}
						</select>
					</div>
					<div>
						<label className="block text-sm text-gray-700 mb-1">Source</label>
						<select className="w-full border rounded px-2 py-2" value={source} onChange={e => setSource(e.target.value)}>
							<option value="srsran">srsran</option>
							<option value="open5gs">open5gs</option>
							<option value="kamailio">kamailio</option>
						</select>
					</div>
					<div className="flex gap-2">
						<button className="px-4 py-2 rounded bg-primary-600 text-white disabled:opacity-50" onClick={run} disabled={!selectedId || runState==='running'}>
							{runState==='running' ? 'Running…' : 'Run'}
						</button>
						<button className="px-4 py-2 rounded border" onClick={() => setExecId(`exec_${Date.now()}`)}>New Execution</button>
					</div>
				</div>
				{error && <div className="mt-3 text-sm text-red-600">{error}</div>}
			</div>

			<div className="bg-white rounded-lg border p-4">
				<h2 className="text-lg font-semibold mb-2">Live Logs</h2>
				<LogViewer executionId={execId} testCaseId={selectedId} userId={'user-1'} mode={'enhanced'} source={source} />
			</div>
		</div>
	);
}

