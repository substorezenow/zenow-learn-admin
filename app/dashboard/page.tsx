'use client';

import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  FolderOpen, 
  Layers, 
  Users, 
  TrendingUp,  
  Clock, 
  Plus,
  ArrowUpRight,
  Activity,
  Target,
  Zap,
  BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import adminApiService from '../../src/services/adminApi';
import { AdminStats } from '../../src/types';

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApiService.getAdminStats();
      if (response.success && response.data) {
        setStats(response.data);
      } else {
        setError('Failed to fetch statistics');
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Error loading dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Categories',
      value: stats?.total_categories || 0,
      icon: <FolderOpen className="w-6 h-6" />,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Total Fields',
      value: stats?.total_fields || 0,
      icon: <Layers className="w-6 h-6" />,
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-50 to-emerald-100',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Published Courses',
      value: stats?.published_courses || 0,
      icon: <BookOpen className="w-6 h-6" />,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      change: '+15%',
      changeType: 'positive'
    },
    {
      title: 'Draft Courses',
      value: stats?.draft_courses || 0,
      icon: <Clock className="w-6 h-6" />,
      gradient: 'from-amber-500 to-amber-600',
      bgGradient: 'from-amber-50 to-amber-100',
      change: '+3%',
      changeType: 'positive'
    },
    {
      title: 'Total Students',
      value: stats?.total_students || 0,
      icon: <Users className="w-6 h-6" />,
      gradient: 'from-indigo-500 to-indigo-600',
      bgGradient: 'from-indigo-50 to-indigo-100',
      change: '+22%',
      changeType: 'positive'
    },
    {
      title: 'Total Enrollments',
      value: stats?.total_enrollments || 0,
      icon: <TrendingUp className="w-6 h-6" />,
      gradient: 'from-rose-500 to-rose-600',
      bgGradient: 'from-rose-50 to-rose-100',
      change: '+18%',
      changeType: 'positive'
    }
  ];

  const quickActions = [
    {
      title: 'Create Course',
      description: 'Add a new course to your academy',
      icon: <Plus className="w-5 h-5" />,
      href: '/dashboard/courses',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100'
    },
    {
      title: 'Manage Categories',
      description: 'Organize your course categories',
      icon: <FolderOpen className="w-5 h-5" />,
      href: '/dashboard/categories',
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-50 to-emerald-100'
    },
    {
      title: 'View Students',
      description: 'Monitor student progress',
      icon: <Users className="w-5 h-5" />,
      href: '/dashboard/students',
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100'
    },
    {
      title: 'Analytics',
      description: 'View detailed analytics',
      icon: <BarChart3 className="w-5 h-5" />,
      href: '/dashboard/analytics',
      gradient: 'from-amber-500 to-amber-600',
      bgGradient: 'from-amber-50 to-amber-100'
    }
  ];

  const recentActivities = [
    {
      title: 'New Course Published',
      description: 'Advanced React Patterns course is now live',
      time: '2 hours ago',
      icon: <BookOpen className="w-5 h-5 text-blue-600" />,
      type: 'course'
    },
    {
      title: 'Student Enrollment',
      description: '25 new students enrolled this week',
      time: '4 hours ago',
      icon: <Users className="w-5 h-5 text-emerald-600" />,
      type: 'enrollment'
    },
    {
      title: 'Category Updated',
      description: 'Web Development category restructured',
      time: '6 hours ago',
      icon: <FolderOpen className="w-5 h-5 text-purple-600" />,
      type: 'category'
    },
    {
      title: 'System Maintenance',
      description: 'Scheduled maintenance completed',
      time: '1 day ago',
      icon: <Zap className="w-5 h-5 text-amber-600" />,
      type: 'system'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
          <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-purple-400 animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="text-red-500 text-2xl">⚠️</div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Dashboard</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={fetchStats}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-2xl p-8 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Welcome back! 👋</h2>
              <p className="text-blue-100 text-lg">Here&apos;s what&apos;s happening with your academy today.</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats?.total_courses || 0}</div>
                <div className="text-sm text-blue-200">Total Courses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats?.total_students || 0}</div>
                <div className="text-sm text-blue-200">Active Students</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-purple-300/20 rounded-full blur-lg"></div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gradient-to-br ${card.bgGradient} rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-gradient-to-r ${card.gradient} rounded-xl text-white shadow-lg`}>
                {card.icon}
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">{card.change}</div>
                <div className="text-xs text-green-600">vs last month</div>
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{card.value}</div>
              <div className="text-gray-600 font-medium">{card.title}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
          <div className="flex items-center text-sm text-gray-500">
            <Zap className="w-4 h-4 mr-1" />
            Fast access to common tasks
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className={`group bg-gradient-to-br ${action.bgGradient} rounded-xl p-6 border border-white/50 hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 bg-gradient-to-r ${action.gradient} rounded-lg text-white`}>
                  {action.icon}
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 mb-1">{action.title}</div>
                <div className="text-sm text-gray-600">{action.description}</div>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity & System Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
            <div className="flex items-center text-sm text-gray-500">
              <Activity className="w-4 h-4 mr-1" />
              Live updates
            </div>
          </div>
          
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="p-2 bg-gray-100 rounded-lg">
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">{activity.title}</div>
                  <div className="text-sm text-gray-600">{activity.description}</div>
                  <div className="text-xs text-gray-500 mt-1">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* System Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">System Overview</h3>
            <div className="flex items-center text-sm text-gray-500">
              <Target className="w-4 h-4 mr-1" />
              Performance metrics
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
              <div className="flex items-center">
                <div className="p-2 bg-blue-500 rounded-lg text-white mr-3">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Course Management</div>
                  <div className="text-sm text-gray-600">
                    {stats?.published_courses} published, {stats?.draft_courses} drafts
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">
                  {(stats?.published_courses || 0) + (stats?.draft_courses || 0)}
                </div>
                <div className="text-xs text-gray-500">total courses</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl">
              <div className="flex items-center">
                <div className="p-2 bg-emerald-500 rounded-lg text-white mr-3">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Student Engagement</div>
                  <div className="text-sm text-gray-600">
                    {stats?.total_students} students, {stats?.total_enrollments} enrollments
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-emerald-600">{stats?.total_enrollments}</div>
                <div className="text-xs text-gray-500">total enrollments</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
              <div className="flex items-center">
                <div className="p-2 bg-purple-500 rounded-lg text-white mr-3">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Content Organization</div>
                  <div className="text-sm text-gray-600">
                    {stats?.total_categories} categories, {stats?.total_fields} fields
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-purple-600">{stats?.total_categories}</div>
                <div className="text-xs text-gray-500">categories</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}