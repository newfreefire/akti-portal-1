'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Custom hook to handle authentication token management
 * This ensures consistent token handling across the application
 */
export function useAuthToken() {
  const router = useRouter();

  // Function to set auth token in localStorage and for API requests
  const setAuthToken = (token, userId, userRole) => {
    if (typeof window !== 'undefined') {
      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('userRole', userRole);
      
      console.log('Auth token set successfully');
    }
  };

  // Function to get the current auth token
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  // Function to clear auth token (logout)
  const clearAuthToken = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
      router.push('/');
    }
  };

  // Function to check if user is authenticated
  const isAuthenticated = () => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('token');
    }
    return false;
  };

  // Function to get user role
  const getUserRole = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userRole');
    }
    return null;
  };

  // Function to check if user has admin role
  const isAdmin = () => {
    return getUserRole() === 'admin';
  };

  // Function to check if user has CSR role
  const isCSR = () => {
    return getUserRole() === 'csr';
  };

  return {
    setAuthToken,
    getAuthToken,
    clearAuthToken,
    isAuthenticated,
    getUserRole,
    isAdmin,
    isCSR
  };
}