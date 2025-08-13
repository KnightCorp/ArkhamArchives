import { NavLink } from "react-router-dom";
import {
  Home,
  Laptop,
  GraduationCap,
  Library,
  Book,
  Settings,
  Users,
  LucideIcon,
} from "lucide-react";

// Define proper types for the navigation items
type NavItemWithPath = {
  icon: LucideIcon;
  path: string;
  label: string;
  divider?: false;
};

type NavItemDivider = {
  divider: true;
  icon?: undefined;
  path?: undefined;
  label?: undefined;
};

type NavItem = NavItemWithPath | NavItemDivider;

const NavItems = () => {
  const navItems: NavItem[] = [
    { icon: Home, path: "/edtech", label: "Home" }, // This stays the same for index route
    { icon: Library, path: "/edtech/library", label: "Content Library" }, // This matches your route structure
    { icon: Book, path: "/edtech/archives", label: "The Archives" }, // This matches your route structure
    { icon: Laptop, path: "/edtech/tech-club", label: "Tech Club" }, // This matches your route structure
    { icon: GraduationCap, path: "/edtech/exam-prep", label: "Exam Prep" }, // This matches your route structure
    { icon: Users, path: "/edtech/lms", label: "LMS & Mentors" }, // Main LMS section
    { divider: true },
    { icon: Settings, path: "/edtech/admin", label: "Admin Dashboard" }, // This matches your route structure
  ];

  return (
    <div className="space-y-2 ">
      {navItems.map((item, index) =>
        "divider" in item && item.divider ? (
          <div
            key={`divider-${index}`}
            className="border-t border-zinc-800/50 my-4"
          />
        ) : (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/edtech"}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${
                isActive
                  ? "bg-zinc-900 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                  : "text-white/70 hover:bg-zinc-900/50 hover:text-white"
              }`
            }
          >
            <item.icon className="h-5 w-5 text-white" />
            <span className="font-serif tracking-wide">{item.label}</span>
          </NavLink>
        )
      )}
    </div>
  );
};

export default NavItems;
