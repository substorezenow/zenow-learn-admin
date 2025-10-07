// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon_url?: string;
  banner_image?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Field {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon_url?: string;
  banner_image?: string;
  is_active: boolean;
  sort_order: number;
  category_name: string;
  category_slug: string;
  course_count: number;
  created_at: string;
  updated_at: string;
}

export interface CourseModule {
  id: number;
  course_id: number;
  title: string;
  description: string;
  module_type: string;
  content_url: string;
  duration_minutes: number;
  sort_order: number;
  is_free: boolean;
  created_at: string;
  updated_at: string;
  course_title?: string;
}

export interface Course {
  id: number;
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
  field_id: number | string;
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

export interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  featured_image?: string;
  is_published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
  views: number;
  likes: number;
}

export interface Student {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
  enrolled_courses: number;
  completed_courses: number;
}

export interface AdminStats {
  total_categories: number;
  total_fields: number;
  published_courses: number;
  draft_courses: number;
  total_enrollments: number;
  total_students: number;
  total_admins: number;
}

// Request/Response Types
export interface CreateCategoryRequest {
  name: string;
  slug?: string;
  description: string;
  icon_url?: string;
  banner_image?: string;
  sort_order?: number;
  is_active?: boolean;
}

export type UpdateCategoryRequest = Partial<CreateCategoryRequest>;

export interface CreateFieldRequest {
  name: string;
  slug?: string;
  description: string;
  icon_url?: string;
  banner_image?: string;
  sort_order?: number;
  is_active?: boolean;
  category_id: number;
}

export type UpdateFieldRequest = Partial<CreateFieldRequest>;

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
  field_id: number | string;
  instructor_id?: string;
  prerequisites?: string | null;
  learning_outcomes?: string | null;
  course_modules?: unknown;
  tags?: string | null;
}

export type UpdateCourseRequest = Partial<CreateCourseRequest>;

export interface CreateModuleRequest {
  course_id: number;
  title: string;
  description?: string;
  content_type: 'video' | 'text' | 'quiz' | 'assignment';
  content_url?: string;
  duration_minutes?: number;
  sort_order?: number;
  is_published?: boolean;
}

export type UpdateModuleRequest = Partial<CreateModuleRequest>;
