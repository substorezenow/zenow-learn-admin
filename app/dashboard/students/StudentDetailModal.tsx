'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Mail, 
  Calendar,  
  BookOpen, 
  CheckCircle, 
  XCircle,  
  User,
  GraduationCap,
  Award,
  TrendingUp
} from 'lucide-react';
import { Student } from '../../../src/types';
import adminApiService from '../../../src/services/adminApi';
import Modal from '../../../src/components/ui/Modal';

interface StudentDetailModalProps {
  isVisible: boolean;
  onClose: () => void;
  studentId: string;
}

export default function StudentDetailModal({ isVisible, onClose, studentId }: StudentDetailModalProps) {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchStudentDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminApiService.getStudentById(studentId);
      
      if (response.success && response.data) {
        setStudent(response.data);
      } else {
        setError(response.error || 'Failed to fetch student details');
      }
    } catch (err) {
      console.error('Error fetching student details:', err);
      setError('Error loading student details');
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    if (isVisible && studentId) {
      fetchStudentDetails();
    }
  }, [isVisible, studentId, fetchStudentDetails]);

  const handleStatusUpdate = async (field: 'is_active', value: boolean) => {
    if (!student) return;

    try {
      setUpdating(true);
      
      const response = await adminApiService.updateStudentStatus(studentId, {
        [field]: value
      });
      
      if (response.success && response.data) {
        setStudent(response.data);
      } else {
        setError(response.error || 'Failed to update student status');
      }
    } catch (err) {
      console.error('Error updating student status:', err);
      setError('Error updating student status');
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (isActive: boolean) => {
    if (!isActive) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
          <XCircle className="w-4 h-4 mr-2" />
          Inactive
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
        <CheckCircle className="w-4 h-4 mr-2" />
        Active
      </span>
    );
  };

  return (
    <Modal
      isOpen={isVisible}
      onClose={onClose}
      title="Student Details"
      size="xl"
    >
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 text-xl mb-4">⚠️</div>
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={fetchStudentDetails}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          ) : student ? (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <p className="text-gray-900">{student.first_name} {student.last_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <p className="text-gray-900 font-mono">{student.username || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{student.email}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{student.role || 'Student'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  Account Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Status</label>
                    {getStatusBadge(student.is_active)}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quick Actions</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusUpdate('is_active', !student.is_active)}
                        disabled={updating}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          student.is_active
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        } disabled:opacity-50`}
                      >
                        {student.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enrollment Statistics */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2 text-purple-600" />
                  Enrollment Statistics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg">
                    <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{student.enrolled_courses || 0}</p>
                    <p className="text-sm text-gray-500">Enrolled Courses</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{student.completed_courses || 0}</p>
                    <p className="text-sm text-gray-500">Completed Courses</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">
                      {student.enrolled_courses ? Math.round(((student.completed_courses || 0) / student.enrolled_courses) * 100) : 0}%
                    </p>
                    <p className="text-sm text-gray-500">Completion Rate</p>
                  </div>
                </div>
              </div>

              {/* Account Timeline */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-gray-600" />
                  Account Timeline
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Account Created</p>
                      <p className="text-xs text-gray-500">{formatDate(student.created_at)}</p>
                    </div>
                  </div>
                  {student.updated_at && student.updated_at !== student.created_at && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Last Updated</p>
                        <p className="text-xs text-gray-500">{formatDate(student.updated_at)}</p>
                      </div>
                    </div>
                  )}
                  {student.last_login && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Last Login</p>
                        <p className="text-xs text-gray-500">{formatDate(student.last_login)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}
    </Modal>
  );
}
