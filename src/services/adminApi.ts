// Admin API Service for Zenow Academy Admin Dashboard
import { 
  ApiResponse, 
  AdminStats, 
  Category, 
  Field, 
  Course, 
  CreateCategoryRequest, 
  UpdateCategoryRequest,
  CreateFieldRequest,
  UpdateFieldRequest,
  CreateCourseRequest,
  UpdateCourseRequest,
  CreateModuleRequest,
  UpdateModuleRequest
} from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string | FormData;
}

class AdminApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request<T = unknown>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Get token from cookies (Next.js way)
    const token = this.getTokenFromCookies();
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Admin API request failed:', error);
      // Return error response instead of falling back to mock data
      throw error;
    }
  }


  private getTokenFromCookies(): string | null {
    // In Next.js, we'll get the token from cookies
    // This will be handled by the server-side API routes
    if (typeof window !== 'undefined') {
      return document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1] || null;
    }
    return null;
  }

  // ==================== ADMIN STATISTICS ====================
  async getAdminStats(): Promise<ApiResponse<AdminStats>> {
    return this.request<AdminStats>('/admin/stats');
  }

  // ==================== CATEGORIES ADMIN CRUD ====================
  async getCategoriesAdmin(): Promise<ApiResponse<Category[]>> {
    return this.request<Category[]>('/admin/categories');
  }

  async createCategory(categoryData: CreateCategoryRequest): Promise<ApiResponse<Category>> {
    return this.request<Category>('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(id: number, categoryData: UpdateCategoryRequest): Promise<ApiResponse<Category>> {
    return this.request<Category>(`/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(id: number): Promise<ApiResponse<Category>> {
    return this.request<Category>(`/admin/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== FIELDS ADMIN CRUD ====================
  async getFieldsAdmin(): Promise<ApiResponse<Field[]>> {
    return this.request<Field[]>('/admin/fields');
  }

  async createField(fieldData: CreateFieldRequest): Promise<ApiResponse<Field>> {
    return this.request<Field>('/admin/fields', {
      method: 'POST',
      body: JSON.stringify(fieldData),
    });
  }

  async updateField(id: number, fieldData: UpdateFieldRequest): Promise<ApiResponse<Field>> {
    return this.request<Field>(`/admin/fields/${id}`, {
      method: 'PUT',
      body: JSON.stringify(fieldData),
    });
  }

  async deleteField(id: number): Promise<ApiResponse<Field>> {
    return this.request<Field>(`/admin/fields/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== COURSES ADMIN CRUD ====================
  async getCoursesAdmin(): Promise<ApiResponse<Course[]>> {
    return this.request<Course[]>('/admin/courses');
  }

  async createCourse(courseData: CreateCourseRequest): Promise<ApiResponse<Course>> {
    return this.request<Course>('/admin/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  }

  async updateCourse(id: number, courseData: UpdateCourseRequest): Promise<ApiResponse<Course>> {
    return this.request<Course>(`/admin/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    });
  }

  async deleteCourse(id: number): Promise<ApiResponse<Course>> {
    return this.request<Course>(`/admin/courses/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== COURSE MODULES ADMIN CRUD ====================
  async createCourseModule(courseId: number, moduleData: CreateModuleRequest): Promise<ApiResponse<unknown>> {
    return this.request(`/admin/courses/${courseId}/modules`, {
      method: 'POST',
      body: JSON.stringify(moduleData),
    });
  }

  async updateCourseModule(moduleId: number, moduleData: UpdateModuleRequest): Promise<ApiResponse<unknown>> {
    return this.request(`/admin/modules/${moduleId}`, {
      method: 'PUT',
      body: JSON.stringify(moduleData),
    });
  }

  async deleteCourseModule(moduleId: number): Promise<ApiResponse<unknown>> {
    return this.request(`/admin/modules/${moduleId}`, {
      method: 'DELETE',
    });
  }

  // ==================== HELPER METHODS ====================
  
  // Get all categories for dropdowns
  async getCategoriesForDropdown(): Promise<Array<{ value: number; label: string; slug: string }>> {
    const response = await this.getCategoriesAdmin();
    if (response.success && response.data) {
      return response.data.map(category => ({
        value: category.id,
        label: category.name,
        slug: category.slug
      }));
    }
    return [];
  }

  // Get all fields for dropdowns
  async getFieldsForDropdown(): Promise<Array<{ value: number; label: string; slug: string; category_id: number }>> {
    const response = await this.getFieldsAdmin();
    if (response.success && response.data) {
      return response.data.map(field => ({
        value: field.id,
        label: field.name,
        slug: field.slug,
        category_id: field.id
      }));
    }
    return [];
  }

  // Get fields by category for dropdowns
  async getFieldsByCategoryForDropdown(categoryId: number): Promise<Array<{ value: number; label: string; slug: string }>> {
    const response = await this.getFieldsAdmin();
    if (response.success && response.data) {
      return response.data
        .filter(field => field.id === categoryId)
        .map(field => ({
          value: field.id,
          label: field.name,
          slug: field.slug
        }));
    }
    return [];
  }

  // Upload file (placeholder for future implementation)
  async uploadFile(file: File, type: string = 'image'): Promise<ApiResponse<unknown>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return this.request('/admin/upload', {
      method: 'POST',
      headers: {
        // Don't set Content-Type, let browser set it with boundary
      },
      body: formData,
    });
  }
}

// Create and export a singleton instance
const adminApiService = new AdminApiService();
export default adminApiService;
