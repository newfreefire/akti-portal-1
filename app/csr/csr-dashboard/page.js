'use client';

import React, { useState, useEffect } from 'react';
import { FaUserFriends, FaSpinner, FaSearch } from 'react-icons/fa';

const CsrDashboard = () => {
  const [coWorkers, setCoWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchCoWorkers = async () => {
      try {
        const response = await fetch('/api/co-workers');
        const data = await response.json();
        
        if (data.success) {
          setCoWorkers(data.coWorkers);
        } else {
          console.error('Failed to fetch co-workers:', data.message);
        }
      } catch (error) {
        console.error('Error fetching co-workers:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCoWorkers();
  }, []);
  
  // Filter co-workers based on search term
  const filteredCoWorkers = coWorkers.filter(worker => 
    worker.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (worker.purpose && worker.purpose.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (worker.reference && worker.reference.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">CSR Dashboard</h1>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search co-workers..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Stats Card */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 mb-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 mr-4">
            <FaUserFriends className="text-blue-500 text-2xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Co-workers</p>
            <p className="text-2xl font-bold text-gray-800">{coWorkers.length}</p>
          </div>
        </div>
      </div>
      
      {/* Co-workers List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Co-workers Details</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <FaSpinner className="animate-spin text-blue-500 text-3xl" />
          </div>
        ) : filteredCoWorkers.length === 0 ? (
          <p className="text-gray-500 italic text-center py-8">
            {searchTerm ? 'No co-workers match your search.' : 'No co-workers found.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CNIC</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Added On</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCoWorkers.map((worker) => (
                  <tr key={worker._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{worker.fullName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{worker.cnic}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{worker.reference || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{worker.purpose || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(worker.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CsrDashboard
