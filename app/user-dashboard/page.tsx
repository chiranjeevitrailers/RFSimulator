'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/auth/AuthGuard';

const UserDashboard: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect directly to the 5GLabX platform
    router.replace('/platform');
  }, [router]);

  return (
    <AuthGuard requireAuth={true} requireAdmin={false} redirectTo="/login">
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to 5GLabX Platform...</p>
        </div>
      </div>
    </AuthGuard>
  );
};

// Disable static generation for this page
export const dynamic = 'force-dynamic';

export default UserDashboard;