import { supabase, supabaseAdmin } from './supabase';

export const auth = {
  async signInAdmin(email: string, password: string) {
    // Simplified admin login: direct verification against env variables or a specific table
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      // For a real app, you'd likely have a dedicated admin table or use RLS
      const { data: adminUser, error: adminError } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('role', 'admin')
        .single();

      if (adminError || !adminUser) {
        throw new Error('Admin user not found or not authorized');
      }
      // In a real scenario, you'd create a session token for the admin
      return { user: adminUser, session: null }; // Simplified: no session token for direct admin login
    }
    throw new Error('Invalid admin credentials');
  },

  async signUpUser(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    // Insert user into public.users table with default role
    if (data.user) {
      await supabase.from('users').insert({
        id: data.user.id,
        email: data.user.email,
        role: 'user',
      });
    }
    return data;
  },

  async signInUser(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile, error } = await supabase.from('users').select('*').eq('id', user.id).single();
      if (error) throw error;
      return { ...user, profile };
    }
    return null;
  },

  async getUserRole(userId: string): Promise<'admin' | 'user' | null> {
    const { data, error } = await supabase.from('users').select('role').eq('id', userId).single();
    if (error) {
      console.error('Error fetching user role:', error);
      return null;
    }
    return data?.role || null;
  },
};