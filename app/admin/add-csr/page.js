'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUserPlus, FaTrash, FaEdit, FaSave, FaTimes, FaSpinner } from 'react-icons/fa';

const AddCSR = () => {
  const [csrs, setCsrs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingCsrs, setFetchingCsrs] = useState(true);
  
  const { register, handleSubmit, reset, formState: { errors }, setValue, watch, getValues } = useForm({
    defaultValues: {
      fullName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      isActive: true,
      isLeadRole: false
    }
  });
  
  const password = watch('password');
  
  // Fetch all CSRs on component mount
  useEffect(() => {
    fetchCSRs();
  }, []);
  
  const fetchCSRs = async () => {
    try {
      setFetchingCsrs(true);
      const response = await fetch('/api/csr');
      const data = await response.json();
      
      if (data.success) {
        setCsrs(data.csrs);
      } else {
        toast.error(data.message || 'Failed to fetch CSRs');
      }
    } catch (error) {
      console.error('Error fetching CSRs:', error);
      toast.error('Failed to fetch CSRs. Please try again.');
    } finally {
      setFetchingCsrs(false);
    }
  };
  
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      // Validate passwords match
      if (data.password !== data.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...csrData } = data;
      
      if (editingId) {
        // Update existing CSR
        const response = await fetch(`/api/csr/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(csrData),
        });
        
        const result = await response.json();
        
        if (result.success) {
          toast.success('CSR updated successfully!');
          setEditingId(null);
          fetchCSRs(); // Refresh the list
          reset(); // Reset form
        } else {
          toast.error(result.message || 'Failed to update CSR');
        }
      } else {
        // Create new CSR
        const response = await fetch('/api/csr', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(csrData),
        });
        
        const result = await response.json();
        
        if (result.success) {
          toast.success('CSR created successfully!');
          fetchCSRs(); // Refresh the list
          reset(); // Reset form
        } else {
          toast.error(result.message || 'Failed to create CSR');
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleEdit = (csr) => {
    setEditingId(csr._id);
    // Set form values
    setValue('fullName', csr.fullName);
    setValue('username', csr.username);
    setValue('email', csr.email);
    setValue('password', ''); // Clear password fields for security
    setValue('confirmPassword', '');
    setValue('isActive', csr.isActive);
    setValue('isLeadRole', csr.isLeadRole);
  };
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  
  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = async () => {
    try {
      setDeleting(true);
      const response = await fetch(`/api/csr/${deleteId}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('CSR deleted successfully!');
        fetchCSRs(); // Refresh the list
        setShowDeleteModal(false);
      } else {
        toast.error(result.message || 'Failed to delete CSR');
      }
    } catch (error) {
      console.error('Error deleting CSR:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setDeleting(false);
    }
  };
  
  const handleCancel = () => {
    setEditingId(null);
    reset();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-white">Confirm Delete</h3>
            <p className="text-gray-300 mb-6">Are you sure you want to delete this CSR? This action cannot be undone.</p>
            
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-70"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 flex items-center disabled:opacity-70"
              >
                {deleting ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <h1 className="text-2xl font-bold mb-6 text-white">
        CSR Management
      </h1>
      
      {/* CSR Form */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-8 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-white">
          {editingId ? 'Update CSR' : 'Add New CSR'}
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Full Name *</label>
              <input
                {...register('fullName', { required: 'Full name is required' })}
                className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter full name"
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
            </div>
            
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Username *</label>
              <input
                {...register('username', { required: 'Username is required' })}
                className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter username"
              />
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
            </div>
            
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email *</label>
              <input
                type="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            
            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                {editingId ? 'Password (leave blank to keep current)' : 'Password *'}
              </label>
              <input
                type="password"
                {...register('password', { 
                  required: editingId ? false : 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>
            
            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                {editingId ? 'Confirm Password (leave blank to keep current)' : 'Confirm Password *'}
              </label>
              <input
                type="password"
                {...register('confirmPassword', { 
                  required: editingId ? false : 'Please confirm password',
                  validate: value => 
                    !value && !getValues('password') ? true : 
                    value === getValues('password') || 'Passwords do not match'
                })}
                className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm password"
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>
            
            {/* Checkboxes */}
            <div className="md:col-span-2 flex flex-col sm:flex-row gap-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('isActive')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                />
                <span className="text-gray-300">Active</span>
              </label>
              
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('isLeadRole')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                />
                <span className="text-gray-300">Lead Role</span>
              </label>
            </div>
          </div>
          
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 flex items-center disabled:opacity-70"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" /> Processing...
                </>
              ) : editingId ? (
                <>
                  <FaSave className="mr-2" /> Update CSR
                </>
              ) : (
                <>
                  <FaUserPlus className="mr-2" /> Add CSR
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => reset()}
              disabled={loading}
              className="px-6 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-70"
            >
              Reset Form
            </button>
            
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="px-6 py-2 bg-red-900 text-red-200 rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 flex items-center disabled:opacity-70"
              >
                <FaTimes className="mr-2" /> Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      
      {/* CSRs List */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-white">CSR List</h2>
        
        {fetchingCsrs ? (
          <div className="flex justify-center items-center py-8">
            <FaSpinner className="animate-spin text-blue-400 text-2xl" />
            <span className="ml-2 text-gray-300">Loading CSRs...</span>
          </div>
        ) : csrs.length === 0 ? (
          <p className="text-gray-400 italic">No CSRs added yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {csrs.map(csr => (
              <div key={csr._id} className="border border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-gray-900">
                <div className="bg-gray-800 p-4 border-b border-gray-700">
                  <h3 className="font-semibold text-lg text-white">{csr.fullName}</h3>
                </div>
                
                <div className="p-4 space-y-2">
                  <p className="text-gray-300"><span className="font-medium text-gray-200">Username:</span> {csr.username}</p>
                  <p className="text-gray-300"><span className="font-medium text-gray-200">Email:</span> {csr.email}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {csr.isActive && (
                      <span className="bg-green-900 text-green-100 text-xs px-2 py-1 rounded">
                        Active
                      </span>
                    )}
                    {!csr.isActive && (
                      <span className="bg-red-900 text-red-100 text-xs px-2 py-1 rounded">
                        Inactive
                      </span>
                    )}
                    {csr.isLeadRole && (
                      <span className="bg-purple-900 text-purple-100 text-xs px-2 py-1 rounded">
                        Lead Role
                      </span>
                    )}
                  </div>
                  
                  <div className="flex space-x-2 mt-4 pt-2 border-t border-gray-700">
                    <button
                      onClick={() => handleEdit(csr)}
                      disabled={loading}
                      className="flex-1 py-2 bg-blue-900 text-blue-100 rounded hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center justify-center disabled:opacity-70"
                    >
                      <FaEdit className="mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(csr._id)}
                      disabled={loading}
                      className="flex-1 py-2 bg-red-900 text-red-100 rounded hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center justify-center disabled:opacity-70"
                    >
                      <FaTrash className="mr-1" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddCSR;
