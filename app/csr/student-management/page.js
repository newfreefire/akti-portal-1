'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  FaUserGraduate,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaSearch,
  FaPlus,
  FaTimes,
  FaSave,
} from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/students');
      const data = await res.json();
      if (data.success) {
        setStudents(data.students || []);
      } else toast.error(data.message || 'Failed to load students');
    } catch (error) {
      console.error(error);
      toast.error('Error loading students');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      const url = editingStudent ? `/api/students/${editingStudent._id}` : '/api/students';
      const method = editingStudent ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (result.success) {
        toast.success(editingStudent ? 'Student updated successfully' : 'Student added successfully');
        fetchStudents();
        reset();
        setEditingStudent(null);
        setShowForm(false);
      } else toast.error(result.message || 'Failed to save student');
    } catch (e) {
      console.error(e);
      toast.error('Error saving student');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setShowForm(true);
    setValue('name', student.name);
    setValue('guardianName', student.guardianName);
    setValue('email', student.email);
    setValue('phone', student.phone);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/students/${deleteId}`, { method: 'DELETE' });
      const result = await response.json();
      if (result.success) {
        toast.success('Student deleted successfully');
        fetchStudents();
      } else toast.error(result.message || 'Failed to delete student');
    } catch (e) {
      console.error(e);
      toast.error('Error deleting student');
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleCancel = () => {
    setEditingStudent(null);
    setShowForm(false);
    reset();
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.guardianName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phone?.includes(searchTerm)
  );

  return (
    <div className="py-6 max-w-8xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-foreground"> </h2>

        <div className="flex items-center gap-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <Button
            onClick={() => (showForm ? handleCancel() : setShowForm(true))}
            variant={showForm ? 'destructive' : 'default'}
            className={'cursor-pointer'}
          >
            {showForm ? <FaTimes className="mr-2" /> : <FaPlus className="mr-2" />}
            {showForm ? 'Cancel' : 'Add Student'}
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-card border border-border cursor-pointer p-6 rounded-lg shadow-md max-w-md w-full">
            <h3 className="text-lg font-semibold mb-3 text-foreground">Confirm Delete</h3>
            <p className="text-muted-foreground mb-4">
              Are you sure you want to delete this student? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)} className={'cursor-pointer'}>
                Cancel
              </Button>
              <Button className={'cursor-pointer'} variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingStudent ? 'Update Student' : 'Add New Student'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student Name */}
              <div>
                <Label className={'mb-3'}>Student Name *</Label>
                <Input
                  placeholder="Enter student name"
                  {...register('name', { required: 'Student name is required' })}
                />
                {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
              </div>

              {/* Guardian Name */}
              <div>
                <Label className={'mb-3'}>Guardian Name *</Label>
                <Input
                  placeholder="Enter guardian name"
                  {...register('guardianName', { required: 'Guardian name is required' })}
                />
                {errors.guardianName && (
                  <p className="text-destructive text-sm mt-1">{errors.guardianName.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label className={'mb-3'}>Email *</Label>
                <Input
                  placeholder="Enter email address"
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email format',
                    },
                  })}
                />
                {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message}</p>}
              </div>

              {/* Phone */}
              <div>
                <Label className={'mb-3'}>Phone *</Label>
                <Input
                  placeholder="Enter phone number"
                  {...register('phone', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[0-9]{11}$/,
                      message: 'Phone must be 11 digits',
                    },
                  })}
                />
                {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone.message}</p>}
              </div>

              <div className="md:col-span-2 flex gap-3 justify-end">
                <Button type="button" variant="secondary" onClick={handleCancel} className={'cursor-pointer'}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className={'cursor-pointer'}>
                  {submitting ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" /> Processing...
                    </>
                  ) : editingStudent ? (
                    <>
                      <FaSave className="mr-2" /> Update Student
                    </>
                  ) : (
                    <>
                      <FaPlus className="mr-2" /> Add Student
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Students List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-md" />
              ))}
            </div>
          ) : filteredStudents.length === 0 ? (
            <p className="text-muted-foreground italic">No students found.</p>
          ) : (
            <div className="overflow-x-auto rounded-md border border-border">
              <table className="w-full text-sm text-left text-foreground">
                <thead className="bg-muted/40 border-b border-border text-muted-foreground uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Student Name</th>
                    <th className="px-4 py-3">Guardian</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, index) => (
                    <tr
                      key={student._id}
                      className="border-b border-border hover:bg-muted/10 transition-colors"
                    >
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3 font-medium">{student.name}</td>
                      <td className="px-4 py-3">{student.guardianName}</td>
                      <td className="px-4 py-3">{student.email}</td>
                      <td className="px-4 py-3">{student.phone}</td>
                      <td className="px-4 py-3 text-right flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(student)}
                          className={'cursor-pointer text-blue-500'}
                        >
                          <FaEdit className="mr-1 text-blue-500" /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteClick(student._id)}
                          className={'cursor-pointer'}
                        >
                          <FaTrash className="mr-1" /> Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentManagement;
