'use client';

import React, { useState, useEffect } from 'react';
import { FaUsers, FaUserTie, FaUserFriends, FaUserGraduate, FaSpinner } from 'react-icons/fa';
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCSRs: 0,
    activeCSRs: 0,
    totalCoWorkers: 0,
    totalStudents: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch CSRs
        const csrResponse = await fetch('/api/csr');
        const csrData = await csrResponse.json();

        // Fetch Co-workers
        const coWorkersResponse = await fetch('/api/co-workers');
        const coWorkersData = await coWorkersResponse.json();

        // Fetch Students
        const studentsResponse = await fetch('/api/students');
        const studentsData = await studentsResponse.json();

        if (csrData.success && coWorkersData.success) {
          const activeCSRs = csrData.csrs.filter(csr => csr.isActive).length;

          setStats({
            totalCSRs: csrData.csrs.length,
            activeCSRs,
            totalCoWorkers: coWorkersData.coWorkers.length,
            totalStudents: studentsData.success ? studentsData.students.length : 0
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="py-6 max-w-[100vw] mx-auto">
      {loading ? (
        <div className="flex justify-center items-center">
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-30'>
            <Skeleton className="h-15 w-30 rounded-full" />
            <Skeleton className="h-15 w-30 rounded-full" />
            <Skeleton className="h-15 w-30 rounded-full" />
            <Skeleton className="h-15 w-30 rounded-full" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total CSRs Card */}
          <div className="rounded-lg transition-all duration-200 ease-out hover:scale-[1.05] hover:shadow-2xl hover:border-gray-200 shadow-md bg-secondary/30 p-6 border-primary ">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary/10 mr-4">
                <FaUserTie className="text-yellow-500 text-2xl" />
              </div>
              <div>
                <p className="text-sm font-medium">Total CSRs</p>
                <p className="text-2xl font-bold">{stats.totalCSRs}</p>
              </div>
            </div>
          </div>

          {/* Active CSRs Card */}
          <div className="rounded-lg shadow-md bg-secondary/30 p-6 border-primary transition-all duration-200 ease-out hover:scale-[1.05] hover:shadow-2xl hover:border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary/10 mr-4">
                <FaUsers className="text-green-500 text-2xl" />
              </div>
              <div>
                <p className="text-sm font-medium">Active CSRs</p>
                <p className="text-2xl font-bold">{stats.activeCSRs}</p>
              </div>
            </div>
          </div>

          {/* Total Co-workers Card */}
          <div className="rounded-lg shadow-md bg-secondary/30 p-6 border-primary transition-all duration-200 ease-out hover:scale-[1.05] hover:shadow-2xl hover:border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary/10 mr-4">
                <FaUserFriends className="text-blue-500 text-2xl" />
              </div>
              <div>
                <p className="text-sm font-medium">Total Co-workers</p>
                <p className="text-2xl font-bold">{stats.totalCoWorkers}</p>
              </div>
            </div>
          </div>

          {/* Total Students Card */}
          <div className="rounded-lg shadow-md bg-secondary/30 p-6 border-primary transition-all duration-200 ease-out hover:scale-[1.05] hover:shadow-2xl hover:border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary/10 mr-4">
                <FaUserGraduate className="text-purple-500 text-2xl" />
              </div>
              <div>
                <p className="text-sm font-medium">Total Students</p>
                <p className="text-2xl font-bold">{stats.totalStudents}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* System Overview Section */}
      <div className="mt-8 rounded-lg shadow-md p-6 border">
        <h2 className="text-xl font-semibold mb-4">System Overview</h2>
        <p>
          Welcome to the AKTI Portal admin dashboard. Here you can monitor key metrics and manage your system.
          Use the navigation menu to access different administrative functions.
        </p>
      </div>
    </div>
  );
}
