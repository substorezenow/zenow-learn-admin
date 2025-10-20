'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  Mail, 
  Calendar, 
  BookOpen, 
  Eye, 
  Search,
  RefreshCw,
  CheckCircle,
  Loader2,
  EyeOff
} from 'lucide-react';
import { Student } from '../../../src/types';
import adminApiService from '../../../src/services/adminApi';
import StudentDetailModal from './StudentDetailModal';

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total_students: 0,
    active_students: 0,
    inactive_students: 0,
    verified_students: 0,
    students_last_30_days: 0,
    total_enrollments: 0,
    completed_courses: 0
  });
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    search: '',
    status: undefined as 'active' | 'inactive' | undefined,
    sort: 'created_at',
    order: 'desc' as 'asc' | 'desc'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [togglingStudentId, setTogglingStudentId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminApiService.getStudents(filters);
      
      if (response.success && response.data) {
        setStudents(response.data);
        if ('pagination' in response && response.pagination) {
          setPagination(response.pagination as { page: number; limit: number; total: number; pages: number });
        }
      } else {
        setError(response.error || 'Failed to fetch students');
      }
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Error loading students');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await adminApiService.getStudentStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Error fetching student stats:', err);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
    fetchStats();
  }, [fetchStudents, fetchStats]);

  const handleSearch = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
  };

  const handleStatusFilter = (status: string) => {
    setFilters(prev => ({ 
      ...prev, 
      status: status === '' ? undefined : status as 'active' | 'inactive', 
      page: 1 
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };


  const handleViewStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedStudentId(null);
  };

  const handleToggleActive = async (student: Student) => {
    try {
      setTogglingStudentId(student.id);
      const response = await adminApiService.updateStudentStatus(student.id, {
        is_active: !student.is_active
      });
      
      if (response.success) {
        setStudents(students.map(s => 
          s.id === student.id ? { ...s, is_active: !s.is_active } : s
        ));
        setToast({ 
          message: `Student ${!student.is_active ? 'activated' : 'deactivated'} successfully`, 
          type: 'success' 
        });
      } else {
        setToast({ message: 'Failed to update student status', type: 'error' });
      }
    } catch (err) {
      console.error('Error updating student status:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error updating student status';
      setToast({ message: errorMessage, type: 'error' });
    } finally {
      setTogglingStudentId(null);
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
          onClick={fetchStudents}
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Students</h1>
          <p className="text-sm text-gray-500 mt-1">Manage student accounts and enrollment data</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchStudents()}
            className="group relative flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 flex-shrink-0"
          >
            <RefreshCw className="w-4 h-4 transition-transform group-hover:rotate-180 duration-200" />
            <span className="font-semibold text-sm sm:text-base">Refresh</span>
            <div className="absolute inset-0 bg-white rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_students}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Active Students</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active_students}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <BookOpen className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Enrollments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_enrollments}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">New This Month</p>
              <p className="text-2xl font-bold text-gray-900">{stats.students_last_30_days}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search students..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filters.status || ''}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              value={`${filters.sort}-${filters.order}`}
              onChange={(e) => {
                const [sort, order] = e.target.value.split('-');
                setFilters(prev => ({ ...prev, sort, order: order as 'asc' | 'desc', page: 1 }));
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="created_at-desc">Newest First</option>
              <option value="created_at-asc">Oldest First</option>
              <option value="first_name-asc">Name A-Z</option>
              <option value="first_name-desc">Name Z-A</option>
              <option value="email-asc">Email A-Z</option>
              <option value="email-desc">Email Z-A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="hidden sm:table-cell px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="hidden md:table-cell px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Enrollment Stats
              </th>
              <th className="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="hidden lg:table-cell px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student, index) => (
              <tr 
                key={student.id} 
                className="group hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200 hover:shadow-sm border-b border-gray-100 hover:border-gray-200"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="px-2 sm:px-3 lg:px-6 py-3 sm:py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 group-hover:scale-105 transition-transform duration-200">
                      <div className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 rounded-full bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200">
                        <span className="text-gray-600 font-medium group-hover:text-gray-700 transition-colors duration-200 text-xs sm:text-sm">
                          {(student.first_name?.[0] || student.email[0]).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-1 sm:ml-2 lg:ml-4 min-w-0 flex-1">
                      <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                        {student.first_name} {student.last_name}
                      </div>
                      <div className="text-xs text-gray-500 truncate hidden sm:block">
                        {student.username || student.email}
                      </div>
                      <div className="sm:hidden text-xs text-gray-400 mt-0.5">{student.email}</div>
                    </div>
                  </div>
                </td>
                <td className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4">
                  <div className="flex items-center text-xs sm:text-sm text-gray-900">
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-gray-400" />
                    {student.email}
                  </div>
                </td>
                <td className="hidden md:table-cell px-3 sm:px-6 py-3 sm:py-4">
                  <div className="text-xs sm:text-sm text-gray-900">
                    <div className="flex items-center">
                      <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-green-500" />
                      {student.enrolled_courses || 0} enrolled
                    </div>
                    <div className="text-xs text-gray-500">
                      {student.completed_courses || 0} completed
                    </div>
                  </div>
                </td>
                <td className="px-2 sm:px-3 lg:px-6 py-3 sm:py-4">
                    <button
                      onClick={() => handleToggleActive(student)}
                      disabled={togglingStudentId === student.id}
                      className={`inline-flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 lg:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium transition-colors duration-200 ${
                        togglingStudentId === student.id
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          : student.is_active
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {togglingStudentId === student.id ? (
                        <>
                          <Loader2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 animate-spin" />
                          <span className="hidden sm:inline">Updating...</span>
                        </>
                      ) : student.is_active ? (
                        <>
                          <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          <span className="hidden sm:inline">Active</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          <span className="hidden sm:inline">Inactive</span>
                        </>
                      )}
                    </button>
                </td>
                <td className="hidden lg:table-cell px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      {formatDate(student.created_at)}
                  </div>
                </td>
                <td className="px-2 sm:px-3 lg:px-6 py-3 sm:py-4">
                    <button 
                      onClick={() => handleViewStudent(student.id)}
                      className="group relative p-1 sm:p-1.5 lg:p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-all duration-200 transform hover:scale-110 active:scale-95" 
                      title="View student"
                    >
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:rotate-12" />
                    <div className="absolute inset-0 bg-indigo-100 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-2 text-sm text-gray-700">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
              className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {students.length === 0 && !loading && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No students found.</p>
        </div>
      )}

      {/* Student Detail Modal */}
      {showDetailModal && selectedStudentId && (
        <StudentDetailModal
          isVisible={showDetailModal}
          onClose={handleCloseModal}
          studentId={selectedStudentId}
        />
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