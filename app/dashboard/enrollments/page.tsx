'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  UserCheck, 
  Calendar, 
  Eye, 
  Trash2, 
  Search,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Enrollment, EnrollmentStats, EnrollmentFilters } from '../../../src/types';
import adminApiService from '../../../src/services/adminApi';
import Modal from '../../../src/components/ui/Modal';

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [stats, setStats] = useState<EnrollmentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<EnrollmentFilters>({
    page: 1,
    limit: 20
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deletingEnrollmentId, setDeletingEnrollmentId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchEnrollments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminApiService.getEnrollments(filters);
      
      if (response.success && response.data) {
        setEnrollments(response.data);
        // Handle pagination from response if available
        if ('pagination' in response && response.pagination) {
          setPagination(response.pagination as { page: number; limit: number; total: number; pages: number });
        }
      } else {
        setError(response.error || 'Failed to fetch enrollments');
      }
    } catch (err) {
      console.error('Error fetching enrollments:', err);
      setError('Error loading enrollments');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await adminApiService.getEnrollmentStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Error fetching enrollment stats:', err);
    }
  }, []);

  useEffect(() => {
    fetchEnrollments();
    fetchStats();
  }, [fetchEnrollments, fetchStats]);

  const handleFilterChange = (newFilters: Partial<EnrollmentFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      // For now, we'll implement client-side search
      // In a real implementation, you'd send the search term to the backend
      const filtered = enrollments.filter(enrollment => 
        enrollment.course_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setEnrollments(filtered);
    } else {
      fetchEnrollments();
    }
  };

  const handleUpdateStatus = async (enrollmentId: string, updates: { is_completed?: boolean; completion_percentage?: number; completion_date?: string }) => {
    try {
      const response = await adminApiService.updateEnrollmentStatus(enrollmentId, updates);
      if (response.success) {
        setEnrollments(enrollments.map(e => 
          e.id === enrollmentId ? { ...e, ...updates } : e
        ));
        setToast({ message: 'Enrollment status updated successfully', type: 'success' });
        setShowModal(false);
        setSelectedEnrollment(null);
      } else {
        setToast({ message: response.error || 'Failed to update enrollment', type: 'error' });
      }
    } catch (err) {
      console.error('Error updating enrollment:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error updating enrollment status';
      setToast({ message: errorMessage, type: 'error' });
    }
  };

  const handleDeleteEnrollment = async (enrollmentId: string) => {
    if (!confirm('Are you sure you want to delete this enrollment?')) return;
    
    setDeletingEnrollmentId(enrollmentId);
    try {
      const response = await adminApiService.deleteEnrollment(enrollmentId);
      if (response.success) {
        setEnrollments(enrollments.filter(e => e.id !== enrollmentId));
        setToast({ message: 'Enrollment deleted successfully', type: 'success' });
      } else {
        setToast({ message: response.error || 'Failed to delete enrollment', type: 'error' });
      }
    } catch (err) {
      console.error('Error deleting enrollment:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error deleting enrollment';
      setToast({ message: errorMessage, type: 'error' });
    } finally {
      setDeletingEnrollmentId(null);
    }
  };

  const getStatusIcon = (isCompleted: boolean, completionPercentage: number) => {
    if (isCompleted) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    } else if (completionPercentage > 0) {
      return <Clock className="w-4 h-4 text-blue-500" />;
    } else {
      return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = (isCompleted: boolean, completionPercentage: number) => {
    if (isCompleted) {
      return 'Completed';
    } else if (completionPercentage > 0) {
      return 'In Progress';
    } else {
      return 'Not Started';
    }
  };

  const getStatusColor = (isCompleted: boolean, completionPercentage: number) => {
    if (isCompleted) {
      return 'bg-green-100 text-green-800';
    } else if (completionPercentage > 0) {
      return 'bg-blue-100 text-blue-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-xl mb-4">⚠️</div>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchEnrollments}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Enrollments</h1>
          <p className="text-sm text-gray-500 mt-1">Manage student course enrollments and progress</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchEnrollments}
            className="group relative flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 flex-shrink-0"
          >
            <RefreshCw className="w-4 h-4 transition-transform group-hover:rotate-180 duration-200" />
            <span className="font-semibold text-sm sm:text-base">Refresh</span>
            <div className="absolute inset-0 bg-white rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <UserCheck className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Enrollments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_enrollments}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed_enrollments}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{stats.in_progress_enrollments}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Last 30 Days</p>
                <p className="text-2xl font-bold text-gray-900">{stats.enrollments_last_30_days}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by student name, email, or course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange({ status: e.target.value as 'completed' | 'in_progress' | 'not_started' || undefined })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="completed">Completed</option>
              <option value="in_progress">In Progress</option>
              <option value="not_started">Not Started</option>
            </select>

            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Enrollments Table */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="hidden sm:table-cell px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="hidden md:table-cell px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="hidden lg:table-cell px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enrolled
                </th>
                <th className="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {enrollments.map((enrollment, index) => (
                <tr 
                  key={enrollment.id} 
                  className="group hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200 hover:shadow-sm border-b border-gray-100 hover:border-gray-200"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-2 sm:px-3 lg:px-6 py-3 sm:py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 group-hover:scale-105 transition-transform duration-200">
                        <div className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 rounded-full bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200">
                          <span className="text-gray-600 font-medium group-hover:text-gray-700 transition-colors duration-200 text-xs sm:text-sm">
                            {(enrollment.first_name?.[0] || enrollment.email?.[0] || 'S').toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-1 sm:ml-2 lg:ml-4 min-w-0 flex-1">
                        <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                          {enrollment.first_name} {enrollment.last_name}
                        </div>
                        <div className="text-xs text-gray-500">{enrollment.email}</div>
                        <div className="sm:hidden text-xs text-gray-400 mt-0.5">{enrollment.course_title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4">
                    <div className="text-xs sm:text-sm text-gray-900">
                      <div className="font-medium">{enrollment.course_title}</div>
                      <div className="text-gray-500">{enrollment.field_name} • {enrollment.category_name}</div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-3 sm:px-6 py-3 sm:py-4">
                    <div className="text-xs sm:text-sm text-gray-900">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${enrollment.completion_percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs">{enrollment.completion_percentage}%</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 sm:px-3 lg:px-6 py-3 sm:py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(enrollment.is_completed, enrollment.completion_percentage)}`}>
                      {getStatusIcon(enrollment.is_completed, enrollment.completion_percentage)}
                      <span className="ml-1">{getStatusText(enrollment.is_completed, enrollment.completion_percentage)}</span>
                    </span>
                  </td>
                  <td className="hidden lg:table-cell px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      {new Date(enrollment.enrollment_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-2 sm:px-3 lg:px-6 py-3 sm:py-4">
                    <div className="flex items-center gap-0.5 sm:gap-1">
                      <button 
                        onClick={() => {
                          setSelectedEnrollment(enrollment);
                          setShowModal(true);
                        }}
                        className="group relative p-1 sm:p-1.5 lg:p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-all duration-200 transform hover:scale-110 active:scale-95"
                        title="View Details"
                      >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:rotate-12" />
                        <div className="absolute inset-0 bg-indigo-100 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
                      </button>
                      <button 
                        onClick={() => handleDeleteEnrollment(enrollment.id)}
                        disabled={deletingEnrollmentId === enrollment.id}
                        className={`group relative p-1 sm:p-1.5 lg:p-2 rounded-lg transition-all duration-200 transform hover:scale-110 active:scale-95 ${
                          deletingEnrollmentId === enrollment.id
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-red-600 hover:text-red-900 hover:bg-red-50'
                        }`}
                        title="Delete Enrollment"
                      >
                        {deletingEnrollmentId === enrollment.id ? (
                          <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                        ) : (
                          <>
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:rotate-12" />
                            <div className="absolute inset-0 bg-red-100 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => handleFilterChange({ page: Math.max(1, pagination.page - 1) })}
            disabled={pagination.page === 1}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <span className="px-4 py-2 text-sm text-gray-700">
            Page {pagination.page} of {pagination.pages}
          </span>
          
          <button
            onClick={() => handleFilterChange({ page: Math.min(pagination.pages, pagination.page + 1) })}
            disabled={pagination.page === pagination.pages}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {enrollments.length === 0 && (
        <div className="text-center py-12">
          <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No enrollments found.</p>
        </div>
      )}

      {/* Enrollment Details Modal */}
      {showModal && selectedEnrollment && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Enrollment Details"
          size="lg"
        >
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Student</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEnrollment.first_name} {selectedEnrollment.last_name}</p>
                    <p className="text-xs text-gray-500">{selectedEnrollment.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Course</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEnrollment.course_title}</p>
                    <p className="text-xs text-gray-500">{selectedEnrollment.field_name} • {selectedEnrollment.category_name}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Enrollment Date</label>
                    <p className="mt-1 text-sm text-gray-900">{new Date(selectedEnrollment.enrollment_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Accessed</label>
                    <p className="mt-1 text-sm text-gray-900">{new Date(selectedEnrollment.last_accessed).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Progress</label>
                  <div className="mt-1 flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${selectedEnrollment.completion_percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-900">{selectedEnrollment.completion_percentage}%</span>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedEnrollment.id, { is_completed: !selectedEnrollment.is_completed })}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    {selectedEnrollment.is_completed ? 'Mark Incomplete' : 'Mark Complete'}
                  </button>
                </div>
              </div>
        </Modal>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-2 sm:right-4 z-50 animate-in slide-in-from-right duration-300 max-w-sm sm:max-w-md">
          <div className={`group relative px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-2xl flex items-center gap-2 sm:gap-3 backdrop-blur-sm border ${
            toast.type === 'success' 
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-400' 
              : 'bg-gradient-to-r from-red-500 to-red-600 text-white border-red-400'
          }`}>
            <div className="flex-shrink-0">
              <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center ${
                toast.type === 'success' ? 'bg-white bg-opacity-20' : 'bg-white bg-opacity-20'
              }`}>
                <span className="text-xs sm:text-sm">{toast.type === 'success' ? '✓' : '✕'}</span>
              </div>
            </div>
            <span className="font-medium text-sm sm:text-base flex-1">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 p-1 rounded-full hover:bg-black hover:bg-opacity-20 transition-colors duration-200 group-hover:scale-110"
            >
              <span className="text-lg leading-none">×</span>
            </button>
            <div className="absolute bottom-0 left-0 h-1 bg-white bg-opacity-30 rounded-full animate-pulse"></div>
          </div>
        </div>
      )}
    </div>
  );
}
