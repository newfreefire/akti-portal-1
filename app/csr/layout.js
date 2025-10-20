'use client';

import CsrNavbar from "@/components/CsrNavbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthToken } from "@/lib/useAuthToken";
import CsrTop from "@/components/CsrTop";

export default function CsrLayout({ children }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { isAuthenticated, isCSR, isAdmin } = useAuthToken();
  
  useEffect(() => {
    // Check if we're in the browser
    if (typeof window !== 'undefined') {
      // Allow both CSR and admin users to access CSR routes
      if (!isAuthenticated() || (!isCSR() && !isAdmin())) {
        router.push('/');
      } else {
        setIsAuthorized(true);
      }
    }
  }, [router]);

  // Show nothing while checking authorization
  if (!isAuthorized) {
    return null;
  }

  return (
    <main className="min-h-screen">
      <CsrNavbar>
        <CsrTop />
        {children}
        </CsrNavbar>
    </main>
  );
}
