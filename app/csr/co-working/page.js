'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUserPlus, FaTrash, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

const CoWorking = () => {
  const [coWorkers, setCoWorkers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm();

  // Fetch co-workers
  const fetchCoWorkers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/co-workers');
      const data = await res.json();
      if (data.success) {
        setCoWorkers(data.coWorkers);
      } else {
        toast.error(data.message || 'Failed to fetch co-workers');
      }
    } catch (error) {
      toast.error('Error fetching co-workers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoWorkers();
  }, []);

  // Submit (Add or Update)
  const onSubmit = async (data) => {
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/co-workers/${editingId}` : '/api/co-workers';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        toast.success(editingId ? 'Co-worker updated!' : 'Co-worker added!');
        fetchCoWorkers();
        setShowForm(false);
        setEditingId(null);
        reset();
      } else {
        toast.error(result.message || 'Something went wrong');
      }
    } catch (err) {
      toast.error('Error saving co-worker');
    }
  };

  const handleEdit = (worker) => {
    setShowForm(true);
    setEditingId(worker._id);
    setValue('fullName', worker.fullName);
    setValue('cnic', worker.cnic);
    setValue('reference', worker.reference || '');
    setValue('purpose', worker.purpose || '');
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      setDeleting(true);
      const res = await fetch(`/api/co-workers/${deleteId}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        toast.success('Co-worker deleted successfully');
        fetchCoWorkers();
      } else {
        toast.error(result.message || 'Failed to delete co-worker');
      }
    } catch (error) {
      toast.error('Error deleting co-worker');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    reset();
  };

  return (
    <div className="py-6 max-w-[100vw] mx-auto space-y-8">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header + Add Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold"></h1>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            reset();
            
          }}
          className="flex items-center gap-2 cursor-pointer"
        >
          <FaUserPlus />
          {showForm ? 'Hide Form' : 'Add Co-worker'}
        </Button>
      </div>

      {/* Form Section */}
      {showForm && (
        <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md border border-border">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Edit Co-worker' : 'Add New Co-worker'}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name *</label>
                <input
                  {...register('fullName', { required: 'Full name is required' })}
                  placeholder="Enter full name"
                  className="w-full rounded-md border border-input bg-background px-4 py-2 focus:ring-2 focus:ring-primary"
                />
                {errors.fullName && <p className="text-destructive text-sm mt-1">{errors.fullName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">CNIC *</label>
                <input
                  {...register('cnic', {
                    required: 'CNIC is required',
                    pattern: {
                      value: /^\d{5}-\d{7}-\d{1}$/,
                      message: 'Format: 12345-1234567-1',
                    },
                  })}
                  placeholder="12345-1234567-1"
                  className="w-full rounded-md border border-input bg-background px-4 py-2 focus:ring-2 focus:ring-primary"
                />
                {errors.cnic && <p className="text-destructive text-sm mt-1">{errors.cnic.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Reference</label>
                <input
                  {...register('reference')}
                  placeholder="Enter reference"
                  className="w-full rounded-md border border-input bg-background px-4 py-2 focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Purpose</label>
                <input
                  {...register('purpose')}
                  placeholder="Enter purpose"
                  className="w-full rounded-md border border-input bg-background px-4 py-2 focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button type="submit" className="flex items-center gap-2 cursor-pointer">
                {editingId ? <><FaSave /> Update</> : <><FaUserPlus /> Add</>}
              </Button>
              <Button type="button" variant="outline" onClick={() => reset()} className={'cursor-pointer'}>
                Reset
              </Button>
              {editingId && (
                <Button type="button" variant="destructive" onClick={handleCancel} className={'cursor-pointer'}>
                  <FaTimes className="mr-2" /> Cancel
                </Button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Table Section */}
      <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md border border-border">
        <h2 className="text-xl font-semibold mb-4">Co-worker List</h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-md" />
            ))}
          </div>
        ) : coWorkers.length === 0 ? (
          <p className="text-muted-foreground italic">No co-workers found.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>List of all co-workers</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>CNIC</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coWorkers.map((worker) => (
                  <TableRow key={worker._id}>
                    <TableCell className="font-medium">{worker.fullName}</TableCell>
                    <TableCell>{worker.cnic}</TableCell>
                    <TableCell>{worker.reference || '-'}</TableCell>
                    <TableCell>{worker.purpose || '-'}</TableCell>
                    <TableCell>{new Date(worker.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleEdit(worker)}
                        className={'cursor-pointer text-blue-500'}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDelete(worker._id)}
                        className={'cursor-pointer'}
                      >
                        <FaTrash />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg shadow-lg max-w-sm w-full border border-border">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete this co-worker? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoWorking;
