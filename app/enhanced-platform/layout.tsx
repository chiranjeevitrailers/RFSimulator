'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function EnhancedPlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Load TestCasePlaybackService into browser
    const loadPlaybackService = async () => {
      try {
        // Import the service dynamically
        const TestCasePlaybackServiceModule = await import('@/services/TestCasePlaybackService.js');
        const TestCasePlaybackService = TestCasePlaybackServiceModule.default || TestCasePlaybackServiceModule;
        
        // Make it available globally
        if (typeof window !== 'undefined') {
          (window as any).TestCasePlaybackService = TestCasePlaybackService;
          console.log('✅ TestCasePlaybackService loaded into browser');
        }
      } catch (error) {
        console.error('❌ Failed to load TestCasePlaybackService:', error);
      }
    };

    loadPlaybackService();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {children}
    </div>
  );
}