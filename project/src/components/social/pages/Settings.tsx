import React, { useState } from "react";
import { Tabs } from "../ui/Tabs";
import { GeneralSettings } from "../settings/GeneralSettings";
import { NotificationSettings } from "../settings/NotificationSettings";
import { PrivacySettings } from "../settings/PrivacySettings";
import { TermsAndConditions } from "../settings/TermsAndConditions";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "General" },
    { id: "notifications", label: "Notifications" },
    { id: "privacy", label: "Privacy" },
    { id: "terms", label: "Terms & Conditions" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return <GeneralSettings />;
      case "notifications":
        return <NotificationSettings />;
      case "privacy":
        return <PrivacySettings />;
      case "terms":
        return <TermsAndConditions />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto font-cormorant">
      <h1 className="text-3xl text-zinc-200 mb-8 font-light tracking-wide">
        App Settings
      </h1>
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      <div className="mt-8">{renderContent()}</div>
    </div>
  );
};

export default Settings;
