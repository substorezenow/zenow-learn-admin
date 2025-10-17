"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { 
  Menu, 
  X, 
  LogOut, 
  Settings, 
  User, 
  ChevronDown,
  Sparkles
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
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-3 sm:px-6 py-3">
          {/* Left side */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
              onClick={toggleSidebar}
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">Zenow Academy</h1>
                <p className="text-xs sm:text-sm text-gray-500">Admin Dashboard</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-sm font-bold text-gray-900">Zenow</h1>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1 sm:gap-2 p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 hidden sm:block" />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-40 sm:w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2"
                  >
                    <Link href="/dashboard/profile" className="flex items-center gap-3 px-3 sm:px-4 py-2 hover:bg-gray-50">
                      <User className="w-4 h-4 text-gray-600" />
                      <span className="text-sm">Profile</span>
                    </Link>
                    <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 sm:px-4 py-2 hover:bg-gray-50">
                      <Settings className="w-4 h-4 text-gray-600" />
                      <span className="text-sm">Settings</span>
                    </Link>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-3 sm:px-4 py-2 text-red-600 hover:bg-red-50 w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Logout</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence>
          {(sidebarOpen || isDesktop) && (
            <motion.aside
              initial={{ x: -224, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -224, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed lg:static z-50 top-0 left-0 h-full w-56 sm:w-64 lg:w-64 bg-white border-r border-gray-200 shadow-xl lg:shadow-none flex flex-col min-h-full"
            >
              {/* Sidebar Header */}
              <div className="flex-shrink-0 p-3 sm:p-4 border-b border-gray-200/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900 text-sm sm:text-base">Admin</span>
                  </div>
                  <button
                    className="lg:hidden p-1 rounded-lg hover:bg-gray-100"
                    onClick={toggleSidebar}
                    aria-label="Close sidebar"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Navigation - Scrollable */}
              <nav className="flex-1 px-3 sm:px-4 py-3 sm:py-4 space-y-1 overflow-y-auto min-h-0">
                {adminSidebarRoutes.map((item) => (
                  <Link
                    key={item.route}
                    href={item.route}
                    className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-3 rounded-xl font-medium transition-all group text-sm sm:text-base ${
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
                    <span className="truncate">{item.name}</span>
                  </Link>
                ))}
              </nav>

              {/* Sidebar Footer */}
              <div className="flex-shrink-0 p-3 sm:p-4 border-t border-gray-200/50">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded flex items-center justify-center">
                    <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                  </div>
                  <span className="truncate">Zenow Academy v2.0.1</span>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content - Scrollable */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
            {/* Content */}
            {children}
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
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>
    </div>
  );
}