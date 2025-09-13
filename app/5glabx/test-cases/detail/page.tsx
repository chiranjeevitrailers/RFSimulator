'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchTestCaseIEs, fetchTestCaseMessages } from '@/lib/test-data';
import { ingestLogs } from '@/lib/log-ingest';
import LogViewer from '@/components/logs/LogViewer';

function DetailInner() {
	const sp = useSearchParams();
	const testCaseId = sp.get('id') || '';
	const [messages, setMessages] = useState<any[]>([]);
	const [ies, setIes] = useState<any[]>([]);
	const [execId, setExecId] = useState<string>('');
	const [source, setSource] = useState<string>('srsran');
	const [error, setError] = useState('');
	const [running, setRunning] = useState(false);

	useEffect(() => {
		(async () => {
			if (!testCaseId) return;
			try {
				setExecId(`exec_${Date.now()}`);
				const [m, i] = await Promise.all([
					fetchTestCaseMessages(testCaseId),
					fetchTestCaseIEs(testCaseId),
				]);
				setMessages(m);
				setIes(i);
			} catch (e: any) {
				setError(e?.message || 'Failed to load test case');
			}
		})();
	}, [testCaseId]);

	const run = async () => {
		setRunning(true);
		setError('');
		try {
			for (const m of messages) {
				const relIes = ies.filter(i => i.message_id === m.id || i.test_case_id === testCaseId);
				await ingestLogs(source, {
					message: `${m.protocol}:${m.layer}:${m.message_type}`,
					level: 'info',
					layer: m.layer,
					protocol: m.protocol,
					source,
					executionId: execId,
					testCaseId,
					data: { direction: m.direction, order: m.order_index, messageType: m.message_type },
					informationElements: relIes,
				});
				await new Promise(r => setTimeout(r, 150));
			}
		} catch (e: any) {
			setError(e?.message || 'Run failed');
		} finally {
			setRunning(false);
		}
	};

	return (
		<div className="max-w-7xl mx-auto p-6 space-y-6">
			<div className="bg-white border rounded p-4">
				<div className="flex items-center justify-between">
					<h1 className="text-lg font-semibold">Test Case: {testCaseId || '—'}</h1>
					<div className="flex gap-2 items-center">
						<select className="border rounded px-2 py-1" value={source} onChange={e => setSource(e.target.value)}>
							<option value="srsran">srsran</option>
							<option value="open5gs">open5gs</option>
							<option value="kamailio">kamailio</option>
						</select>
						<button className="px-4 py-2 rounded bg-primary-600 text-white disabled:opacity-50" onClick={run} disabled={running || !messages.length}>
							{running ? 'Running…' : 'Run'}
						</button>
					</div>
				</div>
				{error && <div className="mt-3 text-sm text-red-600">{error}</div>}
				<div className="mt-4 text-sm text-gray-600">Messages: {messages.length} • IEs: {ies.length}</div>
			</div>

			<div className="bg-white border rounded p-4">
				<h2 className="text-base font-semibold mb-2">Live Logs</h2>
				<LogViewer executionId={execId} testCaseId={testCaseId} userId={'user-1'} mode={'enhanced'} source={source} />
			</div>
		</div>
	);
}

export default function TestCaseDetailPage() {
	return (
		<Suspense fallback={<div className="max-w-7xl mx-auto p-6">Loading…</div>}>
			<DetailInner />
		</Suspense>
	);
}

