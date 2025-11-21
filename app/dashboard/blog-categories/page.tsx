'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2, Tag, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import adminApi from '../../../src/services/adminApi';
import BlogCategoryForm from '../components/BlogCategoryForm';
import { BlogCategory } from '../../../src/types';

export default function BlogCategoriesPage() {
  const [blogCategories, setBlogCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
  const [togglingCategoryId, setTogglingCategoryId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchBlogCategories();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchBlogCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApi.getBlogCategories();
      if (response.success && response.data) {
        setBlogCategories(response.data);
      } else {
        setError('Failed to fetch blog categories');
      }
    } catch (err) {
      console.error('Error fetching blog categories:', err);
      setError('Error loading blog categories');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog category?')) return;

    setDeletingCategoryId(id);
    try {
      const response = await adminApi.deleteBlogCategory(id);
      if (response.success) {
        setBlogCategories(blogCategories.filter(cat => cat.id !== id));
        setToast({ message: 'Blog category deleted successfully', type: 'success' });
      } else {
        setToast({ message: 'Failed to delete blog category', type: 'error' });
      }
    } catch (err) {
      console.error('Error deleting blog category:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error deleting blog category';
      setToast({ message: errorMessage, type: 'error' });
      
      if (errorMessage.includes('not found')) {
        fetchBlogCategories();
      }
    } finally {
      setDeletingCategoryId(null);
    }
  };

  const handleToggleActive = async (category: BlogCategory) => {
    try {
      setTogglingCategoryId(category.id);
      const response = await adminApi.updateBlogCategory(category.id, {
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon_url: category.icon_url,
        banner_image: category.banner_image,
        sort_order: category.sort_order,
        is_active: !category.is_active
      });
      
      if (response.success) {
        setBlogCategories(blogCategories.map(cat => 
          cat.id === category.id ? { ...cat, is_active: !cat.is_active } : cat
        ));
        setToast({ 
          message: `Blog category ${!category.is_active ? 'activated' : 'deactivated'} successfully`, 
          type: 'success' 
        });
      } else {
        setToast({ message: 'Failed to update blog category', type: 'error' });
      }
    } catch (err) {
      console.error('Error updating blog category:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error updating blog category';
      setToast({ message: errorMessage, type: 'error' });
    } finally {
      setTogglingCategoryId(null);
    }
  };

  const handleCreateSuccess = () => {
    fetchBlogCategories();
    setShowCreateModal(false);
    setToast({ message: 'Blog category created successfully', type: 'success' });
  };

  const handleEditSuccess = () => {
    fetchBlogCategories();
    setEditingCategory(null);
    setToast({ message: 'Blog category updated successfully', type: 'success' });
  };

  const handleEdit = (category: BlogCategory) => {
    setEditingCategory(category);
  };

  const handleCloseEdit = () => {
    setEditingCategory(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchBlogCategories}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Categories</h1>
          <p className="text-gray-600 mt-1">Manage blog categories and their settings</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Blog Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogCategories.map((category) => (
          <div
            key={category.id ?? category.slug}
            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Category Banner */}
            <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
              {category.banner_image ? (
                <Image
                  src={category.banner_image}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <ImageIcon className="w-8 h-8 text-white/70" />
                </div>
              )}
              
              {/* Status Badge */}
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  category.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {category.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* Category Content */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {category.icon_url ? (
                    <Image
                      src={category.icon_url}
                      alt={category.name}
                      width={24}
                      height={24}
                      className="rounded"
                    />
                  ) : (
                    <Tag className="w-5 h-5 text-gray-400" />
                  )}
                  <h3 className="font-semibold text-gray-900 truncate">
                    {category.name}
                  </h3>
                </div>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  #{category.sort_order}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-2 truncate">
                /{category.slug}
              </p>

              {category.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {category.description}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Edit category"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleToggleActive(category)}
                    disabled={togglingCategoryId === category.id}
                    className="p-1.5 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded transition-colors disabled:opacity-50"
                    title={category.is_active ? 'Deactivate' : 'Activate'}
                  >
                    {togglingCategoryId === category.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : category.is_active ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    disabled={deletingCategoryId === category.id}
                    className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                    title="Delete category"
                  >
                    {deletingCategoryId === category.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="text-xs text-gray-500">
                  ID: {category.id}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {blogCategories.length === 0 && (
        <div className="text-center py-12">
          <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No blog categories found</h3>
          <p className="text-gray-600 mb-4">Get started by creating your first blog category.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Blog Category
          </button>
        </div>
      )}

      {/* Create Modal */}
      <BlogCategoryForm
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* Edit Modal */}
      <BlogCategoryForm
        isOpen={!!editingCategory}
        onClose={handleCloseEdit}
        onSuccess={handleEditSuccess}
        blogCategory={editingCategory}
      />
    </div>
  );
}