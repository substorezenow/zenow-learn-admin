// Mock API service for development/testing
import { 
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
  ApiResponse
} from '../types';

class MockApiService {
  // Mock data
  private mockCategories: Category[] = [
    {
      id: 1,
      name: "Web Development",
      slug: "web-development",
      description: "Learn modern web development technologies",
      icon_url: "https://via.placeholder.com/40",
      banner_image: "https://via.placeholder.com/800x200",
      is_active: true,
      sort_order: 1,
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-15T10:30:00Z"
    },
    {
      id: 2,
      name: "Data Science",
      slug: "data-science",
      description: "Master data analysis and machine learning",
      icon_url: "https://via.placeholder.com/40",
      banner_image: "https://via.placeholder.com/800x200",
      is_active: true,
      sort_order: 2,
      created_at: "2024-01-16T10:30:00Z",
      updated_at: "2024-01-16T10:30:00Z"
    }
  ];

  private mockFields: Field[] = [
    {
      id: 1,
      name: "Frontend Development",
      slug: "frontend-development",
      description: "React, Vue, Angular and modern frontend frameworks",
      icon_url: "https://via.placeholder.com/40",
      banner_image: "https://via.placeholder.com/800x200",
      is_active: true,
      sort_order: 1,
      category_name: "Web Development",
      category_slug: "web-development",
      course_count: 5,
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-15T10:30:00Z"
    },
    {
      id: 2,
      name: "Backend Development",
      slug: "backend-development",
      description: "Node.js, Python, Java backend development",
      icon_url: "https://via.placeholder.com/40",
      banner_image: "https://via.placeholder.com/800x200",
      is_active: true,
      sort_order: 2,
      category_name: "Web Development",
      category_slug: "web-development",
      course_count: 3,
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-15T10:30:00Z"
    }
  ];

  private mockCourses: Course[] = [
    {
      id: 1,
      title: "React Fundamentals",
      slug: "react-fundamentals",
      description: "Learn React from scratch with hands-on projects",
      short_description: "Master React basics",
      banner_image: "https://via.placeholder.com/800x200",
      thumbnail_image: "https://via.placeholder.com/300x200",
      duration_hours: 40,
      difficulty_level: "Beginner",
      price: 99.99,
      is_free: false,
      is_published: true,
      field_id: 1,
      field_name: "Frontend Development",
      category_name: "Web Development",
      instructor_id: "1",
      instructor_name: "John Doe",
      enrolled_students: 1250,
      rating: 4.8,
      total_ratings: 156,
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-15T10:30:00Z"
    },
    {
      id: 2,
      title: "Node.js Backend Mastery",
      slug: "nodejs-backend-mastery",
      description: "Build scalable backend APIs with Node.js",
      short_description: "Advanced Node.js development",
      banner_image: "https://via.placeholder.com/800x200",
      thumbnail_image: "https://via.placeholder.com/300x200",
      duration_hours: 60,
      difficulty_level: "Intermediate",
      price: 149.99,
      is_free: false,
      is_published: false,
      field_id: 2,
      field_name: "Backend Development",
      category_name: "Web Development",
      instructor_id: "2",
      instructor_name: "Jane Smith",
      enrolled_students: 0,
      rating: 0,
      total_ratings: 0,
      created_at: "2024-01-16T10:30:00Z",
      updated_at: "2024-01-16T10:30:00Z"
    }
  ];

  private mockStats: AdminStats = {
    total_categories: 2,
    total_fields: 2,
    published_courses: 1,
    draft_courses: 1,
    total_enrollments: 1250,
    total_students: 1250,
    total_admins: 1
  };

  // Simulate API delay
  private delay = (ms: number = 500): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

  // Admin Statistics
  async getAdminStats(): Promise<ApiResponse<AdminStats>> {
    await this.delay();
    return { success: true, data: this.mockStats };
  }

  // Categories
  async getCategoriesAdmin(): Promise<ApiResponse<Category[]>> {
    await this.delay();
    return { success: true, data: this.mockCategories };
  }

  async createCategory(categoryData: CreateCategoryRequest): Promise<ApiResponse<Category>> {
    await this.delay();
    const newCategory: Category = {
      id: this.mockCategories.length + 1,
      name: categoryData.name,
      slug: categoryData.slug || categoryData.name.toLowerCase().replace(/\s+/g, '-'),
      description: categoryData.description,
      icon_url: categoryData.icon_url,
      banner_image: categoryData.banner_image,
      is_active: categoryData.is_active !== false,
      sort_order: categoryData.sort_order || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.mockCategories.push(newCategory);
    return { success: true, data: newCategory };
  }

  async updateCategory(id: number, categoryData: UpdateCategoryRequest): Promise<ApiResponse<Category>> {
    await this.delay();
    const index = this.mockCategories.findIndex(c => c.id === id);
    if (index === -1) {
      return { success: false, error: 'Category not found' };
    }
    this.mockCategories[index] = { 
      ...this.mockCategories[index], 
      ...categoryData, 
      updated_at: new Date().toISOString() 
    };
    return { success: true, data: this.mockCategories[index] };
  }

  async deleteCategory(id: number): Promise<ApiResponse<Category>> {
    await this.delay();
    const index = this.mockCategories.findIndex(c => c.id === id);
    if (index === -1) {
      return { success: false, error: 'Category not found' };
    }
    this.mockCategories[index].is_active = false;
    return { success: true, data: this.mockCategories[index] };
  }

  // Fields
  async getFieldsAdmin(): Promise<ApiResponse<Field[]>> {
    await this.delay();
    return { success: true, data: this.mockFields };
  }

  async createField(fieldData: CreateFieldRequest): Promise<ApiResponse<Field>> {
    await this.delay();
    const newField: Field = {
      id: this.mockFields.length + 1,
      name: fieldData.name,
      slug: fieldData.slug || fieldData.name.toLowerCase().replace(/\s+/g, '-'),
      description: fieldData.description,
      icon_url: fieldData.icon_url,
      banner_image: fieldData.banner_image,
      is_active: fieldData.is_active !== false,
      sort_order: fieldData.sort_order || 0,
      category_name: "Mock Category",
      category_slug: "mock-category",
      course_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.mockFields.push(newField);
    return { success: true, data: newField };
  }

  async updateField(id: number, fieldData: UpdateFieldRequest): Promise<ApiResponse<Field>> {
    await this.delay();
    const index = this.mockFields.findIndex(f => f.id === id);
    if (index === -1) {
      return { success: false, error: 'Field not found' };
    }
    this.mockFields[index] = { 
      ...this.mockFields[index], 
      ...fieldData, 
      updated_at: new Date().toISOString() 
    };
    return { success: true, data: this.mockFields[index] };
  }

  async deleteField(id: number): Promise<ApiResponse<Field>> {
    await this.delay();
    const index = this.mockFields.findIndex(f => f.id === id);
    if (index === -1) {
      return { success: false, error: 'Field not found' };
    }
    this.mockFields[index].is_active = false;
    return { success: true, data: this.mockFields[index] };
  }

  // Courses
  async getCoursesAdmin(): Promise<ApiResponse<Course[]>> {
    await this.delay();
    return { success: true, data: this.mockCourses };
  }

  async createCourse(courseData: CreateCourseRequest): Promise<ApiResponse<Course>> {
    await this.delay();
    const newCourse: Course = {
      id: this.mockCourses.length + 1,
      title: courseData.title,
      slug: courseData.slug || courseData.title.toLowerCase().replace(/\s+/g, '-'),
      description: courseData.description,
      short_description: courseData.short_description || undefined,
      banner_image: courseData.banner_image || undefined,
      thumbnail_image: courseData.thumbnail_image || undefined,
      duration_hours: courseData.duration_hours,
      difficulty_level: courseData.difficulty_level,
      price: courseData.price,
      is_free: courseData.is_free,
      is_published: courseData.is_published || false,
      field_id: courseData.field_id,
      instructor_id: courseData.instructor_id,
      enrolled_students: 0,
      rating: 0,
      total_ratings: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.mockCourses.push(newCourse);
    return { success: true, data: newCourse };
  }

  async updateCourse(id: number, courseData: UpdateCourseRequest): Promise<ApiResponse<Course>> {
    await this.delay();
    const index = this.mockCourses.findIndex(c => c.id === id);
    if (index === -1) {
      return { success: false, error: 'Course not found' };
    }
    // Filter out null values and convert them to undefined
    const filteredCourseData = Object.fromEntries(
      Object.entries(courseData).map(([key, value]) => [
        key, 
        value === null ? undefined : value
      ])
    );
    
    this.mockCourses[index] = { 
      ...this.mockCourses[index], 
      ...filteredCourseData,
      course_modules: courseData.course_modules as CourseModule[] | undefined,
      updated_at: new Date().toISOString() 
    };
    return { success: true, data: this.mockCourses[index] };
  }

  async deleteCourse(id: number): Promise<ApiResponse<Course>> {
    await this.delay();
    const index = this.mockCourses.findIndex(c => c.id === id);
    if (index === -1) {
      return { success: false, error: 'Course not found' };
    }
    this.mockCourses[index].is_published = false;
    return { success: true, data: this.mockCourses[index] };
  }
}

const mockApiService = new MockApiService();
export default mockApiService;
