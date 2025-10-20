'use client';

import AdminNavbar from "@/components/AdminNavbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthToken } from "@/lib/useAuthToken";
import AdminTop from "@/components/AdminTop";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { isAuthenticated, isAdmin } = useAuthToken();
  
  useEffect(() => {
    // Check if user is authenticated and has admin role
    if (!isAuthenticated() || !isAdmin()) {
      router.push('/');
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  // Show nothing while checking authorization
  if (!isAuthorized) {
    return null;
  }

  return (
    <main className="min-h-screen">
      <AdminNavbar>
        <AdminTop />
        {children}
        </AdminNavbar>
    </main>
  );
}
