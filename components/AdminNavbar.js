"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthToken } from "@/lib/useAuthToken";

export default function AdminNavbar({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
  const { clearAuthToken } = useAuthToken();

  // ✅ Detect screen size and handle default open/close
  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024; // lg breakpoint
      setIsDesktop(desktop);
      setIsOpen(desktop); // open by default on desktop
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const tabs = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Add CSR", path: "/admin/add-csr" },
    { name: "Course Management", path: "/admin/course-management" },
    { name: "Reports", path: "/admin/reports" },
    { name: "Users", path: "/admin/users" },
    { name: "Settings", path: "/admin/settings" },
  ];

  // ✅ Handle logout redirect
  const handleLogout = async () => {
    try {
      // Call the logout API endpoint
      const response = await fetch('/api/logout');
      if (response.ok) {
        // Clear auth token and redirect to login page
        clearAuthToken();
        router.push("/");
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="flex min-h-screen relative overflow-hidden">
      {/* 🧭 Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 border-r shadow-xl flex flex-col
          transform transition-transform duration-500 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* 🔹 Top Section with Logo */}
        <div className="flex w-full justify-center items-center px-6 py-5 border-b border-gray-800">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={150}
            height={150}
            className="rounded-md object-cover"
          />
        </div>

        {/* 🔹 Navigation Tabs */}
        <nav className="flex-1 mt-6 space-y-1 px-3 overflow-y-auto">
          {tabs.map(({ name, path }) => {
            const active = pathname === path;
            return (
              <Link
                key={path}
                href={path}
                onClick={() => {
                  if (!isDesktop) setIsOpen(false);
                }}
                className={`block px-5 py-3 rounded-md text-sm font-medium transition-all duration-300
                  ${
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }
                `}
              >
                {name}
              </Link>
            );
          })}
        </nav>

        {/* 🔹 Logout Button */}
        <div className="border-t border-gray-800 px-6 py-4">
          <button
            onClick={handleLogout}
            className="w-full cursor-pointer flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-all duration-300 group hover:bg-destructive hover:text-destructive-foreground"
          >
            <LogOut
              size={18}
              className="group-hover:rotate-12 transition-transform duration-300"
            />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* 🍔 Hamburger Button (Outside Sidebar, Static Icon) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-5 z-50 p-2 rounded-full border transition-all duration-300 cursor-pointer
        ${isOpen ? "left-[15.5rem]" : "left-4"}
        `}
        aria-label="Toggle sidebar"
      >
        <Menu size={22} />
      </button>

      {/* 🌓 Overlay for Mobile */}
      {isOpen && !isDesktop && (
        <div
          className="fixed inset-0 backdrop-blur-sm z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* 🧱 Main Content Area */}
      <main
        className={`flex-1 transition-all duration-500 ease-in-out px-8 py-6
          ${isDesktop ? (isOpen ? "lg:ml-64" : "lg:ml-0") : ""}
        `}
      >
        {children}
      </main>
    </div>
  );
}
