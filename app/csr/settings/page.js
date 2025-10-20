'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUser, FaLock, FaBell, FaCheck } from 'react-icons/fa';

const CsrSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [csrData, setCsrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  
  useEffect(() => {
    // In a real application, you would fetch the CSR data from an API
    // For now, we'll simulate it with localStorage data
    const fetchCsrData = async () => {
      try {
        // Get the CSR ID from localStorage
        const csrId = localStorage.getItem('userId');
        
        if (!csrId) {
          toast.error('User information not found');
          return;
        }
        
        // In a real app, you would fetch from API
        // const response = await fetch(`/api/csr/${csrId}`);
        // const data = await response.json();
        
        // For now, we'll use mock data
        const mockData = {
          _id: csrId,
          fullName: 'John Doe',
          username: 'johndoe',
          email: 'john.doe@example.com',
          isActive: true,
          isLeadRole: false,
          isCSR: true,
          isAdmin: false
        };
        
        setCsrData(mockData);
        
        // Set form values
        setValue('fullName', mockData.fullName);
        setValue('email', mockData.email);
        setValue('username', mockData.username);
      } catch (error) {
        console.error('Error fetching CSR data:', error);
        toast.error('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCsrData();
  }, [setValue]);

  const onProfileSubmit = (data) => {
    console.log('Profile updated:', data);
    toast.success('Profile updated successfully');
    // In a real application, you would send this data to an API endpoint
  };

  const onPasswordSubmit = (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    console.log('Password updated');
    toast.success('Password updated successfully');
    // In a real application, you would send this data to an API endpoint
  };

  const onNotificationSubmit = (data) => {
    console.log('Notification settings updated:', data);
    toast.success('Notification settings updated successfully');
    // In a real application, you would send this data to an API endpoint
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <FaUser /> },
    { id: 'password', label: 'Password', icon: <FaLock /> },
    { id: 'notifications', label: 'Notifications', icon: <FaBell /> },
  ];

  return (
    <div className="py-6 max-w-[100vw] mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Account Settings</h1>
      
      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-6 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-4 text-sm font-medium ${activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
          
          {/* Content */}
          <div className="p-6">
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    className={`w-full p-2 border rounded-md ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter your full name"
                    {...register('fullName', { required: 'Full name is required' })}
                  />
                  {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                    disabled
                    {...register('username')}
                  />
                  <p className="mt-1 text-xs text-gray-500">Username cannot be changed</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    className={`w-full p-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter your email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                  >
                    <FaCheck className="mr-2" />
                    Update Profile
                  </button>
                </div>
              </form>
            )}
            
            {/* Password Settings */}
            {activeTab === 'password' && (
              <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    className={`w-full p-2 border rounded-md ${errors.currentPassword ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter your current password"
                    {...register('currentPassword', { required: 'Current password is required' })}
                  />
                  {errors.currentPassword && <p className="mt-1 text-sm text-red-500">{errors.currentPassword.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    className={`w-full p-2 border rounded-md ${errors.newPassword ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter new password"
                    {...register('newPassword', { 
                      required: 'New password is required',
                      minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters'
                      }
                    })}
                  />
                  {errors.newPassword && <p className="mt-1 text-sm text-red-500">{errors.newPassword.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    className={`w-full p-2 border rounded-md ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Confirm new password"
                    {...register('confirmPassword', { 
                      required: 'Please confirm your password',
                      validate: (value, formValues) => value === formValues.newPassword || 'Passwords do not match'
                    })}
                  />
                  {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>}
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                  >
                    <FaCheck className="mr-2" />
                    Update Password
                  </button>
                </div>
              </form>
            )}
            
            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <form onSubmit={handleSubmit(onNotificationSubmit)} className="space-y-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    className="h-4 w-4 text-blue-600 rounded"
                    {...register('emailNotifications')}
                  />
                  <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700">
                    Email notifications
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="newStudentAlert"
                    className="h-4 w-4 text-blue-600 rounded"
                    {...register('newStudentAlert')}
                  />
                  <label htmlFor="newStudentAlert" className="ml-2 block text-sm text-gray-700">
                    New student alerts
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="coWorkerUpdates"
                    className="h-4 w-4 text-blue-600 rounded"
                    {...register('coWorkerUpdates')}
                  />
                  <label htmlFor="coWorkerUpdates" className="ml-2 block text-sm text-gray-700">
                    Co-worker updates
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="systemUpdates"
                    className="h-4 w-4 text-blue-600 rounded"
                    {...register('systemUpdates')}
                  />
                  <label htmlFor="systemUpdates" className="ml-2 block text-sm text-gray-700">
                    System update notifications
                  </label>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                  >
                    <FaCheck className="mr-2" />
                    Save Preferences
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CsrSettings
