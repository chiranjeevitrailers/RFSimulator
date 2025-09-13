'use client';

import React, { useState } from 'react';
import LogViewer from '@/components/logs/LogViewer';

export default function LogsPage() {
	const [source, setSource] = useState('srsran');
	const execId = `exec_${Date.now()}`;
	return (
		<div className="max-w-7xl mx-auto p-6 space-y-4">
			<div className="bg-white border rounded p-4 flex items-center justify-between">
				<h1 className="text-lg font-semibold">Live Logs</h1>
				<select className="border rounded px-2 py-1" value={source} onChange={e => setSource(e.target.value)}>
					<option value="srsran">srsran</option>
					<option value="open5gs">open5gs</option>
					<option value="kamailio">kamailio</option>
				</select>
			</div>
			<div className="bg-white border rounded p-4">
				<LogViewer executionId={execId} testCaseId={'tc-live'} userId={'user-1'} mode={'enhanced'} source={source} />
			</div>
		</div>
	);
}

