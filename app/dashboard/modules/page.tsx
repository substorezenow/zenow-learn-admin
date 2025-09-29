'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Play, FileText, Video } from 'lucide-react';
import adminApiService from '../../../src/services/adminApi';
import { CourseModule, Course } from '../../../src/types';

export default function ModulesPage() {
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingModule, setEditingModule] = useState<CourseModule | null>(null);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      setLoading(true);
      // For now, we'll get modules from courses
      // In a real implementation, you'd have a dedicated endpoint
      const response = await adminApiService.getCoursesAdmin();
      if (response.success && response.data) {
        // Extract modules from courses
        const allModules: CourseModule[] = [];
        response.data.forEach((course: Course) => {
          if (course.course_modules && Array.isArray(course.course_modules)) {
            course.course_modules.forEach((module: CourseModule) => {
              allModules.push({
                ...module,
                course_title: course.title
              });
            });
          }
        });
        setModules(allModules);
      } else {
        setError('Failed to fetch modules');
      }
    } catch (err) {
      console.error('Error fetching modules:', err);
      setError('Error loading modules');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteModule = async (id: number) => {
    if (!confirm('Are you sure you want to delete this module?')) return;

    try {
      const response = await adminApiService.deleteCourseModule(id);
      if (response.success) {
        setModules(modules.filter(module => module.id !== id));
      } else {
        alert('Failed to delete module');
      }
    } catch (err) {
      console.error('Error deleting module:', err);
      alert('Error deleting module');
    }
  };

  const getModuleIcon = (moduleType: string) => {
    switch (moduleType) {
      case 'video':
        return <Video className="w-5 h-5 text-red-600" />;
      case 'text':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'quiz':
        return <Play className="w-5 h-5 text-green-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
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
          onClick={fetchModules}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Course Modules Management</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Module
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Module
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {modules.map((module) => (
              <tr key={module.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {getModuleIcon(module.module_type)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{module.title}</div>
                      <div className="text-sm text-gray-500">{module.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{module.course_title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    module.module_type === 'video' ? 'bg-red-100 text-red-800' :
                    module.module_type === 'text' ? 'bg-blue-100 text-blue-800' :
                    module.module_type === 'quiz' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {module.module_type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {module.duration_minutes} min
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {module.sort_order}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingModule(module)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteModule(module.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modules.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No modules found. Create your first module!</p>
        </div>
      )}

      {/* Create/Edit Modal would go here */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Module</h2>
            {/* Form would go here */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
