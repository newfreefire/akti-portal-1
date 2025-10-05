'use client';

import CsrNavbar from "@/components/CsrNavbar";
import { Geist, Geist_Mono } from "next/font/google";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthToken } from "@/lib/useAuthToken";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
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
    <main className="bg-gray-900 text-gray-100 min-h-screen">
      <CsrNavbar>{children}</CsrNavbar>
    </main>
  );
}
