'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  redirectTo?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  requireAdmin = false,
  redirectTo = '/login',
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await auth.getCurrentUser();
        
        if (user) {
          setIsAuthenticated(true);
          
          // Check if user is admin
          if (requireAdmin) {
            const userRole = await auth.getUserRole(user.id);
            setIsAdmin(userRole === 'admin');
            
            if (userRole !== 'admin') {
              router.push('/user-dashboard');
              return;
            }
          }
        } else {
          setIsAuthenticated(false);
          
          if (requireAuth) {
            router.push(redirectTo);
            return;
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        
        if (requireAuth) {
          router.push(redirectTo);
          return;
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [requireAuth, requireAdmin, redirectTo, router]);

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

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return null; // Will redirect to login
  }

  // If admin access is required but user is not admin
  if (requireAdmin && !isAdmin) {
    return null; // Will redirect to user dashboard
  }

  // If user is authenticated and has required permissions
  return <>{children}</>;
};

export default AuthGuard;