"use client";
import { useState, useEffect } from "react";
import { SecureTokenStorage } from "../../lib/secureTokenStorage";
import adminApiService from "../../src/services/adminApi";

export default function TestSecurePage() {
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [apiTest, setApiTest] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const tokenStorage = new SecureTokenStorage();

  useEffect(() => {
    // Get token info
    const info = tokenStorage.getTokenInfo();
    setTokenInfo(info);
  }, []);

  const testApiCall = async () => {
    setLoading(true);
    try {
      const response = await adminApiService.getAdminStats();
      setApiTest({ success: true, data: response });
    } catch (error) {
      setApiTest({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const clearToken = () => {
    tokenStorage.clearToken();
    setTokenInfo(tokenStorage.getTokenInfo());
    setApiTest(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Secure Token Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Token Info */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Token Storage Info</h2>
            <div className="space-y-2">
              <p><strong>Token Exists:</strong> {tokenInfo?.exists ? 'Yes' : 'No'}</p>
              <p><strong>Fingerprint:</strong> {tokenInfo?.fingerprint || 'None'}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={clearToken}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Clear Token
              </button>
            </div>
          </div>

          {/* API Test */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">API Test</h2>
            <button
              onClick={testApiCall}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Admin API'}
            </button>
            
            {apiTest && (
              <div className="mt-4 p-4 bg-gray-50 rounded">
                <h3 className="font-semibold">Result:</h3>
                <pre className="text-sm mt-2 overflow-auto">
                  {JSON.stringify(apiTest, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* LocalStorage Debug */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">LocalStorage Debug</h2>
          <div className="space-y-2">
            <p><strong>zenow_secure_auth:</strong> {localStorage.getItem('zenow_secure_auth') || 'None'}</p>
            <p><strong>zenow_fingerprint:</strong> {localStorage.getItem('zenow_fingerprint') || 'None'}</p>
          </div>
        </div>

        {/* Cookies Debug */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Cookies Debug</h2>
          <p><strong>document.cookie:</strong> {document.cookie || 'None'}</p>
        </div>
      </div>
    </div>
  );
}
