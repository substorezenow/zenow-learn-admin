"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  BookOpen,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import adminApiService from "@/src/services/adminApi";
import CourseForm from "../components/CourseForm";
import { Course, UpdateCourseRequest } from "@/src/types";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [togglingCourseId, setTogglingCourseId] = useState<string | null>(null);
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      const response = await adminApiService.getCoursesAdmin();
      if (response.success && response.data) {
        setCourses(response.data);
      } else {
        setError("Failed to fetch courses");
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Error loading courses");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    setDeletingCourseId(id);
    try {
      const response = await adminApiService.deleteCourse(id);
      if (response.success) {
        setCourses(courses.filter((course) => course.id !== id));
        setToast({ message: "Course deleted successfully", type: "success" });
      } else {
        setToast({ message: "Failed to delete course", type: "error" });
      }
    } catch (err) {
      console.error("Error deleting course:", err);
      setToast({ message: "Error deleting course", type: "error" });
    } finally {
      setDeletingCourseId(null);
    }
  };

  const handleTogglePublished = async (course: Course) => {
    setTogglingCourseId(course.id);
    try {
      const updateData: UpdateCourseRequest = {
        title: course.title,
        slug: course.slug,
        description: course.description,
        short_description: course.short_description || null,
        banner_image: course.banner_image || null,
        thumbnail_image: course.thumbnail_image || null,
        duration_hours: Number(course.duration_hours),
        difficulty_level: (
          course.difficulty_level || "beginner"
        ).toLowerCase() as "beginner" | "intermediate" | "advanced",
        price: Number(course.price),
        is_free: course.is_free,
        is_published: !course.is_published,
        field_id: String(course.field_id),
        instructor_id: course.instructor_id
          ? String(course.instructor_id)
          : undefined,
        prerequisites: course.prerequisites || null,
        learning_outcomes: course.learning_outcomes || null,
        course_modules: course.course_modules,
        tags: course.tags,
      };
      const response = await adminApiService.updateCourse(
        course.id,
        updateData
      );

      if (response.success) {
        setCourses(
          courses.map((c) =>
            c.id === course.id ? { ...c, is_published: !c.is_published } : c
          )
        );
        setToast({
          message: `Course ${
            !course.is_published ? "published" : "unpublished"
          } successfully`,
          type: "success",
        });
      } else {
        setToast({ message: "Failed to update course", type: "error" });
      }
    } catch (err) {
      console.error("Error updating course:", err);
      setToast({ message: "Error updating course", type: "error" });
    } finally {
      setTogglingCourseId(null);
    }
  };

  const handleFormSuccess = (course: Course) => {
    if (editingCourse) {
      // Update existing course
      setCourses(courses.map((c) => (c.id === course.id ? course : c)));
    } else {
      // Add new course
      setCourses([...courses, course]);
    }
    setShowCreateModal(false);
    setEditingCourse(null);
  };

  const filteredCourses = courses.filter((course) => {
    if (filter === "published") return course.is_published;
    if (filter === "draft") return !course.is_published;
    return true;
  });

  const getDifficultyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[...Array(7)].map((_, i) => (
                    <th
                      key={i}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div className="animate-pulse">
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-6 py-4 whitespace-nowrap">
                        <div className="animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-900">Courses Management</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="group relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-200" />
          <span className="font-semibold">Add Course</span>
          <div className="absolute inset-0 bg-white rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
          <nav className="flex space-x-1">
            {[
              { key: "all", label: "All Courses", count: courses.length },
              {
                key: "published",
                label: "Published",
                count: courses.filter((c) => c.is_published).length,
              },
              {
                key: "draft",
                label: "Drafts",
                count: courses.filter((c) => !c.is_published).length,
              },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() =>
                  setFilter(tab.key as "all" | "published" | "draft")
                }
                className={`group relative flex-1 py-3 px-4 rounded-md font-medium text-sm transition-all duration-200 ${
                  filter === tab.key
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <span className="relative z-10">{tab.label}</span>
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                    filter === tab.key
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-600 group-hover:bg-gray-300"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
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
              {filteredCourses.map((course, index) => (
                <tr
                  key={course.id}
                  className="group hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200 hover:shadow-sm border-b border-gray-100 hover:border-gray-200"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 group-hover:scale-105 transition-transform duration-200">
                        {course.thumbnail_image ? (
                          <Image
                            className="h-12 w-12 rounded-lg object-cover shadow-sm group-hover:shadow-md transition-shadow duration-200"
                            src={course.thumbnail_image || ""}
                            alt={course.title}
                            width={48}
                            height={48}
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200">
                            <BookOpen className="w-6 h-6 text-gray-600 group-hover:text-gray-700 transition-colors duration-200" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {course.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {course.short_description}
                        </div>
                        <div className="text-xs text-gray-400">
                          {course.duration_hours}h • {course.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {course.category_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {course.field_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(
                        course.difficulty_level || "beginner"
                      )}`}
                    >
                      {course.difficulty_level || "Beginner"}
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
                      disabled={togglingCourseId === course.id}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-200 ${
                        togglingCourseId === course.id
                          ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                          : course.is_published
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                      }`}
                    >
                      {togglingCourseId === course.id ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>Updating...</span>
                        </>
                      ) : course.is_published ? (
                        <>
                          <Eye className="w-3 h-3" />
                          <span>Published</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          <span>Draft</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <span>{course.enrolled_students}</span>
                      {course.rating && course.rating > 0 && (
                        <span className="ml-2 text-xs text-gray-500">
                          ⭐ {course.rating.toFixed(1)} (
                          {course.total_ratings || 0})
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingCourse(course)}
                        className="group relative p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-all duration-200 transform hover:scale-110 active:scale-95"
                        title="Edit course"
                      >
                        <Edit className="w-4 h-4 transition-transform group-hover:rotate-12" />
                        <div className="absolute inset-0 bg-indigo-100 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        disabled={deletingCourseId === course.id}
                        className={`group relative p-2 rounded-lg transition-all duration-200 transform hover:scale-110 active:scale-95 ${
                          deletingCourseId === course.id
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-red-600 hover:text-red-900 hover:bg-red-50"
                        }`}
                        title="Delete course"
                      >
                        {deletingCourseId === course.id ? (
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

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            {filter === "all"
              ? "No courses found. Create your first course!"
              : `No ${filter} courses found.`}
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

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div
            className={`group relative px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-sm border ${
              toast.type === "success"
                ? "bg-gradient-to-r from-green-500 to-green-600 text-white border-green-400"
                : "bg-gradient-to-r from-red-500 to-red-600 text-white border-red-400"
            }`}
          >
            <div className="flex-shrink-0">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  toast.type === "success"
                    ? "bg-white bg-opacity-20"
                    : "bg-white bg-opacity-20"
                }`}
              >
                <span className="text-sm">
                  {toast.type === "success" ? "✓" : "✕"}
                </span>
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
