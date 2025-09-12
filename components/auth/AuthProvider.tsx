'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  username?: string;
  permissions?: string[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, isAdmin?: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check for existing authentication on mount
    checkAuth();
  }, []);

  useEffect(() => {
    // Handle route protection
    if (!isLoading) {
      handleRouteProtection();
    }
  }, [isLoading, user, pathname]);

  const checkAuth = () => {
    try {
      // Check localStorage for admin user
      const adminUser = localStorage.getItem('adminUser');
      if (adminUser) {
        const parsedUser = JSON.parse(adminUser);
        setUser(parsedUser);
        setIsLoading(false);
        return;
      }

      // Check localStorage for regular user
      const regularUser = localStorage.getItem('user');
      if (regularUser) {
        const parsedUser = JSON.parse(regularUser);
        setUser(parsedUser);
        setIsLoading(false);
        return;
      }

      setUser(null);
      setIsLoading(false);
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      setIsLoading(false);
    }
  };

  const handleRouteProtection = () => {
    // Admin routes
    const adminRoutes = ['/admin-dashboard', '/admin/login'];
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

    // User routes
    const userRoutes = ['/user-dashboard'];
    const isUserRoute = userRoutes.some(route => pathname.startsWith(route));

    // Public routes
    const publicRoutes = ['/', '/login', '/signup', '/admin/login'];
    const isPublicRoute = publicRoutes.includes(pathname);

    if (isPublicRoute) {
      return; // Allow access to public routes
    }

    if (!user) {
      // No user logged in, redirect to appropriate login
      if (isAdminRoute) {
        router.push('/admin/login');
      } else {
        router.push('/login');
      }
      return;
    }

    // User is logged in, check route access
    if (isAdminRoute && user.role !== 'admin') {
      // Regular user trying to access admin routes
      router.push('/user-dashboard');
      return;
    }

    if (isUserRoute && user.role === 'admin') {
      // Admin user trying to access user routes
      router.push('/admin-dashboard');
      return;
    }
  };

  const login = async (email: string, password: string, isAdmin: boolean = false): Promise<{ success: boolean; error?: string }> => {
    try {
      if (isAdmin) {
        // Admin authentication
        const adminCredentials = [
          { email: 'admin@5glabx.com', password: '5GLabX@Admin2024!', role: 'admin', username: '5GLabX-Admin' },
          { email: 'superadmin@5glabx.com', password: 'SuperAdmin@5GLabX2024!', role: 'admin', username: 'Super-Admin' },
          { email: 'manager@5glabx.com', password: 'Manager@5GLabX2024!', role: 'admin', username: 'Manager' }
        ];

        const admin = adminCredentials.find(cred => cred.email === email && cred.password === password);
        
        if (admin) {
          const userData: User = {
            id: `admin-${Date.now()}`,
            email: admin.email,
            role: 'admin',
            username: admin.username,
            permissions: ['*']
          };

          localStorage.setItem('adminUser', JSON.stringify(userData));
          setUser(userData);
          router.push('/admin-dashboard');
          return { success: true };
        } else {
          return { success: false, error: 'Invalid admin credentials' };
        }
      } else {
        // Regular user authentication (mock)
        if (email && password) {
          const userData: User = {
            id: `user-${Date.now()}`,
            email: email,
            role: 'user'
          };

          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
          router.push('/user-dashboard');
          return { success: true };
        } else {
          return { success: false, error: 'Please enter email and password' };
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const logout = () => {
    // Clear all authentication data
    localStorage.removeItem('adminUser');
    localStorage.removeItem('user');
    setUser(null);
    
    // Redirect to home page
    router.push('/');
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};