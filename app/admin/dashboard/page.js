'use client';

import React, { useState, useEffect } from 'react';
import { FaUsers, FaUserTie, FaUserFriends, FaUserGraduate, FaSpinner } from 'react-icons/fa';

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
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-white">Admin Dashboard</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-blue-400 text-4xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total CSRs Card */}
          <div className="bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-900 mr-4">
                <FaUserTie className="text-blue-300 text-2xl" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium">Total CSRs</p>
                <p className="text-2xl font-bold text-white">{stats.totalCSRs}</p>
              </div>
            </div>
          </div>
          
          {/* Active CSRs Card */}
          <div className="bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-900 mr-4">
                <FaUsers className="text-green-300 text-2xl" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium">Active CSRs</p>
                <p className="text-2xl font-bold text-white">{stats.activeCSRs}</p>
              </div>
            </div>
          </div>
          
          {/* Total Co-workers Card */}
          <div className="bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-900 mr-4">
                <FaUserFriends className="text-purple-300 text-2xl" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium">Total Co-workers</p>
                <p className="text-2xl font-bold text-white">{stats.totalCoWorkers}</p>
              </div>
            </div>
          </div>
          
          {/* Total Students Card */}
          <div className="bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-900 mr-4">
                <FaUserGraduate className="text-yellow-300 text-2xl" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium">Total Students</p>
                <p className="text-2xl font-bold text-white">{stats.totalStudents}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* System Overview Section */}
      <div className="mt-8 bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-white">System Overview</h2>
        <p className="text-gray-300">
          Welcome to the AKTI Portal admin dashboard. Here you can monitor key metrics and manage your system.
          Use the navigation menu to access different administrative functions.
        </p>
      </div>
    </div>
  );
}
