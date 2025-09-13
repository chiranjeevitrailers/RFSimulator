'use client';

import ProtocolLayerDisplay from '@/components/protocol-layers/ProtocolLayerDisplay';

export default function LayersPage() {
	const execId = `exec_${Date.now()}`;
	return (
		<div className="max-w-7xl mx-auto p-4">
			<ProtocolLayerDisplay executionId={execId} testCaseId={'tc-demo'} userId={'user-1'} selectedLayers={['PHY','MAC','RLC','PDCP','RRC','NAS']} />
		</div>
	);
}

