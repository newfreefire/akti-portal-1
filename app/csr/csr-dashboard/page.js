'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FaUserFriends,
  FaUserGraduate,
  FaSearch,
  FaEdit,
  FaTrash,
} from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CsrDashboard = () => {
  const router = useRouter();
  const [coWorkers, setCoWorkers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // ✅ Fetch both co-workers and students
  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch Co-workers
      const coWorkersRes = await fetch('/api/co-workers');
      const coWorkersData = await coWorkersRes.json();
      if (coWorkersData.success) {
        setCoWorkers(coWorkersData.coWorkers || []);
      } else {
        toast.error(coWorkersData.message || 'Failed to fetch co-workers');
      }

      // Fetch Students (same logic as student management)
      const studentsRes = await fetch('/api/students');
      const studentsData = await studentsRes.json();
      if (studentsData.success) {
        setStudents(studentsData.students || []);
      } else {
        toast.error(studentsData.message || 'Failed to fetch students');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Filter data by search
  const filteredCoWorkers = coWorkers.filter(
    (worker) =>
      worker.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.cnic?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.purpose?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStudents = students.filter(
    (student) =>
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.guardianName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phone?.includes(searchTerm)
  );

  // ✅ Redirect actions
  const handleUpdate = (type) => {
    router.push(type === 'student' ? '/csr/student-management' : '/csr/co-working');
  };

  const handleDelete = (type) => {
    router.push(type === 'student' ? '/csr/student-management' : '/csr/co-working');
  };

  return (
    <div className="py-6 max-w-[100vw] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          
        </h1>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <FaSearch className="absolute left-3 top-3 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search co-workers or students..."
            className="pl-9 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-24 w-full rounded-md" />
          <Skeleton className="h-24 w-full rounded-md" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="rounded-lg shadow-md bg-secondary/30 p-6 border-primary/30">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary/10 mr-4">
                <FaUserFriends className="text-blue-500 text-2xl" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  Total Co-workers
                </p>
                <p className="text-2xl font-bold">{coWorkers.length}</p>
              </div>
            </div>
          </Card>

          <Card className="rounded-lg shadow-md bg-secondary/30 p-6 border-primary/30">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary/10 mr-4">
                <FaUserGraduate className="text-purple-500 text-2xl" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  Total Students
                </p>
                <p className="text-2xl font-bold">{students.length}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Dual Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Co-workers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Co-workers Details</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-14 w-full rounded-md" />
            ) : filteredCoWorkers.length === 0 ? (
              <p className="text-muted-foreground italic text-center py-10">
                No co-workers found.
              </p>
            ) : (
              <div className="overflow-x-auto border border-border rounded-md">
                <table className="w-full text-sm text-left text-foreground">
                  <thead className="bg-muted/50 border-b border-border uppercase text-xs font-medium text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">#</th>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">CNIC</th>
                      <th className="px-4 py-3">Purpose</th>
                      <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCoWorkers.map((worker, index) => (
                      <tr
                        key={worker._id}
                        className="border-b border-border hover:bg-muted/10 transition-colors"
                      >
                        <td className="px-4 py-3 text-muted-foreground">{index + 1}</td>
                        <td className="px-4 py-3 font-medium">{worker.fullName}</td>
                        <td className="px-4 py-3">{worker.cnic}</td>
                        <td className="px-4 py-3">
                          {worker.purpose ? (
                            <Badge>{worker.purpose}</Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 flex justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdate('co-worker')}
                            className={'cursor-pointer'}
                          >
                            <FaEdit className="text-blue-500" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete('co-worker')}
                            className={'cursor-pointer'}
                          >
                            <FaTrash />
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

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle>Students Details</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-14 w-full rounded-md" />
            ) : filteredStudents.length === 0 ? (
              <p className="text-muted-foreground italic text-center py-10">
                No students found.
              </p>
            ) : (
              <div className="overflow-x-auto border border-border rounded-md">
                <table className="w-full text-sm text-left text-foreground">
                  <thead className="bg-muted/50 border-b border-border uppercase text-xs font-medium text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">#</th>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Guardian</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Phone</th>
                      <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student, index) => (
                      <tr
                        key={student._id}
                        className="border-b border-border hover:bg-muted/10 transition-colors"
                      >
                        <td className="px-4 py-3 text-muted-foreground">{index + 1}</td>
                        <td className="px-4 py-3 font-medium">{student.name}</td>
                        <td className="px-4 py-3">{student.guardianName}</td>
                        <td className="px-4 py-3">{student.email}</td>
                        <td className="px-4 py-3">{student.phone}</td>
                        <td className="px-4 py-3 flex justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdate('student')}
                            className={'cursor-pointer'}
                          >
                            <FaEdit className="text-blue-500" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete('student')}
                            className={'cursor-pointer'}
                          >
                            <FaTrash />
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
    </div>
  );
};

export default CsrDashboard;
