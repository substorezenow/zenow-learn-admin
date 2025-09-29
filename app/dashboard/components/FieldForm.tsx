'use client';

import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import adminApiService from '../../../src/services/adminApi';
import { Field, CreateFieldRequest, UpdateFieldRequest } from '../../../src/types';

interface FieldFormProps {
  field?: Field | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (field: Field) => void;
}

export default function FieldForm({ field, isOpen, onClose, onSuccess }: FieldFormProps) {
  const [formData, setFormData] = useState<Partial<Field> & { category_id?: number }>({
    name: '',
    slug: '',
    description: '',
    icon_url: '',
    banner_image: '',
    is_active: true,
    sort_order: 0,
    category_id: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (field) {
      setFormData({
        name: field.name || '',
        slug: field.slug || '',
        description: field.description || '',
        icon_url: field.icon_url || '',
        banner_image: field.banner_image || '',
        is_active: field.is_active ?? true,
        sort_order: Number(field.sort_order) || 0,
        category_id: 1 // Default category ID for editing
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        icon_url: '',
        banner_image: '',
        is_active: true,
        sort_order: 0,
        category_id: 1
      });
    }
  }, [field]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'name' && !formData.slug) {
      // Auto-generate slug from name
      const slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      setFormData(prev => ({ ...prev, [name]: value, slug }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
                type === 'number' ? Number(value) : value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let response;
      
      if (field) {
        // Update existing field
        const updateData: UpdateFieldRequest = {
          id: field.id,
          name: formData.name || '',
          slug: formData.slug || '',
          description: formData.description || '',
          icon_url: formData.icon_url || '',
          banner_image: formData.banner_image || '',
          is_active: formData.is_active ?? true,
          sort_order: Number(formData.sort_order) || 0,
          category_id: Number(formData.category_id) || 1
        };
        response = await adminApiService.updateField(field.id, updateData);
      } else {
        // Create new field
        const createData: CreateFieldRequest = {
          name: formData.name || '',
          slug: formData.slug || '',
          description: formData.description || '',
          icon_url: formData.icon_url || '',
          banner_image: formData.banner_image || '',
          is_active: formData.is_active ?? true,
          sort_order: Number(formData.sort_order) || 0,
          category_id: Number(formData.category_id) || 1
        };
        response = await adminApiService.createField(createData);
      }

      if (response.success && response.data) {
        onSuccess(response.data);
        onClose();
      } else {
        setError(response.error || 'Failed to save field');
      }
    } catch (err) {
      console.error('Error saving field:', err);
      setError('Error saving field');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {field ? 'Edit Field' : 'Create New Field'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Field Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Frontend Development"
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                Slug *
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., frontend-development"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of this field"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="icon_url" className="block text-sm font-medium text-gray-700 mb-1">
                Icon URL
              </label>
              <input
                type="url"
                id="icon_url"
                name="icon_url"
                value={formData.icon_url}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/icon.svg"
              />
            </div>

            <div>
              <label htmlFor="banner_image" className="block text-sm font-medium text-gray-700 mb-1">
                Banner Image URL
              </label>
              <input
                type="url"
                id="banner_image"
                name="banner_image"
                value={formData.banner_image}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/banner.jpg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="sort_order" className="block text-sm font-medium text-gray-700 mb-1">
                Sort Order
              </label>
              <input
                type="number"
                id="sort_order"
                name="sort_order"
                value={formData.sort_order}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                Category ID
              </label>
              <input
                type="number"
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
              Active
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              {loading ? 'Saving...' : (field ? 'Update Field' : 'Create Field')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
