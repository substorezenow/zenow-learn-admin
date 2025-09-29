// Test API service to check backend connectivity
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

interface TestResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

class TestApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async testConnection(): Promise<TestResult> {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        return { success: false, error: `HTTP ${response.status}` };
      }
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  async testPublicCategories(): Promise<TestResult> {
    try {
      const response = await fetch(`${this.baseURL}/courses/categories`);
      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        return { success: false, error: `HTTP ${response.status}` };
      }
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  async testAdminStats(): Promise<TestResult> {
    try {
      const response = await fetch(`${this.baseURL}/admin/stats`);
      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        return { success: false, error: `HTTP ${response.status}` };
      }
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }
}

const testApiService = new TestApiService();
export default testApiService;
