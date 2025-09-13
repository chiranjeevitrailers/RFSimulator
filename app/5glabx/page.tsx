'use client';

import Link from 'next/link';

export default function FiveGLabXHub() {
	return (
		<div className="min-h-screen bg-gray-50">
			<header className="bg-white border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
					<h1 className="text-lg font-semibold text-gray-900">5GLabX Platform</h1>
				</div>
			</header>
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<Link href="/5glabx/test-cases" className="block bg-white border rounded-lg p-6 hover:shadow-md transition">
						<h2 className="text-base font-semibold text-gray-900">Test Cases</h2>
						<p className="text-sm text-gray-600 mt-1">Browse 1000+ 3GPP-compliant test cases</p>
					</Link>
					<Link href="/5glabx/logs" className="block bg-white border rounded-lg p-6 hover:shadow-md transition">
						<h2 className="text-base font-semibold text-gray-900">Logs</h2>
						<p className="text-sm text-gray-600 mt-1">Live log analysis and search</p>
					</Link>
					<Link href="/5glabx/analyzer" className="block bg-white border rounded-lg p-6 hover:shadow-md transition">
						<h2 className="text-base font-semibold text-gray-900">Protocol Analyzer</h2>
						<p className="text-sm text-gray-600 mt-1">Professional 4G/5G analysis</p>
					</Link>
				</div>
				<div className="mt-8">
					<p className="text-sm text-gray-500">Quick access: <Link href="/test-runner" className="text-primary-600 hover:underline">Test Runner</Link>, <Link href="/layers" className="text-primary-600 hover:underline">Protocol Layers</Link></p>
				</div>
			</main>
		</div>
	);
}

