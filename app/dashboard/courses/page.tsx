'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, BookOpen } from 'lucide-react';
import Image from 'next/image';
import adminApiService from '@/src/services/adminApi';
import CourseForm from '../components/CourseForm';
import { Course, UpdateCourseRequest } from '@/src/types';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await adminApiService.getCoursesAdmin();
      if (response.success && response.data) {
        setCourses(response.data);
      } else {
        setError('Failed to fetch courses');
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Error loading courses');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (id: number) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      const response = await adminApiService.deleteCourse(id);
      if (response.success) {
        setCourses(courses.filter(course => course.id !== id));
      } else {
        alert('Failed to delete course');
      }
    } catch (err) {
      console.error('Error deleting course:', err);
      alert('Error deleting course');
    }
  };

  const handleTogglePublished = async (course: Course) => {
    try {
      const updateData: UpdateCourseRequest = {
        id: course.id,
        title: course.title,
        slug: course.slug,
        description: course.description,
        short_description: course.short_description,
        banner_image: course.banner_image,
        thumbnail_image: course.thumbnail_image,
        duration_hours: course.duration_hours,
        difficulty_level: course.difficulty_level as 'Beginner' | 'Intermediate' | 'Advanced',
        price: course.price,
        is_free: course.is_free,
        is_published: !course.is_published,
        field_id: course.field_id,
        instructor_id: course.instructor_id,
        prerequisites: course.prerequisites,
        learning_outcomes: course.learning_outcomes,
        course_modules: course.course_modules,
        tags: course.tags
      };
      const response = await adminApiService.updateCourse(course.id, updateData);
      
      if (response.success) {
        setCourses(courses.map(c => 
          c.id === course.id ? { ...c, is_published: !c.is_published } : c
        ));
      } else {
        alert('Failed to update course');
      }
    } catch (err) {
      console.error('Error updating course:', err);
      alert('Error updating course');
    }
  };

  const handleFormSuccess = (course: Course) => {
    if (editingCourse) {
      // Update existing course
      setCourses(courses.map(c => c.id === course.id ? course : c));
    } else {
      // Add new course
      setCourses([...courses, course]);
    }
    setShowCreateModal(false);
    setEditingCourse(null);
  };

  const filteredCourses = courses.filter(course => {
    if (filter === 'published') return course.is_published;
    if (filter === 'draft') return !course.is_published;
    return true;
  });

  const getDifficultyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
          onClick={fetchCourses}
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
        <h1 className="text-3xl font-bold text-gray-900">Courses Management</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Course
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'all', label: 'All Courses', count: courses.length },
              { key: 'published', label: 'Published', count: courses.filter(c => c.is_published).length },
              { key: 'draft', label: 'Drafts', count: courses.filter(c => !c.is_published).length }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as 'all' | 'published' | 'draft')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  filter === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category / Field
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Difficulty
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Students
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCourses.map((course) => (
              <tr key={course.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      {course.thumbnail_image ? (
                        <Image 
                          className="h-12 w-12 rounded-lg object-cover" 
                          src={course.thumbnail_image || ''} 
                          alt={course.title}
                          width={48}
                          height={48}
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-gray-300 flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-gray-600" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{course.title}</div>
                      <div className="text-sm text-gray-500">{course.short_description}</div>
                      <div className="text-xs text-gray-400">{course.duration_hours}h • {course.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{course.category_name}</div>
                  <div className="text-sm text-gray-500">{course.field_name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(course.difficulty_level || 'beginner')}`}>
                    {course.difficulty_level || 'Beginner'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {course.is_free ? (
                    <span className="text-green-600 font-medium">Free</span>
                  ) : (
                    `$${course.price}`
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleTogglePublished(course)}
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      course.is_published
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {course.is_published ? (
                      <>
                        <Eye className="w-3 h-3" />
                        Published
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3" />
                        Draft
                      </>
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <span>{course.enrolled_students}</span>
                    {course.rating && course.rating > 0 && (
                      <span className="ml-2 text-xs text-gray-500">
                        ⭐ {course.rating.toFixed(1)} ({course.total_ratings || 0})
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingCourse(course)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            {filter === 'all' 
              ? 'No courses found. Create your first course!'
              : `No ${filter} courses found.`
            }
          </p>
        </div>
      )}

      {/* Course Form Modal */}
      <CourseForm
        course={editingCourse}
        isOpen={showCreateModal || editingCourse !== null}
        onClose={() => {
          setShowCreateModal(false);
          setEditingCourse(null);
        }}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}
