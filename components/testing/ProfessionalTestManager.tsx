'use client';

import React from 'react';
import ProfessionalTestingPlatform from '@/components/testing/ProfessionalTestingPlatform';

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

  // Use the ProfessionalTestingPlatform component
  return <ProfessionalTestingPlatform />;
};

export default ProfessionalTestManager;

