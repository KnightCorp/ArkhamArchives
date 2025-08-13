import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./SocialLayout.css";

const SocialLayout: React.FC = () => {
  const [activeSection, setActiveSection] = useState<number>(0);
  return (
    <div className="social-container flex">
      <Sidebar isExpanded={true} activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="social-content flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default SocialLayout;
