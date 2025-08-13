import React from "react";
import { NavLink } from "react-router-dom";
import {
  Compass,
  Film,
  Clock,
  LayoutDashboard,
  User,
  Users,
  Store,
  Settings,
  MessageSquare,
  Rss,
  Coins,
  LucideIcon,
} from "lucide-react";

interface NavItemsProps {
  isExpanded: boolean;
  activeSection: number;
  onSectionChange: (index: number) => void;
}

// Define proper types for the navigation items
type NavItemWithPath = {
  icon: LucideIcon;
  path: string;
  label: string;
  sectionIndex: number;
  divider?: false;
};

type NavItemDivider = {
  divider: true;
  icon?: undefined;
  path?: undefined;
  label?: undefined;
  sectionIndex?: undefined;
};

type NavItem = NavItemWithPath | NavItemDivider;

const NavItems = ({
  isExpanded,
  activeSection,
  onSectionChange,
}: NavItemsProps) => {
  const navItems: NavItem[] = [
    { icon: Compass, path: "/explore", label: "Explore", sectionIndex: 0 },
    { icon: Rss, path: "/feed", label: "Feed", sectionIndex: 1 },
    { icon: Film, path: "/reels", label: "Reels", sectionIndex: 2 },
    { icon: Store, path: "/store", label: "Store", sectionIndex: 3 },
    { icon: Clock, path: "/timeline", label: "Timeline", sectionIndex: 4 },
    {
      icon: LayoutDashboard,
      path: "/dashboard",
      label: "Dashboard",
      sectionIndex: 5,
    },
    { icon: User, path: "/profile", label: "Profile", sectionIndex: 6 },
    { icon: Users, path: "/referrals", label: "Referrals", sectionIndex: 7 },
    { divider: true },
    // {
    //   icon: MessageSquare,
    //   path: "/messenger",
    //   label: "Messenger",
    //   sectionIndex: 8,
    // },
    {
      icon: Coins,
      path: "/subscription",
      label: "Subscription",
      sectionIndex: 8,
    },
    { divider: true },
    { icon: Settings, path: "/settings", label: "Settings", sectionIndex: 9 },
  ];

  return (
    <div className="flex flex-col items-center space-y-2">
      {navItems.map((item, index) =>
        "divider" in item && item.divider ? (
          <div
            key={`divider-${index}`}
            className="w-full border-t border-zinc-800/50 my-4"
          />
        ) : (
          <div
            key={item.path}
            className={`flex ${
              isExpanded ? "w-full" : "w-auto"
            } transition-all`}
          >
            <button
              onClick={() => onSectionChange(item.sectionIndex)}
              className={`flex items-center ${
                isExpanded ? "w-full justify-start px-4" : "justify-center"
              } p-3 rounded-lg transition-all ${
                activeSection === item.sectionIndex
                  ? "metallic-shine bg-zinc-900 text-white shadow-md"
                  : "text-white/70 hover:bg-zinc-900/50 hover:text-white"
              }`}
            >
              {React.createElement(item.icon, { className: "h-5 w-5" })}
              {isExpanded && (
                <span className="ml-3 font-medium">{item.label}</span>
              )}
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default NavItems;
