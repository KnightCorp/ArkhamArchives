import React from "react";
import NavItems from "./navigation/NavItems";
import { Title } from "./ui/Typography";

export interface SidebarProps {
  isExpanded: boolean;
}

const Sidebar = ({ isExpanded }: SidebarProps) => {
  return (
    <nav
      className={`fixed top-0 bottom-0 ${
        isExpanded ? "w-64" : "w-20"
      } border-r border-zinc-800/50 z-20 bg-zinc-950/90 backdrop-blur-sm metallic-shine transition-all duration-300 ease-in-out flex flex-col`}
    >
      {/* Fixed Header */}
      <div
        className={`flex-none px-4 py-6 border-b border-zinc-800/50 ${
          isExpanded ? "px-6" : "flex justify-center"
        }`}
      ></div>

      {/* Scrollable Navigation */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="px-4 py-6">
          <NavItems isExpanded={isExpanded} />
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
