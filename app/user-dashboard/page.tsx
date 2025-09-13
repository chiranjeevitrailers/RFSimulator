'use client';

import Link from 'next/link';

export default function UserDashboard() {
	return (
		<div className="min-h-screen bg-gray-50">
			<header className="bg-white border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
					<h1 className="text-lg font-semibold text-gray-900">5GLabX Dashboard</h1>
				</div>
			</header>
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<Link href="/test-runner" className="block bg-white border rounded-lg p-6 hover:shadow-md transition">
						<h2 className="text-base font-semibold text-gray-900">Test Runner</h2>
						<p className="text-sm text-gray-600 mt-1">Select test case, run, stream logs</p>
					</Link>
					<Link href="/analyzer" className="block bg-white border rounded-lg p-6 hover:shadow-md transition">
						<h2 className="text-base font-semibold text-gray-900">Protocol Analyzer</h2>
						<p className="text-sm text-gray-600 mt-1">Live 4G/5G log analysis</p>
					</Link>
					<Link href="/layers" className="block bg-white border rounded-lg p-6 hover:shadow-md transition">
						<h2 className="text-base font-semibold text-gray-900">Protocol Layers</h2>
						<p className="text-sm text-gray-600 mt-1">Layer-by-layer view (PHY→NAS)</p>
					</Link>
				</div>
			</main>
		</div>
	);
}