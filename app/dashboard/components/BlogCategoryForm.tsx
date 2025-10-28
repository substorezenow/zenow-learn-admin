'use client';

import React, { useEffect } from 'react';
import Modal from '../../../src/components/ui/Modal';
import { InputField, TextareaField, CheckboxField, SubmitButton } from '../../../lib/formFields';
import { useFormValidation } from '../../../lib/useFormValidation';
import { ValidationSchemas } from '../../../src/types/validation';
import adminApi from '../../../src/services/adminApi';
import type { BlogCategory } from '../../../src/types';

interface BlogCategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  blogCategory?: BlogCategory | null;
}

export default function BlogCategoryForm({ isOpen, onClose, onSuccess, blogCategory }: BlogCategoryFormProps) {
  const {
    formData,
    setFieldValue,
    setFieldTouched,
    validateForm,
    resetForm,
    clearErrors,
    getFieldError,
    isFormValid
  } = useFormValidation({
    initialData: {
      name: '',
      slug: '',
      description: '',
      icon_url: '',
      banner_image: '',
      sort_order: 0,
      is_active: true
    },
    validationSchema: ValidationSchemas.validateBlogCategory
  });

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Handle name change and auto-generate slug
  const handleNameChange = (value: string) => {
    setFieldValue('name', value);
    if (!blogCategory) { // Only auto-generate slug for new categories
      const slug = generateSlug(value);
      setFieldValue('slug', slug);
    }
  };

  // Populate form when editing
  useEffect(() => {
    if (blogCategory) {
      setFieldValue('name', blogCategory.name);
      setFieldValue('slug', blogCategory.slug);
      setFieldValue('description', blogCategory.description || '');
      setFieldValue('icon_url', blogCategory.icon_url || '');
      setFieldValue('banner_image', blogCategory.banner_image || '');
      setFieldValue('sort_order', blogCategory.sort_order);
      setFieldValue('is_active', blogCategory.is_active);
    } else {
      resetForm();
    }
  }, [blogCategory, setFieldValue, resetForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const blogCategoryData = {
        name: formData.name,
        slug: formData.slug || generateSlug(formData.name),
        description: formData.description || undefined,
        icon_url: formData.icon_url || undefined,
        banner_image: formData.banner_image || undefined,
        sort_order: Number(formData.sort_order),
        is_active: formData.is_active
      };

      if (blogCategory) {
        // Update existing blog category
        await adminApi.updateBlogCategory(blogCategory.id, blogCategoryData);
      } else {
        // Create new blog category
        await adminApi.createBlogCategory(blogCategoryData);
      }

      onSuccess();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error saving blog category:', error);
    }
  };

  const handleClose = () => {
    onClose();
    resetForm();
    clearErrors();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      size="lg"
      title={blogCategory ? 'Edit Blog Category' : 'Create New Blog Category'}
    >
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              name="name"
              label="Category Name"
              value={formData.name}
              onChange={(value) => handleNameChange(value as string)}
              onBlur={() => setFieldTouched('name')}
              error={getFieldError('name')}
              required
              placeholder="Enter category name"
            />

            <InputField
              name="slug"
              label="Slug"
              value={formData.slug}
              onChange={(value) => setFieldValue('slug', value as string)}
              onBlur={() => setFieldTouched('slug')}
              error={getFieldError('slug')}
              placeholder="auto-generated-slug"
              helpText="URL-friendly version of the name"
            />
          </div>

          <TextareaField
            name="description"
            label="Description"
            value={formData.description}
            onChange={(value) => setFieldValue('description', value as string)}
            onBlur={() => setFieldTouched('description')}
            error={getFieldError('description')}
            placeholder="Enter category description"
            rows={3}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              name="icon_url"
              label="Icon URL"
              value={formData.icon_url}
              onChange={(value) => setFieldValue('icon_url', value as string)}
              onBlur={() => setFieldTouched('icon_url')}
              error={getFieldError('icon_url')}
              placeholder="https://example.com/icon.svg"
              helpText="URL to category icon"
            />

            <InputField
              name="banner_image"
              label="Banner Image URL"
              value={formData.banner_image}
              onChange={(value) => setFieldValue('banner_image', value as string)}
              onBlur={() => setFieldTouched('banner_image')}
              error={getFieldError('banner_image')}
              placeholder="https://example.com/banner.jpg"
              helpText="URL to category banner image"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              name="sort_order"
              label="Sort Order"
              type="number"
              value={(formData.sort_order || 0).toString()}
              onChange={(value) => setFieldValue('sort_order', parseInt(value as string) || 0)}
              onBlur={() => setFieldTouched('sort_order')}
              error={getFieldError('sort_order')}
              placeholder="0"
              helpText="Lower numbers appear first"
            />

            <div className="flex items-center">
              <CheckboxField
                name="is_active"
                label="Active"
                value={formData.is_active}
                checked={formData.is_active}
                onChange={(value) => setFieldValue('is_active', value as boolean)}
                onBlur={() => setFieldTouched('is_active')}
                helpText="Whether this category is active and visible"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <SubmitButton
              loading={false}
              disabled={!isFormValid}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {blogCategory ? 'Update Category' : 'Create Category'}
            </SubmitButton>
          </div>
        </form>
      </div>
    </Modal>
  );
}