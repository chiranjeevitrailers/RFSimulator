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
  // Use the original JavaScript ProfessionalTestingPlatform component
  if (typeof window !== 'undefined' && window.ProfessionalTestingPlatform) {
    return React.createElement(window.ProfessionalTestingPlatform, {});
  }

  // Fallback if the component is not loaded
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <div className="text-lg font-semibold text-gray-900 mb-2">Professional Test Manager</div>
        <div className="text-sm text-gray-600">Loading...</div>
      </div>
    </div>
  );
};

export default ProfessionalTestManager;

