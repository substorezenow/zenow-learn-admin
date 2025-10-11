/**
 * Centralized API request/response types
 * 
 * This file contains ALL API-related type definitions to prevent duplication
 * and ensure consistency across the application.
 */

import { ID, FormID, FlexibleID } from './common';

// ============================================================================
// BASE API TYPES
// ============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ============================================================================
// ENTITY TYPES
// ============================================================================

export interface Category {
  id: ID;
  name: string;
  slug: string;
  description?: string;
  icon_url?: string;
  banner_image?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Field {
  id: ID;
  name: string;
  slug: string;
  description?: string;
  icon_url?: string;
  banner_image?: string;
  sort_order: number;
  is_active: boolean;
  category_id: number; // Database field - keep as number for foreign key
  created_at: string;
  updated_at: string;
  category_name?: string; // Additional field for UI
  category_slug?: string; // Additional field for UI
  course_count?: number; // Additional field for UI
}

export interface Course {
  id: ID;
  title: string;
  slug: string;
  description: string;
  short_description?: string;
  banner_image?: string;
  thumbnail_image?: string;
  duration_hours?: number;
  difficulty_level?: string;
  price: number;
  is_free: boolean;
  is_published: boolean;
  field_id: number; // Database field - keep as number for foreign key
  instructor_id?: string;
  prerequisites?: string;
  learning_outcomes?: string;
  course_modules?: CourseModule[];
  tags?: string;
  rating?: number;
  total_ratings?: number;
  enrolled_students?: number;
  created_at: string;
  updated_at: string;
  field_name?: string;
  field_slug?: string;
  category_name?: string;
  category_slug?: string;
  instructor_name?: string;
  instructor_email?: string;
}

export interface CourseModule {
  id: ID;
  course_id: number; // Database field - keep as number for foreign key
  title: string;
  description?: string;
  content_type: 'video' | 'text' | 'quiz' | 'assignment';
  content_url?: string;
  duration_minutes?: number;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  course_title?: string;
  module_type?: string; // Additional field for UI
  is_free?: boolean; // Additional field for UI
}

export interface Blog {
  id: ID;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  author_id: string;
  author?: string; // Additional field for UI
  status: 'draft' | 'published' | 'archived';
  is_published?: boolean; // Additional field for UI compatibility
  published_at?: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
  category?: string;
  read_time?: number;
  views?: number;
  likes?: number; // Additional field for UI
}

export interface Student {
  id: ID;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  is_active: boolean;
  enrolled_courses?: number;
  completed_courses?: number;
  created_at: string;
  updated_at: string;
  last_login?: string;
  role?: string; // Additional field for UI
}

export interface AdminStats {
  total_categories: number;
  total_fields: number;
  total_courses: number;
  total_modules: number;
  total_students: number;
  total_blogs: number;
  active_courses: number;
  published_courses: number;
  draft_courses?: number; // Additional field for UI compatibility
  enrolled_students: number;
  total_enrollments?: number; // Additional field for UI compatibility
  recent_activity: Array<{
    type: string;
    description: string;
    timestamp: string;
  }>;
}

// ============================================================================
// CREATE REQUEST TYPES (Accept flexible IDs for form compatibility)
// ============================================================================

export interface CreateCategoryRequest {
  name: string;
  slug?: string;
  description: string; // Required for forms
  icon_url?: string;
  banner_image?: string;
  sort_order?: number;
  is_active?: boolean;
}

export interface CreateFieldRequest {
  name: string;
  slug?: string;
  description: string;
  icon_url?: string;
  banner_image?: string;
  sort_order?: number;
  is_active?: boolean;
  category_id: FlexibleID; // Accept both string and number for form compatibility
}

export interface CreateCourseRequest {
  title: string;
  slug?: string;
  description: string;
  short_description?: string | null;
  banner_image?: string | null;
  thumbnail_image?: string | null;
  duration_hours: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  is_free: boolean;
  is_published?: boolean;
  field_id: FlexibleID; // Accept both string and number for form compatibility
  instructor_id?: string;
  prerequisites?: string | null;
  learning_outcomes?: string | null;
  course_modules?: unknown;
  tags?: string | null;
}

export interface CreateModuleRequest {
  course_id: FlexibleID; // Accept both string and number for form compatibility
  title: string;
  description?: string;
  content_type: 'video' | 'text' | 'quiz' | 'assignment';
  content_url?: string;
  duration_minutes?: number;
  sort_order?: number;
  is_published?: boolean;
}

// ============================================================================
// UPDATE REQUEST TYPES (All fields optional)
// ============================================================================

export type UpdateCategoryRequest = {
  name?: string;
  slug?: string;
  description?: string;
  icon_url?: string;
  banner_image?: string;
  sort_order?: number;
  is_active?: boolean;
};

export type UpdateFieldRequest = {
  name?: string;
  slug?: string;
  description?: string;
  icon_url?: string;
  banner_image?: string;
  sort_order?: number;
  is_active?: boolean;
  category_id?: FlexibleID; // Accept both string and number for form compatibility
};

export type UpdateCourseRequest = {
  title?: string;
  slug?: string;
  description?: string;
  short_description?: string | null;
  banner_image?: string | null;
  thumbnail_image?: string | null;
  duration_hours?: number;
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
  price?: number;
  is_free?: boolean;
  is_published?: boolean;
  field_id?: FlexibleID; // Accept both string and number for form compatibility
  instructor_id?: string;
  prerequisites?: string | null;
  learning_outcomes?: string | null;
  course_modules?: unknown;
  tags?: string | null;
};

export type UpdateModuleRequest = {
  course_id?: FlexibleID; // Accept both string and number for form compatibility
  title?: string;
  description?: string;
  content_type?: 'video' | 'text' | 'quiz' | 'assignment';
  content_url?: string;
  duration_minutes?: number;
  sort_order?: number;
  is_published?: boolean;
};

// ============================================================================
// FORM DATA TYPES (For useFormValidation hook)
// ============================================================================

export interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  icon_url: string;
  banner_image: string;
  sort_order: number;
  is_active: boolean;
}

export interface FieldFormData {
  name: string;
  slug: string;
  description: string;
  icon_url: string;
  banner_image: string;
  sort_order: number;
  is_active: boolean;
  category_id: FormID; // Can be string or number from form
}

export interface CourseFormData {
  title: string;
  slug: string;
  description: string;
  short_description: string;
  banner_image: string;
  thumbnail_image: string;
  duration_hours: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  is_free: boolean;
  is_published: boolean;
  field_id: FormID; // Can be string or number from form
  instructor_id: string;
  prerequisites: string;
  learning_outcomes: string;
  tags: string;
}

export interface ModuleFormData {
  course_id: FormID; // Can be string or number from form
  title: string;
  description: string;
  content_type: 'video' | 'text' | 'quiz' | 'assignment';
  content_url: string;
  duration_minutes: number;
  sort_order: number;
  is_published: boolean;
}
