'use client';

import React from 'react';
import { useAuth } from './AuthProvider';
import { Loader2 } from 'lucide-react';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  fallback?: React.ReactNode;
}

const RouteGuard: React.FC<RouteGuardProps> = ({
  children,
  requireAuth = true,
  requireAdmin = false,
  fallback
}) => {
  const { user, isLoading, isAuthenticated, isAdmin } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check authentication requirements
  if (requireAuth && !isAuthenticated) {
    return fallback || null;
  }

  // Check admin requirements
  if (requireAdmin && !isAdmin) {
    return fallback || null;
  }

  // If all checks pass, render children
  return <>{children}</>;
};

export default RouteGuard;