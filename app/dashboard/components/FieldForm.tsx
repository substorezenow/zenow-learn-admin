'use client';

import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import adminApiService from '../../../src/services/adminApi';
import { Field, CreateFieldRequest, UpdateFieldRequest, Category } from '../../../src/types';
import { useFormValidation } from '../../../lib/useFormValidation';
import { ValidationSchemas } from '../../../src/types';
import { InputField, TextareaField, CheckboxField, SelectField, SubmitButton } from '../../../lib/formFields';
import Modal from '../../../src/components/ui/Modal';

interface FieldFormProps {
  field?: Field | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (field: Field) => void;
  onError?: (error: string) => void;
}

const initialData = {
  name: '',
  slug: '',
  description: '',
  icon_url: '',
  banner_image: '',
  is_active: true,
  sort_order: 0,
  category_id: '0' // Will be set dynamically when categories load (as string)
};

export default function FieldForm({ field, isOpen, onClose, onSuccess, onError }: FieldFormProps) {

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
    validationSchema: ValidationSchemas.validateField
  });

  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  // Load categories for the dropdown
  useEffect(() => {
    const loadCategories = async () => {
      try {
        console.log('🔄 Loading categories for FieldForm...');
        const response = await adminApiService.getCategoriesAdmin();
        console.log('📋 Categories response:', response);
        if (response.success && response.data) {
          setCategories(response.data);
          console.log('✅ Categories loaded:', response.data);
          // Set the first category as default if no field is being edited
          if (!field && response.data.length > 0) {
            console.log('🎯 Setting default category ID:', response.data[0].id);
            setFieldValue('category_id', String(response.data[0].id)); // Ensure it's a string
          }
        } else {
          console.error('❌ Failed to load categories:', response.error);
        }
      } catch (error) {
        console.error('❌ Error loading categories:', error);
      }
    };
    
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen, field, setFieldValue]);

  useEffect(() => {
    if (field) {
      setFieldValue('name', field.name || '');
      setFieldValue('slug', field.slug || '');
      setFieldValue('description', field.description || '');
      setFieldValue('icon_url', field.icon_url || '');
      setFieldValue('banner_image', field.banner_image || '');
      setFieldValue('is_active', field.is_active ?? true);
      setFieldValue('sort_order', Number(field.sort_order) || 0);
      setFieldValue('category_id', String(field.category_id) || '0'); // Ensure it's a string
    } else {
      resetForm();
    }
  }, [field, setFieldValue, resetForm]);

  const handleInputChange = (fieldName: string, value: string | number | boolean | string[]) => {
    if (fieldName === 'name' && !formData.slug && typeof value === 'string') {
      // Auto-generate slug from name
      const slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      setFieldValue('name', value);
      setFieldValue('slug', slug);
    } else {
      setFieldValue(fieldName, value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError(null);
    clearErrors();

    console.log('🚀 Submitting field form with data:', formData);
    console.log('📋 Available categories:', categories);
    console.log('🔍 formData.category_id type:', typeof formData.category_id);
    console.log('🔍 formData.category_id value:', formData.category_id);
    console.log('🔍 Available category IDs:', categories.map(cat => ({ id: cat.id, type: typeof cat.id })));

    // Check if we have a valid category_id
    if (!formData.category_id || formData.category_id === '0' || (typeof formData.category_id === 'string' ? parseInt(formData.category_id) <= 0 : formData.category_id <= 0)) {
      console.error('❌ No valid category_id:', formData.category_id);
      setSubmitError('Please select a category');
      setLoading(false);
      return;
    }

    // Validate form before submission
    const validationResult = validateForm();
    if (!validationResult.isValid) {
      console.error('❌ Form validation failed:', validationResult.errors);
      setLoading(false);
      return;
    }

    try {
      let response;
      
      if (field) {
        // Update existing field
        const updateData: UpdateFieldRequest = {
          name: formData.name || '',
          slug: formData.slug || '',
          description: formData.description || '',
          icon_url: formData.icon_url,
          banner_image: formData.banner_image,
          is_active: formData.is_active ?? true,
          sort_order: Number(formData.sort_order) || 0,
          category_id: formData.category_id, // Keep as string to preserve precision
        };
        console.log('🔄 Updating field with data:', updateData);
        response = await adminApiService.updateField(field.id, updateData);
      } else {
        // Create new field
        const createData: CreateFieldRequest = {
          name: formData.name || '',
          slug: formData.slug || '',
          description: formData.description || '',
          icon_url: formData.icon_url,
          banner_image: formData.banner_image,
          is_active: formData.is_active ?? true,
          sort_order: Number(formData.sort_order) || 0,
          category_id: formData.category_id, // Keep as string to preserve precision
        };
        console.log('🔄 Creating field with data:', createData);
        console.log('🔍 createData.category_id type:', typeof createData.category_id);
        console.log('🔍 createData.category_id value:', createData.category_id);
        response = await adminApiService.createField(createData);
      }

      console.log('📨 API Response:', response);

      if (response.success && response.data) {
        console.log('✅ Field saved successfully:', response.data);
        onSuccess(response.data);
        onClose();
      } else {
        console.error('❌ API Error:', response.error);
        setSubmitError(response.error || 'Failed to save field');
      }
    } catch (err) {
      console.error('❌ Error saving field:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error saving field';
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
      title={field ? 'Edit Field' : 'Create New Field'}
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
              label="Field Name"
              placeholder="e.g., Frontend Development"
              helpText="Enter a descriptive name for the field"
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
              placeholder="e.g., frontend-development"
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
            placeholder="Brief description of this field"
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
              helpText="Optional icon URL for the field"
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
            <SelectField
              name="category_id"
              value={formData.category_id}
              onChange={(value) => handleInputChange('category_id', value)}
              onBlur={() => setFieldTouched('category_id')}
              error={getFieldError('category_id')}
              touched={validationState.touchedFields.has('category_id')}
              required
              label="Category"
              placeholder="Select a category"
              helpText="Choose the parent category for this field"
              options={categories.map(cat => ({
                value: String(cat.id), // Ensure value is string to preserve precision
                label: cat.name,
                disabled: !cat.is_active
              }))}
            />

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
              helpText="Order for displaying fields (0 = first)"
            />
          </div>

          <CheckboxField
            name="is_active"
            value={formData.is_active}
            onChange={(value) => handleInputChange('is_active', value)}
            onBlur={() => setFieldTouched('is_active')}
            error={getFieldError('is_active')}
            touched={validationState.touchedFields.has('is_active')}
            label="Active (visible to users)"
            helpText="Uncheck to hide this field from users"
          />

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
              loadingText={field?.id ? 'Updating...' : 'Creating...'}
            >
              <div className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                {field?.id ? 'Update Field' : 'Create Field'}
              </div>
            </SubmitButton>
          </div>
        </form>
    </Modal>
  );
}
