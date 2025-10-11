class SecureApiWrapper {
  async secureRequest<T = unknown>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Make the actual request with credentials
    const response = await fetch(endpoint, {
      ...options,
      credentials: 'include', // Include httpOnly cookies
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid, redirect to login
        window.location.href = '/login';
        throw new Error('Session expired');
      }
      if (response.status === 403) {
        // Access denied, redirect to login
        window.location.href = '/login';
        throw new Error('Access denied');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

export const secureApiWrapper = new SecureApiWrapper();
