'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchActiveTestCases } from '@/lib/test-data';

export default function TestCasesListPage() {
	const [items, setItems] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		(async () => {
			try {
				setLoading(true);
				const data = await fetchActiveTestCases(500);
				setItems(data);
			} catch (e: any) {
				setError(e?.message || 'Failed to load test cases');
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	return (
		<div className="max-w-7xl mx-auto p-6">
			<h1 className="text-xl font-semibold mb-4">Test Cases</h1>
			{error && <div className="text-sm text-red-600 mb-3">{error}</div>}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{items.map(tc => (
					<Link key={tc.id} href={`/5glabx/test-cases/detail?id=${tc.id}`} className="block bg-white border rounded p-4 hover:shadow">
						<div className="text-sm text-gray-500">{tc.category}</div>
						<div className="font-medium">{tc.name}</div>
						<div className="text-sm text-gray-600 line-clamp-2">{tc.description}</div>
					</Link>
				))}
			</div>
		</div>
	);
}

