'use client';
import React, { useEffect, useState } from 'react';

interface Subscribed5glabxProps {
  iframeSrc?: string;
}

export default function Subscribed5glabx({ iframeSrc = '/5glabx/simple.html' }: Subscribed5glabxProps) {
  const [status, setStatus] = useState<'checking' | 'allowed' | 'denied'>('checking');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        // For demo purposes, we'll simulate a subscription check
        // In production, this would call your actual subscription API
        const hasSubscription = true; // Mock: assume user has subscription
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setStatus(hasSubscription ? 'allowed' : 'denied');
      } catch (error) {
        console.error('Subscription check failed:', error);
        setStatus('denied');
      } finally {
        setIsLoading(false);
      }
    };

    checkSubscription();
  }, []);

  if (isLoading || status === 'checking') {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking subscription...</p>
        </div>
      </div>
    );
  }

  if (status === 'denied') {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <div className="text-yellow-600 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Subscription Required</h3>
        <p className="text-yellow-700 mb-4">
          You need an active subscription to access the 5GLabX Platform.
        </p>
        <a 
          href="/pricing" 
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          Upgrade Now
        </a>
      </div>
    );
  }

  return (
    <div style={{height:'78vh', borderRadius:8, overflow:'hidden', border:'1px solid #e5e7eb'}}>
      <iframe 
        src={iframeSrc} 
        title="5GLabX Platform" 
        style={{width:'100%', height:'100%', border:0}} 
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
        allow="fullscreen"
      />
    </div>
  );
}