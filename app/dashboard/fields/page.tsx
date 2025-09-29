'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Layers } from 'lucide-react';
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

  useEffect(() => {
    fetchFields();
  }, []);

  const fetchFields = async () => {
    try {
      setLoading(true);
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

  const handleDeleteField = async (id: number) => {
    if (!confirm('Are you sure you want to delete this field?')) return;

    try {
      const response = await adminApiService.deleteField(id);
      if (response.success) {
        setFields(fields.filter(field => field.id !== id));
      } else {
        alert('Failed to delete field');
      }
    } catch (err) {
      console.error('Error deleting field:', err);
      alert('Error deleting field');
    }
  };

  const handleToggleActive = async (field: Field) => {
    try {
      const response = await adminApiService.updateField(field.id, {
        ...field,
        is_active: !field.is_active
      });
      
      if (response.success) {
        setFields(fields.map(f => 
          f.id === field.id ? { ...f, is_active: !f.is_active } : f
        ));
      } else {
        alert('Failed to update field');
      }
    } catch (err) {
      console.error('Error updating field:', err);
      alert('Error updating field');
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Fields Management</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Field
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Field
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Courses
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sort Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {fields.map((field) => (
              <tr key={field.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {field.icon_url ? (
                        <Image 
                          className="h-10 w-10 rounded-full" 
                          src={field.icon_url} 
                          alt={field.name}
                          width={40}
                          height={40}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <Layers className="w-5 h-5 text-gray-600" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{field.name}</div>
                      <div className="text-sm text-gray-500">{field.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{field.category_name}</div>
                  <div className="text-sm text-gray-500">{field.category_slug}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {field.slug}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {field.course_count} courses
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleActive(field)}
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      field.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {field.is_active ? (
                      <>
                        <Eye className="w-3 h-3" />
                        Active
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3" />
                        Inactive
                      </>
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {field.sort_order}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingField(field)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteField(field.id)}
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
      />
    </div>
  );
}
