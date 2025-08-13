import React, { useState } from "react";
import Sidebar from "./Sidebar";
import LegalPopup from "./sections/LegalPopup";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ThemeProvider } from "../context/ThemeContext";

// Import only the sections you need
import SocialMedia from "./sections/SocialMedia";
import ArkhamExperience from "./sections/ArkhamExperience";
import KProtocol from "./sections/KProtocol";
import Terms from "./sections/Terms";
import Privacy from "./sections/Privacy";
import Contact from "./sections/Contact";
import Hero from "./sections/Hero";
import AiSearchDigitalLabs from "./sections/AiSearchDigitalLabs";
import VentureStudio from "./sections/VentureStudio";

const Layout = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLegalPopup, setShowLegalPopup] = useState(false);
  const [activeLegalSection, setActiveLegalSection] = useState<
    "terms" | "privacy" | "contact" | null
  >(null);

  // Main sections (4 sections now including Home)
  const mainSectionComponents = [
    <Hero key="home" />, // Assuming App is the Home component
    <SocialMedia key="social" />,
    <ArkhamExperience key="arkham" />,
    <AiSearchDigitalLabs key="ai-search-labs" />,
    <VentureStudio key="venture-studio" />,
    <KProtocol key="kprotocol" />,
  ];

  const mainSectionTitles = [
    "Home",
    "Social Media",
    "Arkham Experience",
    "AI Search Digital Labs",
    "Venture Studio",
    "K-Protocol",
  ];

  // Legal sections
  const legalSectionComponents = {
    terms: <Terms key="terms" />,
    privacy: <Privacy key="privacy" />,
    contact: <Contact key="contact" />,
  };

  const legalSectionTitles = {
    terms: "Terms & Conditions",
    privacy: "Privacy Policy",
    contact: "Contact Us",
  };

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleLegalClick = () => {
    setShowLegalPopup(true);
  };

  const handleLegalSectionSelect = (
    section: "terms" | "privacy" | "contact"
  ) => {
    setActiveLegalSection(section);
    setActiveSection(-1); // Set to -1 to indicate we're showing a legal section
  };

  const handleMainSectionChange = (index: number) => {
    setActiveSection(index);
    setActiveLegalSection(null); // Clear legal section when switching to main sections
  };

  // Determine what to render
  const getCurrentComponent = () => {
    if (activeLegalSection) {
      return legalSectionComponents[activeLegalSection];
    }
    return mainSectionComponents[activeSection] || mainSectionComponents[0];
  };

  const getCurrentTitle = () => {
    if (activeLegalSection) {
      return legalSectionTitles[activeLegalSection];
    }
    return mainSectionTitles[activeSection] || mainSectionTitles[0];
  };

  return (
    <ThemeProvider>
      <div className="flex h-screen w-screen overflow-hidden">
        <Sidebar
          activeSection={activeSection}
          onSectionChange={handleMainSectionChange}
          isExpanded={isExpanded}
          onLegalClick={handleLegalClick}
        />

        <LegalPopup
          isOpen={showLegalPopup}
          onClose={() => setShowLegalPopup(false)}
          onSectionSelect={handleLegalSectionSelect}
        />

        <main
          className={`flex-1 relative transition-all duration-300 ${
            isExpanded ? "ml-56" : "ml-16"
          }`}
        >
          {/* Sidebar Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="absolute top-6 left-6 z-10 p-2 bg-zinc-900/80 backdrop-blur-sm rounded-full text-white/70 hover:text-white hover:bg-zinc-800/90 transition-all"
            aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isExpanded ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          {/* Section Title - Only show when sidebar is collapsed */}
          {!isExpanded && (
            <div className="absolute top-6 left-20 z-10">
              <h1 className="text-white/90 font-semibold text-lg">
                {getCurrentTitle()}
              </h1>
            </div>
          )}

          {/* Main Content */}
          <div className="main-content absolute inset-0 transform-style-3d transition-transform duration-500 ease-in-out">
            {getCurrentComponent()}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Layout;
