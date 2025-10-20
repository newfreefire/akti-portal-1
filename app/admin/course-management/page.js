'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaSpinner } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const CourseManagement = () => {
  const trainers = [
    { id: 1, name: 'John Smith' },
    { id: 2, name: 'Sarah Johnson' },
    { id: 3, name: 'Michael Brown' },
    { id: 4, name: 'Emily Davis' },
    { id: 5, name: 'Robert Wilson' },
  ];

  const [courses, setCourses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingCourses, setFetchingCourses] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      courseName: '',
      trainerId: '',
      price: '',
      duration: {
        weekend: false,
        weekdays: false,
        oneMonth: false,
        levelwise: false,
      },
    },
  });

  const watchDuration = watch('duration');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setFetchingCourses(true);
    try {
      const res = await fetch('/api/courses');
      const data = await res.json();
      if (data.success) {
        const processed = (data.courses || []).map((course) => ({
          ...course,
          id: course._id,
          durationLabels: [
            course.duration?.weekend3Months && 'Weekend/3 Months',
            course.duration?.weekdays2Months && 'Weekdays/2 Months',
            course.duration?.oneMonth && '1 Month',
            course.duration?.levelwise && 'Levelwise',
          ].filter(Boolean),
        }));
        setCourses(processed);
      } else toast.error(data.message || 'Failed to fetch courses');
    } catch (e) {
      console.error(e);
      toast.error('Error loading courses');
    } finally {
      setFetchingCourses(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (
        !data.duration.weekend &&
        !data.duration.weekdays &&
        !data.duration.oneMonth &&
        !data.duration.levelwise
      ) {
        toast.error('Please select at least one duration option');
        return;
      }

      const trainer = trainers.find((t) => t.id === parseInt(data.trainerId));
      if (!trainer) {
        toast.error('Invalid trainer selected');
        return;
      }

      const payload = {
        courseName: data.courseName,
        trainerName: trainer.name,
        price: parseFloat(data.price),
        duration: {
          weekend3Months: data.duration.weekend,
          weekdays2Months: data.duration.weekdays,
          oneMonth: data.duration.oneMonth,
          levelwise: data.duration.levelwise,
        },
      };

      setLoading(true);
      const response = await fetch(
        editingId ? `/api/courses/${editingId}` : '/api/courses',
        {
          method: editingId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      if (result.success) {
        toast.success(`Course ${editingId ? 'updated' : 'added'} successfully!`);
        reset();
        setShowForm(false);
        setEditingId(null);
        fetchCourses();
      } else toast.error(result.message || 'Operation failed');
    } catch (e) {
      console.error(e);
      toast.error('Error saving course');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (course) => {
    setEditingId(course._id);
    setShowForm(true);
    setValue('courseName', course.courseName);
    const trainer = trainers.find((t) => t.name === course.trainerName);
    if (trainer) setValue('trainerId', trainer.id.toString());
    setValue('price', course.price);
    setValue('duration.weekend', course.duration?.weekend3Months || false);
    setValue('duration.weekdays', course.duration?.weekdays2Months || false);
    setValue('duration.oneMonth', course.duration?.oneMonth || false);
    setValue('duration.levelwise', course.duration?.levelwise || false);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      setDeleting(true);
      const response = await fetch(`/api/courses/${deleteId}`, { method: 'DELETE' });
      const result = await response.json();
      if (result.success) {
        toast.success('Course deleted successfully');
        fetchCourses();
      } else toast.error(result.message || 'Failed to delete course');
    } catch (e) {
      console.error(e);
      toast.error('Error deleting course');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    reset();
    setShowForm(false);
  };

  return (
    <div className="py-6 max-w-[100vw] mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-foreground">Courses List</h2>
        <Button
          onClick={() => (showForm ? handleCancel() : setShowForm(true))}
          variant={showForm ? 'destructive' : 'default'}
          className={'cursor-pointer'}
        >
          {showForm ? <FaTimes className="mr-2" /> : <FaPlus className="mr-2" />}
          {showForm ? 'Cancel' : 'Add Course'}
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-background/60 flex items-center justify-center z-50">
          <div className="bg-card/95 backdrop-blur-md border border-border p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4 text-foreground">Confirm Delete</h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete this course? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button onClick={() => setShowDeleteModal(false)} variant="outline" disabled={deleting} className={'cursor-pointer'}>
                Cancel
              </Button>
              <Button onClick={confirmDelete} variant="destructive" disabled={deleting} className={'cursor-pointer'}>
                {deleting ? <FaSpinner className="animate-spin mr-2" /> : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Form */}
      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingId ? 'Update Course' : 'Add New Course'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className={'mb-2'}>Course Name *</Label>
                  <Input {...register('courseName', { required: 'Course name is required' })} />
                  {errors.courseName && (
                    <p className="text-destructive text-sm mt-1">{errors.courseName.message}</p>
                  )}
                </div>

                <div>
                  <Label className={'mb-2'}>Trainer *</Label>
                  <select
                    {...register('trainerId', { required: 'Trainer selection is required' })}
                    className="w-full border border-input bg-background text-foreground rounded-md px-3 py-2"
                  >
                    <option value="">Select a trainer</option>
                    {trainers.map((trainer) => (
                      <option key={trainer.id} value={trainer.id}>
                        {trainer.name}
                      </option>
                    ))}
                  </select>
                  {errors.trainerId && (
                    <p className="text-destructive text-sm mt-1">{errors.trainerId.message}</p>
                  )}
                </div>

                <div>
                  <Label className={'mb-2'}>Price (PKR) *</Label>
                  <Input
                    type="number"
                    {...register('price', {
                      required: 'Price is required',
                      min: { value: 0, message: 'Price must be positive' },
                    })}
                  />
                  {errors.price && (
                    <p className="text-destructive text-sm mt-1">{errors.price.message}</p>
                  )}
                </div>
              </div>

              {/* ✅ FIXED Course Duration Section */}
              <div>
                <Label className={'mb-3'}>Course Duration *</Label>
                <div className="flex flex-wrap gap-4 mt-2">
                  {[
                    ['weekend', 'Weekend/3 Months'],
                    ['weekdays', 'Weekdays/2 Months'],
                    ['oneMonth', '1 Month'],
                    ['levelwise', 'Levelwise'],
                  ].map(([key, label]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={key}
                        checked={watch(`duration.${key}`)}
                        onCheckedChange={(value) => setValue(`duration.${key}`, value)}
                      />
                      <Label htmlFor={key} className={'text-[12px]'}>{label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <Button type="submit" disabled={loading} className={'cursor-pointer'}>
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" /> Processing...
                    </>
                  ) : editingId ? (
                    <>
                      <FaSave className="mr-2" /> Update Course
                    </>
                  ) : (
                    <>
                      <FaPlus className="mr-2" /> Add Course
                    </>
                  )}
                </Button>
                <Button className={'cursor-pointer'} type="button" variant="secondary" onClick={() => reset()} disabled={loading}>
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Courses List */}
      <Card>
        <CardHeader>
          <CardTitle>Courses</CardTitle>
        </CardHeader>
        <CardContent>
          {fetchingCourses ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-md" />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <p className="text-muted-foreground italic">No courses added yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course._id} className="border border-border hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{course.courseName}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Trainer:</span> {course.trainerName}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Price:</span> PKR {course.price.toLocaleString()}
                    </p>
                    <div>
                      <p className="font-medium text-foreground mb-1">Duration:</p>
                      <div className="flex flex-wrap gap-2">
                        {course.durationLabels.map((label, i) => (
                          <span key={i} className="bg-primary/20 text-primary text-xs px-2 py-1 rounded">
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-2 pt-2">
                      <Button className={'cursor-pointer text-blue-500'} size="sm" variant="outline" onClick={() => handleEdit(course)}>
                        <FaEdit className="mr-1 text-blue-500" /> Edit
                      </Button>
                      <Button className={'cursor-pointer'} size="sm" variant="destructive" onClick={() => handleDeleteClick(course._id)}>
                        <FaTrash className="mr-1" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseManagement;
