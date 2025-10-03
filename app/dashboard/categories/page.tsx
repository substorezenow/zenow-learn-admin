'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';
import Image from 'next/image';
import adminApiService from '../../../src/services/adminApi';
import CategoryForm from '../components/CategoryForm';
import { Category } from '../../../src/types';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<number | null>(null);
  const [togglingCategoryId, setTogglingCategoryId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await adminApiService.getCategoriesAdmin();
      if (response.success && response.data) {
        setCategories(response.data);
      } else {
        setError('Failed to fetch categories');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Error loading categories');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    setDeletingCategoryId(id);
    try {
      const response = await adminApiService.deleteCategory(id);
      if (response.success) {
        setCategories(categories.filter(cat => cat.id !== id));
        setToast({ message: 'Category deleted successfully', type: 'success' });
      } else {
        setToast({ message: 'Failed to delete category', type: 'error' });
      }
    } catch (err) {
      console.error('Error deleting category:', err);
      setToast({ message: 'Error deleting category', type: 'error' });
    } finally {
      setDeletingCategoryId(null);
    }
  };

  const handleToggleActive = async (category: Category) => {
    try {
      setTogglingCategoryId(category.id);
      const response = await adminApiService.updateCategory(category.id, {
        ...category,
        is_active: !category.is_active
      });
      
      if (response.success) {
        setCategories(categories.map(cat => 
          cat.id === category.id ? { ...cat, is_active: !cat.is_active } : cat
        ));
        setToast({ message: `Category ${!category.is_active ? 'activated' : 'deactivated'} successfully`, type: 'success' });
      } else {
        setToast({ message: 'Failed to update category', type: 'error' });
      }
    } catch (err) {
      console.error('Error updating category:', err);
      setToast({ message: 'Error updating category', type: 'error' });
    } finally {
      setTogglingCategoryId(null);
    }
  };

  const handleFormSuccess = (category: Category) => {
    if (category.id) {
      // Update existing category
      setCategories(categories.map(cat => 
        cat.id === category.id ? category : cat
      ));
    } else {
      // Add new category
      setCategories([...categories, category]);
    }
    setShowCreateModal(false);
    setEditingCategory(null);
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
          onClick={fetchCategories}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-900">Categories Management</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="group relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-200" />
          <span className="font-semibold">Add Category</span>
          <div className="absolute inset-0 bg-white rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sort Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category, index) => (
              <tr 
                key={category.id} 
                className="group hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200 hover:shadow-sm border-b border-gray-100 hover:border-gray-200"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 group-hover:scale-105 transition-transform duration-200">
                      {category.icon_url ? (
                        <Image 
                          className="h-10 w-10 rounded-full shadow-sm group-hover:shadow-md transition-shadow duration-200" 
                          src={category.icon_url} 
                          alt={category.name}
                          width={40}
                          height={40}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200">
                          <span className="text-gray-600 font-medium group-hover:text-gray-700 transition-colors duration-200">
                            {category.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{category.name}</div>
                      <div className="text-sm text-gray-500">{category.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {category.slug}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleActive(category)}
                    disabled={togglingCategoryId === category.id}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-200 ${
                      togglingCategoryId === category.id
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : category.is_active
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    {togglingCategoryId === category.id ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : category.is_active ? (
                      <>
                        <Eye className="w-3 h-3" />
                        <span>Active</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3" />
                        <span>Inactive</span>
                      </>
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {category.sort_order}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(category.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingCategory(category)}
                      className="group relative p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-all duration-200 transform hover:scale-110 active:scale-95"
                      title="Edit category"
                    >
                      <Edit className="w-4 h-4 transition-transform group-hover:rotate-12" />
                      <div className="absolute inset-0 bg-indigo-100 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      disabled={deletingCategoryId === category.id}
                      className={`group relative p-2 rounded-lg transition-all duration-200 transform hover:scale-110 active:scale-95 ${
                        deletingCategoryId === category.id
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-red-600 hover:text-red-900 hover:bg-red-50'
                      }`}
                      title="Delete category"
                    >
                      {deletingCategoryId === category.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4 transition-transform group-hover:rotate-12" />
                          <div className="absolute inset-0 bg-red-100 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
                        </>
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No categories found. Create your first category!</p>
        </div>
      )}

      {/* Category Form Modal */}
      <CategoryForm
        category={editingCategory}
        isOpen={showCreateModal || editingCategory !== null}
        onClose={() => {
          setShowCreateModal(false);
          setEditingCategory(null);
        }}
        onSuccess={handleFormSuccess}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className={`group relative px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-sm border ${
            toast.type === 'success' 
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-400' 
              : 'bg-gradient-to-r from-red-500 to-red-600 text-white border-red-400'
          }`}>
            <div className="flex-shrink-0">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                toast.type === 'success' ? 'bg-white bg-opacity-20' : 'bg-white bg-opacity-20'
              }`}>
                <span className="text-sm">{toast.type === 'success' ? '✓' : '✕'}</span>
              </div>
            </div>
            <span className="font-medium">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 p-1 rounded-full hover:bg-black hover:bg-opacity-20 transition-colors duration-200 group-hover:scale-110"
            >
              <span className="text-lg leading-none">×</span>
            </button>
            <div className="absolute bottom-0 left-0 h-1 bg-white bg-opacity-30 rounded-full animate-pulse"></div>
          </div>
        </div>
      )}
    </div>
  );
}
