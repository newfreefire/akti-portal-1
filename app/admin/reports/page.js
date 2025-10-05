'use client';

import React, { useState, useEffect } from 'react';
import { FaChartBar, FaUserTie, FaUserFriends, FaUserGraduate, FaSpinner, FaCalendarAlt } from 'react-icons/fa';

const AdminReports = () => {
  const [stats, setStats] = useState({
    totalCSRs: 0,
    activeCSRs: 0,
    totalCoWorkers: 0,
    totalStudents: 0,
    monthlyCounts: {
      students: [],
      coWorkers: [],
      csrs: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('monthly');

  useEffect(() => {
    fetchReportData();
  }, [timeframe]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      // Fetch CSRs
      const csrResponse = await fetch('/api/csr');
      const csrData = await csrResponse.json();
      
      // Fetch Co-workers
      const coWorkersResponse = await fetch('/api/co-workers');
      const coWorkersData = await coWorkersResponse.json();
      
      // Simulate monthly data (in a real app, this would come from the API)
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const studentMonthlyData = months.map(() => Math.floor(Math.random() * 20));
      const coWorkerMonthlyData = months.map(() => Math.floor(Math.random() * 10));
      const csrMonthlyData = months.map(() => Math.floor(Math.random() * 5));
      
      // Update stats
      setStats({
        totalCSRs: csrData.csrs?.length || 0,
        activeCSRs: csrData.csrs?.filter(csr => csr.isActive)?.length || 0,
        totalCoWorkers: coWorkersData.coWorkers?.length || 0,
        totalStudents: 0, // Placeholder for when student API is implemented
        monthlyCounts: {
          students: studentMonthlyData,
          coWorkers: coWorkerMonthlyData,
          csrs: csrMonthlyData,
          labels: months
        }
      });
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Simple bar chart component
  const BarChart = ({ data, labels, title, color }) => (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2 text-gray-700">{title}</h3>
      <div className="flex items-end h-40 gap-1">
        {data.map((value, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div 
              className={`w-full bg-${color}-500 rounded-t`} 
              style={{ height: `${(value / Math.max(...data)) * 100}%` }}
            ></div>
            <span className="text-xs mt-1 text-gray-600">{labels[index]}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // Stat card component
  const StatCard = ({ title, value, icon, color }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-${color}-500`}>
      <div className="flex items-center">
        <div className={`p-3 rounded-full bg-${color}-100 mr-4`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">System Reports</h1>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setTimeframe('monthly')} 
            className={`px-4 py-2 rounded-md ${timeframe === 'monthly' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Monthly
          </button>
          <button 
            onClick={() => setTimeframe('quarterly')} 
            className={`px-4 py-2 rounded-md ${timeframe === 'quarterly' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Quarterly
          </button>
          <button 
            onClick={() => setTimeframe('yearly')} 
            className={`px-4 py-2 rounded-md ${timeframe === 'yearly' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Yearly
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-blue-500 text-3xl" />
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              title="Total CSRs" 
              value={stats.totalCSRs} 
              icon={<FaUserTie className="text-blue-500 text-2xl" />} 
              color="blue" 
            />
            
            <StatCard 
              title="Active CSRs" 
              value={stats.activeCSRs} 
              icon={<FaUserTie className="text-green-500 text-2xl" />} 
              color="green" 
            />
            
            <StatCard 
              title="Total Co-workers" 
              value={stats.totalCoWorkers} 
              icon={<FaUserFriends className="text-purple-500 text-2xl" />} 
              color="purple" 
            />
            
            <StatCard 
              title="Total Students" 
              value={stats.totalStudents} 
              icon={<FaUserGraduate className="text-yellow-500 text-2xl" />} 
              color="yellow" 
            />
          </div>
          
          {/* Charts */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center mb-4">
              <FaChartBar className="text-blue-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-700">Growth Trends</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <BarChart 
                data={stats.monthlyCounts.students} 
                labels={stats.monthlyCounts.labels} 
                title="Student Growth" 
                color="yellow" 
              />
              
              <BarChart 
                data={stats.monthlyCounts.coWorkers} 
                labels={stats.monthlyCounts.labels} 
                title="Co-worker Growth" 
                color="purple" 
              />
              
              <BarChart 
                data={stats.monthlyCounts.csrs} 
                labels={stats.monthlyCounts.labels} 
                title="CSR Growth" 
                color="blue" 
              />
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <FaCalendarAlt className="text-blue-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-700">Recent Activity</h2>
            </div>
            
            <div className="border-l-2 border-gray-200 pl-4 ml-2 space-y-6">
              <div className="relative">
                <div className="absolute -left-6 mt-1 w-4 h-4 rounded-full bg-blue-500"></div>
                <div>
                  <p className="text-sm text-gray-500">Today</p>
                  <p className="font-medium">3 new students registered</p>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute -left-6 mt-1 w-4 h-4 rounded-full bg-green-500"></div>
                <div>
                  <p className="text-sm text-gray-500">Yesterday</p>
                  <p className="font-medium">New co-worker added</p>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute -left-6 mt-1 w-4 h-4 rounded-full bg-purple-500"></div>
                <div>
                  <p className="text-sm text-gray-500">3 days ago</p>
                  <p className="font-medium">CSR account activated</p>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute -left-6 mt-1 w-4 h-4 rounded-full bg-yellow-500"></div>
                <div>
                  <p className="text-sm text-gray-500">Last week</p>
                  <p className="font-medium">New course added</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminReports
