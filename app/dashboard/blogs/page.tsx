'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, FileText, Calendar } from 'lucide-react';
import Image from 'next/image';
import { Blog } from '../../../src/types';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [, setEditingBlog] = useState<Blog | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      // Mock data for now - in real implementation, you'd call an API
      const mockBlogs: Blog[] = [
        {
          id: '1',
          title: 'Getting Started with React Development',
          slug: 'getting-started-react-development',
          excerpt: 'Learn the fundamentals of React and start building modern web applications.',
          content: 'Full blog content here...',
          author_id: 'admin-1',
          author: 'Admin User',
          featured_image: 'https://example.com/react-blog.jpg',
          status: 'published',
          is_published: true,
          published_at: '2024-01-15T10:30:00Z',
          created_at: '2024-01-15T10:30:00Z',
          updated_at: '2024-01-15T10:30:00Z',
          views: 1250,
          likes: 45
        },
        {
          id: '2',
          title: 'Advanced Node.js Patterns',
          slug: 'advanced-nodejs-patterns',
          excerpt: 'Explore advanced patterns and best practices in Node.js development.',
          content: 'Full blog content here...',
          author_id: 'admin-1',
          author: 'Admin User',
          featured_image: 'https://example.com/nodejs-blog.jpg',
          status: 'draft',
          is_published: false,
          created_at: '2024-01-20T14:15:00Z',
          updated_at: '2024-01-20T14:15:00Z',
          views: 0,
          likes: 0
        }
      ];
      
      setBlogs(mockBlogs);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Error loading blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublished = async (blog: Blog) => {
    try {
      // Mock API call - in real implementation, you'd call the API
      const updatedBlog = {
        ...blog,
        is_published: !blog.is_published,
        published_at: !blog.is_published ? new Date().toISOString() : undefined
      };
      
      setBlogs(blogs.map(b => 
        b.id === blog.id ? updatedBlog : b
      ));
    } catch (err) {
      console.error('Error updating blog:', err);
      alert('Error updating blog');
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      // Mock API call - in real implementation, you'd call the API
      setBlogs(blogs.filter(blog => blog.id !== id));
    } catch (err) {
      console.error('Error deleting blog:', err);
      alert('Error deleting blog');
    }
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
          onClick={fetchBlogs}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Blog Post
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Blog Post
              </th>
              <th className="hidden sm:table-cell px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th className="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="hidden md:table-cell px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stats
              </th>
              <th className="hidden lg:table-cell px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Published
              </th>
              <th className="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {blogs.map((blog) => (
              <tr key={blog.id} className="hover:bg-gray-50">
                <td className="px-2 sm:px-3 lg:px-6 py-3 sm:py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10">
                      {blog.featured_image ? (
                        <Image 
                          className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 rounded-lg object-cover" 
                          src={blog.featured_image} 
                          alt={blog.title}
                          width={40}
                          height={40}
                        />
                      ) : (
                        <div className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 rounded-lg bg-gray-300 flex items-center justify-center">
                          <FileText className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-gray-600" />
                        </div>
                      )}
                    </div>
                    <div className="ml-1 sm:ml-2 lg:ml-4 min-w-0 flex-1">
                      <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">{blog.title}</div>
                      {blog.excerpt && blog.excerpt.trim() && (
                        <div className="text-xs text-gray-500 truncate hidden sm:block">{blog.excerpt}</div>
                      )}
                      <div className="sm:hidden text-xs text-gray-400 mt-0.5">{blog.author}</div>
                    </div>
                  </div>
                </td>
                <td className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">
                  {blog.author}
                </td>
                <td className="px-2 sm:px-3 lg:px-6 py-3 sm:py-4">
                  <button
                    onClick={() => handleTogglePublished(blog)}
                    className={`inline-flex items-center gap-1 px-1.5 sm:px-2 lg:px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      blog.is_published
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {blog.is_published ? (
                      <>
                        <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        <span className="hidden sm:inline">Published</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        <span className="hidden sm:inline">Draft</span>
                      </>
                    )}
                  </button>
                </td>
                <td className="hidden md:table-cell px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">
                  <div className="text-xs">
                    <div>{blog.views || 0} views</div>
                    <div>{blog.likes} likes</div>
                  </div>
                </td>
                <td className="hidden lg:table-cell px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">
                  {blog.published_at ? (
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      {new Date(blog.published_at).toLocaleDateString()}
                    </div>
                  ) : (
                    <span className="text-gray-400">Not published</span>
                  )}
                </td>
                <td className="px-2 sm:px-3 lg:px-6 py-3 sm:py-4">
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    <button
                      onClick={() => setEditingBlog(blog)}
                      className="group relative p-1 sm:p-1.5 lg:p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-all duration-200 transform hover:scale-110 active:scale-95"
                      title="Edit blog"
                    >
                      <Edit className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:rotate-12" />
                      <div className="absolute inset-0 bg-indigo-100 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
                    </button>
                    <button
                      onClick={() => handleDeleteBlog(blog.id)}
                      className="group relative p-1 sm:p-1.5 lg:p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-all duration-200 transform hover:scale-110 active:scale-95"
                      title="Delete blog"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:rotate-12" />
                      <div className="absolute inset-0 bg-red-100 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {blogs.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No blog posts found. Create your first blog post!</p>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900">{blogs.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Eye className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Published</p>
              <p className="text-2xl font-bold text-gray-900">
                {blogs.filter(blog => blog.is_published).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <EyeOff className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Drafts</p>
              <p className="text-2xl font-bold text-gray-900">
                {blogs.filter(blog => !blog.is_published).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">
                {blogs.reduce((sum, blog) => sum + (blog.views || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 rounded-t-xl px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Create New Blog Post</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {/* Form would go here */}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
