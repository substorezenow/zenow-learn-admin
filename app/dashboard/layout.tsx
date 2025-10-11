"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { 
  Menu, 
  X, 
  LogOut, 
  Bell, 
  Search, 
  Settings, 
  User, 
  ChevronDown,
  Sparkles,
  Home,
  Shield,
  BarChart3
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { adminSidebarRoutes } from "./sidebarRoutes";
import adminApiService from "../../src/services/adminApi";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      adminApiService.clearSession();
      router.replace("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
              onClick={toggleSidebar}
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Zenow Academy</h1>
                <p className="text-sm text-gray-500">Admin Dashboard</p>
              </div>
            </div>
          </div>

          {/* Center - Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses, users, or settings..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2"
                  >
                    <Link href="/dashboard/profile" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50">
                      <User className="w-4 h-4 text-gray-600" />
                      <span>Profile</span>
                    </Link>
                    <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50">
                      <Settings className="w-4 h-4 text-gray-600" />
                      <span>Settings</span>
                    </Link>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <AnimatePresence>
          {(sidebarOpen || isDesktop) && (
            <motion.aside
              initial={{ x: -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed lg:static z-30 top-0 left-0 h-full w-72 bg-white border-r border-gray-200 shadow-xl lg:shadow-none flex flex-col"
            >
              {/* Sidebar Header */}
              <div className="p-6 border-b border-gray-200/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
                  <button
                    className="lg:hidden p-1 rounded-lg hover:bg-gray-100"
                    onClick={toggleSidebar}
                    aria-label="Close sidebar"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {/* Dashboard Overview */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-500 uppercase tracking-wider">
                    <Home className="w-4 h-4" />
                    Overview
                  </div>
                  <Link
                    href="/dashboard"
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all ${
                      pathname === "/dashboard"
                        ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200 shadow-sm"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <BarChart3 className="w-5 h-5" />
                    <span>Dashboard</span>
                  </Link>
                </div>

                {/* Main Navigation */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-500 uppercase tracking-wider">
                    <Settings className="w-4 h-4" />
                    Management
                  </div>
                  <div className="space-y-1">
                    {adminSidebarRoutes
                      .filter(route => route.route !== "/dashboard")
                      .map((item) => (
                        <Link
                          key={item.route}
                          href={item.route}
                          className={`flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all group ${
                            pathname === item.route
                              ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200 shadow-sm"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <div className={`transition-colors ${
                            pathname === item.route ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"
                          }`}>
                            {item.icon}
                          </div>
                          <span>{item.name}</span>
                        </Link>
                      ))}
                  </div>
                </div>

                {/* Security Section */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-500 uppercase tracking-wider">
                    <Shield className="w-4 h-4" />
                    Security
                  </div>
                  <Link
                    href="/dashboard/security"
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all ${
                      pathname === "/dashboard/security"
                        ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200 shadow-sm"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Shield className="w-5 h-5" />
                    <span>Security Dashboard</span>
                  </Link>
                </div>
              </nav>

              {/* Sidebar Footer */}
              <div className="p-4 border-t border-gray-200/50">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Zenow Academy</p>
                      <p className="text-xs text-gray-500">v2.0.1</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">
                    Enterprise-grade learning management system
                  </p>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <div className="p-6">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {adminSidebarRoutes.find((r) => r.route === pathname)?.name || "Dashboard"}
                  </h1>
                  <p className="text-gray-600">
                    {pathname === "/dashboard" 
                      ? "Welcome back! Here's what's happening with your academy today."
                      : `Manage and monitor your ${adminSidebarRoutes.find((r) => r.route === pathname)?.name.toLowerCase() || "content"} from here.`
                    }
                  </p>
                </div>
                
                {/* Quick Actions */}
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                    <Settings className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg">
                    Quick Action
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && !isDesktop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>
    </div>
  );
}