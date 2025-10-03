"use client";

import { useState, useEffect } from "react";
import { Shield, AlertTriangle, Users, Eye, Lock, Activity } from "lucide-react";

interface SecurityEvent {
  event_type: string;
  severity: string;
  ip_address: string;
  created_at: string;
}

interface BlockedIP {
  ip_address: string;
  reason: string;
  blocked_at: string;
  expires_at: string;
}

interface SuspiciousActivity {
  ip_address: string;
  event_count: number;
  event_types: string[];
}

interface SecurityDashboard {
  recentEvents: SecurityEvent[];
  blockedIPs: BlockedIP[];
  suspiciousActivities: SuspiciousActivity[];
  topEventTypes: Array<{ event_type: string; count: number; severity: string }>;
  summary: {
    totalEvents24h: number;
    blockedIPsCount: number;
    suspiciousIPsCount: number;
  };
}

export default function SecurityDashboard() {
  const [dashboardData, setDashboardData] = useState<SecurityDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const fetchSecurityData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/security-dashboard', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch security data');
      }

      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Security data fetch error:', error);
      setError('Failed to load security dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'text-red-600 bg-red-50';
      case 'HIGH': return 'text-orange-600 bg-orange-50';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50';
      case 'LOW': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
              <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-red-800">Security Dashboard Error</h3>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-6">
          <Shield className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Security Dashboard</h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Activity className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Events (24h)</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData?.summary.totalEvents24h || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Lock className="w-8 h-8 text-red-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Blocked IPs</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData?.summary.blockedIPsCount || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-orange-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Suspicious IPs</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData?.summary.suspiciousIPsCount || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Eye className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Security Level</p>
                <p className="text-2xl font-bold text-green-600">10/10</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Security Events */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Recent Security Events</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {dashboardData?.recentEvents.slice(0, 10).map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(event.severity)}`}>
                          {event.severity}
                        </span>
                        <span className="ml-2 text-sm font-medium text-gray-900">{event.event_type}</span>
                      </div>
                      <p className="text-sm text-gray-500">{event.ip_address}</p>
                    </div>
                    <div className="text-sm text-gray-400">
                      {formatTimestamp(event.created_at)}
                    </div>
                  </div>
                ))}
                {(!dashboardData?.recentEvents || dashboardData.recentEvents.length === 0) && (
                  <p className="text-gray-500 text-center py-8">No recent security events</p>
                )}
              </div>
            </div>
          </div>

          {/* Blocked IPs */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Blocked IP Addresses</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {dashboardData?.blockedIPs.slice(0, 10).map((ip, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{ip.ip_address}</p>
                      <p className="text-sm text-gray-600">{ip.reason}</p>
                    </div>
                    <div className="text-sm text-gray-400">
                      {formatTimestamp(ip.blocked_at)}
                    </div>
                  </div>
                ))}
                {(!dashboardData?.blockedIPs || dashboardData.blockedIPs.length === 0) && (
                  <p className="text-gray-500 text-center py-8">No blocked IP addresses</p>
                )}
              </div>
            </div>
          </div>

          {/* Suspicious Activities */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Suspicious Activities</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {dashboardData?.suspiciousActivities.slice(0, 10).map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.ip_address}</p>
                      <p className="text-sm text-gray-600">{activity.event_count} events</p>
                      <p className="text-xs text-gray-500">{activity.event_types.join(', ')}</p>
                    </div>
                    <div className="text-sm font-medium text-orange-600">
                      {activity.event_count}
                    </div>
                  </div>
                ))}
                {(!dashboardData?.suspiciousActivities || dashboardData.suspiciousActivities.length === 0) && (
                  <p className="text-gray-500 text-center py-8">No suspicious activities detected</p>
                )}
              </div>
            </div>
          </div>

          {/* Top Event Types */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Top Event Types</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {dashboardData?.topEventTypes.slice(0, 10).map((eventType, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(eventType.severity)}`}>
                          {eventType.severity}
                        </span>
                        <span className="ml-2 text-sm font-medium text-gray-900">{eventType.event_type}</span>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-600">
                      {eventType.count}
                    </div>
                  </div>
                ))}
                {(!dashboardData?.topEventTypes || dashboardData.topEventTypes.length === 0) && (
                  <p className="text-gray-500 text-center py-8">No event data available</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="mt-8 text-center">
          <button
            onClick={fetchSecurityData}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
}
