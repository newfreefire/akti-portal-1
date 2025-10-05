'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Hook to protect client-side routes
export function useAuth(requiredRole = null) {
  const router = useRouter();

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('userRole');
      
      // If no token, redirect to login
      if (!token) {
        router.push('/');
        return;
      }
      
      // If role is required, check if user has the required role
      if (requiredRole && userRole !== requiredRole) {
        router.push('/');
        return;
      }
    }
  }, [router, requiredRole]);
}

// HOC to protect admin routes
export function withAdminAuth(Component) {
  return function AdminProtectedRoute(props) {
    useAuth('admin');
    return <Component {...props} />;
  };
}

// HOC to protect CSR routes
export function withCsrAuth(Component) {
  return function CsrProtectedRoute(props) {
    useAuth('csr');
    return <Component {...props} />;
  };
}