import { 
  Home, 
  SettingsIcon, 
  User, 
  BookOpen, 
  FolderOpen, 
  GraduationCap, 
  Layers,
  BarChart3,
  Users,
  FileText
} from "lucide-react";

export const sidebarRoutes = [
  { route: "/dashboard", name: "Dashboard", icon: <Home className="w-5 h-5" /> },
  {
    route: "/dashboard/profile",
    name: "Profile",
    icon: <User className="w-5 h-5" />,
  },
  {
    route: "/dashboard/settings",
    name: "Settings",
    icon: <SettingsIcon className="w-5 h-5" />,
  },
];

export const adminSidebarRoutes = [
  { route: "/dashboard", name: "Dashboard", icon: <BarChart3 className="w-5 h-5" /> },
  {
    route: "/dashboard/categories",
    name: "Categories",
    icon: <FolderOpen className="w-5 h-5" />,
    description: "Manage course categories"
  },
  {
    route: "/dashboard/fields",
    name: "Fields",
    icon: <Layers className="w-5 h-5" />,
    description: "Manage fields within categories"
  },
  {
    route: "/dashboard/courses",
    name: "Courses",
    icon: <BookOpen className="w-5 h-5" />,
    description: "Manage individual courses"
  },
  {
    route: "/dashboard/modules",
    name: "Course Modules",
    icon: <GraduationCap className="w-5 h-5" />,
    description: "Manage course content modules"
  },
  {
    route: "/dashboard/students",
    name: "Students",
    icon: <Users className="w-5 h-5" />,
    description: "Manage student enrollments"
  },
  {
    route: "/dashboard/blogs",
    name: "Blogs",
    icon: <FileText className="w-5 h-5" />,
    description: "Manage blog content"
  },
  {
    route: "/dashboard/settings",
    name: "Admin Settings",
    icon: <SettingsIcon className="w-5 h-5" />,
    description: "System configuration"
  },
  {
    route: "/dashboard/debug",
    name: "Debug API",
    icon: <SettingsIcon className="w-5 h-5" />,
    description: "Test API connectivity"
  },
];
