'use client';

import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import adminApiService from '../../../src/services/adminApi';
import { Course, CreateCourseRequest, UpdateCourseRequest, Field } from '../../../src/types';
import { useFormValidation } from '../../../lib/useFormValidation';
import { ValidationSchemas } from '../../../src/types';
import { InputField, TextareaField, CheckboxField, SelectField, SubmitButton } from '../../../lib/formFields';
import Modal from '../../../src/components/ui/Modal';

interface CourseFormProps {
  course?: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (course: Course) => void;
}

// Helper functions for learning outcomes conversion
const parseLearningOutcomes = (jsonString: string | null): string => {
  if (!jsonString) return '';
  try {
    if (jsonString.startsWith('[')) {
      return JSON.parse(jsonString).join('\n');
    }
    return jsonString;
  } catch {
    return jsonString;
  }
};

const formatLearningOutcomes = (text: string | string[]): string | null => {
  if (!text || (Array.isArray(text) && text.length === 0)) return null;
  if (Array.isArray(text)) {
    return text.length > 0 ? JSON.stringify(text) : null;
  }
  const outcomes = text.split('\n').filter(outcome => outcome.trim() !== '');
  return outcomes.length > 0 ? JSON.stringify(outcomes) : null;
};

const initialData = {
  title: '',
  slug: '',
  description: '',
  short_description: '',
  banner_image: '',
  thumbnail_image: '',
  duration_hours: 0,
  difficulty_level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
  price: 0,
  is_free: false,
  is_published: false,
  field_id: '', // Will be set from available fields
  instructor_id: '', // Will be set to current user's ID
  prerequisites: '',
  learning_outcomes: '',
  tags: ''
};

export default function CourseForm({ course, isOpen, onClose, onSuccess }: CourseFormProps) {

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
    validationSchema: ValidationSchemas.validateCourse
  });

  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (course) {
      setFieldValue('title', course.title || '');
      setFieldValue('slug', course.slug || '');
      setFieldValue('description', course.description || '');
      setFieldValue('short_description', course.short_description || '');
      setFieldValue('banner_image', course.banner_image || '');
      setFieldValue('thumbnail_image', course.thumbnail_image || '');
      setFieldValue('duration_hours', course.duration_hours || 0);
      setFieldValue('difficulty_level', (course.difficulty_level || 'beginner').toLowerCase() as 'beginner' | 'intermediate' | 'advanced');
      setFieldValue('price', course.price || 0);
      setFieldValue('is_free', course.is_free ?? false);
      setFieldValue('is_published', course.is_published ?? false);
      setFieldValue('field_id', String(course.field_id) || ''); // Ensure it's a string
      setFieldValue('instructor_id', course.instructor_id && course.instructor_id !== 'null' ? course.instructor_id : '');
      setFieldValue('prerequisites', course.prerequisites || '');
      setFieldValue('learning_outcomes', parseLearningOutcomes(course.learning_outcomes || null));
      setFieldValue('tags', course.tags || '');
    } else {
      resetForm();
    }
  }, [course, setFieldValue, resetForm]);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const response = await adminApiService.getFieldsAdmin();
        if (response.success && response.data) {
          setFields(response.data);
          // Set default field ID if creating new course and no field is selected
          if (!course && response.data.length > 0 && !formData.field_id) {
            setFieldValue('field_id', response.data[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching fields:', error);
      }
    };
    fetchFields();
  }, [course, formData.field_id, setFieldValue]);

  const handleInputChange = (fieldName: string, value: string | number | boolean | string[]) => {
    if (fieldName === 'title' && !formData.slug && typeof value === 'string') {
      // Auto-generate slug from title
      const slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      setFieldValue('title', value);
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

    // Validate form before submission
    const validationResult = validateForm();
    if (!validationResult.isValid) {
      setLoading(false);
      return;
    }

    try {
      let response;
      
      if (course) {
        // Update existing course - only send changed fields
        const updateData: UpdateCourseRequest = {};
        
        // Only include fields that have actually changed
        if (formData.title !== course.title) updateData.title = formData.title || '';
        if (formData.slug !== course.slug) updateData.slug = formData.slug || '';
        if (formData.description !== course.description) updateData.description = formData.description || '';
        if (formData.short_description !== course.short_description) updateData.short_description = formData.short_description || '';
        if (formData.banner_image !== course.banner_image) updateData.banner_image = formData.banner_image || '';
        if (formData.thumbnail_image !== course.thumbnail_image) updateData.thumbnail_image = formData.thumbnail_image || '';
        if (Number(formData.duration_hours) !== course.duration_hours) updateData.duration_hours = Number(formData.duration_hours) || 0;
        if ((formData.difficulty_level || 'beginner').toLowerCase() !== course.difficulty_level) updateData.difficulty_level = (formData.difficulty_level || 'beginner').toLowerCase() as 'beginner' | 'intermediate' | 'advanced';
        if (Number(formData.price) !== course.price) updateData.price = Number(formData.price) || 0;
        if (formData.is_free !== course.is_free) updateData.is_free = formData.is_free ?? false;
        if (formData.is_published !== course.is_published) updateData.is_published = formData.is_published ?? false;
        if (formData.field_id !== course.field_id) updateData.field_id = formData.field_id || ''; // Keep as string
        if (formData.prerequisites !== course.prerequisites) updateData.prerequisites = formData.prerequisites || '';
        
        // Handle learning outcomes comparison
        const currentLearningOutcomes = parseLearningOutcomes(course.learning_outcomes || null);
        if (formData.learning_outcomes !== currentLearningOutcomes) {
          updateData.learning_outcomes = formatLearningOutcomes(formData.learning_outcomes || '');
        }
        
        // Handle tags comparison - only update if actually changed
        if (formData.tags !== course.tags) {
          const tagsValue = Array.isArray(formData.tags) ? formData.tags.join(',') : formData.tags;
          updateData.tags = tagsValue && typeof tagsValue === 'string' && tagsValue.trim() !== '' ? tagsValue : '';
        }
        
        response = await adminApiService.updateCourse(course.id, updateData);
      } else {
        // Create new course
        const createData: CreateCourseRequest = {
          title: formData.title || '',
          slug: formData.slug || '',
          description: formData.description || '',
          short_description: formData.short_description || '',
          banner_image: formData.banner_image || '',
          thumbnail_image: formData.thumbnail_image || '',
          duration_hours: Number(formData.duration_hours) || 0,
          difficulty_level: (formData.difficulty_level || 'beginner').toLowerCase() as 'beginner' | 'intermediate' | 'advanced',
          price: Number(formData.price) || 0,
          is_free: formData.is_free ?? false,
          is_published: formData.is_published ?? false,
          field_id: String(formData.field_id || ''), // Keep as string to preserve precision
          instructor_id: formData.instructor_id || '', // Use provided instructor ID or empty string
          prerequisites: formData.prerequisites || '',
          learning_outcomes: formatLearningOutcomes(formData.learning_outcomes || ''),
          tags: Array.isArray(formData.tags) ? formData.tags.join(',') : formData.tags || ''
        };
        response = await adminApiService.createCourse(createData);
      }

      if (response.success && response.data) {
        onSuccess(response.data);
        onClose();
      } else {
        setSubmitError(response.error || 'Failed to save course');
      }
    } catch (err) {
      console.error('Error saving course:', err);
      setSubmitError('Error saving course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={course ? 'Edit Course' : 'Create New Course'}
      size="xl"
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
                <li key={index}>{error.field}: {error.message}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Debug info - remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-3 bg-gray-100 border border-gray-300 text-gray-700 rounded text-sm">
            <p className="font-medium">Debug Info:</p>
            <p>Form Valid: {isFormValid ? 'Yes' : 'No'}</p>
            <p>Instructor ID: &quot;{formData.instructor_id}&quot;</p>
            <p>Field ID: &quot;{formData.field_id}&quot;</p>
            <p>Errors: {validationState.errors.length}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <InputField
              name="title"
              value={formData.title}
              onChange={(value) => handleInputChange('title', value)}
              onBlur={() => setFieldTouched('title')}
              error={getFieldError('title')}
              touched={validationState.touchedFields.has('title')}
              required
              label="Course Title"
              placeholder="e.g., React Fundamentals"
              helpText="Enter a descriptive title for the course"
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
              placeholder="e.g., react-fundamentals"
              helpText="URL-friendly identifier (auto-generated from title)"
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
            placeholder="Detailed course description"
            helpText="Optional detailed description (max 5000 characters)"
            rows={3}
          />

          <InputField
            name="short_description"
            value={formData.short_description}
            onChange={(value) => handleInputChange('short_description', value)}
            onBlur={() => setFieldTouched('short_description')}
            error={getFieldError('short_description')}
            touched={validationState.touchedFields.has('short_description')}
            label="Short Description"
            placeholder="Brief course summary"
            helpText="Optional brief summary (max 500 characters)"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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

            <InputField
              name="thumbnail_image"
              value={formData.thumbnail_image}
              onChange={(value) => handleInputChange('thumbnail_image', value)}
              onBlur={() => setFieldTouched('thumbnail_image')}
              error={getFieldError('thumbnail_image')}
              touched={validationState.touchedFields.has('thumbnail_image')}
              type="url"
              label="Thumbnail Image URL"
              placeholder="https://example.com/thumbnail.jpg"
              helpText="Optional thumbnail image URL"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <InputField
              name="duration_hours"
              value={formData.duration_hours}
              onChange={(value) => handleInputChange('duration_hours', value)}
              onBlur={() => setFieldTouched('duration_hours')}
              error={getFieldError('duration_hours')}
              touched={validationState.touchedFields.has('duration_hours')}
              type="number"
              min={0}
              max={1000}
              label="Duration (Hours)"
              placeholder="0"
              helpText="Course duration in hours"
            />

            <SelectField
              name="difficulty_level"
              value={formData.difficulty_level}
              onChange={(value) => handleInputChange('difficulty_level', value)}
              onBlur={() => setFieldTouched('difficulty_level')}
              error={getFieldError('difficulty_level')}
              touched={validationState.touchedFields.has('difficulty_level')}
              label="Difficulty Level"
              placeholder="Select difficulty"
              helpText="Choose the course difficulty level"
              options={[
                { value: 'beginner', label: 'Beginner' },
                { value: 'intermediate', label: 'Intermediate' },
                { value: 'advanced', label: 'Advanced' }
              ]}
            />

            <InputField
              name="price"
              value={formData.price}
              onChange={(value) => handleInputChange('price', value)}
              onBlur={() => setFieldTouched('price')}
              error={getFieldError('price')}
              touched={validationState.touchedFields.has('price')}
              type="number"
              min={0}
              max={9999.99}
              step={0.01}
              label="Price ($)"
              placeholder="0.00"
              helpText="Course price in dollars"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SelectField
              name="field_id"
              value={formData.field_id}
              onChange={(value) => handleInputChange('field_id', value)}
              onBlur={() => setFieldTouched('field_id')}
              error={getFieldError('field_id')}
              touched={validationState.touchedFields.has('field_id')}
              required
              label="Field"
              placeholder="Select a field"
              helpText="Choose the field this course belongs to"
              options={fields.map(field => ({
                value: String(field.id), // Ensure value is string to preserve precision
                label: field.name,
                disabled: !field.is_active
              }))}
            />

            <InputField
              name="instructor_id"
              value={formData.instructor_id}
              onChange={(value) => handleInputChange('instructor_id', value)}
              onBlur={() => setFieldTouched('instructor_id')}
              error={getFieldError('instructor_id')}
              touched={validationState.touchedFields.has('instructor_id')}
              label="Instructor ID"
              placeholder="Leave empty for no instructor"
              helpText="UUID of the course instructor (optional)"
            />
          </div>

          <TextareaField
            name="prerequisites"
            value={formData.prerequisites}
            onChange={(value) => handleInputChange('prerequisites', value)}
            onBlur={() => setFieldTouched('prerequisites')}
            error={getFieldError('prerequisites')}
            touched={validationState.touchedFields.has('prerequisites')}
            label="Prerequisites"
            placeholder="What students should know before taking this course"
            helpText="Optional prerequisites (max 2000 characters)"
            rows={2}
          />

          <TextareaField
            name="learning_outcomes"
            value={formData.learning_outcomes}
            onChange={(value) => handleInputChange('learning_outcomes', value)}
            onBlur={() => setFieldTouched('learning_outcomes')}
            error={getFieldError('learning_outcomes')}
            touched={validationState.touchedFields.has('learning_outcomes')}
            label="Learning Outcomes"
            placeholder="Enter each learning outcome on a new line:&#10;Learn React fundamentals&#10;Build interactive components&#10;Understand state management"
            helpText="Enter each learning outcome on a new line"
            rows={4}
          />

          <InputField
            name="tags"
            value={formData.tags}
            onChange={(value) => handleInputChange('tags', value)}
            onBlur={() => setFieldTouched('tags')}
            error={getFieldError('tags')}
            touched={validationState.touchedFields.has('tags')}
            label="Tags"
            placeholder="react,frontend,javascript"
            helpText="Comma-separated tags for the course"
          />

          <div className="flex items-center space-x-6">
            <CheckboxField
              name="is_free"
              value={formData.is_free}
              onChange={(value) => handleInputChange('is_free', value)}
              onBlur={() => setFieldTouched('is_free')}
              error={getFieldError('is_free')}
              touched={validationState.touchedFields.has('is_free')}
              label="Free Course"
              helpText="Check if this course is free"
            />

            <CheckboxField
              name="is_published"
              value={formData.is_published}
              onChange={(value) => handleInputChange('is_published', value)}
              onBlur={() => setFieldTouched('is_published')}
              error={getFieldError('is_published')}
              touched={validationState.touchedFields.has('is_published')}
              label="Published"
              helpText="Check to make this course visible to users"
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
              loadingText={course?.id ? 'Updating...' : 'Creating...'}
            >
              <div className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                {course?.id ? 'Update Course' : 'Create Course'}
              </div>
            </SubmitButton>
          </div>
        </form>
    </Modal>
  );
}
