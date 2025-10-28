'use client';

import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import adminApi from '../../../src/services/adminApi';
import { Blog, CreateBlogRequest, UpdateBlogRequest, BlogCategory } from '../../../src/types';
import { useFormValidation } from '../../../lib/useFormValidation';
import { ValidationSchemas } from '../../../src/types';
import { InputField, TextareaField, SelectField, SubmitButton } from '../../../lib/formFields';
import Modal from '../../../src/components/ui/Modal';

interface BlogFormProps {
  blog?: Blog | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (blog: Blog) => void;
}

export default function BlogForm({ blog, isOpen, onClose, onSuccess }: BlogFormProps) {
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [blogCategories, setBlogCategories] = useState<BlogCategory[]>([]);

  const {
    formData,
    validationState,
    setFieldValue,
    setFieldTouched,
    getFieldError,
    validateForm,
    resetForm,
  } = useFormValidation({
    initialData: {
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      featured_image: '',
      author_id: '',
      status: 'draft' as 'draft' | 'published' | 'archived',
      published_at: '',
      tags: '',
      category_id: '',
      read_time: 0,
    },
    validationSchema: ValidationSchemas.validateBlog,
  });

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !blog) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFieldValue('slug', slug);
    }
  }, [formData.title, blog, setFieldValue]);

  // Populate form when editing
  useEffect(() => {
    if (blog) {
      setFieldValue('title', blog.title || '');
      setFieldValue('slug', blog.slug || '');
      setFieldValue('content', blog.content || '');
      setFieldValue('excerpt', blog.excerpt || '');
      setFieldValue('featured_image', blog.featured_image || '');
      setFieldValue('author_id', blog.author_id || '');
      setFieldValue('status', blog.status || 'draft');
      setFieldValue('published_at', blog.published_at || '');
      setFieldValue('tags', Array.isArray(blog.tags) ? blog.tags.join(', ') : blog.tags || '');
      setFieldValue('category_id', blog.category ? blog.category.toString() : '');
      setFieldValue('read_time', blog.read_time || 0);
    } else {
      resetForm();
    }
  }, [blog, setFieldValue, resetForm]);

  // Fetch blog categories
  useEffect(() => {
    const fetchBlogCategories = async () => {
      try {
        const response = await adminApi.getBlogCategories();
        if (response.success && response.data) {
          setBlogCategories(response.data);
        }
      } catch (error) {
        console.error('Error fetching blog categories:', error);
      }
    };
    fetchBlogCategories();
  }, []);

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSubmitError(null);

    try {
      let response;

      if (blog) {
        // Update existing blog
        const updateData: UpdateBlogRequest = {
          title: formData.title || '',
          slug: formData.slug || '',
          content: formData.content || '',
          excerpt: formData.excerpt || '',
          featured_image: formData.featured_image || '',
          status: formData.status || 'draft',
          published_at: formData.published_at || undefined,
          tags: formData.tags ? (typeof formData.tags === 'string' ? formData.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag) : formData.tags) : [],
          category_id: formData.category_id || undefined,
          read_time: Number(formData.read_time) || undefined,
        };

        response = await adminApi.updateBlog(blog.id, updateData);
      } else {
        // Create new blog
        const createData: CreateBlogRequest = {
          title: formData.title || '',
          slug: formData.slug || '',
          content: formData.content || '',
          excerpt: formData.excerpt || '',
          featured_image: formData.featured_image || '',
          author_id: formData.author_id || '',
          status: formData.status || 'draft',
          published_at: formData.published_at || undefined,
          tags: formData.tags ? (typeof formData.tags === 'string' ? formData.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag) : formData.tags) : [],
          category_id: formData.category_id || undefined,
          read_time: Number(formData.read_time) || undefined,
        };

        response = await adminApi.createBlog(createData);
      }

      if (response.success && response.data) {
        onSuccess(response.data);
        onClose();
      } else {
        setSubmitError(response.error || 'Failed to save blog');
      }
    } catch (err) {
      console.error('Error saving blog:', err);
      setSubmitError('Error saving blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={blog ? 'Edit Blog Post' : 'Create New Blog Post'}
      size="xl"
    >
      <div className="space-y-6">
        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {submitError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <InputField
            name="title"
            value={formData.title}
            onChange={(value) => setFieldValue('title', value)}
            onBlur={() => setFieldTouched('title')}
            error={getFieldError('title')}
            touched={validationState.touchedFields.has('title')}
            required
            label="Title"
            placeholder="e.g., Getting Started with React"
            helpText="Enter a descriptive title for the blog post"
          />

          <InputField
            name="slug"
            value={formData.slug}
            onChange={(value) => setFieldValue('slug', value)}
            onBlur={() => setFieldTouched('slug')}
            error={getFieldError('slug')}
            touched={validationState.touchedFields.has('slug')}
            required
            label="Slug"
            placeholder="e.g., getting-started-with-react"
            helpText="URL-friendly identifier (auto-generated from title)"
          />
        </div>

        <TextareaField
          name="content"
          value={formData.content}
          onChange={(value) => setFieldValue('content', value)}
          onBlur={() => setFieldTouched('content')}
          error={getFieldError('content')}
          touched={validationState.touchedFields.has('content')}
          required
          label="Content"
          placeholder="Write your blog post content here..."
          helpText="Full blog post content (supports Markdown)"
          rows={10}
        />

        <TextareaField
          name="excerpt"
          value={formData.excerpt}
          onChange={(value) => setFieldValue('excerpt', value)}
          onBlur={() => setFieldTouched('excerpt')}
          error={getFieldError('excerpt')}
          touched={validationState.touchedFields.has('excerpt')}
          label="Excerpt"
          placeholder="Brief summary of the blog post"
          helpText="Optional brief summary (max 500 characters)"
          rows={3}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <InputField
            name="featured_image"
            value={formData.featured_image}
            onChange={(value) => setFieldValue('featured_image', value)}
            onBlur={() => setFieldTouched('featured_image')}
            error={getFieldError('featured_image')}
            touched={validationState.touchedFields.has('featured_image')}
            label="Featured Image URL"
            placeholder="https://example.com/image.jpg"
            helpText="Optional featured image URL"
          />

          <InputField
            name="author_id"
            value={formData.author_id}
            onChange={(value) => setFieldValue('author_id', value)}
            onBlur={() => setFieldTouched('author_id')}
            error={getFieldError('author_id')}
            touched={validationState.touchedFields.has('author_id')}
            label="Author ID"
            placeholder="UUID of the author"
            helpText="UUID of the blog post author"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <SelectField
            name="status"
            value={formData.status}
            onChange={(value) => setFieldValue('status', value)}
            onBlur={() => setFieldTouched('status')}
            error={getFieldError('status')}
            touched={validationState.touchedFields.has('status')}
            required
            label="Status"
            placeholder="Select status"
            helpText="Publication status of the blog post"
            options={[
              { value: 'draft', label: 'Draft' },
              { value: 'published', label: 'Published' },
              { value: 'archived', label: 'Archived' },
            ]}
          />

          <SelectField
            name="category_id"
            value={formData.category_id}
            onChange={(value) => setFieldValue('category_id', value)}
            onBlur={() => setFieldTouched('category_id')}
            error={getFieldError('category_id')}
            touched={validationState.touchedFields.has('category_id')}
            label="Category"
            placeholder="Select category"
            helpText="Optional blog category"
            options={[
              { value: '', label: 'No Category' },
              ...blogCategories.map((category) => ({
                value: String(category.id),
                label: category.name,
                disabled: !category.is_active,
              })),
            ]}
          />

          <InputField
            name="read_time"
            type="number"
            value={formData.read_time}
            onChange={(value) => setFieldValue('read_time', value)}
            onBlur={() => setFieldTouched('read_time')}
            error={getFieldError('read_time')}
            touched={validationState.touchedFields.has('read_time')}
            label="Read Time (minutes)"
            placeholder="5"
            helpText="Estimated reading time in minutes"
            min={0}
            max={120}
          />
        </div>

        <InputField
          name="tags"
          value={formData.tags}
          onChange={(value) => setFieldValue('tags', value)}
          onBlur={() => setFieldTouched('tags')}
          error={getFieldError('tags')}
          touched={validationState.touchedFields.has('tags')}
          label="Tags"
          placeholder="react, javascript, frontend"
          helpText="Comma-separated tags for the blog post"
        />

        <InputField
          name="published_at"
          value={formData.published_at}
          onChange={(value) => setFieldValue('published_at', value)}
          onBlur={() => setFieldTouched('published_at')}
          error={getFieldError('published_at')}
          touched={validationState.touchedFields.has('published_at')}
          label="Published At"
          helpText="Optional publication date and time"
        />

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
          <SubmitButton
            loading={loading}
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {blog ? 'Update Blog' : 'Create Blog'}
          </SubmitButton>
        </div>
      </div>
    </Modal>
  );
}