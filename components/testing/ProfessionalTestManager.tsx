'use client';

import React from 'react';

// A thin TSX wrapper that renders the existing plain-React implementation
// in components/testing/ProfessionalTestingPlatform.js to ensure the
// classic layout is available inside NextJS/TSX screens.

declare global {
  interface Window {
    ProfessionalTestingPlatform?: any;
  }
}

const ProfessionalTestManager: React.FC = () => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    // Mount the existing implementation into this container
    if (typeof window !== 'undefined' && window.ProfessionalTestingPlatform && containerRef.current) {
      try {
        const root = React.createElement(window.ProfessionalTestingPlatform, {
          appState: {},
          onStateChange: () => {}
        });
        // Render via React 18 API in this subtree
        // Create a temporary root specific to this container
        import('react-dom/client').then(({ createRoot }) => {
          const r = createRoot(containerRef.current as HTMLElement);
          r.render(root);
        });
      } catch (e) {
        console.error('Failed to mount ProfessionalTestingPlatform:', e);
      }
    }
  }, []);

  return (
    <div className="h-[720px] border-t">
      <div ref={containerRef} className="h-full" />
    </div>
  );
};

export default ProfessionalTestManager;

