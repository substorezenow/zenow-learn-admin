'use client';

import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import adminApiService from '../../../src/services/adminApi';
import { Course, CreateCourseRequest, UpdateCourseRequest, Field } from '../../../src/types';

interface CourseFormProps {
  course?: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (course: Course) => void;
}

export default function CourseForm({ course, isOpen, onClose, onSuccess }: CourseFormProps) {
  const [fields, setFields] = useState<Field[]>([]);
  const [formData, setFormData] = useState<Partial<Course>>({
    title: '',
    slug: '',
    description: '',
    short_description: '',
    banner_image: '',
    thumbnail_image: '',
    duration_hours: 0,
    difficulty_level: 'Beginner',
    price: 0,
    is_free: false,
    is_published: false,
    field_id: 1111116658137858049, // Default to "Reading & Writing" field
    instructor_id: 1,
    prerequisites: '',
    learning_outcomes: '',
    tags: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || '',
        slug: course.slug || '',
        description: course.description || '',
        short_description: course.short_description || '',
        banner_image: course.banner_image || '',
        thumbnail_image: course.thumbnail_image || '',
        duration_hours: course.duration_hours || 0,
        difficulty_level: course.difficulty_level || 'Beginner',
        price: course.price || 0,
        is_free: course.is_free ?? false,
        is_published: course.is_published ?? false,
        field_id: course.field_id || 1111116658137858049, // Default to "Reading & Writing" field
        instructor_id: course.instructor_id || 1,
        prerequisites: course.prerequisites || '',
        learning_outcomes: course.learning_outcomes || '',
        tags: course.tags || ''
      });
    } else {
      setFormData({
        title: '',
        slug: '',
        description: '',
        short_description: '',
        banner_image: '',
        thumbnail_image: '',
        duration_hours: 0,
        difficulty_level: 'Beginner',
        price: 0,
        is_free: false,
        is_published: false,
        field_id: 1111116658137858049, // Default to "Reading & Writing" field
        instructor_id: 1,
        prerequisites: '',
        learning_outcomes: '',
        tags: ''
      });
    }
  }, [course]);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const response = await adminApiService.getFieldsAdmin();
        if (response.success && response.data) {
          setFields(response.data);
        }
      } catch (error) {
        console.error('Error fetching fields:', error);
      }
    };
    fetchFields();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'title' && !formData.slug) {
      // Auto-generate slug from title
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
      
      if (course) {
        // Update existing course
        const updateData: UpdateCourseRequest = {
          id: course.id,
          title: formData.title || '',
          slug: formData.slug || '',
          description: formData.description || '',
          short_description: formData.short_description || '',
          banner_image: formData.banner_image || '',
          thumbnail_image: formData.thumbnail_image || '',
          duration_hours: Number(formData.duration_hours) || 0,
          difficulty_level: formData.difficulty_level as 'Beginner' | 'Intermediate' | 'Advanced' || 'Beginner',
          price: Number(formData.price) || 0,
          is_free: formData.is_free ?? false,
          is_published: formData.is_published ?? false,
          field_id: formData.field_id || 1111116658137858049, // Default to "Reading & Writing" field
          prerequisites: formData.prerequisites || '',
          learning_outcomes: formData.learning_outcomes || '',
          tags: formData.tags || undefined
        };
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
          difficulty_level: formData.difficulty_level as 'Beginner' | 'Intermediate' | 'Advanced' || 'Beginner',
          price: Number(formData.price) || 0,
          is_free: formData.is_free ?? false,
          is_published: formData.is_published ?? false,
          field_id: formData.field_id || 1111116658137858049, // Default to "Reading & Writing" field
          instructor_id: 1, // Default instructor ID
          prerequisites: formData.prerequisites || '',
          learning_outcomes: formData.learning_outcomes || '',
          tags: formData.tags || undefined
        };
        response = await adminApiService.createCourse(createData);
      }

      if (response.success && response.data) {
        onSuccess(response.data);
        onClose();
      } else {
        setError(response.error || 'Failed to save course');
      }
    } catch (err) {
      console.error('Error saving course:', err);
      setError('Error saving course');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {course ? 'Edit Course' : 'Create New Course'}
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
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Course Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., React Fundamentals"
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
                placeholder="e.g., react-fundamentals"
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
              placeholder="Detailed course description"
            />
          </div>

          <div>
            <label htmlFor="short_description" className="block text-sm font-medium text-gray-700 mb-1">
              Short Description
            </label>
            <input
              type="text"
              id="short_description"
              name="short_description"
              value={formData.short_description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief course summary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div>
              <label htmlFor="thumbnail_image" className="block text-sm font-medium text-gray-700 mb-1">
                Thumbnail Image URL
              </label>
              <input
                type="url"
                id="thumbnail_image"
                name="thumbnail_image"
                value={formData.thumbnail_image}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/thumbnail.jpg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="duration_hours" className="block text-sm font-medium text-gray-700 mb-1">
                Duration (Hours)
              </label>
              <input
                type="number"
                id="duration_hours"
                name="duration_hours"
                value={formData.duration_hours}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="difficulty_level" className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty Level
              </label>
              <select
                id="difficulty_level"
                name="difficulty_level"
                value={formData.difficulty_level}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price ($)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="field_id" className="block text-sm font-medium text-gray-700 mb-1">
                Field
              </label>
              <select
                id="field_id"
                name="field_id"
                value={formData.field_id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a field</option>
                {fields.map((field) => (
                  <option key={field.id} value={field.id}>
                    {field.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="instructor_id" className="block text-sm font-medium text-gray-700 mb-1">
                Instructor ID
              </label>
              <input
                type="number"
                id="instructor_id"
                name="instructor_id"
                value={formData.instructor_id}
                onChange={handleInputChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="prerequisites" className="block text-sm font-medium text-gray-700 mb-1">
              Prerequisites
            </label>
            <textarea
              id="prerequisites"
              name="prerequisites"
              value={formData.prerequisites}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What students should know before taking this course"
            />
          </div>

          <div>
            <label htmlFor="learning_outcomes" className="block text-sm font-medium text-gray-700 mb-1">
              Learning Outcomes
            </label>
            <textarea
              id="learning_outcomes"
              name="learning_outcomes"
              value={formData.learning_outcomes}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What students will learn from this course"
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="react,frontend,javascript"
            />
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_free"
                name="is_free"
                checked={formData.is_free}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_free" className="ml-2 block text-sm text-gray-900">
                Free Course
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_published"
                name="is_published"
                checked={formData.is_published}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_published" className="ml-2 block text-sm text-gray-900">
                Published
              </label>
            </div>
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
              {loading ? 'Saving...' : (course ? 'Update Course' : 'Create Course')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
