'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUserPlus, FaTrash, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

const CoWorking = () => {
  const [coWorkers, setCoWorkers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Fetch co-workers from API
  const fetchCoWorkers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/co-workers');
      const data = await response.json();
      
      if (data.success) {
        setCoWorkers(data.coWorkers);
      } else {
        toast.error(data.message || 'Failed to fetch co-workers');
      }
    } catch (error) {
      console.error('Error fetching co-workers:', error);
      toast.error('An error occurred while fetching co-workers');
    } finally {
      setLoading(false);
    }
  };
  
  // Load co-workers on component mount
  useEffect(() => {
    fetchCoWorkers();
  }, []);
  
  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm();
  
  const onSubmit = async (data) => {
    try {
      if (editingId !== null) {
        // Update existing co-worker
        const response = await fetch(`/api/co-workers/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        
        const result = await response.json();
        
        if (result.success) {
          toast.success('Co-worker updated successfully!');
          setEditingId(null);
          fetchCoWorkers(); // Refresh the co-workers list
        } else {
          toast.error(result.message || 'Failed to update co-worker');
        }
      } else {
        // Add new co-worker
        const response = await fetch('/api/co-workers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        
        const result = await response.json();
        
        if (result.success) {
          toast.success('Co-worker added successfully!');
          fetchCoWorkers(); // Refresh the co-workers list
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
        } else {
          toast.error(result.message || 'Failed to add co-worker');
        }
      }
      
      reset();
    } catch (error) {
      console.error('Error saving co-worker:', error);
      toast.error('An error occurred while saving the co-worker');
    }
  };
  
  const handleEdit = (worker) => {
    setEditingId(worker._id);
    // Set form values
    setValue('fullName', worker.fullName);
    setValue('cnic', worker.cnic);
    setValue('reference', worker.reference || '');
    setValue('purpose', worker.purpose || '');
  };
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  
  const handleDelete = (id) => {
    // Handle MongoDB ObjectId for deletion
    setDeleteId(id);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = async () => {
    try {
      setDeleting(true);
      
      const response = await fetch(`/api/co-workers/${deleteId}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Co-worker deleted successfully');
        fetchCoWorkers(); // Refresh the co-workers list
      } else {
        toast.error(result.message || 'Failed to delete co-worker');
      }
    } catch (error) {
      console.error('Error deleting co-worker:', error);
      toast.error('An error occurred while deleting the co-worker');
    } finally {
      setShowDeleteModal(false);
      setDeleting(false);
      setDeleteId(null);
    }
  };
  
  const handleCancel = () => {
    setEditingId(null);
    reset();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Co-Working Management
      </h1>
      
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-100 dark:bg-green-900 border-l-4 border-green-500 text-green-700 dark:text-green-200 p-4 mb-6 rounded shadow-md">
          <p className="font-medium">Success! Co-worker information has been saved.</p>
        </div>
      )}
      
      {/* Form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
          {editingId !== null ? 'Update Co-worker' : 'Add New Co-worker'}
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
              <input
                {...register('fullName', { required: 'Full name is required' })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter full name"
              />
              {errors.fullName && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.fullName.message}</p>}
            </div>
            
            {/* CNIC */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CNIC *</label>
              <input
                {...register('cnic', { 
                  required: 'CNIC is required',
                  pattern: {
                    value: /^\d{5}-\d{7}-\d{1}$/,
                    message: 'CNIC format should be: 12345-1234567-1'
                  }
                })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="12345-1234567-1"
              />
              {errors.cnic && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.cnic.message}</p>}
            </div>
            
            {/* Reference (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reference (Optional)</label>
              <input
                {...register('reference')}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter reference"
              />
            </div>
            
            {/* Purpose (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Purpose (Optional)</label>
              <input
                {...register('purpose')}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter purpose"
              />
            </div>
          </div>
          
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
            >
              {editingId !== null ? (
                <>
                  <FaSave className="mr-2" /> Update Co-worker
                </>
              ) : (
                <>
                  <FaUserPlus className="mr-2" /> Add Co-worker
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => reset()}
              className="px-6 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Reset Form
            </button>
            
            {editingId !== null && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200 rounded-md hover:bg-red-200 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center"
              >
                <FaTimes className="mr-2" /> Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>
      
      {/* Co-workers List */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Co-workers List</h2>
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
          </div>
        ) : coWorkers.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 italic">No co-workers added yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coWorkers.map(worker => (
              <div key={worker._id} className="border dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow dark:bg-gray-700">
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">{worker.fullName}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">CNIC: {worker.cnic}</p>
                {worker.reference && <p className="text-gray-600 dark:text-gray-300">Reference: {worker.reference}</p>}
                {worker.purpose && <p className="text-gray-600 dark:text-gray-300">Purpose: {worker.purpose}</p>}
                
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => handleEdit(worker)}
                    className="p-2 bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-200 rounded hover:bg-blue-200 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(worker._id)}
                    className="p-2 bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200 rounded hover:bg-red-200 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Confirm Delete</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Are you sure you want to delete this co-worker? This action cannot be undone.</p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white dark:bg-red-700 dark:text-white rounded hover:bg-red-700 dark:hover:bg-red-800"
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoWorking;
