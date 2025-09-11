import { supabase, db, User } from './supabase';
import { toast } from 'react-hot-toast';

export interface AuthUser {
  id: string;
  email: string;
  role: 'user' | 'admin';
  subscription_tier: 'free' | 'pro' | 'enterprise';
  full_name?: string;
  avatar_url?: string;
}

export class AuthService {
  // Admin authentication
  static async adminLogin(email: string, password: string): Promise<AuthUser | null> {
    try {
      // Check if user exists and is admin
      const user = await db.getUserByEmail(email);
      
      if (!user || user.role !== 'admin') {
        toast.error('Invalid admin credentials');
        return null;
      }

      // For now, we'll use a simple password check
      // In production, you should use proper password hashing
      const adminPassword = process.env.ADMIN_PASSWORD;
      if (password !== adminPassword) {
        toast.error('Invalid admin credentials');
        return null;
      }

      // Update last login
      await db.updateUser(user.id, { last_login: new Date().toISOString() });

      // Log activity
      await db.logUserActivity({
        user_id: user.id,
        activity_type: 'login',
        activity_data: { login_type: 'admin' },
      });

      toast.success('Admin login successful');
      return {
        id: user.id,
        email: user.email,
        role: user.role,
        subscription_tier: user.subscription_tier,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
      };
    } catch (error) {
      console.error('Admin login error:', error);
      toast.error('Login failed. Please try again.');
      return null;
    }
  }

  // User registration
  static async userSignup(email: string, password: string, fullName?: string): Promise<AuthUser | null> {
    try {
      // Check if user already exists
      const existingUser = await db.getUserByEmail(email);
      if (existingUser) {
        toast.error('User already exists with this email');
        return null;
      }

      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (authError) {
        toast.error('Registration failed: ' + authError.message);
        return null;
      }

      if (!authData.user) {
        toast.error('Registration failed');
        return null;
      }

      // Create user in our database
      const userData: Partial<User> = {
        id: authData.user.id,
        email: authData.user.email!,
        full_name: fullName,
        role: 'user',
        subscription_tier: 'free',
        subscription_status: 'active',
        is_active: true,
      };

      const user = await db.createUser(userData);

      // Log activity
      await db.logUserActivity({
        user_id: user.id,
        activity_type: 'login',
        activity_data: { login_type: 'signup' },
      });

      toast.success('Registration successful! Please check your email to verify your account.');
      return {
        id: user.id,
        email: user.email,
        role: user.role,
        subscription_tier: user.subscription_tier,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
      };
    } catch (error) {
      console.error('User signup error:', error);
      toast.error('Registration failed. Please try again.');
      return null;
    }
  }

  // User login
  static async userLogin(email: string, password: string): Promise<AuthUser | null> {
    try {
      // Authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        toast.error('Login failed: ' + authError.message);
        return null;
      }

      if (!authData.user) {
        toast.error('Login failed');
        return null;
      }

      // Get user from our database
      const user = await db.getUserByEmail(email);
      if (!user) {
        toast.error('User not found');
        return null;
      }

      // Update last login
      await db.updateUser(user.id, { last_login: new Date().toISOString() });

      // Log activity
      await db.logUserActivity({
        user_id: user.id,
        activity_type: 'login',
        activity_data: { login_type: 'user' },
      });

      toast.success('Login successful');
      return {
        id: user.id,
        email: user.email,
        role: user.role,
        subscription_tier: user.subscription_tier,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
      };
    } catch (error) {
      console.error('User login error:', error);
      toast.error('Login failed. Please try again.');
      return null;
    }
  }

  // Logout
  static async logout(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      }
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // Get current user
  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return null;
      }

      const dbUser = await db.getUserByEmail(user.email!);
      if (!dbUser) {
        return null;
      }

      return {
        id: dbUser.id,
        email: dbUser.email,
        role: dbUser.role,
        subscription_tier: dbUser.subscription_tier,
        full_name: dbUser.full_name,
        avatar_url: dbUser.avatar_url,
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Check if user is admin
  static async isAdmin(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user?.role === 'admin';
  }

  // Check if user is authenticated
  static async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user !== null;
  }
}