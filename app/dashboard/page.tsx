'use client';

import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  FolderOpen, 
  Layers, 
  Users, 
  TrendingUp,  
  Clock, 
} from 'lucide-react';
import adminApiService from '../../src/services/adminApi';
import { AdminStats } from '../../src/types';

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      const response = await adminApiService.getAdminStats();
      if (response.success && response.data) {
        setStats(response.data);
      } else {
        setError('Failed to fetch statistics');
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Error loading dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Categories',
      value: stats?.total_categories || 0,
      icon: <FolderOpen className="w-8 h-8 text-blue-600" />,
      color: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Fields',
      value: stats?.total_fields || 0,
      icon: <Layers className="w-8 h-8 text-green-600" />,
      color: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Published Courses',
      value: stats?.published_courses || 0,
      icon: <BookOpen className="w-8 h-8 text-purple-600" />,
      color: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Draft Courses',
      value: stats?.draft_courses || 0,
      icon: <Clock className="w-8 h-8 text-yellow-600" />,
      color: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Total Students',
      value: stats?.total_students || 0,
      icon: <Users className="w-8 h-8 text-indigo-600" />,
      color: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    {
      title: 'Total Enrollments',
      value: stats?.total_enrollments || 0,
      icon: <TrendingUp className="w-8 h-8 text-red-600" />,
      color: 'bg-red-50',
      textColor: 'text-red-600'
    }
  ];

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
          onClick={fetchStats}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to Zenow Academy Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {statCards.map((card, index) => (
          <div 
            key={index} 
            className={`${card.color} rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105 border border-gray-100`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  {card.icon}
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-600 truncate">
                    {card.title}
                  </dt>
                  <dd className={`text-3xl font-bold ${card.textColor} mt-1`}>
                    {card.value}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/dashboard/categories"
            className="group flex items-center p-4 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 transform hover:scale-105"
          >
            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-200">
              <FolderOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <div className="font-medium text-gray-900 group-hover:text-blue-900">Manage Categories</div>
              <div className="text-sm text-gray-500">Add or edit course categories</div>
            </div>
          </a>
          
          <a
            href="/dashboard/fields"
            className="group flex items-center p-4 border border-gray-200 rounded-xl hover:bg-green-50 hover:border-green-200 transition-all duration-200 transform hover:scale-105"
          >
            <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors duration-200">
              <Layers className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <div className="font-medium text-gray-900 group-hover:text-green-900">Manage Fields</div>
              <div className="text-sm text-gray-500">Organize fields within categories</div>
            </div>
          </a>
          
          <a
            href="/dashboard/courses"
            className="group flex items-center p-4 border border-gray-200 rounded-xl hover:bg-purple-50 hover:border-purple-200 transition-all duration-200 transform hover:scale-105"
          >
            <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors duration-200">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <div className="font-medium text-gray-900 group-hover:text-purple-900">Manage Courses</div>
              <div className="text-sm text-gray-500">Create and edit courses</div>
            </div>
          </a>
          
          <a
            href="/dashboard/students"
            className="group flex items-center p-4 border border-gray-200 rounded-xl hover:bg-indigo-50 hover:border-indigo-200 transition-all duration-200 transform hover:scale-105"
          >
            <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors duration-200">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <div className="font-medium text-gray-900 group-hover:text-indigo-900">Manage Students</div>
              <div className="text-sm text-gray-500">View student enrollments</div>
            </div>
          </a>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">System Overview</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <BookOpen className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900">Course Management</div>
                <div className="text-sm text-gray-500">
                  {stats?.published_courses} published, {stats?.draft_courses} drafts
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {(stats?.published_courses || 0) + (stats?.draft_courses || 0)} total
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Users className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900">Student Engagement</div>
                <div className="text-sm text-gray-500">
                  {stats?.total_students} students, {stats?.total_enrollments} enrollments
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {stats?.total_enrollments} total enrollments
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <FolderOpen className="w-5 h-5 text-purple-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900">Content Organization</div>
                <div className="text-sm text-gray-500">
                  {stats?.total_categories} categories, {stats?.total_fields} fields
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Well organized structure
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
