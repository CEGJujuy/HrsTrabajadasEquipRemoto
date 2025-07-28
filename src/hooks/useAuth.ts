import { useState, useEffect } from 'react';
import { User as AppUser } from '../types';
import { getCurrentUser, setCurrentUser } from '../lib/localStorage';

export function useAuth() {
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current user from localStorage
    const currentUser = getCurrentUser();
    setProfile(currentUser);
    setLoading(false);
  }, []);

  const signIn = async (user: AppUser) => {
    setCurrentUser(user);
    setProfile(user);
    return { error: null };
  };

  const signOut = async () => {
    setCurrentUser(null);
    setProfile(null);
    return { error: null };
  };

  return {
    user: profile,
    profile,
    loading,
    signIn,
    signOut,
  };
}