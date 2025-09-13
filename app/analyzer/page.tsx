'use client';

import ProtocolAnalyzerViewer from '@/components/protocol-analyzer/ProtocolAnalyzerViewer';

export default function AnalyzerPage() {
	const execId = `exec_${Date.now()}`;
	return (
		<div className="max-w-7xl mx-auto p-4">
			<ProtocolAnalyzerViewer executionId={execId} testCaseId={'tc-demo'} userId={'user-1'} />
		</div>
	);
}

