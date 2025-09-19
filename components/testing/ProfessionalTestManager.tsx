'use client';

import React from 'react';
import ClassicTestManager from '@/components/testing/ClassicTestManager';

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

  // Prefer native TSX implementation to avoid blank page if global script is missing
  return <ClassicTestManager />;
};

export default ProfessionalTestManager;

