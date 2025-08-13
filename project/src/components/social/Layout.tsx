import React, { useState, useRef, useEffect } from "react";
import Sidebar from "./Sidebar";
import Hero from "../sections/Hero";
import AiAppBuilder from "../sections/AiAppBuilder";
import AiResearch from "../sections/AiResearch";
import AiPlayground from "../sections/AiPlayground";
import SocialMedia from "../sections/SocialMedia";
import FreelancerMarketplace from "../sections/FreelancerMarketplace";
import ArkhamExperience from "../sections/ArkhamExperience";
import AiSoundManager from "../sections/AiSoundManager";
import EdTech from "../sections/EdTech";
import KProtocol from "../sections/KProtocol";
import People from "../sections/People";
import Contact from "../sections/Contact";
import Terms from "../sections/Terms";
import Privacy from "../sections/Privacy";
import Careers from "../sections/Careers";

const Layout: React.FC = () => {
  const [activeSection, setActiveSection] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);

  const sections = [
    <Hero key="hero" />,
    <AiAppBuilder key="ai-builder" />,
    <AiResearch key="ai-research" />,
    <AiPlayground key="ai-playground" />,
    <SocialMedia key="social-media" />,
    <FreelancerMarketplace key="freelancer" />,
    <ArkhamExperience key="arkham" />,
    <AiSoundManager key="sound" />,
    <EdTech key="edtech" />,
    <KProtocol key="k-protocol" />,
    <People key="people" />,
    <Contact key="contact" />,
    <Terms key="terms" />,
    <Privacy key="privacy" />,
    <Careers key="careers" />,
  ];

  const handleSectionChange = (index: number) => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    const direction = index > activeSection ? 1 : -1;

    if (mainContentRef.current) {
      mainContentRef.current.classList.add("transitioning");
      mainContentRef.current.style.transform = `translateX(${
        -direction * 100
      }%)`;
    }

    setTimeout(() => {
      setActiveSection(index);
      if (mainContentRef.current) {
        mainContentRef.current.style.transform = `translateX(${
          direction * 100
        }%)`;
        requestAnimationFrame(() => {
          if (mainContentRef.current) {
            mainContentRef.current.classList.remove("transitioning");
            mainContentRef.current.style.transform = "translateX(0)";
          }
        });
      }
      setTimeout(() => setIsTransitioning(false), 500);
    }, 500);
  };

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden perspective">
      <Sidebar
        isExpanded={isExpanded}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      <main
        className={`flex-1 relative transition-all ${
          isExpanded ? "ml-64" : "ml-20"
        }`}
      >
        <button
          onClick={toggleSidebar}
          className="absolute top-4 left-4 z-10 p-2 bg-zinc-900/80 rounded-full text-white/70 hover:text-white"
        >
          {isExpanded ? "←" : "→"}
        </button>

        <div
          ref={mainContentRef}
          className="main-content absolute inset-0 transform-style-3d transition-transform duration-500 ease-in-out"
        >
          {sections[activeSection]}
        </div>
      </main>
    </div>
  );
};

export default Layout;
