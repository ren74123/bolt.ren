import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Helper function to check authentication status
export const checkAuth = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  if (!session) {
    throw new Error('Not authenticated');
  }
  return session;
};

// Helper function to sign in with email and password
export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim()
    });
    
    if (error) {
      console.error('Sign in error:', error);
      throw new Error('邮箱或密码错误');
    }
    
    if (!data.session) {
      throw new Error('登录失败，请稍后重试');
    }

    // Create profile if it doesn't exist
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', data.session.user.id)
      .single();

    if (profileError && profileError.code === 'PGRST116') {
      // Profile doesn't exist, create it
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: data.session.user.id,
          username: email.split('@')[0], // Use email prefix as username
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (insertError) {
        console.error('Error creating profile:', insertError);
      }
    }
    
    return data;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

// Helper function to sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
