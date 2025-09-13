import { getServerUrl } from './env';

export interface IngestLogEntry {
	level?: string;
	message: string;
	layer?: string;
	protocol?: string;
	source?: string;
	executionId?: string;
	testCaseId?: string;
	data?: any;
	raw?: string;
	decoded?: any;
	informationElements?: any[];
	validation?: any;
	performance?: any;
}

export async function ingestLogs(source: string, logs: IngestLogEntry | IngestLogEntry[]) {
	const server = getServerUrl();
	const resp = await fetch(`${server}/api/logs/${encodeURIComponent(source)}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(logs),
	});
	if (!resp.ok) {
		const err = await resp.text().catch(() => '');
		throw new Error(`Ingest failed: ${resp.status} ${err}`);
	}
	return resp.json();
}

