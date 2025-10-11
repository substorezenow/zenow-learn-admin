import { secureApiWrapper } from "../../lib/secureApiWrapper";
import type {
  ApiResponse,
  Category,
  Field,
  Course,
  CourseModule,
  AdminStats,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CreateFieldRequest,
  UpdateFieldRequest,
  CreateCourseRequest,
  UpdateCourseRequest,
  CreateModuleRequest,
  UpdateModuleRequest
} from '../types';

// Request options interface (only interface needed in this file)
interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: string | FormData;
}

class AdminApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = "/api";
  }

  async request<T = unknown>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };
    
    return secureApiWrapper.secureRequest<ApiResponse<T>>(url, config);
  }

  // Auth methods
  async login(username: string, password: string, fingerprint: string): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("fingerprint", fingerprint);
    
    return secureApiWrapper.secureRequest("/api/auth/secure-login", {
      method: "POST",
      body: formData,
    });
  }

  async logout(): Promise<void> {
    await this.request("/auth/logout", { method: "POST" });
  }

  // Admin methods
  async getAdminStats(): Promise<ApiResponse<AdminStats>> {
    return this.request("/admin/stats");
  }

  async getCategories(): Promise<ApiResponse> {
    return this.request("/admin/categories");
  }

  async getCategoriesAdmin(): Promise<ApiResponse<Category[]>> {
    return this.request<Category[]>("/admin/categories");
  }

  async createCategory(data: CreateCategoryRequest): Promise<ApiResponse<Category>> {
    return this.request<Category>("/admin/categories", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateCategory(id: string | number, data: UpdateCategoryRequest): Promise<ApiResponse<Category>> {
    // Keep ID as string to preserve precision for large integers
    const stringId = String(id);
    if (!stringId || stringId === 'NaN') {
      throw new Error('Invalid category ID');
    }
    
    return this.request(`/admin/categories/${stringId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id: string | number): Promise<ApiResponse> {
    // Keep ID as string to preserve precision for large integers
    const stringId = String(id);
    if (!stringId || stringId === 'NaN') {
      throw new Error('Invalid category ID');
    }
    
    return this.request(`/admin/categories/${stringId}`, {
      method: "DELETE",
    });
  }

  // Fields methods
  async getFields(): Promise<ApiResponse> {
    return this.request("/admin/fields");
  }

  async getFieldsAdmin(): Promise<ApiResponse<Field[]>> {
    return this.request("/admin/fields");
  }

  async createField(data: CreateFieldRequest): Promise<ApiResponse<Field>> {
    return this.request("/admin/fields", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateField(id: string | number, data: UpdateFieldRequest): Promise<ApiResponse<Field>> {
    // Keep ID as string to preserve precision for large integers
    const stringId = String(id);
    if (!stringId || stringId === 'NaN') {
      throw new Error('Invalid field ID');
    }
    
    return this.request(`/admin/fields/${stringId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteField(id: string | number): Promise<ApiResponse> {
    // Keep ID as string to preserve precision for large integers
    const stringId = String(id);
    if (!stringId || stringId === 'NaN') {
      throw new Error('Invalid field ID');
    }
    
    return this.request(`/admin/fields/${stringId}`, {
      method: "DELETE",
    });
  }

  // Courses methods
  async getCourses(): Promise<ApiResponse> {
    return this.request("/admin/courses");
  }

  async getCoursesAdmin(): Promise<ApiResponse<Course[]>> {
    return this.request("/admin/courses");
  }

  async createCourse(data: CreateCourseRequest): Promise<ApiResponse<Course>> {
    return this.request("/admin/courses", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateCourse(id: string | number, data: UpdateCourseRequest): Promise<ApiResponse<Course>> {
    // Keep ID as string to preserve precision for large integers
    const stringId = String(id);
    if (!stringId || stringId === 'NaN') {
      throw new Error('Invalid course ID');
    }
    
    return this.request(`/admin/courses/${stringId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteCourse(id: string | number): Promise<ApiResponse> {
    // Keep ID as string to preserve precision for large integers
    const stringId = String(id);
    if (!stringId || stringId === 'NaN') {
      throw new Error('Invalid course ID');
    }
    
    return this.request(`/admin/courses/${stringId}`, {
      method: "DELETE",
    });
  }

  // Security dashboard
  async getSecurityDashboard(): Promise<ApiResponse> {
    return this.request("/admin/security-dashboard");
  }

  // Migration management
  async getMigrationStatus(): Promise<ApiResponse> {
    return this.request("/admin/migrations");
  }

  async runMigrations(): Promise<ApiResponse> {
    return this.request("/admin/migrations", {
      method: "POST",
    });
  }

  async rollbackMigration(): Promise<ApiResponse> {
    return this.request("/admin/migrations/rollback", {
      method: "POST",
    });
  }

  // File upload
  async uploadFile(file: File): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.request("/admin/upload", {
      method: "POST",
      body: formData,
    });
  }

  // Course modules
  async getCourseModules(courseId: string): Promise<ApiResponse<CourseModule[]>> {
    // Keep ID as string to preserve precision for large integers
    const stringId = String(courseId);
    if (!stringId || stringId === 'NaN') {
      throw new Error('Invalid course ID');
    }
    
    return this.request<CourseModule[]>(`/admin/course-modules?courseId=${stringId}`);
  }

  async createCourseModule(courseId: string, data: CreateModuleRequest): Promise<ApiResponse<CourseModule>> {
    // Keep ID as string to preserve precision for large integers
    const stringId = String(courseId);
    if (!stringId || stringId === 'NaN') {
      throw new Error('Invalid course ID');
    }
    
    return this.request<CourseModule>(`/admin/course-modules?courseId=${stringId}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateModule(moduleId: string | number, data: UpdateModuleRequest): Promise<ApiResponse> {
    // Keep ID as string to preserve precision for large integers
    const stringId = String(moduleId);
    if (!stringId || stringId === 'NaN') {
      throw new Error('Invalid module ID');
    }
    
    return this.request(`/admin/modules/${stringId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteModule(moduleId: string | number): Promise<ApiResponse> {
    // Keep ID as string to preserve precision for large integers
    const stringId = String(moduleId);
    if (!stringId || stringId === 'NaN') {
      throw new Error('Invalid module ID');
    }
    
    return this.request(`/admin/modules/${stringId}`, {
      method: "DELETE",
    });
  }

  // Alias for deleteModule (used by modules page)
  async deleteCourseModule(moduleId: string | number): Promise<ApiResponse> {
    return this.deleteModule(moduleId);
  }

  public clearSession(): void {
    fetch('/api/auth/logout', { method: 'POST' });
  }
}

const adminApiService = new AdminApiService();
export default adminApiService;