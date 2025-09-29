'use client';

import React, { useState } from 'react';
import testApiService from '../../../src/services/testApi';

export default function DebugPage() {
  const [results, setResults] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState<string | null>(null);

  const runTest = async (testName: string, testFn: () => Promise<unknown>) => {
    setLoading(testName);
    try {
      const result = await testFn();
      setResults(prev => ({ ...prev, [testName]: result }));
    } catch (error) {
      setResults(prev => ({ ...prev, [testName]: { success: false, error: (error as Error).message } }));
    } finally {
      setLoading(null);
    }
  };

  const testConnection = () => runTest('connection', () => testApiService.testConnection());
  const testPublicCategories = () => runTest('publicCategories', () => testApiService.testPublicCategories());
  const testAdminStats = () => runTest('adminStats', () => testApiService.testAdminStats());

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">API Debug Console</h1>
      
      <div className="space-y-4 mb-8">
        <button
          onClick={testConnection}
          disabled={loading === 'connection'}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading === 'connection' ? 'Testing...' : 'Test Backend Connection'}
        </button>
        
        <button
          onClick={testPublicCategories}
          disabled={loading === 'publicCategories'}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 ml-4"
        >
          {loading === 'publicCategories' ? 'Testing...' : 'Test Public Categories'}
        </button>
        
        <button
          onClick={testAdminStats}
          disabled={loading === 'adminStats'}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 ml-4"
        >
          {loading === 'adminStats' ? 'Testing...' : 'Test Admin Stats (No Auth)'}
        </button>
      </div>

      <div className="space-y-4">
        {Object.entries(results).map(([testName, result]) => {
          const testResult = result as { success: boolean; data?: unknown; error?: string };
          return (
            <div key={testName} className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-lg mb-2 capitalize">{testName}</h3>
              <div className={`p-3 rounded ${testResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <pre>{JSON.stringify(result, null, 2)}</pre>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-gray-100 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">API Base URL:</h3>
        <code>{process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api'}</code>
      </div>
    </div>
  );
}
