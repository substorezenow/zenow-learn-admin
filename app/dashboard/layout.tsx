"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { adminSidebarRoutes } from "./sidebarRoutes";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-white via-blue-50 to-indigo-100 overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 bg-white shadow border-b border-blue-100">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden p-1 rounded hover:bg-blue-100 transition"
            onClick={toggleSidebar}
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5 text-blue-700" />
          </button>
          <span className="text-lg font-bold text-blue-700 tracking-tight">
            Zenow Dashboard
          </span>
        </div>
        <button
          onClick={async () => {
            if (window.confirm("Are you sure you want to log out?")) {
              await fetch("/api/auth/logout", { method: "POST" });
              router.replace("/login");
            }
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-4 rounded shadow"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </header>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence>
          {(sidebarOpen || isDesktop) && (
            <motion.aside
              initial={{ x: -250, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -250, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed md:static z-30 top-0 left-0 h-full w-64 bg-white shadow-xl flex flex-col border-r border-blue-100 md:h-auto md:w-60"
            >
              <div className="flex items-center justify-between px-3 py-2 border-b border-blue-100">
                <span className="text-lg font-bold text-blue-700">Menu</span>
                <button
                  className="md:hidden p-1 rounded hover:bg-blue-100"
                  onClick={toggleSidebar}
                  aria-label="Close sidebar"
                >
                  <X className="w-4 h-4 text-blue-700" />
                </button>
              </div>

              <nav className="flex-1 flex flex-col gap-1 px-2 py-2 overflow-y-auto">
                {adminSidebarRoutes.map((item) => (
                  <Link
                    key={item.route}
                    href={item.route}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-blue-700 hover:bg-blue-50 transition-all ${
                      pathname === item.route
                        ? "bg-blue-50 border border-blue-400 shadow"
                        : ""
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main content */}
        <main className="flex-1 flex flex-col bg-white shadow-lg border border-blue-100 min-h-0">
          <div className="px-4 py-2 border-b border-blue-100 bg-white">
            <h1 className="text-xl font-bold text-blue-700">
              {adminSidebarRoutes.find((r) => r.route === pathname)?.name ||
                "Dashboard"}
            </h1>
          </div>
          <div className="flex-1 overflow-y-auto p-4">{children}</div>
        </main>
      </div>
    </div>
  );
}
