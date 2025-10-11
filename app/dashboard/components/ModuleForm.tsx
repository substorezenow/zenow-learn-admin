'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Save } from 'lucide-react';
import adminApiService from '../../../src/services/adminApi';
import { CourseModule, CreateModuleRequest, UpdateModuleRequest, Course } from '../../../src/types';
import { useFormValidation } from '../../../lib/useFormValidation';
import { ValidationSchemas } from '../../../src/types';
import { InputField, TextareaField, CheckboxField, SelectField, SubmitButton } from '../../../lib/formFields';
import Modal from '../../../src/components/ui/Modal';

interface ModuleFormProps {
  module?: CourseModule | null;
  courseId?: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (module: CourseModule) => void;
}

export default function ModuleForm({ module, courseId, isOpen, onClose, onSuccess }: ModuleFormProps) {
  const initialData = useMemo(() => ({
    course_id: String(courseId || '0'), // Keep as string to preserve precision
    title: '',
    description: '',
    content_type: 'video' as 'video' | 'text' | 'quiz' | 'assignment',
    content_url: '',
    duration_minutes: 0,
    sort_order: 0,
    is_published: false
  }), [courseId]);

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
    validationSchema: ValidationSchemas.validateModule
  });

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Load courses for the dropdown
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await adminApiService.getCoursesAdmin();
        if (response.success && response.data) {
          setCourses(response.data);
        }
      } catch (error) {
        console.error('Error loading courses:', error);
      }
    };
    
    if (isOpen) {
      loadCourses();
    }
  }, [isOpen]);

  useEffect(() => {
    if (module) {
      setFieldValue('course_id', module.course_id);
      setFieldValue('title', module.title || '');
      setFieldValue('description', module.description || '');
      setFieldValue('content_type', module.module_type as 'video' | 'text' | 'quiz' | 'assignment');
      setFieldValue('content_url', module.content_url || '');
      setFieldValue('duration_minutes', module.duration_minutes || 0);
      setFieldValue('sort_order', module.sort_order || 0);
      setFieldValue('is_published', module.is_free ?? false); // Assuming is_free maps to is_published
    } else {
      setFieldValue('course_id', courseId || 0);
      resetForm();
    }
  }, [module, courseId, setFieldValue, resetForm]);

  const handleInputChange = (fieldName: string, value: string | number | boolean | string[]) => {
    setFieldValue(fieldName, value);
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
      
      if (module) {
        // Update existing module
        const updateData: UpdateModuleRequest = {
          course_id: formData.course_id, // Keep as string to preserve precision
          title: formData.title || '',
          description: formData.description || '',
          content_type: formData.content_type || 'video',
          content_url: formData.content_url || '',
          duration_minutes: Number(formData.duration_minutes) || 0,
          sort_order: Number(formData.sort_order) || 0,
          is_published: formData.is_published ?? false
        };
        response = await adminApiService.updateModule(module.id, updateData);
      } else {
        // Create new module
        const createData: CreateModuleRequest = {
          course_id: formData.course_id, // Keep as string to preserve precision
          title: formData.title || '',
          description: formData.description || '',
          content_type: formData.content_type || 'video',
          content_url: formData.content_url || '',
          duration_minutes: Number(formData.duration_minutes) || 0,
          sort_order: Number(formData.sort_order) || 0,
          is_published: formData.is_published ?? false
        };
        response = await adminApiService.createCourseModule(String(formData.course_id), createData);
      }

      if (response.success && response.data) {
        onSuccess(response.data as CourseModule);
        onClose();
      } else {
        setSubmitError(response.error || 'Failed to save module');
      }
    } catch (err) {
      console.error('Error saving module:', err);
      setSubmitError('Error saving module');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={module ? 'Edit Module' : 'Create New Module'}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              name="course_id"
              value={formData.course_id}
              onChange={(value) => handleInputChange('course_id', value)}
              onBlur={() => setFieldTouched('course_id')}
              error={getFieldError('course_id')}
              touched={validationState.touchedFields.has('course_id')}
              required
              label="Course"
              placeholder="Select a course"
              helpText="Choose the course this module belongs to"
              options={courses.map(course => ({
                value: String(course.id), // Ensure value is string to preserve precision
                label: course.title,
                disabled: !course.is_published
              }))}
            />

            <InputField
              name="title"
              value={formData.title}
              onChange={(value) => handleInputChange('title', value)}
              onBlur={() => setFieldTouched('title')}
              error={getFieldError('title')}
              touched={validationState.touchedFields.has('title')}
              required
              label="Module Title"
              placeholder="e.g., Introduction to React"
              helpText="Enter a descriptive title for the module"
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
            placeholder="Brief description of this module"
            helpText="Optional description (max 2000 characters)"
            rows={3}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              name="content_type"
              value={formData.content_type}
              onChange={(value) => handleInputChange('content_type', value)}
              onBlur={() => setFieldTouched('content_type')}
              error={getFieldError('content_type')}
              touched={validationState.touchedFields.has('content_type')}
              required
              label="Content Type"
              placeholder="Select content type"
              helpText="Choose the type of content for this module"
              options={[
                { value: 'video', label: 'Video' },
                { value: 'text', label: 'Text/Lesson' },
                { value: 'quiz', label: 'Quiz' },
                { value: 'assignment', label: 'Assignment' }
              ]}
            />

            <InputField
              name="content_url"
              value={formData.content_url}
              onChange={(value) => handleInputChange('content_url', value)}
              onBlur={() => setFieldTouched('content_url')}
              error={getFieldError('content_url')}
              touched={validationState.touchedFields.has('content_url')}
              type="url"
              label="Content URL"
              placeholder="https://example.com/video.mp4"
              helpText="Optional URL to the module content"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              name="duration_minutes"
              value={formData.duration_minutes}
              onChange={(value) => handleInputChange('duration_minutes', value)}
              onBlur={() => setFieldTouched('duration_minutes')}
              error={getFieldError('duration_minutes')}
              touched={validationState.touchedFields.has('duration_minutes')}
              type="number"
              min={0}
              max={600}
              label="Duration (Minutes)"
              placeholder="0"
              helpText="Module duration in minutes"
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
              helpText="Order for displaying modules (0 = first)"
            />
          </div>

          <CheckboxField
            name="is_published"
            value={formData.is_published}
            onChange={(value) => handleInputChange('is_published', value)}
            onBlur={() => setFieldTouched('is_published')}
            error={getFieldError('is_published')}
            touched={validationState.touchedFields.has('is_published')}
            label="Published (visible to students)"
            helpText="Uncheck to hide this module from students"
          />

          <div className="flex justify-end gap-3 pt-4">
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
              loadingText={module?.id ? 'Updating...' : 'Creating...'}
            >
              <div className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                {module?.id ? 'Update Module' : 'Create Module'}
              </div>
            </SubmitButton>
          </div>
        </form>
    </Modal>
  );
}
