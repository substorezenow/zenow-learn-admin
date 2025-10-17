'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Layers, Loader2 } from 'lucide-react';
import Image from 'next/image';
import adminApiService from '../../../src/services/adminApi';
import FieldForm from '../components/FieldForm';
import { Field } from '../../../src/types';

export default function FieldsPage() {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingField, setEditingField] = useState<Field | null>(null);
  const [togglingFieldId, setTogglingFieldId] = useState<string | null>(null);
  const [deletingFieldId, setDeletingFieldId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchFields();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchFields = async () => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      const response = await adminApiService.getFieldsAdmin();
      if (response.success && response.data) {
        setFields(response.data);
      } else {
        setError('Failed to fetch fields');
      }
    } catch (err) {
      console.error('Error fetching fields:', err);
      setError('Error loading fields');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteField = async (id: string) => {
    if (!confirm('Are you sure you want to delete this field?')) return;

    try {
      setDeletingFieldId(id);
      const response = await adminApiService.deleteField(id);
      if (response.success) {
        setFields(fields.filter(field => field.id !== id));
        setToast({ type: 'success', message: 'Field deleted successfully' });
      } else {
        setToast({ type: 'error', message: 'Failed to delete field' });
      }
    } catch (err) {
      console.error('Error deleting field:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error deleting field';
      setToast({ type: 'error', message: errorMessage });
      
      // If field not found, refresh the data
      if (errorMessage.includes('not found') || errorMessage.includes('Field not found')) {
        fetchFields();
      }
    } finally {
      setDeletingFieldId(null);
    }
  };

  const handleToggleActive = async (field: Field) => {
    try {
      setTogglingFieldId(field.id);
      const response = await adminApiService.updateField(field.id, {
        name: field.name,
        slug: field.slug,
        description: field.description,
        icon_url: field.icon_url,
        banner_image: field.banner_image,
        sort_order: Number(field.sort_order),
        is_active: !field.is_active
      });
      
      if (response.success) {
        setFields(fields.map(f => 
          f.id === field.id ? { ...f, is_active: !f.is_active } : f
        ));
        setToast({ type: 'success', message: `Field ${!field.is_active ? 'activated' : 'deactivated'} successfully` });
      } else {
        setToast({ type: 'error', message: 'Failed to update field' });
      }
    } catch (err) {
      console.error('Error updating field:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error updating field';
      setToast({ type: 'error', message: errorMessage });
      
      // If field not found, refresh the data
      if (errorMessage.includes('not found') || errorMessage.includes('Field not found')) {
        fetchFields();
      }
    } finally {
      setTogglingFieldId(null);
    }
  };

  const handleFormSuccess = (field: Field) => {
    if (editingField) {
      // Update existing field
      setFields(fields.map(f => f.id === field.id ? field : f));
    } else {
      // Add new field
      setFields([...fields, field]);
    }
    setShowCreateModal(false);
    setEditingField(null);
  };

  const handleFormError = (error: string) => {
    // If there's an error, refresh the data to ensure we have the latest state
    if (error.includes('not found') || error.includes('Field not found')) {
      fetchFields(); // Refresh data
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
          onClick={fetchFields}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Fields</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="group relative flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-200" />
          <span className="font-semibold text-sm sm:text-base">Add Field</span>
          <div className="absolute inset-0 bg-white rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Field
              </th>
              <th className="hidden sm:table-cell px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="hidden md:table-cell px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="hidden lg:table-cell px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Courses
              </th>
              <th className="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="hidden xl:table-cell px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sort Order
              </th>
              <th className="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {fields.map((field, index) => (
              <tr 
                key={field.id} 
                className="group hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200 hover:shadow-sm border-b border-gray-100 hover:border-gray-200"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="px-2 sm:px-3 lg:px-6 py-3 sm:py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 group-hover:scale-105 transition-transform duration-200">
                      {field.icon_url ? (
                        <Image 
                          className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 rounded-full shadow-sm group-hover:shadow-md transition-shadow duration-200" 
                          src={field.icon_url} 
                          alt={field.name}
                          width={40}
                          height={40}
                        />
                      ) : (
                        <div className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200">
                          <Layers className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-gray-600 group-hover:text-gray-700 transition-colors duration-200" />
                        </div>
                      )}
                    </div>
                    <div className="ml-1 sm:ml-2 lg:ml-4 min-w-0 flex-1">
                      <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">{field.name}</div>
                      {field.description && field.description.trim() && (
                        <div className="text-xs text-gray-500 truncate hidden sm:block">{field.description}</div>
                      )}
                      <div className="sm:hidden text-xs text-gray-400 mt-0.5">{field.category_name}</div>
                    </div>
                  </div>
                </td>
                <td className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4">
                  <div className="text-xs sm:text-sm text-gray-900">{field.category_name}</div>
                  <div className="text-xs text-gray-500">{field.category_slug}</div>
                </td>
                <td className="hidden md:table-cell px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">
                  {field.slug}
                </td>
                <td className="hidden lg:table-cell px-3 sm:px-6 py-3 sm:py-4">
                  <span className="inline-flex items-center px-1.5 sm:px-2 lg:px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {field.course_count} courses
                  </span>
                </td>
                <td className="px-2 sm:px-3 lg:px-6 py-3 sm:py-4">
                  <button
                    onClick={() => handleToggleActive(field)}
                    disabled={togglingFieldId === field.id}
                    className={`inline-flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 lg:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium transition-colors duration-200 ${
                      togglingFieldId === field.id
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : field.is_active
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    {togglingFieldId === field.id ? (
                      <>
                        <Loader2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 animate-spin" />
                        <span className="hidden sm:inline">Updating...</span>
                      </>
                    ) : field.is_active ? (
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
                <td className="hidden xl:table-cell px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">
                  {field.sort_order}
                </td>
                <td className="px-2 sm:px-3 lg:px-6 py-3 sm:py-4">
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    <button
                      onClick={() => setEditingField(field)}
                      className="group relative p-1 sm:p-1.5 lg:p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-all duration-200 transform hover:scale-110 active:scale-95"
                      title="Edit field"
                    >
                      <Edit className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:rotate-12" />
                      <div className="absolute inset-0 bg-indigo-100 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
                    </button>
                    <button
                      onClick={() => handleDeleteField(field.id)}
                      disabled={deletingFieldId === field.id}
                      className={`group relative p-1 sm:p-1.5 lg:p-2 rounded-lg transition-all duration-200 transform hover:scale-110 active:scale-95 ${
                        deletingFieldId === field.id
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-red-600 hover:text-red-900 hover:bg-red-50'
                      }`}
                      title="Delete field"
                    >
                      {deletingFieldId === field.id ? (
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

      {fields.length === 0 && (
        <div className="text-center py-12">
          <Layers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No fields found. Create your first field!</p>
        </div>
      )}

      {/* Field Form Modal */}
      <FieldForm
        field={editingField}
        isOpen={showCreateModal || editingField !== null}
        onClose={() => {
          setShowCreateModal(false);
          setEditingField(null);
        }}
        onSuccess={handleFormSuccess}
        onError={handleFormError}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className={`group relative px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-sm border ${
            toast.type === 'success' 
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-400' 
              : 'bg-gradient-to-r from-red-500 to-red-600 text-white border-red-400'
          }`}>
            <div className="flex-shrink-0">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                toast.type === 'success' ? 'bg-white bg-opacity-20' : 'bg-white bg-opacity-20'
              }`}>
                <span className="text-sm">{toast.type === 'success' ? '✓' : '✕'}</span>
              </div>
            </div>
            <span className="font-medium">{toast.message}</span>
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
