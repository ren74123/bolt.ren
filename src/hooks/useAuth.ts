import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setIsAuthenticated(true);
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        navigate('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    } catch (error) {
      console.error('Error checking auth session:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  return { isAuthenticated, isLoading };
}
