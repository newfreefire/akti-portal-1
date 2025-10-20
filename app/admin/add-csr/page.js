"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaUserPlus,
  FaTrash,
  FaEdit,
  FaSave,
  FaTimes,
  FaSpinner,
  FaSearch,
} from "react-icons/fa";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AddCSR = () => {
  const [csrs, setCsrs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCsrs, setFilteredCsrs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCsrs, setFetchingCsrs] = useState(true);
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
    getValues,
  } = useForm({
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      isActive: true,
      isLeadRole: false,
    },
  });

  useEffect(() => {
    fetchCSRs();
  }, []);

  useEffect(() => {
    const filtered = csrs.filter((csr) =>
      [csr.fullName, csr.username, csr.email]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredCsrs(filtered);
  }, [searchTerm, csrs]);

  const fetchCSRs = async () => {
    try {
      setFetchingCsrs(true);
      const response = await fetch("/api/csr");
      const data = await response.json();

      if (data.success) {
        setCsrs(data.csrs);
      } else {
        toast.error(data.message || "Failed to fetch CSRs");
      }
    } catch (error) {
      console.error("Error fetching CSRs:", error);
      toast.error("Failed to fetch CSRs. Please try again.");
    } finally {
      setFetchingCsrs(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      if (data.password !== data.confirmPassword) {
        toast.error("Passwords do not match");
        setLoading(false);
        return;
      }

      const { confirmPassword, ...csrData } = data;

      if (editingId) {
        const response = await fetch(`/api/csr/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(csrData),
        });
        const result = await response.json();

        if (result.success) {
          toast.success("CSR updated successfully!");
          setEditingId(null);
          fetchCSRs();
          reset();
          setShowForm(false);
        } else {
          toast.error(result.message || "Failed to update CSR");
        }
      } else {
        const response = await fetch("/api/csr", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(csrData),
        });
        const result = await response.json();

        if (result.success) {
          toast.success("CSR created successfully!");
          fetchCSRs();
          reset();
          setShowForm(false);
        } else {
          toast.error(result.message || "Failed to create CSR");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (csr) => {
    setEditingId(csr._id);
    setShowForm(true);
    setValue("fullName", csr.fullName);
    setValue("username", csr.username);
    setValue("email", csr.email);
    setValue("password", "");
    setValue("confirmPassword", "");
    setValue("isActive", csr.isActive);
    setValue("isLeadRole", csr.isLeadRole);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      setDeleting(true);
      const response = await fetch(`/api/csr/${deleteId}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (result.success) {
        toast.success("CSR deleted successfully!");
        fetchCSRs();
        setShowDeleteModal(false);
      } else {
        toast.error(result.message || "Failed to delete CSR");
      }
    } catch (error) {
      console.error("Error deleting CSR:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setDeleting(false);
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

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-foreground">
          Customer Support Representatives
        </h2>
        <Button
          onClick={() => {
            if (showForm) {
              handleCancel();
            } else {
              setShowForm(true);
            }
          }}
          variant={showForm ? "destructive" : "default"}
          className={'cursor-pointer'}
        >
          {showForm ? (
            <>
              <FaTimes className="mr-2" /> Cancel
            </>
          ) : (
            <>
              <FaUserPlus className="mr-2" /> Add CSR
            </>
          )}
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full border">
            <h3 className="text-xl font-semibold mb-4 text-foreground">
              Confirm Delete
            </h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete this CSR? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                onClick={() => setShowDeleteModal(false)}
                variant="outline"
                disabled={deleting}
                className={'cursor-pointer'}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDelete}
                variant="destructive"
                disabled={deleting}
                className={'cursor-pointer'}
              >
                {deleting ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" /> Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingId ? "Update CSR" : "Add New CSR"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="mb-2">Full Name *</Label>
                  <Input
                    {...register("fullName", { required: "Full name is required" })}
                    placeholder="Enter full name"
                  />
                  {errors.fullName && (
                    <p className="text-destructive text-sm mt-1">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="mb-2">Username *</Label>
                  <Input
                    {...register("username", { required: "Username is required" })}
                    placeholder="Enter username"
                  />
                  {errors.username && (
                    <p className="text-destructive text-sm mt-1">
                      {errors.username.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="mb-2">Email *</Label>
                  <Input
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    placeholder="Enter email"
                  />
                  {errors.email && (
                    <p className="text-destructive text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="mb-2">
                    {editingId ? "Password (optional)" : "Password *"}
                  </Label>
                  <Input
                    type="password"
                    {...register("password", {
                      required: editingId ? false : "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    placeholder="Enter password"
                  />
                  {errors.password && (
                    <p className="text-destructive text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="mb-2">Confirm Password *</Label>
                  <Input
                    type="password"
                    {...register("confirmPassword", {
                      validate: (value) =>
                        value === getValues("password") || "Passwords do not match",
                    })}
                    placeholder="Confirm password"
                  />
                  {errors.confirmPassword && (
                    <p className="text-destructive text-sm mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4 md:col-span-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="isActive" {...register("isActive")} />
                    <Label htmlFor="isActive">Active</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="isLeadRole" {...register("isLeadRole")} />
                    <Label htmlFor="isLeadRole">Lead Role</Label>
                  </div>
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
                      <FaSave className="mr-2" /> Update CSR
                    </>
                  ) : (
                    <>
                      <FaUserPlus className="mr-2" /> Add CSR
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => reset()}
                  disabled={loading}
                  className={'cursor-pointer'}
                >
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Table Section with Responsive Horizontal Scroll */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <CardTitle>CSR List</CardTitle>
          <div className="relative mt-3 md:mt-0 w-full md:w-64">
            <FaSearch className="absolute left-3 top-3 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search CSR..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {fetchingCsrs ? (
            <div className="flex justify-center items-center py-8 text-muted-foreground">
              <FaSpinner className="animate-spin mr-2" /> Loading CSRs...
            </div>
          ) : csrs.length === 0 ? (
            <p className="text-muted-foreground italic">No CSRs added yet.</p>
          ) : (
            <div className="overflow-x-auto w-full">
              <Table className="min-w-[750px]">
                <TableCaption>
                  List of all Customer Support Representatives
                </TableCaption>
                <TableHeader className="bg-primary/10">
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Lead Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCsrs.map((csr) => (
                    <TableRow key={csr._id}>
                      <TableCell>{csr.fullName}</TableCell>
                      <TableCell>{csr.username}</TableCell>
                      <TableCell>{csr.email}</TableCell>
                      <TableCell>
                        {csr.isActive ? (
                          <span className="text-green-600 dark:text-green-400 font-medium">
                            Active
                          </span>
                        ) : (
                          <span className="text-red-600 dark:text-red-400 font-medium">
                            Inactive
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{csr.isLeadRole ? "Yes" : "No"}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleEdit(csr)}
                          disabled={loading}
                          className={'cursor-pointer text-blue-500'}
                        >
                          <FaEdit className="mr-1" /> Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(csr._id)}
                          disabled={loading}
                          className={'cursor-pointer'}
                        >
                          <FaTrash className="mr-1" /> Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCSR;
