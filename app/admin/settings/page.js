'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaCog, FaBell, FaLock, FaDatabase, FaEnvelope, FaCheck } from 'react-icons/fa';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = (data) => {
    console.log('Settings saved:', data);
    toast.success('Settings saved successfully');
    // In a real application, you would send this data to an API endpoint
  };

  const tabs = [
    { id: 'general', label: 'General', icon: <FaCog /> },
    { id: 'notifications', label: 'Notifications', icon: <FaBell /> },
    { id: 'security', label: 'Security', icon: <FaLock /> },
    { id: 'database', label: 'Database', icon: <FaDatabase /> },
    { id: 'email', label: 'Email', icon: <FaEnvelope /> },
  ];

  return (
    <div className="py-6 max-w-[100vw] mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />      
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
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Portal Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="AKTI Portal"
                    {...register('portalName', { required: 'Portal name is required' })}
                  />
                  {errors.portalName && <p className="mt-1 text-sm text-red-500">{errors.portalName.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
                  <input
                    type="email"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="admin@example.com"
                    {...register('adminEmail', { 
                      required: 'Admin email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                  />
                  {errors.adminEmail && <p className="mt-1 text-sm text-red-500">{errors.adminEmail.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    {...register('timezone', { required: 'Timezone is required' })}
                  >
                    <option value="">Select timezone</option>
                    <option value="UTC+0">UTC+0 (London)</option>
                    <option value="UTC+5">UTC+5 (Pakistan)</option>
                    <option value="UTC-5">UTC-5 (New York)</option>
                    <option value="UTC-8">UTC-8 (Los Angeles)</option>
                  </select>
                  {errors.timezone && <p className="mt-1 text-sm text-red-500">{errors.timezone.message}</p>}
                </div>
              </div>
            )}
            
            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
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
                    id="systemUpdates"
                    className="h-4 w-4 text-blue-600 rounded"
                    {...register('systemUpdates')}
                  />
                  <label htmlFor="systemUpdates" className="ml-2 block text-sm text-gray-700">
                    System update notifications
                  </label>
                </div>
              </div>
            )}
            
            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password Expiry (days)</label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="90"
                    {...register('passwordExpiry', { 
                      required: 'Password expiry is required',
                      min: {
                        value: 30,
                        message: 'Minimum 30 days'
                      },
                      max: {
                        value: 365,
                        message: 'Maximum 365 days'
                      }
                    })}
                  />
                  {errors.passwordExpiry && <p className="mt-1 text-sm text-red-500">{errors.passwordExpiry.message}</p>}
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="twoFactorAuth"
                    className="h-4 w-4 text-blue-600 rounded"
                    {...register('twoFactorAuth')}
                  />
                  <label htmlFor="twoFactorAuth" className="ml-2 block text-sm text-gray-700">
                    Enable two-factor authentication
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="loginAttempts"
                    className="h-4 w-4 text-blue-600 rounded"
                    {...register('loginAttempts')}
                  />
                  <label htmlFor="loginAttempts" className="ml-2 block text-sm text-gray-700">
                    Limit login attempts
                  </label>
                </div>
              </div>
            )}
            
            {/* Database Settings */}
            {activeTab === 'database' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Backup Frequency</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    {...register('backupFrequency')}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Backup Retention (days)</label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="30"
                    {...register('backupRetention')}
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="autoCleanup"
                    className="h-4 w-4 text-blue-600 rounded"
                    {...register('autoCleanup')}
                  />
                  <label htmlFor="autoCleanup" className="ml-2 block text-sm text-gray-700">
                    Enable automatic cleanup of old records
                  </label>
                </div>
              </div>
            )}
            
            {/* Email Settings */}
            {activeTab === 'email' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Server</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="smtp.example.com"
                    {...register('smtpServer')}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Port</label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="587"
                    {...register('smtpPort')}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Username</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="username"
                    {...register('smtpUsername')}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Password</label>
                  <input
                    type="password"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="••••••••"
                    {...register('smtpPassword')}
                  />
                </div>
              </div>
            )}
            
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
              >
                <FaCheck className="mr-2" />
                Save Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings
