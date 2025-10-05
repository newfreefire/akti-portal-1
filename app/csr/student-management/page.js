'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUserGraduate, FaEdit, FaTrash, FaSpinner, FaSearch, FaPlus } from 'react-icons/fa';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm();

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/students');
      const data = await response.json();
      
      if (data.success) {
        setStudents(data.students || []);
      } else {
        console.error('Failed to fetch students:', data.message);
        toast.error('Failed to load students');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Error loading students');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const url = editingStudent ? `/api/students/${editingStudent._id}` : '/api/students';
      const method = editingStudent ? 'PUT' : 'POST';
      
      console.log('Submitting data:', data);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      console.log('API response:', result);
      
      if (result.success) {
        toast.success(editingStudent ? 'Student updated successfully' : 'Student added successfully');
        fetchStudents();
        reset();
        setEditingStudent(null);
        setShowForm(false);
      } else {
        toast.error(result.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving student:', error);
      toast.error('Failed to save student');
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setShowForm(true);
    
    // Set form values
    setValue('name', student.name);
    setValue('guardianName', student.guardianName);
    setValue('email', student.email);
    setValue('phone', student.phone);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/students/${id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Student deleted successfully');
        fetchStudents();
      } else {
        toast.error(result.message || 'Failed to delete student');
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error('Error deleting student');
    } finally {
      setShowDeleteConfirm(null);
    }
  };

  const handleCancel = () => {
    setEditingStudent(null);
    setShowForm(false);
    reset();
  };

  // Filter students based on search term
  const filteredStudents = students.filter(student => 
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.guardianName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.phone?.includes(searchTerm)
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-4 md:mb-0">Student Management</h1>
        
        <div className="flex flex-col md:flex-row w-full md:w-auto gap-4">
          {/* Search Bar */}
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search students..."
              className="pl-10 pr-4 py-2 w-full border border-gray-600 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Add Student Button */}
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-200"
          >
            {showForm ? 'Cancel' : <>
              <FaPlus size={14} />
              <span>Add Student</span>
            </>}
          </button>
        </div>
      </div>
      
      {/* Student Form */}
      {showForm && (
        <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-white">
            {editingStudent ? 'Update Student' : 'Add New Student'}
          </h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Student Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Student Name</label>
              <input
                type="text"
                className={`w-full p-2 border rounded-md bg-gray-700 text-white ${errors.name ? 'border-red-500' : 'border-gray-600'}`}
                placeholder="Enter student name"
                {...register('name', { required: 'Student name is required' })}
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
            </div>
            
            {/* Guardian Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Guardian Name</label>
              <input
                type="text"
                className={`w-full p-2 border rounded-md bg-gray-700 text-white ${errors.guardianName ? 'border-red-500' : 'border-gray-600'}`}
                placeholder="Enter guardian name"
                {...register('guardianName', { required: 'Guardian name is required' })}
              />
              {errors.guardianName && <p className="mt-1 text-sm text-red-500">{errors.guardianName.message}</p>}
            </div>
            
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input
                type="email"
                className={`w-full p-2 border rounded-md bg-gray-700 text-white ${errors.email ? 'border-red-500' : 'border-gray-600'}`}
                placeholder="Enter email address"
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
            
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
              <input
                type="text"
                className={`w-full p-2 border rounded-md bg-gray-700 text-white ${errors.phone ? 'border-red-500' : 'border-gray-600'}`}
                placeholder="Enter phone number"
                {...register('phone', { 
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[0-9]{11}$/,
                    message: 'Phone number must be 11 digits'
                  }
                })}
              />
              {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
            </div>
            
            <div className="md:col-span-2 flex justify-end gap-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 transition duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
              >
                {editingStudent ? 'Update Student' : 'Add Student'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Students List */}
      <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-white">Students</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <FaSpinner className="animate-spin text-blue-500 text-3xl" />
          </div>
        ) : filteredStudents.length === 0 ? (
          <p className="text-gray-400 italic text-center py-8">
            {searchTerm ? 'No students match your search.' : 'No students found. Add your first student!'}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <div key={student._id} className="bg-gray-800 border border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-blue-100 mr-3">
                        <FaUserGraduate className="text-blue-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">{student.name}</h3>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(student)}
                        className="p-1.5 text-gray-500 hover:text-blue-500 transition-colors duration-200"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => setShowDeleteConfirm(student._id)}
                        className="p-1.5 text-gray-500 hover:text-red-500 transition-colors duration-200"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-gray-300">
                      <span className="font-medium">Guardian:</span> {student.guardianName}
                    </p>
                    <p className="text-sm text-gray-300">
                      <span className="font-medium">Email:</span> {student.email}
                    </p>
                    <p className="text-sm text-gray-300">
                      <span className="font-medium">Phone:</span> {student.phone}
                    </p>
                  </div>
                  
                  {/* Delete Confirmation */}
                  {showDeleteConfirm === student._id && (
                    <div className="mt-4 p-3 bg-red-900 border border-red-800 rounded-md">
                      <p className="text-sm text-red-300 mb-2">Are you sure you want to delete this student?</p>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setShowDeleteConfirm(null)}
                          className="px-3 py-1 text-xs text-gray-300 bg-gray-700 border border-gray-600 rounded hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDelete(student._id)}
                          className="px-3 py-1 text-xs text-white bg-red-600 rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentManagement
