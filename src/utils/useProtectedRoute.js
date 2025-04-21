'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../app/context/AuthContext';

export const useProtectedRoute = () => {
  const { accessToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!accessToken) {
      router.push('/SignIn');
    }
  }, [accessToken, router]);

  // Helper function for making authenticated API calls
  const authenticatedFetch = async (url, options = {}) => {
    if (!accessToken) {
      throw new Error('No access token available');
    }

    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Token expired or invalid
      router.push('/SignIn');
      throw new Error('Authentication failed');
    }

    return response;
  };

  return { authenticatedFetch };
};