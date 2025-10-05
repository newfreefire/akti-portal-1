'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

const CourseManagement = () => {
  // Sample trainers data
  const trainers = [
    { id: 1, name: 'John Smith' },
    { id: 2, name: 'Sarah Johnson' },
    { id: 3, name: 'Michael Brown' },
    { id: 4, name: 'Emily Davis' },
    { id: 5, name: 'Robert Wilson' },
  ];

  const [courses, setCourses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);
  
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/courses');
      const data = await response.json();
      
      if (data.success) {
        // Process courses to add durationLabels and ensure id property exists
        const processedCourses = (data.courses || []).map(course => {
          // Create durationLabels array
          const durationLabels = [];
          if (course.duration?.weekend3Months) durationLabels.push('Weekend/3 Months');
          if (course.duration?.weekdays2Months) durationLabels.push('Weekdays/2 Months');
          if (course.duration?.oneMonth) durationLabels.push('1 Month');
          if (course.duration?.levelwise) durationLabels.push('Levelwise');
          
          // Return processed course with id and durationLabels
          return {
            ...course,
            id: course._id, // Ensure id exists for frontend operations
            durationLabels
          };
        });
        
        setCourses(processedCourses);
      } else {
        console.error('Failed to fetch courses:', data.message);
        toast.error('Failed to load courses');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Error loading courses');
    } finally {
      setLoading(false);
    }
  };
  
  const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm({
    defaultValues: {
      courseName: '',
      trainerId: '',
      price: '',
      duration: {
        weekend: false,
        weekdays: false,
        oneMonth: false,
        levelwise: false
      }
    }
  });
  
  const watchDuration = watch('duration');
  
  const onSubmit = async (data) => {
    try {
      // Validate at least one duration option is selected
      if (!data.duration.weekend && !data.duration.weekdays && !data.duration.oneMonth && !data.duration.levelwise) {
        toast.error('Please select at least one duration option');
        return;
      }

      // Get trainer name from id
      const selectedTrainer = trainers.find(trainer => trainer.id === parseInt(data.trainerId));
      
      if (!selectedTrainer) {
        toast.error('Invalid trainer selected');
        return;
      }
      
      // Prepare data for API
      const courseData = {
        courseName: data.courseName,
        trainerName: selectedTrainer.name,
        price: parseFloat(data.price),
        duration: {
          weekend3Months: data.duration.weekend,
          weekdays2Months: data.duration.weekdays,
          oneMonth: data.duration.oneMonth,
          levelwise: data.duration.levelwise
        }
      };
      
      if (editingId !== null) {
        // Update existing course
        const response = await fetch(`/api/courses/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(courseData),
        });
        
        const result = await response.json();
        
        if (result.success) {
          toast.success('Course updated successfully!');
          setEditingId(null);
          fetchCourses(); // Refresh the courses list
        } else {
          toast.error(result.message || 'Failed to update course');
        }
      } else {
        // Add new course
        const response = await fetch('/api/courses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(courseData),
        });
        
        const result = await response.json();
        
        if (result.success) {
          toast.success('Course added successfully!');
          fetchCourses(); // Refresh the courses list
        } else {
          toast.error(result.message || 'Failed to add course');
        }
      }
      
      reset();
    } catch (error) {
      console.error('Error saving course:', error);
      toast.error('An error occurred while saving the course');
    }
  };
  
  const handleEdit = (course) => {
    // Use the MongoDB _id for editing
    setEditingId(course._id);
    // Set form values
    setValue('courseName', course.courseName);
    
    // Find trainer by name and set the ID
    const trainer = trainers.find(t => t.name === course.trainerName);
    if (trainer) {
      setValue('trainerId', trainer.id.toString());
    }
    
    setValue('price', course.price.toString());
    
    // Map the database duration structure to the form structure
    setValue('duration.weekend', course.duration?.weekend3Months || false);
    setValue('duration.weekdays', course.duration?.weekdays2Months || false);
    setValue('duration.oneMonth', course.duration?.oneMonth || false);
    setValue('duration.levelwise', course.duration?.levelwise || false);
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        // Use the MongoDB _id for API operations
        const response = await fetch(`/api/courses/${id}`, {
          method: 'DELETE',
        });
        
        const result = await response.json();
        
        if (result.success) {
          toast.success('Course deleted successfully');
          fetchCourses(); // Refresh the courses list
        } else {
          toast.error(result.message || 'Failed to delete course');
        }
      } catch (error) {
        console.error('Error deleting course:', error);
        toast.error('An error occurred while deleting the course');
      }
    }
  };
  
  const handleCancel = () => {
    setEditingId(null);
    reset();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <h1 className="text-2xl font-bold mb-6 text-white">
        Course Management
      </h1>
      
      {/* Course Form */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-8 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-white">
          {editingId !== null ? 'Update Course' : 'Add New Course'}
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Course Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Course Name *</label>
              <input
                {...register('courseName', { required: 'Course name is required' })}
                className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter course name"
              />
              {errors.courseName && <p className="text-red-500 text-sm mt-1">{errors.courseName.message}</p>}
            </div>
            
            {/* Trainer Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Trainer *</label>
              <select
                {...register('trainerId', { required: 'Trainer selection is required' })}
                className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a trainer</option>
                {trainers.map(trainer => (
                  <option key={trainer.id} value={trainer.id}>{trainer.name}</option>
                ))}
              </select>
              {errors.trainerId && <p className="text-red-500 text-sm mt-1">{errors.trainerId.message}</p>}
            </div>
            
            {/* Course Price */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Price (PKR) *</label>
              <input
                type="number"
                {...register('price', { 
                  required: 'Price is required',
                  min: { value: 0, message: 'Price must be positive' }
                })}
                className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter course price"
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
            </div>
          </div>
          
          {/* Course Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Course Duration *</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="flex items-center space-x-2 p-3 border border-gray-600 rounded-md hover:bg-gray-700 cursor-pointer bg-gray-800">
                <input 
                  type="checkbox" 
                  {...register('duration.weekend')} 
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                />
                <span className="text-gray-300">Weekend/3 Months</span>
              </label>
              
              <label className="flex items-center space-x-2 p-3 border border-gray-600 rounded-md hover:bg-gray-700 cursor-pointer bg-gray-800">
                <input 
                  type="checkbox" 
                  {...register('duration.weekdays')} 
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                />
                <span className="text-gray-300">Weekdays/2 Months</span>
              </label>
              
              <label className="flex items-center space-x-2 p-3 border border-gray-600 rounded-md hover:bg-gray-700 cursor-pointer bg-gray-800">
                <input 
                  type="checkbox" 
                  {...register('duration.oneMonth')} 
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                />
                <span className="text-gray-300">1 Month</span>
              </label>
              
              <label className="flex items-center space-x-2 p-3 border border-gray-600 rounded-md hover:bg-gray-700 cursor-pointer bg-gray-800">
                <input 
                  type="checkbox" 
                  {...register('duration.levelwise')} 
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                />
                <span className="text-gray-300">Levelwise</span>
              </label>
            </div>
            {(!watchDuration.weekend && !watchDuration.weekdays && !watchDuration.oneMonth && !watchDuration.levelwise) && 
              errors.duration && <p className="text-red-500 text-sm mt-1">At least one duration option must be selected</p>}
          </div>
          
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 flex items-center"
            >
              {editingId !== null ? (
                <>
                  <FaSave className="mr-2" /> Update Course
                </>
              ) : (
                <>
                  <FaPlus className="mr-2" /> Add Course
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => reset()}
              className="px-6 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Reset Form
            </button>
            
            {editingId !== null && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 bg-red-900 text-red-200 rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 flex items-center"
              >
                <FaTimes className="mr-2" /> Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      
      {/* Courses List */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-white">Courses</h2>
        
        {courses.length === 0 ? (
          <p className="text-gray-400 italic">No courses added yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <div key={course._id} className="border border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-gray-900">
                <div className="bg-gray-800 p-4 border-b border-gray-700">
                  <h3 className="font-semibold text-lg text-white">{course.courseName}</h3>
                </div>
                
                <div className="p-4 space-y-2">
                  <p className="text-gray-300"><span className="font-medium text-gray-200">Trainer:</span> {course.trainerName}</p>
                  <p className="text-gray-300"><span className="font-medium text-gray-200">Price:</span> PKR {course.price.toLocaleString()}</p>
                  
                  <div>
                    <p className="font-medium text-gray-200 mb-1">Duration:</p>
                    <div className="flex flex-wrap gap-2">
                      {course.durationLabels.map((label, index) => (
                        <span key={index} className="bg-blue-900 text-blue-100 text-xs px-2 py-1 rounded">
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-4 pt-2 border-t border-gray-700">
                    <button
                      onClick={() => handleEdit(course)}
                      className="flex-1 py-2 bg-blue-900 text-blue-100 rounded hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center justify-center"
                    >
                      <FaEdit className="mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="flex-1 py-2 bg-red-900 text-red-100 rounded hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center justify-center"
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

export default CourseManagement;
