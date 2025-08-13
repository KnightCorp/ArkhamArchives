import React from "react";
import {
  Home,
  Users,
  Gamepad2,
  Network,
  FileText,
  Moon,
  Sun,
  ChevronRight,
  Search,
  Building2,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface SidebarProps {
  activeSection: number;
  onSectionChange: (index: number) => void;
  isExpanded: boolean;
  onLegalClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSectionChange,
  isExpanded,
  onLegalClick,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={`sidebar-glass fixed left-0 top-0 h-full flex flex-col py-8 z-50 transition-all duration-300 ${
        isExpanded ? "w-56" : "w-16"
      }`}
    >
      {/* ---------- TOP SECTION: THEME TOGGLE + HOME ---------- */}
      <div className="flex flex-col items-center mb-8 space-y-6 px-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`nav-icon group relative ${
            isExpanded ? "w-full justify-start" : "w-10 h-10 justify-center"
          } flex items-center`}
          aria-label="Toggle Theme"
        >
          {theme === "night" ? (
            <Sun className="w-5 h-5 text-white transition-transform group-hover:scale-110" />
          ) : (
            <Moon className="w-5 h-5 text-white transition-transform group-hover:scale-110" />
          )}
          {isExpanded && (
            <span className="ml-3 text-white font-medium text-sm">
              {theme === "night" ? "General Mode" : "Night Mode"}
            </span>
          )}
          {!isExpanded && <span className="tooltip">Toggle Theme</span>}
        </button>

        {/* Home */}
        <button
          onClick={() => onSectionChange(0)}
          className={`nav-icon group relative ${
            isExpanded ? "w-full justify-start" : "w-10 h-10 justify-center"
          } flex items-center ${activeSection === 0 ? "active" : ""}`}
          aria-label="Home"
        >
          <Home className="w-5 h-5 text-white transition-transform group-hover:scale-110" />
          {isExpanded && (
            <span className="ml-3 text-white font-medium text-sm">Home</span>
          )}
          {!isExpanded && <span className="tooltip">Home</span>}
        </button>
      </div>

      {/* ---------- MIDDLE SECTION: SOCIAL, EXPERIENCE, AI, VENTURE ---------- */}
      <nav className="flex-1 flex flex-col justify-start">
        <div className="space-y-6 px-4">
          <button
            onClick={() => onSectionChange(1)}
            className={`nav-icon group relative ${
              isExpanded
                ? "w-full justify-start"
                : "w-10 h-10 justify-center mx-auto"
            } flex items-center ${activeSection === 1 ? "active" : ""}`}
            aria-label="Social Media"
          >
            <Users className="w-5 h-5 text-white transition-transform group-hover:scale-110" />
            {isExpanded && (
              <span className="ml-3 text-white font-medium text-sm">
                Social Media
              </span>
            )}
            {!isExpanded && <span className="tooltip">Social Media</span>}
          </button>

          <button
            onClick={() => onSectionChange(2)}
            className={`nav-icon group relative ${
              isExpanded
                ? "w-full justify-start"
                : "w-10 h-10 justify-center mx-auto"
            } flex items-center ${activeSection === 2 ? "active" : ""}`}
            aria-label="Arkham Experience"
          >
            <Gamepad2 className="w-5 h-5 text-white transition-transform group-hover:scale-110" />
            {isExpanded && (
              <span className="ml-3 text-white font-medium text-sm">
                Arkham Experience
              </span>
            )}
            {!isExpanded && <span className="tooltip">Arkham Experience</span>}
          </button>

          <button
            onClick={() => onSectionChange(3)}
            className={`nav-icon group relative ${
              isExpanded
                ? "w-full justify-start"
                : "w-10 h-10 justify-center mx-auto"
            } flex items-center ${activeSection === 3 ? "active" : ""}`}
            aria-label="AI Search & Digital Labs"
          >
            <Search className="w-5 h-5 text-white transition-transform group-hover:scale-110" />
            {isExpanded && (
              <span className="ml-3 text-white font-medium text-sm">
                AI Search & Digital Labs
              </span>
            )}
            {!isExpanded && <span className="tooltip">AI Search</span>}
          </button>

          <button
            onClick={() => onSectionChange(4)}
            className={`nav-icon group relative ${
              isExpanded
                ? "w-full justify-start"
                : "w-10 h-10 justify-center mx-auto"
            } flex items-center ${activeSection === 4 ? "active" : ""}`}
            aria-label="Venture Studio"
          >
            <Building2 className="w-5 h-5 text-white transition-transform group-hover:scale-110" />
            {isExpanded && (
              <span className="ml-3 text-white font-medium text-sm">
                Venture Studio
              </span>
            )}
            {!isExpanded && <span className="tooltip">Venture Studio</span>}
          </button>
        </div>
      </nav>

      {/* ---------- BOTTOM SECTION: K-PROTOCOL + LEGAL ---------- */}
      <div className="space-y-6 px-4 mb-4">
        <button
          onClick={() => onSectionChange(5)}
          className={`nav-icon group relative ${
            isExpanded
              ? "w-full justify-start"
              : "w-10 h-10 justify-center mx-auto"
          } flex items-center ${activeSection === 5 ? "active" : ""}`}
          aria-label="K-Protocol"
        >
          <Network className="w-5 h-5 text-white transition-transform group-hover:scale-110" />
          {isExpanded && (
            <span className="ml-3 text-white font-medium text-sm">
              K-Protocol
            </span>
          )}
          {!isExpanded && <span className="tooltip">K-Protocol</span>}
        </button>

        <button
          onClick={onLegalClick}
          className={`nav-icon group relative ${
            isExpanded
              ? "w-full justify-between"
              : "w-10 h-10 justify-center mx-auto"
          } flex items-center`}
          aria-label="Legal & Contact"
        >
          <div
            className={`flex items-center ${
              isExpanded ? "" : "justify-center"
            }`}
          >
            <FileText className="w-5 h-5 text-white transition-transform group-hover:scale-110" />
            {isExpanded && (
              <span className="ml-3 text-white font-medium text-sm">
                Legal & Contact
              </span>
            )}
          </div>
          {isExpanded && (
            <ChevronRight className="w-4 h-4 text-white/70 transition-colors" />
          )}
          {!isExpanded && <span className="tooltip">Legal & Contact</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
