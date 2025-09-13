'use client';

import React from 'react';

export default function UserDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-600 to-primary-800 text-white font-bold grid place-items-center">5G</div>
            <h1 className="text-lg font-semibold text-gray-900">5GLabX User Dashboard</h1>
          </div>
          <a href="/5glabx/simple/" className="text-sm text-primary-600 hover:text-primary-700">Open 5GLabX in new tab</a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">5GLabX Platform</h2>
            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 border border-green-200">Online</span>
          </div>
          <div style={{height:'78vh', borderTop:'1px solid #e5e7eb'}}>
            <iframe
              src="/5glabx/simple/"
              title="5GLabX Platform"
              style={{ width: '100%', height: '100%', border: 0 }}
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
              allow="fullscreen"
            />
          </div>
        </div>
      </main>
    </div>
  );
}