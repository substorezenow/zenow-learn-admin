'use client';

import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import adminApiService from '../../../src/services/adminApi';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../../../src/types';
import { useFormValidation } from '../../../lib/useFormValidation';
import { ValidationSchemas } from '../../../src/types';
import { InputField, TextareaField, CheckboxField, SubmitButton } from '../../../lib/formFields';
import Modal from '../../../src/components/ui/Modal';

interface CategoryFormProps {
  category?: Category | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (category: Category) => void;
  onError?: (error: string) => void;
}

const initialData = {
  name: '',
  slug: '',
  description: '',
  icon_url: '',
  banner_image: '',
  is_active: true,
  sort_order: 0
};

export default function CategoryForm({ category, isOpen, onClose, onSuccess, onError }: CategoryFormProps) {

  const {
    formData,
    validationState,
    setFieldValue,
    setFieldTouched,
    validateForm,
    resetForm,
    clearErrors,
    getFieldError,
    isFormValid
  } = useFormValidation({
    initialData,
    validationSchema: ValidationSchemas.validateCategory
  });

  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (category) {
      setFieldValue('name', category.name || '');
      setFieldValue('slug', category.slug || '');
      setFieldValue('description', category.description || '');
      setFieldValue('icon_url', category.icon_url || '');
      setFieldValue('banner_image', category.banner_image || '');
      setFieldValue('is_active', category.is_active ?? true);
      setFieldValue('sort_order', Number(category.sort_order) || 0);
    } else {
      resetForm();
    }
  }, [category, setFieldValue, resetForm]);

  const handleInputChange = (field: string, value: string | number | boolean | string[]) => {
    if (field === 'name' && !formData.slug && typeof value === 'string') {
      // Auto-generate slug from name
      const slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      setFieldValue('name', value);
      setFieldValue('slug', slug);
    } else {
      setFieldValue(field, value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError(null);
    clearErrors();

    // Validate form before submission
    const validationResult = validateForm();
    if (!validationResult.isValid) {
      setLoading(false);
      return;
    }

    try {
      let response;
      if (category?.id) {
        const updateData: UpdateCategoryRequest = {
          name: formData.name || '',
          slug: formData.slug || '',
          description: formData.description || '',
          icon_url: formData.icon_url,
          banner_image: formData.banner_image,
          sort_order: Number(formData.sort_order) || 0,
          is_active: formData.is_active
        };
        response = await adminApiService.updateCategory(category.id, updateData);
      } else {
        const createData: CreateCategoryRequest = {
          name: formData.name || '',
          slug: formData.slug || '',
          description: formData.description || '',
          icon_url: formData.icon_url,
          banner_image: formData.banner_image,
          sort_order: Number(formData.sort_order) || 0,
          is_active: formData.is_active
        };
        response = await adminApiService.createCategory(createData);
      }

      if (response.success && response.data) {
        onSuccess(response.data);
        onClose();
      } else {
        setSubmitError(response.error || 'Failed to save category');
      }
    } catch (err) {
      console.error('Error saving category:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error saving category';
      setSubmitError(errorMessage);
      
      // Call the error handler if provided
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={category?.id ? 'Edit Category' : 'Create New Category'}
      size="lg"
    >

        {submitError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {submitError}
          </div>
        )}

        {validationState.errors.length > 0 && (
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            <p className="font-medium">Please fix the following errors:</p>
            <ul className="mt-1 list-disc list-inside">
              {validationState.errors.map((error, index) => (
                <li key={index}>{error.message}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <InputField
              name="name"
              value={formData.name}
              onChange={(value) => handleInputChange('name', value)}
              onBlur={() => setFieldTouched('name')}
              error={getFieldError('name')}
              touched={validationState.touchedFields.has('name')}
              required
              label="Category Name"
              placeholder="e.g., Web Development"
              helpText="Enter a descriptive name for the category"
            />

            <InputField
              name="slug"
              value={formData.slug}
              onChange={(value) => handleInputChange('slug', value)}
              onBlur={() => setFieldTouched('slug')}
              error={getFieldError('slug')}
              touched={validationState.touchedFields.has('slug')}
              required
              label="Slug"
              placeholder="e.g., web-development"
              helpText="URL-friendly identifier (auto-generated from name)"
            />
          </div>

          <TextareaField
            name="description"
            value={formData.description}
            onChange={(value) => handleInputChange('description', value)}
            onBlur={() => setFieldTouched('description')}
            error={getFieldError('description')}
            touched={validationState.touchedFields.has('description')}
            label="Description"
            placeholder="Brief description of this category"
            helpText="Optional description (max 1000 characters)"
            rows={3}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <InputField
              name="icon_url"
              value={formData.icon_url}
              onChange={(value) => handleInputChange('icon_url', value)}
              onBlur={() => setFieldTouched('icon_url')}
              error={getFieldError('icon_url')}
              touched={validationState.touchedFields.has('icon_url')}
              type="url"
              label="Icon URL"
              placeholder="https://example.com/icon.svg"
              helpText="Optional icon URL for the category"
            />

            <InputField
              name="banner_image"
              value={formData.banner_image}
              onChange={(value) => handleInputChange('banner_image', value)}
              onBlur={() => setFieldTouched('banner_image')}
              error={getFieldError('banner_image')}
              touched={validationState.touchedFields.has('banner_image')}
              type="url"
              label="Banner Image URL"
              placeholder="https://example.com/banner.jpg"
              helpText="Optional banner image URL"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <InputField
              name="sort_order"
              value={formData.sort_order}
              onChange={(value) => handleInputChange('sort_order', value)}
              onBlur={() => setFieldTouched('sort_order')}
              error={getFieldError('sort_order')}
              touched={validationState.touchedFields.has('sort_order')}
              type="number"
              min={0}
              label="Sort Order"
              placeholder="0"
              helpText="Order for displaying categories (0 = first)"
            />

            <CheckboxField
              name="is_active"
              value={formData.is_active}
              onChange={(value) => handleInputChange('is_active', value)}
              onBlur={() => setFieldTouched('is_active')}
              error={getFieldError('is_active')}
              touched={validationState.touchedFields.has('is_active')}
              label="Active (visible to users)"
              helpText="Uncheck to hide this category from users"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={loading}
            >
              Cancel
            </button>
            <SubmitButton
              loading={loading}
              disabled={!isFormValid}
              loadingText={category?.id ? 'Updating...' : 'Creating...'}
            >
              <div className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                {category?.id ? 'Update Category' : 'Create Category'}
              </div>
            </SubmitButton>
          </div>
        </form>
    </Modal>
  );
}
